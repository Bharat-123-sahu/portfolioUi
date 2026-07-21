import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormControl,
  ReactiveFormsModule
} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-technology-chips',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
  ],
  templateUrl: './technology-chips.component.html',
  styleUrls: ['./technology-chips.component.scss'],
})
export class TechnologyChipsComponent {

  @Input()
  technologies: string[] = [];

  @Input()
  placeholder = 'Add Technology';

  @Output()
  technologiesChange = new EventEmitter<string[]>();

  technologyControl = new FormControl('');

  addTechnology(): void {

    const value = this.technologyControl.value?.trim();

    if (!value) {
      return;
    }

    if (this.technologies.includes(value)) {

      this.technologyControl.reset();

      return;

    }

    this.technologies = [
      ...this.technologies,
      value,
    ];

    this.technologiesChange.emit(this.technologies);

    this.technologyControl.reset();

  }

  removeTechnology(index: number): void {

    this.technologies.splice(index, 1);

    this.technologies = [...this.technologies];

    this.technologiesChange.emit(this.technologies);

  }

}