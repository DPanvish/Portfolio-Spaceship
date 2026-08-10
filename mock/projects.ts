import { Project } from '../lib/content-types';

export const mockProjects: Project[] = [
  {
    id: 'proj-1',
    title: 'Orbit E-Commerce',
    summary: 'A high-performance headless e-commerce storefront.',
    description: '<p>Built with Next.js App Router and Shopify. Features include cart syncing, real-time inventory, and sub-1s page loads.</p>',
    coverImage: '/images/projects/orbit-cover.jpg',
    galleryImages: ['/images/projects/orbit-1.jpg', '/images/projects/orbit-2.jpg'],
    techTags: ['Next.js', 'TypeScript', 'Shopify', 'Zustand'],
    liveUrl: 'https://example.com/orbit',
    repoUrl: 'https://github.com/example/orbit',
    featured: true,
    displayOrder: 1,
    dockingCameraNotes: 'Approach from top-left, focus on the central dashboard node.',
  },
  {
    id: 'proj-2',
    title: 'Gravity Analytics',
    summary: 'Real-time dashboard for server metrics.',
    description: '<p>A real-time data visualization tool for tracking server health and latency across multiple regions.</p>',
    coverImage: '/images/projects/gravity-cover.jpg',
    galleryImages: [],
    techTags: ['React', 'D3.js', 'WebSockets', 'Go'],
    liveUrl: 'https://example.com/gravity',
    featured: false,
    displayOrder: 2,
  }
];
