import { Component, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BackendService } from 'src/app/services/backend.service';
import Observer from 'src/app/services/observer';
import { SharedService } from 'src/app/services/shared.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-update-support',
  templateUrl: './add-update-support.component.html',
  styleUrls: ['./add-update-support.component.scss']
})
export class AddUpdateSupportComponent implements OnInit {
  @Input() title;
  @Input() add;
  @Input() objectReceved;
  model: any = { }
  listTypeSupport:any=[]
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
      this.model.supportName = this.objectReceved.supportName

      // this.model.sla = this.objectContract.sla
    }
  }

  Onsubmit(f: NgForm) {
    if(this.add){
      const payload={...f.value};
      // console.log(payload);
      // console.log(payload);
      this.backendService
    .post(`${environment.apiUrl}/typeSupport/createTypeSupport`, payload)
    .subscribe(new Observer(
      this.router,// just un class dans angular
         null,//
         true,//relode
         true,//swwet alert
         this.sharedService,//obligtoir si ana reload
         this.activeModal
      ).OBSERVER_POST());
    }else{
      const payload ={...f.value,_id:this.objectReceved._id}
      this.backendService
      .put(`${environment.apiUrl}/typeSupport/updateTypeSupport`, payload)
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
