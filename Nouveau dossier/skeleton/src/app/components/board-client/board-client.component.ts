import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-board-client',
  templateUrl: './board-client.component.html',
  styleUrls: ['./board-client.component.scss']
})
export class BoardClientComponent  implements OnInit {
  public isCompleteStatus = false;
  public isAssignUsers = false;
  public isRevision = false;

  constructor() { }

  ngOnInit() {
  }

}
