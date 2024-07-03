import { Component, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BackendService } from 'src/app/services/backend.service';
import Observer from 'src/app/services/observer';
import { SharedService } from 'src/app/services/shared.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-update-equipemont-sofet',
  templateUrl: './add-update-equipemont-sofet.component.html',
  styleUrls: ['./add-update-equipemont-sofet.component.scss']
})
export class AddUpdateEquipemontSofetComponent implements OnInit {
  @Input() title;
  @Input() id_Sites;
  @Input() add;
  @Input() objSites;
  model: any = { type: "", nom: "" }
  listTypeSupport:any=[]
  constructor(
    public activeModal: NgbActiveModal,
    public sharedService: SharedService,

    private backendService: BackendService,
    public router: Router
  
  ) { }


  ngOnInit() {
    this.getListSupport()
    if (this.add) {
      this.model = {}
    } else {
      this.model.constructure = this.objSites.constructure
      this.model.equipmentName = this.objSites.equipmentName
      this.model.version = this.objSites.version
      this.model.TypeSupport = this.objSites.TypeSupport
      this.model.startDateSupport = this.objSites.startDateSupport
      this.model.endDateSupport = this.objSites.endDateSupport
    }
  }


  async getListSupport() {
    await this.backendService.get(`${environment.apiUrl}/typeSupport/getAllTypeSupport`).subscribe(
      new Observer().OBSERVER_GET((response) => {
        this.listTypeSupport = response.rows;
        // console.log(this.listTypeSupport);
        
      })
    );
  }
// 
  Onsubmit(f: NgForm) {
    
    if(this.add){
      const payload={eqipemontSofy:{...f.value},siteId:this.id_Sites};
      // console.log(payload);
      // console.log(payload);
      this.backendService
    .post(`${environment.apiUrl}/equipmentSoft/createEquipmentSoft`, payload)
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
      // console.log(payload);
      this.backendService
      .put(`${environment.apiUrl}/equipmentSoft/updateEquipmentSoft`, payload)
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
