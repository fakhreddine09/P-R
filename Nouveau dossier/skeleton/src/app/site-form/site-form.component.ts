import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SiteService } from './site.service';
@Component({
  selector: 'app-site-form',
  templateUrl: './site-form.component.html',
  styleUrls: ['./site-form.component.scss']
})
export class SiteFormComponent implements OnInit {
onSubmit() {
throw new Error('Method not implemented.');
}
  address:any;
  siteForm: FormGroup;
  siteService: any;

  constructor() {
    this.address = ['', Validators.required]
      
    }

  
  ngOnInit(): void {
    throw new Error('Method not implemented.')
  }

  onsubmit(): void {
    if (this.siteForm.valid) {
      this.siteService.saveAddress(this.siteForm.value).subscribe(
        response => {
          console.log('Adresse envoyée avec succès', response);
        },
        error => {
          console.error('Erreur lors de l\'envoi de l\'adresse', error);
        }
      );
    }
  }
}

function ngOnInit() {
  throw new Error('Function not implemented.');
}

