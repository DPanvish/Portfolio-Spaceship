import { Experience } from '../lib/content-types';

export const mockExperience: Experience[] = [
  {
    id: 'exp-1',
    company: 'Stellar Tech',
    role: 'Senior Full Stack Engineer',
    startDate: '2022-03',
    endDate: null,
    description: 'Lead engineer for the core platform team. Scaled the microservices architecture to handle 5x traffic.',
    techTags: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
    logo: '/images/stellar-logo.png',
    displayOrder: 1,
  },
  {
    id: 'exp-2',
    company: 'Nebula Startup',
    role: 'Frontend Developer',
    startDate: '2019-06',
    endDate: '2022-02',
    description: 'Built the initial MVP and established the design system.',
    techTags: ['Vue', 'Tailwind', 'Firebase'],
    logo: '/images/nebula-logo.png',
    displayOrder: 2,
  },
];
