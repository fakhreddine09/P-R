import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListTicketsRoutingModule } from './list-tickets-routing.module';
import { ListTicketsComponent } from './list-tickets.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [ListTicketsComponent],
  imports: [
    CommonModule,
    ListTicketsRoutingModule,
    SharedModule,
    FormsModule
  ]
})
export class ListTicketsModule { }
