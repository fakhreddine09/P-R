import { Component, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BackendService } from 'src/app/services/backend.service';
import Observer from 'src/app/services/observer';
import { SharedService } from 'src/app/services/shared.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-update-tiketes-customer',
  templateUrl: './add-update-tiketes-customer.component.html',
  styleUrls: ['./add-update-tiketes-customer.component.scss']
})
export class AddUpdateTiketesCustomerComponent implements OnInit {
  @Input() mytitle;
  @Input() id_contract;
  @Input() id_Client;
  @Input() add;
  @Input() Obj;
  fileNames: string;
  files:any=[]
  model: any = {}
  modelAdd: any = {}
  listSite:any=[]
  listEquipmontSoft:any=[]
  listEquipmontHard:any=[]
  siteId //==> change it in model object 
  contractObject:any={}
  siteSelected=false ;
  constructor(
    public activeModal: NgbActiveModal,
    public sharedService: SharedService,

    private backendService: BackendService,
    public router: Router
  
  ) { }


  async ngOnInit() {
    // alert(this.mytitle)
   await this.getListSite()
    await this.getContractById()
    if (this.add) {
      this.model = {}
    } else {
      this.getContractByIdForUpdate()
      this.siteSelected = true
      this.model.title = this.Obj.title
      this.model.description = this.Obj.description
      this.model.neveuxEsclade = this.Obj.neveuxEsclade
      this.model.siteId = this.Obj.siteId._id
      if(this.Obj.equipmentHardId){ 
        this.model.equipmentHardId = this.Obj.equipmentHardId._id
      }
      if(this.Obj.equipmentSoftId){ 
        this.model.equipmentSoftId = this.Obj.equipmentSoftId._id
      }
    }
  }
  async getContractById() {
    await this.backendService.get(`${environment.apiUrl}/contract/getContractById/${this.id_contract}`).subscribe(
      new Observer().OBSERVER_GET((response) => {
        this.contractObject = response.rows;
        
      })
    );
  }


  async getContractByIdForUpdate() {
    await this.backendService.get(`${environment.apiUrl}/contract/getContractById/${this.id_contract}`).subscribe(
      new Observer().OBSERVER_GET((response) => {
        const contractType = response.rows.type ;
      if(contractType == 'SUPPORT AND MAINTENANCE HARD'){ this.getListEquipmontHared(this.Obj.siteId._id)}
      if(contractType == 'SUPPORT AND MAINTENANCE SOFT'){ this.getListEquipmontSoft(this.Obj.siteId._id)}
      if(contractType == 'SUPPORT AND MAINTENANCE SOFT AND HARD'){
        this.getListEquipmontSoft(this.Obj.siteId._id)
        this.getListEquipmontHared(this.Obj.siteId._id)
        }
        
      })
    );
  }

  async getListSite() {
    await this.backendService.get(`${environment.apiUrl}/site/getListSiteByContract/${this.id_contract}`).subscribe(
      new Observer().OBSERVER_GET((response) => {
        this.listSite = response.rows
      })
    );
  }

  async getListEquipmontHared(id) {
    await this.backendService.get(`${environment.apiUrl}/equipment/getListEquipmentByContractHared/${id}`).subscribe(
      new Observer().OBSERVER_GET((response) => {
        this.listEquipmontHard = response.rows;
      })
    );
  }

  async getListEquipmontSoft(id) {
    await this.backendService.get(`${environment.apiUrl}/equipmentSoft/getListEquipmentByContractSoft/${id}`).subscribe(
      new Observer().OBSERVER_GET((response) => {
        this.listEquipmontSoft = response.rows;
      })
    );
  }

  getNeveuxEsclade(event){
    this.modelAdd.neveuxEsclade = event.target.value

  }
  getSiteId(event){
    const id = event.target.value
    this.modelAdd.siteId = id

    this.siteSelected = true
    // this.getContractById()
    const contractType = this.contractObject.type ;
    if(contractType == 'SUPPORT AND MAINTENANCE HARD'){ this.getListEquipmontHared(id)}
    if(contractType == 'SUPPORT AND MAINTENANCE SOFT'){ this.getListEquipmontSoft(id)}
    if(contractType == 'SUPPORT AND MAINTENANCE SOFT AND HARD'){
      this.getListEquipmontSoft(id)
      this.getListEquipmontHared(id)
      }

  }
  getEquipmentId(event){
    const id = event.target.value
    this.model.equipmentId = id
  }
  onFileSelected(event: any): void {
    this.files =[];
    const input = event.target as HTMLInputElement;
    this.files =input.files;
    if (input.files) {
      const filesArray = Array.from(input.files).map(file => file.name);
      this.fileNames = filesArray.join(', ');
    } else {
      this.fileNames = '';
    }
  }
  Onsubmit(f: NgForm) {
    
    if(this.add){
      let data = new FormData();
      for (let index = 0; index < this.files.length; index++) {
        data.append("files",this.files[index])
      }
      data.append("contractId",this.id_contract)
      data.append("clientId",this.id_Client)
      data.append("siteId",f.value.siteId)
      data.append("title",f.value.title)
      data.append("description",f.value.description)
      data.append("neveuxEsclade",f.value.neveuxEsclade)
      // data.append("siteId",f.value.siteId)
      if(f.value.equipmentSoftId){
      data.append("equipmentSoftId",f.value.equipmentSoftId)
      }
      if(f.value.equipmentHardId){
        data.append("equipmentHardId",f.value.equipmentHardId)
      }
      this.backendService
      .post(`${environment.apiUrl}/ticket/createTicket`, data)
      .subscribe(new Observer(
        this.router,// just un class dans angular
           null,//
           true,//relode
           true,//swwet alert
           this.sharedService,//obligtoir si ana reload
           this.activeModal
        ).OBSERVER_POST());

    }else{
      const payload ={...f.value,_id:this.Obj._id}
      this.backendService
      .put(`${environment.apiUrl}/ticket/updateTicket`, payload)
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
