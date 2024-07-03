import { Component, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BackendService } from 'src/app/services/backend.service';
import Observer from 'src/app/services/observer';
import { SharedService } from 'src/app/services/shared.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-customer-affect-oled',
  templateUrl: './customer-affect-oled.component.html',
  styleUrls: ['./customer-affect-oled.component.scss']
})
export class CustomerAffectOledComponent implements OnInit {
  @Input() title;
  @Input() mangerAddet;
  @Input() companyName;
  @Input() id_contract;
  add = true
  listCustomer: any = []
  listCustomerAffected: any = []
  model: any = { clientId: "", typeAccount: "" }
  typeAcc: any;
  constructor(
    public activeModal: NgbActiveModal,
    public sharedService: SharedService,
    private backendService: BackendService,
    public router: Router

  ) { }


  ngOnInit() {
    this.getListCustomerAffected()
    this.getListCustomer()
  }
  Onsubmit(f: NgForm) {
    let payload = {};
    if (this.typeAcc == 'Contract manager') {
      payload = {
        _id: this.id_contract,
        customerId: null,
        visaVi: f.value.clientId
      }
    }
    if (this.typeAcc == 'user') {
      payload = {
        _id: this.id_contract,
        customerId: f.value.clientId,
        visaVi: null
      }

    }
      this.backendService
    .post(`${environment.apiUrl}/client/affectOledCustemer`, payload)
    .subscribe(new Observer(
      this.router,// just un class dans angular
         null,//
         true,//relode
         true,//swwet alert
         this.sharedService,//obligtoir si ana reload
         this.activeModal
      ).OBSERVER_POST());
  }

  getTypeAccount(event) {
    this.typeAcc = event.target.value
    alert(this.typeAcc)
  }
  getListCustomer() {
    this.backendService.get(`${environment.apiUrl}/client/getListClientOledNotAffected/${this.companyName}`).subscribe(
      new Observer().OBSERVER_GET((response) => {
        this.listCustomer = response.rows;
        // console.log("oled List");
        // console.log(this.listCustomer);
        if (this.listCustomerAffected.length != 0) {
          this.listCustomer = this.listCustomer.filter(cli => !this.listCustomerAffected.includes(cli._id));
        }
        // console.log("new List");
        // console.log(this.listCustomer);

      })
    );
  }
  getListCustomerAffected() {
    this.backendService.get(`${environment.apiUrl}/client/getListClientDejaAffected/${this.id_contract}`).subscribe(
      new Observer().OBSERVER_GET((response) => {
        this.listCustomerAffected = response.rows;
        // if (this.listtechAffecte.length != 0) {
        //   this.listTechnicvien = this.listTechnicvien.filter(tech => !this.listtechAffecte.includes(tech._id));
        // }
      })
    );
  }
}



