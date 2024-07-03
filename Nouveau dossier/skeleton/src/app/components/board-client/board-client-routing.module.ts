import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BoardClientComponent } from './board-client.component';

const routes: Routes = [{ path: '', component: BoardClientComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoardClientRoutingModule { }
