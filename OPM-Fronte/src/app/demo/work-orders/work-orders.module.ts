import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkOrdersRoutingModule } from './work-orders-routing.module';
import { WorkOrdersComponent } from "./work-orders.component"

@NgModule({
  declarations: [
    WorkOrdersComponent
  ],
  imports: [
    CommonModule,
    WorkOrdersRoutingModule
  ]
})
export class WorkOrdersModule { }
