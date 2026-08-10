import { Skill } from '../lib/content-types';

export const mockSkills: Skill[] = [
  {
    id: 'skill-1',
    category: 'Navigation',
    name: 'React / Next.js',
    proficiency: 95,
    icon: 'react-icon',
    displayOrder: 1,
  },
  {
    id: 'skill-2',
    category: 'Navigation',
    name: 'TypeScript',
    proficiency: 90,
    icon: 'ts-icon',
    displayOrder: 2,
  },
  {
    id: 'skill-3',
    category: 'Engine',
    name: 'Node.js',
    proficiency: 85,
    icon: 'node-icon',
    displayOrder: 3,
  },
  {
    id: 'skill-4',
    category: 'Engine',
    name: 'PostgreSQL',
    proficiency: 80,
    icon: 'pg-icon',
    displayOrder: 4,
  },
  {
    id: 'skill-5',
    category: 'Shields',
    name: 'Three.js / R3F',
    proficiency: 75,
    icon: 'three-icon',
    displayOrder: 5,
  }
];
