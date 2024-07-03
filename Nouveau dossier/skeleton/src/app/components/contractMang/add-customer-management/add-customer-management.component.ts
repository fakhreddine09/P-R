import { Component, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BackendService } from 'src/app/services/backend.service';
import Observer from 'src/app/services/observer';
import { SharedService } from 'src/app/services/shared.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-customer-management',
  templateUrl: './add-customer-management.component.html',
  styleUrls: ['./add-customer-management.component.scss']
})
export class AddCustomerManagementComponent implements OnInit {
  @Input() title;
  @Input() id_folder;
  @Input() id_contract;
  @Input() add;
  @Input() objCustomer;
  @Input() mangerAddet;
  @Input() typeAccount;
  
  model: any = { type: "", nom: "" }
 
  constructor(
    public activeModal: NgbActiveModal,
    public sharedService: SharedService,

    private backendService: BackendService,
    public router: Router
  
  ) { }


  ngOnInit() {
    // alert(this.mangerAddet)
    if (this.add) {
      this.model = {}
    } else {
      this.model.email = this.objCustomer.email
      this.model.tel = this.objCustomer.tel
      this.model.typeAccount =this.objCustomer.typeAccount
      this.model.valid =this.objCustomer.valid
      // this.model.sla = this.objectContract.sla
    }
  }


  Onsubmit(f: NgForm) {
      if(this.add){
      let payload ={}
      let url=""
      const typeAccount = f.value.typeAccount
      
      // alert(typeAccount)
      if(typeAccount =="Contract manager"){
        payload ={visAvis:{...f.value,authority:"clientManger",folderId:this.id_folder},contractId:this.id_contract}
        url ="contract/AddVissaVie"
      }else{
        payload ={userContract:{...f.value,authority:"clientUser",folderId:this.id_folder},contractId:this.id_contract}
        url ="contract/addUserForContract"
      }
      this.backendService
    .post(`${environment.apiUrl+'/'+url}`, payload)
    .subscribe(new Observer(
      this.router,// just un class dans angular
         null,//
         true,//relode
         true,//swwet alert
         this.sharedService,//obligtoir si ana reload
         this.activeModal
      ).OBSERVER_POST2());

    }else{

      const payload ={...f.value,_id:this.objCustomer._id}
      console.log(payload);
      this.backendService
      .put(`${environment.apiUrl}/contract/updateCastomers`, payload)
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
