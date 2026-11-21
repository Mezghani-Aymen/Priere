export interface PrayerTimes {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export interface AlAdhanHijriDate {
  date: string;
  day: string;
  month: {
    number: number;
    en: string;
    ar: string;
  };
  year: string;
  designation: {
    abbreviated: string;
    expanded: string;
  };
}

export interface AlAdhanResponse {
  code: number;
  status: string;
  data: {
    timings: PrayerTimes;
    date: {
      readable: string;
      hijri: AlAdhanHijriDate;
      gregorian: {
        date: string;
        day: string;
        month: { en: string; number: number };
        year: string;
      };
    };
  };
}

export interface CalculationMethod {
  id: number;
  name: string;
}

export interface PrayerEntry {
  name: string;
  label: string;
  time: string;
  isNext: boolean;
}

export interface NextPrayerInfo {
  nextIndex: number;
  nextPrayerName: string;
  nextPrayerTime: string;
  timeRemaining: string;
  diffMinutes: number;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}
