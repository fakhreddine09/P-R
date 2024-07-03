import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FoldersLayoutComponent } from 'src/app/theme/layout/folders-layout/folders-layout.component';
import { FoldersComponent } from './folders.component';
import { WorkOrdersComponent } from '../work-orders/work-orders.component';
import { TicketsComponent } from '../tickets/tickets.component';

const routes: Routes = [{
  path: "",
  component: FoldersLayoutComponent,
  children: [
    {
      path: '',
      component: FoldersComponent,
      data: {
        animationState: 'folders'
      },
    },
    {
      path: '',
      loadChildren: () => import('./../work-orders/work-orders.module').then(m => m.WorkOrdersModule),
      data: {
        animationState: 'work-orders'
      },
    },
    {
      path: ':folderId',
      loadChildren: () => import('./../tickets/tickets.module').then(m => m.TicketsModule),
      data: {
        animationState: 'tickets'
      },
    },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FoldersRoutingModule { }
