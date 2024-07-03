import { Component, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BackendService } from 'src/app/services/backend.service';
import Observer from 'src/app/services/observer';
import { SharedService } from 'src/app/services/shared.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-files-to-contract',
  templateUrl: './add-files-to-contract.component.html',
  styleUrls: ['./add-files-to-contract.component.scss']
})
export class AddFilesToContractComponent implements OnInit {
  @Input() title;
  @Input() add;
  @Input() _id

  Filelists:any
  // data:FormData;
  constructor(
    public activeModal: NgbActiveModal,
    public sharedService: SharedService,

    private backendService: BackendService,
    public router: Router
  
  ) { }


  ngOnInit() {
// alert(this._id)
  }


  Onsubmit(f: NgForm) {
    let data = new FormData();
    for (let index = 0; index < this.Filelists.length; index++) {
      data.append("files",this.Filelists[index])
    }
    data.append("_id",this._id)
    // console.log(data.getAll("files"));
    // console.log(data.getAll("_id"));
      this.backendService
    .post(`${environment.apiUrl}/contract/addlistFileContract`, data)
    .subscribe(new Observer(
      this.router,// just un class dans angular
         null,//
         true,//relode
         true,//swwet alert
         this.sharedService,//obligtoir si ana reload
         this.activeModal
      ).OBSERVER_POST());
  }



}
