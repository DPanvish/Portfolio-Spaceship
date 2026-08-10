import { SiteSettings, About, Experience, Project, Skill } from './content-types';
import { mockSettings } from '../mock/settings';
import { mockAbout } from '../mock/about';
import { mockExperience } from '../mock/experience';
import { mockProjects } from '../mock/projects';
import { mockSkills } from '../mock/skills';

// This is the content service interface. 
// In Phase 1-7, this returns mock data.
// In Phase 8, this will swap to fetch from the DB/API.

export async function getSiteSettings(): Promise<SiteSettings> {
  return mockSettings;
}

export async function getAbout(): Promise<About> {
  return mockAbout;
}

export async function getExperience(): Promise<Experience[]> {
  return [...mockExperience].sort((a, b) => a.displayOrder - b.displayOrder);
}

export async function getProjects(): Promise<Project[]> {
  return [...mockProjects].sort((a, b) => a.displayOrder - b.displayOrder);
}

export async function getSkills(): Promise<Skill[]> {
  return [...mockSkills].sort((a, b) => a.displayOrder - b.displayOrder);
}
