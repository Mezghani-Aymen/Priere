import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Coordinates } from '../types/prayer.types';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  getCurrentPosition(): Observable<Coordinates> {
    return new Observable<Coordinates>((observer) => {
      if (!navigator.geolocation) {
        observer.error(new Error('La géolocalisation n\'est pas supportée par votre navigateur.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          observer.next({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          observer.complete();
        },
        (error) => {
          let message = 'Erreur de géolocalisation.';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = 'Accès à la géolocalisation refusé.';
              break;
            case error.POSITION_UNAVAILABLE:
              message = 'Position non disponible.';
              break;
            case error.TIMEOUT:
              message = 'Délai d\'attente dépassé pour la géolocalisation.';
              break;
          }
          observer.error(new Error(message));
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }
}
