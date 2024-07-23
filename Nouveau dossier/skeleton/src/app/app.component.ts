import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import * as L from 'leaflet';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'elite-able';
 map: L.Map;


  constructor(private router: Router) { }

  ngOnInit() {
    this.initMap();
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
private initMap(): void {
    this.map = L.map('map', {
      center: [51.505, -0.09], // Coordonnées initiales de la carte (latitude, longitude)
      zoom: 13 // Zoom initial
    });

    // Ajouter un fond de carte OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Ajouter un marqueur
    L.marker([51.505, -0.09]).addTo(this.map)
      .bindPopup('Hello, World!')
      .openPopup();
  }
}



 

  


