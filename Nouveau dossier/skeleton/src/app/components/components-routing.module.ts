import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'user-list', loadChildren: () => import('./user-list/user-list.module').then(m => m.UserListModule) }, 
  { path: 'technicie-list', loadChildren: () => import('./technicie-list/technicie-list.module').then(m => m.TechnicieListModule) },
  { path: 'listContract', loadChildren: () => import('./contract-list/contract-list.module').then(m => m.ContractListModule) },
  { path: 'folderDerailes', loadChildren: () => import('./folder-detailes/folder-detailes.module').then(m => m.FolderDetailesModule) },
  { path: 'listTickets', loadChildren: () => import('./list-tickets/list-tickets.module').then(m => m.ListTicketsModule) },
  { path: 'listTechnician', loadChildren: () => import('./list-client/list-client.module').then(m => m.ListClientModule) },
  { path: 'boardClient', loadChildren: () => import('./board-client/board-client.module').then(m => m.BoardClientModule) },
  { path: 'typesupports', loadChildren: () => import('./typesupports/typesupports.module').then(m => m.TypesupportsModule) },
  { path: 'clanderVisitepreventive', loadChildren: () => import('./clander-visitepreventive/clander-visitepreventive.module').then(m => m.ClanderVisitepreventiveModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentsRoutingModule { }
