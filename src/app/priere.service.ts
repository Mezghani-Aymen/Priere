import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PriereService {

  constructor() { }

  getPrayerIcon(name: string): string {
    const icons: Record<string, string> = {
      Fajr: '🌙',
      Dhuhr: '☀️',
      Asr: '🌤️',
      Maghrib: '🌇',
      Isha: '🌃',
    };
    return icons[name] ?? 'Icon Not Found';
  }
}
