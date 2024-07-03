import { Component, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BackendService } from 'src/app/services/backend.service';
import Observer from 'src/app/services/observer';
import { SharedService } from 'src/app/services/shared.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-add-and-update-contract',
  templateUrl: './add-and-update-contract.component.html',
  styleUrls: ['./add-and-update-contract.component.scss']
})
export class AddAndUpdateContractComponent implements OnInit {
  @Input() title;
  @Input() id_folder;
  @Input() add;
  @Input() objectContract;
  model: any = { type: "", nom: "" }

  constructor(
    public activeModal: NgbActiveModal,
    public sharedService: SharedService,

    private backendService: BackendService,
    public router: Router
  
  ) { }


  ngOnInit() {
    if (this.add) {
      this.model = {}
    } else {
      this.model.type = this.objectContract.type
      this.model.nature = this.objectContract.nature
      this.model.sla = this.objectContract.sla
      this.model.startDate = this.objectContract.startDate
      this.model.endDate = this.objectContract.endDate
    }
  }


  Onsubmit(f: NgForm) {

    if(this.add){
      const payload={...f.value,folderID:this.id_folder};
      // console.log(payload);
      this.backendService
    .post(`${environment.apiUrl}/contract/createContract`, payload)
    .subscribe(new Observer(
      this.router,// just un class dans angular
         null,//
         true,//relode
         true,//swwet alert
         this.sharedService,//obligtoir si ana reload
         this.activeModal
      ).OBSERVER_POST());

    }else{
      const payload ={...f.value,_id:this.objectContract._id}
      console.log(payload);
      this.backendService
      .put(`${environment.apiUrl}/contract/updateContract`, payload)
      .subscribe(new Observer(
        this.router,// just un class dans angular
           null,//
           true,//relode
           true,//swwet alert
           this.sharedService,//obligtoir si ana reload
           this.activeModal
        ).OBSERVER_PUT());
    }

  }



}
