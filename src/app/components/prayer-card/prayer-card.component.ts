import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { CommonModule, NgClass, NgStyle } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { PriereService } from '../../services/priere.service';
import { PrayerEntry, PrayerTimes } from '../../types/prayer.types';
import { HoraireComponent } from '../horaire/horaire.component';

@Component({
  selector: 'app-prayer-card',
  standalone: true,
  imports: [CommonModule, NgClass, NgStyle, HoraireComponent],
  templateUrl: './prayer-card.component.html',
  styleUrl: './prayer-card.component.css',
})
export class PrayerCardComponent implements OnChanges, OnDestroy {
  @Input() cityName = '';
  @Input() dateGregorian = '';
  @Input() dateHijri = '';
  @Input() timings: PrayerTimes | null = null;
  @Input() loading = false;

  prayers: PrayerEntry[] = [];
  nextPrayer = '';
  nextPrayerTime = '';
  timeRemaining = '';
  diffMinutes = 0;

  private timerSub?: Subscription;

  constructor(private priereService: PriereService) {}

  get redDegree(): number {
    if (this.diffMinutes > 15) {
      return 0;
    }
    return Math.min(255, Math.max(30, 255 - this.diffMinutes * 15));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['timings'] && this.timings) {
      this.buildPrayerList(this.timings);
      this.startCountdown();
    }
  }

  ngOnDestroy(): void {
    this.timerSub?.unsubscribe();
  }

  private buildPrayerList(timings: PrayerTimes): void {
    const list: { key: keyof PrayerTimes; label: string }[] = [
      { key: 'Fajr', label: 'Fajr' },
      { key: 'Dhuhr', label: 'Dhuhr' },
      { key: 'Asr', label: 'Asr' },
      { key: 'Maghrib', label: 'Maghrib' },
      { key: 'Isha', label: 'Isha' },
    ];

    this.prayers = list.map((p) => ({
      name: p.key,
      label: p.label,
      time: timings[p.key].split(' ')[0],
      isNext: false,
    }));

    this.updateNext();
  }

  private startCountdown(): void {
    this.timerSub?.unsubscribe();
    this.timerSub = interval(1000).subscribe(() => this.updateNext());
  }

  private updateNext(): void {
    if (!this.prayers.length) return;

    const result = this.priereService.calculateNextPrayer(this.prayers);
    this.prayers.forEach((p, idx) => {
      p.isNext = idx === result.nextIndex;
    });

    this.nextPrayer = result.nextPrayerName;
    this.nextPrayerTime = result.nextPrayerTime;
    this.timeRemaining = result.timeRemaining;
    this.diffMinutes = result.diffMinutes;
  }
}
