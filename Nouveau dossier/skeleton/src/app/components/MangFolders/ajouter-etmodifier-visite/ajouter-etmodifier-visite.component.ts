import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BackendService } from 'src/app/services/backend.service';
import Observer from 'src/app/services/observer';
import { SharedService } from 'src/app/services/shared.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ajouter-etmodifier-visite',
  templateUrl: './ajouter-etmodifier-visite.component.html',
  styleUrls: ['./ajouter-etmodifier-visite.component.scss']
})
export class AjouterEtmodifierVisiteComponent implements OnInit {
  @Input() mytitle;
  @Input() add;
  @Input() obj;
  @Input() id_contract;
  @Input() id_folder;
  listTech :any=[]
  listSites:any=[]
  model:any ={}

  constructor(
    public activeModal: NgbActiveModal,
    public sharedService: SharedService,
    private backendService: BackendService,
    public router: Router
  
  ) { 
  }

  ngOnInit(): void {

    this.getListEquipe()
    this.getListSiteBayFolder()

    if(this.add){
      this.model ={}
    }else{
      this.model.title = this.obj.title;
      this.model.startDate = this.obj.startDate;
      this.model.endDate = this.obj.endDate;
      this.model.technicien = this.obj.technicien;
      this.model.siteID = this.obj.siteID;
      this.model.status = this.obj.status;

      
    }
  }
  Onsubmit(f:NgForm){

    if(this.add){

      const payload ={visite:{...f.value},contractId:this.id_contract}
      // console.log(payload);
      this.backendService
      .post(`${environment.apiUrl}/contract/addOnePlanificationVistePreventive`, payload)
      .subscribe(new Observer(
        this.router,// just un class dans angular
           null,//
           true,//relode
           true,//swwet alert
           this.sharedService,//obligtoir si ana reload
           this.activeModal
        ).OBSERVER_POST());

    }else{

      const payload ={...f.value,_id:this.obj._id}
      console.log(payload);
      this.backendService
      .post(`${environment.apiUrl}/contract/updateVisitePrev`, payload)
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
  getListEquipe() {
    this.backendService.get(`${environment.apiUrl}/contract/getListEquipeContract/${this.id_contract}`).subscribe(
      new Observer().OBSERVER_GET((response) => {
        this.listTech = response.rows;
        const listNous =[]
        console.log( this.listTech );
        
      })
    );
  }
  getListSiteBayFolder() {
    this.backendService.get(`${environment.apiUrl}/folder/getListSiteByFolder/${this.id_folder}`).subscribe(
      new Observer().OBSERVER_GET((response) => {
        this.listSites = response.rows;
        console.log( this.listSites );
        
      })
    );
  }

}
