# 🚀 Spaceship Portfolio

A high-performance, cinematic, 3D-driven developer portfolio built with Next.js 16, Supabase, GSAP, and Tailwind CSS v4. It features a fully integrated **Admin Dashboard** (CMS) to manage your projects, experience, bio, and settings in real-time.

![Clean Architecture](https://img.shields.io/badge/Architecture-Next.js_App_Router-black)
![Database](https://img.shields.io/badge/Database-Supabase-24b47e)
![Styling](https://img.shields.io/badge/Styling-Tailwind_v4-38bdf8)
![Animation](https://img.shields.io/badge/Animation-GSAP_%7C_Three.js-88CE02)

---

## 🌌 Project Structure

This repository is split into two main environments using Next.js Route Groups:

- **Live Portfolio (`/`)** 
  Located in `app/(site)/`. The public-facing, cinematic 3D portfolio loaded with GSAP scroll animations, custom cursors, and WebGL elements.
- **Admin Dashboard (`/admin`)** 
  Located in `app/(admin)/`. A secure, zero-lag CMS built with Shadcn UI and Next.js Server Actions. Manage your entire portfolio without touching a line of code.

---

## 🛠 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4 + Shadcn UI
- **Database & Auth:** Supabase (PostgreSQL)
- **Image Hosting:** Cloudinary
- **Emails:** Resend
- **Animations:** GSAP, Framer Motion, Lenis (Smooth Scrolling)
- **3D Graphics:** React Three Fiber, Drei, Three.js

---

## ⚙️ Setup Instructions

Follow these steps to deploy your own instance of the Spaceship Portfolio.

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/portfolio-spaceship.git
cd portfolio-spaceship
npm install
```

### 2. Environment Variables
Create a `.env.local` file in the root directory and populate it with your credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Admin Panel Credentials (Only this user can log in)
ADMIN_EMAIL=your_email@domain.com
ADMIN_PASSWORD=your_secure_password

# Cloudinary (For uploading Project Images)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset

# Resend (For the Contact Form)
RESEND_API_KEY=your_resend_api_key
```

### 3. Database Setup (Supabase)
1. Create a new project in [Supabase](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Run the following migration script to build the required tables, security policies, and initial rows:

<details>
<summary><b>Click to expand the SQL Script</b></summary>

```sql
-- 1. Projects Table
CREATE TABLE public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  bg_color TEXT NOT NULL DEFAULT '#0a0a14',
  accent_color TEXT NOT NULL DEFAULT '#00f0ff',
  link_url TEXT,
  image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Experience Table
CREATE TABLE public.experience (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role TEXT NOT NULL,
  company TEXT NOT NULL,
  period TEXT NOT NULL,
  description TEXT NOT NULL,
  technologies TEXT[] NOT NULL DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. About Profile Table
CREATE TABLE public.about (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title_primary TEXT NOT NULL DEFAULT 'Frontend',
  title_secondary TEXT NOT NULL DEFAULT 'Architect',
  paragraph_1 TEXT NOT NULL DEFAULT 'I build interfaces where every detail compounds into something that feels right.',
  paragraph_2 TEXT NOT NULL DEFAULT 'Bridging the gap between design engineering and technical architecture.',
  skills TEXT[] NOT NULL DEFAULT ARRAY['React', 'Three.js', 'Next.js', 'TypeScript'],
  years_exp INTEGER NOT NULL DEFAULT 5,
  projects_count INTEGER NOT NULL DEFAULT 30,
  lines_code INTEGER NOT NULL DEFAULT 15
);

-- 4. System Settings Table (Socials & Email routing)
CREATE TABLE public.settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_email TEXT NOT NULL DEFAULT 'your@email.com',
  github_url TEXT,
  twitter_url TEXT,
  linkedin_url TEXT
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- 6. Create Read Policies (Public access to view data)
CREATE POLICY "Public read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public read experience" ON public.experience FOR SELECT USING (true);
CREATE POLICY "Public read about" ON public.about FOR SELECT USING (true);
CREATE POLICY "Public read settings" ON public.settings FOR SELECT USING (true);

-- 7. Create Write Policies (Admin only access to modify data)
CREATE POLICY "Admins full access projects" ON public.projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins full access experience" ON public.experience FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins full access about" ON public.about FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins full access settings" ON public.settings FOR ALL USING (auth.role() = 'authenticated');

-- 8. Insert initial placeholder rows for single-row tables
INSERT INTO public.about (id) VALUES (gen_random_uuid());
INSERT INTO public.settings (id) VALUES (gen_random_uuid());
```

</details>

### 4. Create the Admin Account
Because Supabase restricts admin creation from the frontend for security, go to **Authentication -> Users** in your Supabase Dashboard and manually create a user using the exact `ADMIN_EMAIL` and `ADMIN_PASSWORD` you placed in your `.env.local` file. 

*(Make sure to auto-confirm their email address in Supabase settings so you can log in immediately).*

---

## 🚀 Running the App

Start the development server:

```bash
npm run dev
```

- **Live Portfolio:** `http://localhost:3000`
- **Admin Dashboard:** `http://localhost:3000/admin`

---

## 🕹 How to Use the Admin Dashboard

1. Navigate to `/admin/login`.
2. Enter your credentials. The system strictly rejects any email address that doesn't match your `.env.local` configuration.
3. You will be routed to the **Spaceship OS** dashboard:
   - **Projects:** Add tilt-cards, assign neon accent colors, and seamlessly upload images (handled natively via Cloudinary).
   - **Experience:** Add your work history and map out your tech stack timeline.
   - **About:** Modify your hero title, bio, and your animated statistics (Years Exp, Projects, etc.).
   - **Settings:** Define where Contact Form submissions should be routed and update your Social Links.

All changes utilize Next.js Server Actions and update your live portfolio instantly with zero latency.

---
*Built by [Antigravity]*
