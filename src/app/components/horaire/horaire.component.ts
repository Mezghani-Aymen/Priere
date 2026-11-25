import { Component, Input } from '@angular/core';
import { CommonModule, NgClass, NgStyle } from '@angular/common';

@Component({
  selector: 'horaire-component',
  standalone: true,
  imports: [CommonModule, NgClass, NgStyle],
  templateUrl: './horaire.component.html',
  styleUrl: './horaire.component.css'
})
export class HoraireComponent {
  @Input() name = '';
  @Input() label = '';
  @Input() time = '';
  @Input() isNext = false;
  @Input() diffMinutes: number | null = null;

  get redDegree(): number {
    if (this.diffMinutes === null || this.diffMinutes > 15) {
      return 0;
    }
    return Math.min(255, Math.max(30, 255 - this.diffMinutes * 15));
  }
}
