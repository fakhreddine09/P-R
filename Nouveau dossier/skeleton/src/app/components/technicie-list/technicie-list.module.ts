import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TechnicieListRoutingModule } from './technicie-list-routing.module';
import { TechnicieListComponent } from './technicie-list.component';


@NgModule({
  declarations: [TechnicieListComponent],
  imports: [
    CommonModule,
    TechnicieListRoutingModule
  ]
})
export class TechnicieListModule { }
