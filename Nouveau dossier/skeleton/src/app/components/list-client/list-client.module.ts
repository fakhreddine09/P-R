import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListClientRoutingModule } from './list-client-routing.module';
import { ListClientComponent } from './list-client.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { SamplePageRoutingModule } from 'src/app/demo/extra/sample-page/sample-page-routing.module';
import { DataTablesModule } from 'angular-datatables';



@NgModule({
  declarations: [ListClientComponent],
  imports: [
    CommonModule,
    ListClientRoutingModule,
    SamplePageRoutingModule,
    SharedModule,
    FormsModule,
    DataTablesModule,
  ]
})
export class ListClientModule { }
