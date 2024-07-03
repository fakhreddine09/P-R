import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TechnicieListComponent } from './technicie-list.component';

const routes: Routes = [{ path: '', component: TechnicieListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TechnicieListRoutingModule { }
