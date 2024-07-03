import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListTechnicianRoutingModule } from './list-technician-routing.module';
import { ListTechnicianComponent } from './list-technician.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';


@NgModule({
  declarations: [ListTechnicianComponent],
  imports: [
    CommonModule,
    ListTechnicianRoutingModule,
    SharedModule,
    FormsModule,
    DataTablesModule
  ]
})
export class ListTechnicianModule { }
