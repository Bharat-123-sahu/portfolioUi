import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Hero } from '../features/hero/models/hero.model';
import { About } from '../features/about/models/about.model';
import { Skill } from '../features/skills/models/skills.model';
import { Experience } from '../features/experience/models/experience.model';
import { Education } from '../features/education/models/education.model';
import { Project } from '../features/projects/models/project.models';
import { Blog } from '../features/blog/models/blog.models';
import { Certificate } from '../features/certificate/models/certificate.models';
import { Contact } from '../features/contact/models/contact.model';
import { Resume } from '../features/resume/models/resume.models';
import { SocialLink } from '../features/social-links/models/social-link.model';

@Injectable({
  providedIn: 'root',
})
export class PublicService {
  private http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/api/v1/public` ; // apna backend URL

  getHero() {
    return this.http.get<Hero[]>(`${this.api}/hero`);
  }

  getAbout() {
    return this.http.get<About[]>(`${this.api}/about`);
  }

  getSkills() {
    return this.http.get<Skill[]>(`${this.api}/skills`);
  }

  getExperience() {
    return this.http.get<Experience[]>(`${this.api}/experience`);
  }

  getEducation() {
    return this.http.get<Education[]>(`${this.api}/education`);
  }

  getProjects() {
    return this.http.get<Project[]>(`${this.api}/projects`);
  }

  getProjectBySlug(slug: string) {
    return this.http.get<Project>(`${this.api}/projects/slug/${encodeURIComponent(slug)}`);
  }

  getCertificates() {
    return this.http.get<Certificate[]>(`${this.api}/certificate`);
  }

  getBlogs() {
    return this.http.get<Blog[] >(`${this.api}/blog`);
  }

  getBlogBySlug(slug: string) {
    return this.http.get<Blog>(`${this.api}/blog/slug/${encodeURIComponent(slug)}`);
  }

  getContact() {
    return this.http.get<Contact[]>(`${this.api}/contact`);
  }

  getResume() {
    return this.http.get<Resume[]>(`${this.api}/resume`);

  }

  getSocialLinks() {
    return this.http.get<SocialLink[]>(`${this.api}/social-links`);
  }
}
