-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" 
  ON public.profiles FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- Create properties table
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(15,2) NOT NULL,
  property_type TEXT NOT NULL CHECK (property_type IN ('apartment', 'house', 'land', 'commercial')),
  bedrooms INTEGER,
  bathrooms INTEGER,
  area_sqm DECIMAL(10,2),
  location TEXT NOT NULL,
  address TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  features TEXT[],
  images TEXT[],
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'sold', 'rented', 'pending')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on properties
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Create policies for properties (public read, admin write)
CREATE POLICY "Properties are viewable by everyone" 
  ON public.properties FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage properties" 
  ON public.properties FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- Create saved properties table (user wishlist)
CREATE TABLE public.saved_properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, property_id)
);

-- Enable RLS on saved properties
ALTER TABLE public.saved_properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their saved properties" 
  ON public.saved_properties FOR ALL 
  USING (auth.uid() = user_id);

-- Create property inquiries table
CREATE TABLE public.property_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  inquiry_type TEXT DEFAULT 'general' CHECK (inquiry_type IN ('general', 'viewing', 'purchase', 'rental')),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'scheduled', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on inquiries
ALTER TABLE public.property_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own inquiries" 
  ON public.property_inquiries FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create inquiries" 
  ON public.property_inquiries FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Admins can manage all inquiries" 
  ON public.property_inquiries FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- Create storage bucket for property images
INSERT INTO storage.buckets (id, name, public) VALUES ('property-images', 'property-images', true);

-- Create storage policies for property images
CREATE POLICY "Property images are publicly accessible" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'property-images');

CREATE POLICY "Admins can upload property images" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'property-images' AND EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update property images" 
  ON storage.objects FOR UPDATE 
  USING (bucket_id = 'property-images' AND EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can delete property images" 
  ON storage.objects FOR DELETE 
  USING (bucket_id = 'property-images' AND EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'first_name', NEW.raw_user_meta_data ->> 'last_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();