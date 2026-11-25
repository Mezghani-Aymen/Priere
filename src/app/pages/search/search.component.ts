import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass, NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PriereService } from '../../services/priere.service';
import { CalculationMethod, PrayerTimes } from '../../types/prayer.types';
import { PrayerCardComponent } from '../../components/prayer-card/prayer-card.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, NgClass, NgStyle, PrayerCardComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent implements OnInit {
  cityInput = 'Tunis';
  selectedMethod = 1;
  methods: CalculationMethod[] = [];

  loading = false;
  error = '';
  cityName = '';
  dateGregorian = '';
  dateHijri = '';
  timings: PrayerTimes | null = null;

  constructor(private priereService: PriereService) {}

  ngOnInit(): void {
    this.methods = this.priereService.getCalculationMethods();
    this.search();
  }

  search(): void {
    const city = this.cityInput.trim();
    if (!city) return;

    this.error = '';
    this.loading = true;

    this.priereService.getByCity(city, this.selectedMethod).subscribe({
      next: (res) => {
        this.loading = false;
        this.cityName = city;
        this.dateGregorian = res.data.date.readable;
        const h = res.data.date.hijri;
        if (h) {
          this.dateHijri = `${h.day} ${h.month.en} ${h.year} ${h.designation?.abbreviated ?? 'AH'}`;
        }
        this.timings = res.data.timings;
      },
      error: () => {
        this.loading = false;
        this.error = 'Ville non trouvée ou erreur de connexion API.';
      },
    });
  }

  onMethodChange(): void {
    this.search();
  }
}
