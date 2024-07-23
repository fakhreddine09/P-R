import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { AuthComponent } from './theme/layout/auth/auth.component';
import { AddClientComponent } from './components/add-client/add-client.component';
import { BoardClientComponent } from './components/board-client/board-client.component';
import { MapComponent } from 'src/map/map.component';


const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'sample-page',
        pathMatch: 'full'
      },
      {
        path: 'clientMang',
        loadChildren: () => import('./components/clients-mang/clients-mang.module').then(m => m.ClientsMangModule)
      },

      {
        path: 'sample-page',
        loadChildren: () => import('./demo/extra/sample-page/sample-page.module').then(m => m.SamplePageModule)
      },
      {
        path: 'test',
        loadChildren: () => import('./components/components.module').then(m => m.ComponentsModule)
      },
      { path: 'map', component: MapComponent }, // Chemin vers votre carte
  // Autres routes si nécessaires
  { path: '', redirectTo: '/map', pathMatch: 'full' } // Redirection vers la carte par défaut

    
    ]
  },
  {
    path: ' board-client',
    component:BoardClientComponent,
    children: []
  },
  
  // ng g m components/admin --route home --module components.module
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
