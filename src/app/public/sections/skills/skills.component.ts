import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonButton,
  IonIcon,
  IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { codeSlashOutline, layersOutline } from 'ionicons/icons';
import { finalize } from 'rxjs';

import { Skill } from 'src/app/features/skills/models/skills.model';
import { PublicService } from '../../public.service';
import { activeOnly, sortByDisplayOrder, unwrapCollection } from '../../public.utils';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonButton,
    IonIcon,
    IonSpinner,
  ],
})
export class SkillsComponent {
  private readonly publicService = inject(PublicService);

  readonly skills = signal<Skill[]>([]);
  readonly activeCategory = signal('All');
  readonly loading = signal(true);
  readonly error = signal(false);

  readonly categories = computed(() => [
    'All',
    ...new Set(this.skills().map((skill) => skill.category).filter(Boolean)),
  ]);

  readonly filteredSkills = computed(() => {
    const category = this.activeCategory();
    return category === 'All'
      ? this.skills()
      : this.skills().filter((skill) => skill.category === category);
  });

  constructor() {
    addIcons({ codeSlashOutline, layersOutline });
    this.loadSkills();
  }

  private loadSkills(): void {
    this.publicService.getSkills()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          const skills = sortByDisplayOrder(activeOnly(unwrapCollection<Skill>(response, 'skills')));
          this.skills.set(skills);
          this.error.set(false);
        },
        error: () => this.error.set(true),
      });
  }
}
