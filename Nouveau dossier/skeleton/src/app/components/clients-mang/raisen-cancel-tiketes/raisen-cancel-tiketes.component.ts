import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BackendService } from 'src/app/services/backend.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-raisen-cancel-tiketes',
  templateUrl: './raisen-cancel-tiketes.component.html',
  styleUrls: ['./raisen-cancel-tiketes.component.scss']
})
export class RaisenCancelTiketesComponent implements OnInit {
  @Input() title;
  @Input() id_contract;
  @Input() add;
  model: any = {}

  constructor(
    public activeModal: NgbActiveModal,
    public sharedService: SharedService,

    private backendService: BackendService,
    public router: Router
  
  ) { }

  ngOnInit(): void {
  }
  Onsubmit(f: NgForm) {

    
  }
}
