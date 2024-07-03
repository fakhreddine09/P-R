import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientsMangRoutingModule } from './clients-mang-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddUpdateTiketesCustomerComponent } from './add-update-tiketes-customer/add-update-tiketes-customer.component';
import { RaisenCancelTiketesComponent } from './raisen-cancel-tiketes/raisen-cancel-tiketes.component';


@NgModule({
  declarations: [
    AddUpdateTiketesCustomerComponent,
    RaisenCancelTiketesComponent
  ],
  imports: [
    CommonModule,
    ClientsMangRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ] 
})
export class ClientsMangModule { }
