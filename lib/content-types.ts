export interface SiteSettings {
  accentColor: string;
  audioOnByDefault: boolean;
  seoTitle: string;
  seoDescription: string;
  ogImage: string;
  maintenanceMode: boolean;
}

export interface About {
  headline: string;
  bio: string; // rich text (HTML or markdown string)
  profilePhoto: string;
  resumeUrl: string;
  socialLinks: { platform: string; url: string }[];
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string | null; // null for present
  description: string;
  techTags: string[];
  logo: string;
  displayOrder: number;
}

export interface Project {
  id: string;
  title: string;
  summary: string;
  description: string; // rich text
  coverImage: string;
  galleryImages: string[];
  techTags: string[];
  liveUrl?: string;
  repoUrl?: string;
  featured: boolean;
  displayOrder: number;
  dockingCameraNotes?: string;
}

export interface Skill {
  id: string;
  category: 'Navigation' | 'Shields' | 'Comms' | 'Core' | string;
  name: string;
  proficiency: number;
  icon: string;
  displayOrder: number;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  submittedAt: string;
  read: boolean;
}
