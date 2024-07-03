import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TypesupportsRoutingModule } from './typesupports-routing.module';
import { TypesupportsComponent } from './typesupports.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [TypesupportsComponent],
  imports: [
    CommonModule,
    TypesupportsRoutingModule,
    SharedModule,
    FormsModule
  ]
})
export class TypesupportsModule { }
