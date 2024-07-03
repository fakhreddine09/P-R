import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListTechnicianComponent } from './list-technician.component';

const routes: Routes = [{ path: '', component: ListTechnicianComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListTechnicianRoutingModule { }
