import {Component, NgZone, OnInit} from '@angular/core';
import {DattaConfig} from '../../../app-config';
import {Location} from '@angular/common';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  address: string = '';
  clientId: string = '';
  http: any;
  geocodingService: any;
  longitude: any;
  latitude: any;
onSubmit() {
throw new Error('Method not implemented.');
}
  public eliteConfig: any;
  public navCollapsed: boolean;
  public navCollapsedMob: boolean;
  public windowWidth: number;

  constructor(private zone: NgZone, private location: Location,) {
    this.eliteConfig = DattaConfig.config;

    let current_url = this.location.path();
    if (this.location['_baseHref']) {
      current_url = this.location['_baseHref'] + this.location.path();
    }

    if (current_url === this.location['_baseHref'] + '/layout/collapse-menu' || current_url === this.location['_baseHref'] + '/layout/box') {
      this.eliteConfig['collapse-menu'] = true;
    }

    this.windowWidth = window.innerWidth;
    this.navCollapsed = (this.windowWidth >= 992) ? this.eliteConfig['collapse-menu'] : false;
    this.navCollapsedMob = false;
    if (!this.clientId) {
      alert('Client ID is required');
      return;
    }

    this.http.post('/api/save-location', { address: this.address, clientId: this.clientId }).subscribe(response => {
      console.log('Location saved successfully');
    }, error => {
      console.error('Error saving location', error);
    });
    this.geocodingService.geocode(this.address).subscribe((results: any) => {
      if (results && results.length > 0) {
        this.latitude = results[0].lat;
        this.longitude = results[0].lon;
        this.saveToBackend(this.address, this.latitude, this.longitude);
      } else {
        alert('Location not found');
      }
    });
  }

  ngOnInit() {
    if (this.windowWidth < 992) {
      this.eliteConfig['layout'] = 'vertical';
      setTimeout(() => {
        document.querySelector('.pcoded-navbar').classList.add('menupos-static');
        (document.querySelector('#nav-ps-elite') as HTMLElement).style.maxHeight = '100%'; 
      }, 500);
    }
  }
  


  navMobClick() {
    if (this.navCollapsedMob && !(document.querySelector('app-navigation.pcoded-navbar').classList.contains('mob-open'))) {
      this.navCollapsedMob = !this.navCollapsedMob;
      setTimeout(() => {
        this.navCollapsedMob = !this.navCollapsedMob;
      }, 100);
    } else {
      this.navCollapsedMob = !this.navCollapsedMob;
    }
  }
  

  saveToBackend(address: string, clientId, ticket): void {
    const payload = { address, clientId, ticket};
    this.http.post('/api/save-location', payload).subscribe(response => {
      console.log('Location saved successfully');
    }, error => {
      console.error('Error saving location', error);
    });
  }

}
