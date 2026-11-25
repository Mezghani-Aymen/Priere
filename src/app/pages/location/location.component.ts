import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe, NgClass, NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocationService } from '../../services/location.service';
import { PriereService } from '../../services/priere.service';
import { CalculationMethod, Coordinates, PrayerTimes } from '../../types/prayer.types';
import { PrayerCardComponent } from '../../components/prayer-card/prayer-card.component';

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe, NgClass, NgStyle, PrayerCardComponent],
  templateUrl: './location.component.html',
  styleUrl: './location.component.css',
})
export class LocationComponent implements OnInit {
  selectedMethod = 1;
  methods: CalculationMethod[] = [];

  loading = false;
  error = '';
  coords: Coordinates | null = null;
  dateGregorian = '';
  dateHijri = '';
  timings: PrayerTimes | null = null;

  constructor(
    private locationService: LocationService,
    private priereService: PriereService
  ) {}

  ngOnInit(): void {
    this.methods = this.priereService.getCalculationMethods();
    this.loadFromGeolocation();
  }

  loadFromGeolocation(): void {
    this.error = '';
    this.loading = true;

    this.locationService.getCurrentPosition().subscribe({
      next: (coords) => {
        this.coords = coords;
        this.fetchPrayerTimes(coords.latitude, coords.longitude);
      },
      error: (err: Error) => {
        this.loading = false;
        this.error = err.message;
      },
    });
  }

  onMethodChange(): void {
    if (this.coords) {
      this.fetchPrayerTimes(this.coords.latitude, this.coords.longitude);
    }
  }

  private fetchPrayerTimes(lat: number, lng: number): void {
    this.loading = true;
    this.priereService.getByCoords(lat, lng, this.selectedMethod).subscribe({
      next: (res) => {
        this.loading = false;
        this.dateGregorian = res.data.date.readable;
        const h = res.data.date.hijri;
        if (h) {
          this.dateHijri = `${h.day} ${h.month.en} ${h.year} ${h.designation?.abbreviated ?? 'AH'}`;
        }
        this.timings = res.data.timings;
      },
      error: () => {
        this.loading = false;
        this.error = 'Impossible de récupérer les horaires pour votre position.';
      },
    });
  }
}
