import { Component, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BackendService } from 'src/app/services/backend.service';
import Observer from 'src/app/services/observer';
import { SharedService } from 'src/app/services/shared.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-update-sites',
  templateUrl: './add-update-sites.component.html',
  styleUrls: ['./add-update-sites.component.scss']
})
export class AddUpdateSitesComponent implements OnInit {
  @Input() title;
  @Input() id_folder;
  @Input() add;
  @Input() objSites;
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
      this.model.nomSite = this.objSites.nomSite
      this.model.adress = this.objSites.adress
      // this.model.sla = this.objectContract.sla
    }
  }


  Onsubmit(f: NgForm) {
    
    if(this.add){
      const payload={site:{...f.value},_id:this.id_folder};
      // console.log(payload);
      // console.log(payload);
      this.backendService
    .post(`${environment.apiUrl}/folder/addSiteClient`, payload)
    .subscribe(new Observer(
      this.router,// just un class dans angular
         null,//
         true,//relode
         true,//swwet alert
         this.sharedService,//obligtoir si ana reload
         this.activeModal
      ).OBSERVER_POST());

    }else{
      const payload ={...f.value,_id:this.objSites._id}
      console.log(payload);
      this.backendService
      .put(`${environment.apiUrl}/folder/updateSite`, payload)
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
