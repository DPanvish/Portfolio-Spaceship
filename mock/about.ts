import { About } from '../lib/content-types';

export const mockAbout: About = {
  headline: 'Building digital worlds and scalable systems.',
  bio: '<p>Hi, I am Jane Doe. I am a full-stack engineer with a passion for 3D web experiences, performance optimization, and scalable backend architecture.</p><p>Welcome to my vessel.</p>',
  profilePhoto: '/images/profile.jpg',
  resumeUrl: '/resume.pdf',
  socialLinks: [
    { platform: 'GitHub', url: 'https://github.com' },
    { platform: 'LinkedIn', url: 'https://linkedin.com' },
    { platform: 'X', url: 'https://twitter.com' },
  ],
};
