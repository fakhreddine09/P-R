import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { GeocodingService } from './geocoding.service';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  map: L.Map;
  
  address: string = '';
    latitude: number;
    longitude: number;
// Définir une icône personnalisée

constructor(private geocodingService: GeocodingService, private http: HttpClient) { }
  ngOnInit() {
    this.initMap();
   

  }
 

  private initMap(): void {
    this.map = L.map('map', {
      center: [36.81897 , 10.16579],
      zoom: 13
    });

  
    
  
// Google Map Layer

 L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
  maxZoom: 20,
  subdomains:['mt0','mt1','mt2','mt3']
}).addTo(this.map);

    
  }
  
    
  
   
  }






