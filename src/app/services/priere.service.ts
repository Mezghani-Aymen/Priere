import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AlAdhanResponse,
  CalculationMethod,
  NextPrayerInfo,
  PrayerEntry,
} from '../types/prayer.types';

export const CALCULATION_METHODS: CalculationMethod[] = [
  { id: 1, name: 'Muslim World League' },
  { id: 3, name: 'Egyptian General Authority of Survey' },
  { id: 4, name: 'Umm Al-Qura University, Makkah' },
  { id: 5, name: 'University of Islamic Sciences, Karachi' },
  { id: 2, name: 'Islamic Society of North America (ISNA)' },
  { id: 7, name: 'Institute of Geophysics, University of Tehran' },
  { id: 8, name: 'Gulf Region' },
  { id: 9, name: 'Kuwait' },
  { id: 10, name: 'Qatar' },
  { id: 11, name: 'Majlis Ugama Islam Singapura, Singapore' },
  { id: 15, name: 'Turkey' },
];

@Injectable({
  providedIn: 'root',
})
export class PriereService {
  private readonly cityApiUrl = 'https://api.aladhan.com/v1/timingsByCity';
  private readonly coordsApiUrl = 'https://api.aladhan.com/v1/timings';

  constructor(private http: HttpClient) {}

  getCalculationMethods(): CalculationMethod[] {
    return CALCULATION_METHODS;
  }

  getByCity(city: string, method: number): Observable<AlAdhanResponse> {
    const url = `${this.cityApiUrl}?city=${encodeURIComponent(city)}&country=&method=${method}`;
    return this.http.get<AlAdhanResponse>(url);
  }

  getByCoords(lat: number, lng: number, method: number): Observable<AlAdhanResponse> {
    const url = `${this.coordsApiUrl}?latitude=${lat}&longitude=${lng}&method=${method}`;
    return this.http.get<AlAdhanResponse>(url);
  }

  calculateNextPrayer(prayers: PrayerEntry[]): NextPrayerInfo {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    let nextIndex = -1;
    let minDiff = Infinity;

    for (let i = 0; i < prayers.length; i++) {
      const [h, m] = prayers[i].time.split(' ')[0].split(':').map(Number);
      const prayerMinutes = h * 60 + m;
      const diff = prayerMinutes > currentMinutes
        ? prayerMinutes - currentMinutes
        : prayerMinutes + 1440 - currentMinutes;

      if (diff < minDiff) {
        minDiff = diff;
        nextIndex = i;
      }
    }

    const hours = Math.floor(minDiff / 60);
    const minutes = minDiff % 60;

    return {
      nextIndex,
      nextPrayerName: nextIndex >= 0 ? prayers[nextIndex].label : '',
      nextPrayerTime: nextIndex >= 0 ? prayers[nextIndex].time : '',
      timeRemaining: `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}min`,
      diffMinutes: minDiff === Infinity ? 0 : minDiff,
    };
  }

  getTimeRemainingColor(diffMinutes: number): string {
    if (diffMinutes <= 15) {
      const ratio = Math.max(0, Math.min(1, diffMinutes / 15));
      const r = Math.round(255 - ratio * 35);
      const g = Math.round(ratio * 50);
      const b = Math.round(ratio * 50);
      return `rgb(${r}, ${g}, ${b})`;
    } else if (diffMinutes <= 60) {
      return 'rgb(230, 126, 34)';
    } else {
      return 'rgb(44, 83, 100)';
    }
  }

  getCountdownBgColor(diffMinutes: number): string {
    if (diffMinutes <= 15) {
      return 'rgb(254, 242, 242)';
    } else if (diffMinutes <= 60) {
      return 'rgb(255, 250, 240)';
    }
    return 'rgb(240, 247, 251)';
  }
}
