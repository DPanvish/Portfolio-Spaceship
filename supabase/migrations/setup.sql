-- Create Projects Table
CREATE TABLE public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  bg_color TEXT NOT NULL DEFAULT '#0a0a14',
  accent_color TEXT NOT NULL DEFAULT '#00f0ff',
  link_url TEXT
);

-- Create Experience Table
CREATE TABLE public.experience (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  role TEXT NOT NULL,
  company TEXT NOT NULL,
  period TEXT NOT NULL,
  description TEXT NOT NULL
);

-- Turn on Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;

-- Allow public read access to everyone
CREATE POLICY "Public profiles are viewable by everyone." ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public experience is viewable by everyone." ON public.experience FOR SELECT USING (true);

-- Allow full access only to authenticated admin users
CREATE POLICY "Admins can do everything on projects" ON public.projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can do everything on experience" ON public.experience FOR ALL USING (auth.role() = 'authenticated');

-- Insert Initial Mock Data
INSERT INTO public.projects (sort_order, title, category, description, bg_color, accent_color) VALUES 
(1, 'Stellar Dashboard', 'Web App', 'Real-time analytics platform with 3D data visualization and live WebSocket feeds.', '#0c0c12', '#00f0ff'),
(2, 'Nebula Commerce', 'E-Commerce', 'High-performance storefront with immersive product experiences and AR previews.', '#0a0a14', '#a855f7'),
(3, 'Quantum Editor', 'SaaS Tool', 'Collaborative code editor with AI-powered suggestions and real-time pair programming.', '#0f0a14', '#f97316'),
(4, 'Orbit Social', 'Mobile App', 'Location-based social platform with AR integration and spatial audio experiences.', '#0a140a', '#22c55e');

INSERT INTO public.experience (sort_order, role, company, period, description) VALUES
(1, 'Creative Developer', 'Awwwards Agency', '2023 — Present', 'Building immersive 3D web experiences with React Three Fiber and GSAP. Leading the frontend architecture for high-profile client projects.'),
(2, 'Senior Frontend Engineer', 'Tech Startup X', '2021 — 2023', 'Led the development of a complex data visualization dashboard serving 50K+ daily users. Implemented real-time WebSocket data feeds.'),
(3, 'Frontend Developer', 'Digital Studio Y', '2019 — 2021', 'Built responsive web applications and interactive marketing sites. Introduced component-driven architecture and design systems.');
