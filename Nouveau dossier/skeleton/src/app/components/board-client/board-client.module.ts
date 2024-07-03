import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoardClientRoutingModule } from './board-client-routing.module';
import { BoardClientComponent } from './board-client.component';
import {SharedModule} from  '../../theme/shared/shared.module'
// '../../../../../theme/shared/shared.module';
import {NgbCollapseModule, NgbDropdownModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  imports: [
    CommonModule,
    BoardClientRoutingModule,
    SharedModule,
    NgbCollapseModule,
    NgbDropdownModule,
    NgbTooltipModule
  ],
  declarations: [BoardClientComponent]
})
export class BoardClientModule { }
