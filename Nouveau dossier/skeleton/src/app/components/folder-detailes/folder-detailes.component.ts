import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { BackendService } from 'src/app/services/backend.service';
import Observer from 'src/app/services/observer';
import { SharedService } from 'src/app/services/shared.service';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddAndUpdateContractComponent } from '../contractMang/add-and-update-contract/add-and-update-contract.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { AddFilesToContractComponent } from '../contractMang/add-files-to-contract/add-files-to-contract.component';
// import { AddVisitePrevToContractComponent } from '../contractMang/add-visite-prev-to-contract/add-visite-prev-to-contract.component';
// import { AddFilesToContractComponent } from '../contractMang/add-files-to-contract/add-files-to-contract.component';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { Pipe, PipeTransform } from '@angular/core';
import { FileUploadValidators } from '@iplab/ngx-file-upload';
import { AffecteTeamsComponent } from '../contractMang/affecte-teams/affecte-teams.component';
import { AddUpdateSitesComponent } from '../contractMang/add-update-sites/add-update-sites.component';
import { AddUpdateEquipemontComponent } from '../contractMang/add-update-equipemont/add-update-equipemont.component';
import { AddCustomerManagementComponent } from '../contractMang/add-customer-management/add-customer-management.component';
import { AddUpdateEquipemontSofetComponent } from '../contractMang/add-update-equipemont-sofet/add-update-equipemont-sofet.component';
import { AddUpdatevisitPrevComponent } from '../contractMang/add-updatevisit-prev/add-updatevisit-prev.component';
import { AjouterEtmodifierVisiteComponent } from '../MangFolders/ajouter-etmodifier-visite/ajouter-etmodifier-visite.component';
import { CsvParserService } from 'src/app/services/csv-parser.service';
import { Equipmenthared } from 'src/app/services/equipmenthared.model';
import { ImpoertListEquipmentHaredComponent } from '../contractMang/impoert-list-equipment-hared/impoert-list-equipment-hared.component';
import { ImpoertListEquipmentSoftComponent } from '../contractMang/impoert-list-equipment-soft/impoert-list-equipment-soft.component';
// import { AddUpdatevisitPreventiveComponent } from '../contractMang/add-updatevisit-preventive/add-updatevisit-preventive.component';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CustomerAddAffectComponent } from '../contractMang/customer-add-affect/customer-add-affect.component';
@Component({
  selector: 'app-folder-detailes',
  templateUrl: './folder-detailes.component.html',
  styleUrls: ['./folder-detailes.component.scss']
})
export class FolderDetailesComponent implements OnInit {
  id_folder: string;
  foldetIfo:any={}
  equipments: Equipmenthared[] = [];
  public isCollapsed: boolean;
  public isCollapsed2: boolean;
  public isCollapsed3: boolean;
  public isCollapsed5: boolean;
  public isCollapsed6: boolean;
  public isCollapsed7: boolean;
  public isCollapsed99: boolean;
  public isCollapsed991: boolean;
  public multiCollapsed1: boolean;
  public multiCollapsed2: boolean;

  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    public sahredserv: SharedService,
    private backendService: BackendService,
    public sharedService: SharedService,
    public router: Router,
    private datePipe: DatePipe,
    private csvParserService: CsvParserService
  ) { }
  newListContract: any = [];
  newListSites: any = [];
  newAssociatedCustomerList: any = []
  newEquipeTechniquet: any = []
  newListOfFiles: any = []
  newplanificationVistePreventive: any = []
  newInfoOneContract: any = { _id: "", endDate: "", startDate: "", nature: "", type: "", sla: "", }
  newVisAvis: any = { _id: "", company: "", tel: "", email: "", valid: "", folderId: "" }
  newInfoContract: any = {};
  infoOneSite: any = {}
  responsableEquipeTechnique: any = { nomPrinom: "", _id: "" }
  showDataContract = false;
  showDataSites = false;
  public rowsOnPage = 10;
  public filterQuery = '';
  public sortBy = 'id';
  public sortOrder = 'asc';
  newListEquipmontSoft: any = []
  FileMatrisEsqalade: any = {};
  FileEqipemont: any = {};
  async ngOnInit(): Promise<void> {
    this.isCollapsed = true;
    this.isCollapsed2 = true;
    this.isCollapsed3 = true;
    this.isCollapsed5 = true;
    this.isCollapsed6 = true;
    this.isCollapsed7 = true;
    this.isCollapsed99 = true;
    this.isCollapsed991 = true;

    this.multiCollapsed1 = true;
    this.multiCollapsed2 = true;
    this.id_folder = this.route.snapshot.paramMap.get("id");
    await this.getListContract()
    await this.getListSites()
    await this.getinfoOfOneFolder()
  }

  async getinfoOfOneFolder(){
    await this.backendService.get(`${environment.apiUrl}/folder/getFoldetByID/${this.id_folder}`).subscribe(
      new Observer().OBSERVER_GET((response) => {
        this.foldetIfo = response.rows;
        console.log("this.foldetIfo");
        console.log(this.foldetIfo);
        
      })
    );
  }
  downloadFile(fileUrl: string): void {
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href',fileUrl);
    link.setAttribute('download', 'filename'); // Set the desired filename here
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  async getListContract() {
    await this.backendService.get(`${environment.apiUrl}/folder/getContractsByFolderId/${this.id_folder}`).subscribe(
      new Observer().OBSERVER_GET((response) => {
        this.newListContract = response.rows;
      })
    );
  }
  async getListSites() {
    await this.backendService.get(`${environment.apiUrl}/folder/getListSiteByFolder/${this.id_folder}`).subscribe(
      new Observer().OBSERVER_GET((response) => {
        this.newListSites = response.rows;
      })
    );
  }
  showInfoSites(item) {
    this.showDataSites = true
    this.showDataContract = false
    this.infoOneSite = item;
    this.newListEquipmontSoft = item.listEquipmentSoft
    console.log(item.listEquipmentSoft);
    
  }
  openAddSites() {
    const modalRef = this.modalService.open(AddUpdateSitesComponent);
    modalRef.componentInstance.title = 'New Site';
    modalRef.componentInstance.id_folder = this.id_folder;
    modalRef.componentInstance.add = true;
  }
  deleteSite(id) {
    Swal.fire({
      title: 'Are you sure ?',
      text: " you want to delete this Site ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',
      allowOutsideClick: true,
      allowEscapeKey: true,
    }).then((result) => {
      if (result.isConfirmed) {
        const obj = { _id: id, folderId: this.id_folder };
        const apiurl = environment.apiUrl + '/folder/deleteSite';
        this.backendService.post(apiurl, obj).subscribe(new Observer(
          this.router, // just un class dans angular
          null, // 
          true, // relode
          true, // sweet alert
          this.sharedService, // oblegtour si ona reload
        ).OBSERVER_POST());
      }
    });
  }
  openUpdateSites(item) {
    const modalRef = this.modalService.open(AddUpdateSitesComponent);
    modalRef.componentInstance.title = 'Update Site';
    modalRef.componentInstance.objSites = this.infoOneSite;
    modalRef.componentInstance.add = false;
  }
  openAddEquipement() {
    const modalRef = this.modalService.open(AddUpdateEquipemontComponent);
    modalRef.componentInstance.title = 'New Equipment hared ';
    modalRef.componentInstance.id_Sites = this.infoOneSite._id;
    modalRef.componentInstance.add = true;
  }
  openAddEquipementSoft() {
    const modalRef = this.modalService.open(AddUpdateEquipemontSofetComponent);
    modalRef.componentInstance.title = 'New Equipment Soft ';
    modalRef.componentInstance.id_Sites = this.infoOneSite._id;
    modalRef.componentInstance.add = true;
  }
  upadteEqupemontSoft(item) {
    let obj = { equipmentName: item.equipmentName, version: item.version, _id: item._id, TypeSupport: item.TypeSupport._id, constructure: item.constructure,startDateSupport:item.startDateSupport,endDateSupport:item.endDateSupport }
    console.log(obj);
    const modalRef = this.modalService.open(AddUpdateEquipemontSofetComponent);
    modalRef.componentInstance.title = 'Update Equipment ';
    modalRef.componentInstance.objSites = obj;
    modalRef.componentInstance.add = false;
  }
  deleteEqupemontSoft(id) {
    Swal.fire({
      title: 'Are you sure ?',
      text: " you want to delete this Equipment ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',
      allowOutsideClick: true,
      allowEscapeKey: true,
    }).then((result) => {
      if (result.isConfirmed) {
        const obj = { _id: id, siteId: this.infoOneSite._id };
        const aoiurl = environment.apiUrl + '/equipmentSoft/deleteEquipmentSoft';
        this.backendService.post(aoiurl, obj).subscribe(new Observer(
          this.router, // just un class dans angular
          null, // 
          true, // relode
          true, // sweet alert
          this.sharedService, // oblegtour si ona reload
        ).OBSERVER_POST());
      }
    });
  }
  deleteResponsableEquipe() {
    Swal.fire({
      title: 'Are you sure ?',
      text: " you want to delete this Technical Team Manager ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',
      allowOutsideClick: true,
      allowEscapeKey: true,
    }).then((result) => {
      if (result.isConfirmed) {
        const obj = { _id: this.responsableEquipeTechnique._id, contractId: this.newInfoOneContract._id };
        const aoiurl = environment.apiUrl + '/equipmentSoft/deleteEquipmentSoft';
        this.backendService.post(aoiurl, obj).subscribe(new Observer(
          this.router, // just un class dans angular
          null, // 
          true, // relode
          true, // sweet alert
          this.sharedService, // oblegtour si ona reload
        ).OBSERVER_POST());
      }
    });
  }
  deleteMemeberEquipe(id) {
    Swal.fire({
      title: 'Are you sure ?',
      text: " you want to delete this Equipment ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',
      allowOutsideClick: true,
      allowEscapeKey: true,
    }).then((result) => {
      if (result.isConfirmed) {
        const obj = { _id: id, contractID: this.newInfoOneContract._id };
        const aoiurl = environment.apiUrl + '/contract/deleteMemberEquipefromContract';
        this.backendService.post(aoiurl, obj).subscribe(new Observer(
          this.router, // just un class dans angular
          null, // 
          true, // relode
          true, // sweet alert
          this.sharedService, // oblegtour si ona reload
        ).OBSERVER_POST());
      }
    });
  }
  upadteEqupemont(item) {
    
    let obj = { SN: item.SN, nomPice: item.nomPice, _id: item._id, TypeSupport: item.TypeSupport._id,startDateSupport:item.startDateSupport,endDateSupport:item.endDateSupport }
    const modalRef = this.modalService.open(AddUpdateEquipemontComponent);
    modalRef.componentInstance.title = 'Update Equipment ';
    modalRef.componentInstance.objSites = obj;
    modalRef.componentInstance.add = false;
  }
  deleteEqupemont(id) {
    Swal.fire({
      title: 'Are you sure ?',
      text: " you want to delete this Equipment ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',
      allowOutsideClick: true,
      allowEscapeKey: true,
    }).then((result) => {
      if (result.isConfirmed) {
        const obj = { _id: id, folderId: this.id_folder };
        const aoiurl = environment.apiUrl + '/equipment/deleteEquipment';
        this.backendService.post(aoiurl, obj).subscribe(new Observer(
          this.router, // just un class dans angular
          null, // 
          true, // relode
          true, // sweet alert
          this.sharedService, // oblegtour si ona reload
        ).OBSERVER_POST());
      }
    });
  }
  openAddContract() {
    const modalRef = this.modalService.open(AddAndUpdateContractComponent);
    modalRef.componentInstance.title = 'New contract';
    modalRef.componentInstance.id_folder = this.id_folder;
    modalRef.componentInstance.add = true;
  }
  openUpdateContract() {
    const modalRef = this.modalService.open(AddAndUpdateContractComponent);
    modalRef.componentInstance.title = 'Update contract';
    modalRef.componentInstance.objectContract = this.newInfoOneContract;
    modalRef.componentInstance.id_folder = this.id_folder;
    modalRef.componentInstance.add = false;
  }
  retertTypefile(fileName: string): string {
    const index = fileName.lastIndexOf(".");
    if (index !== -1) {
      return fileName.substring(index + 1).toUpperCase();
    }
    return '';
  }
  deleteContract(id, valid) {
    Swal.fire({
      title: 'Are you sure ?',
      text: " you want to delete this contract ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',
      allowOutsideClick: true,
      allowEscapeKey: true,
    }).then((result) => {
      if (result.isConfirmed) {
        const obj = { _id: id, folderId: this.id_folder };
        const aoiurl = environment.apiUrl + '/contract/deleteContract';
        this.backendService.post(aoiurl, obj).subscribe(new Observer(
          this.router, // just un class dans angular
          null, // 
          true, // relode
          true, // sweet alert
          this.sharedService, // oblegtour si ona reload
        ).OBSERVER_POST());
      }
    });
  }
  // openAddCustomers() {
  //   const modalRef = this.modalService.open(AddCustomerManagementComponent);
  //   modalRef.componentInstance.title = 'Add Customer ';
  //   modalRef.componentInstance.id_contract = this.newInfoOneContract._id;
  //   modalRef.componentInstance.id_folder = this.id_folder;
  //   modalRef.componentInstance.add = true;
  //   if (this.newVisAvis._id == "") {
  //     modalRef.componentInstance.mangerAddet = true;
  //   } else {
  //     modalRef.componentInstance.mangerAddet = false;
  //   }
  // }
openAddNewOledCustomers(){
  console.log("from folder detailes");
  
    console.log(this.newInfoOneContract._id,this.id_folder,this.newVisAvis._id == "");
    
  const modalRef = this.modalService.open(CustomerAddAffectComponent);
  modalRef.componentInstance.title = 'Customers ';
  modalRef.componentInstance.id_contract = this.newInfoOneContract._id;
  modalRef.componentInstance.id_folder = this.id_folder;
  modalRef.componentInstance.add = true;
  modalRef.componentInstance.companyName = this.foldetIfo.name;
  if (this.newVisAvis._id == "") {
    modalRef.componentInstance.mangerAddet = true;
  } else {
    modalRef.componentInstance.mangerAddet = false;
  }

}





  openUpdatUsers(item) {
    const obj = { ...item, typeAccount: 'user' }
    const modalRef = this.modalService.open(AddCustomerManagementComponent);
    modalRef.componentInstance.title = 'Update Customer ';
    modalRef.componentInstance.objCustomer = obj;
    modalRef.componentInstance.add = false;
  }
  showInfoContract(item) {
    this.newVisAvis = { _id: "", company: "", tel: "", email: "", valid: "", folderId: "" }
    this.newAssociatedCustomerList = []
    this.showDataContract = true;
    this.showDataSites = false
    this.responsableEquipeTechnique.nomPrinom = ''
    if (item.associatedCustomerList.length != 0) {
      this.newAssociatedCustomerList = item.associatedCustomerList

    } else {
      this.newAssociatedCustomerList = []
    }
    this.newplanificationVistePreventive = item.Vistepreventive;
    if (item.equipeTechnique) {
      this.newEquipeTechniquet = item.equipeTechnique
    }
    else {
      this.newEquipeTechniquet = []
    }

    if (item.visAvis) {
      this.newVisAvis._id = item.visAvis._id;
      this.newVisAvis.company = item.visAvis.company;
      this.newVisAvis.tel = item.visAvis.tel;
      this.newVisAvis.email = item.visAvis.email;
      this.newVisAvis.valid = item.visAvis.valid;
      this.newVisAvis.folderId = item.visAvis.folderId;
    }
    if (item.responsableEquipeTechnique.responsable) {
      this.responsableEquipeTechnique.nomPrinom = item.responsableEquipeTechnique.responsable.firstName + " " + item.responsableEquipeTechnique.responsable.lastName || ""
      this.responsableEquipeTechnique._id = item.responsableEquipeTechnique.responsable._id;
    }
    else {
      this.responsableEquipeTechnique.nomPrinom = ""
    }
    this.newInfoOneContract._id = item._id
    this.newInfoOneContract.endDate = item.endDate
    this.newInfoOneContract.startDate = item.startDate
    this.newInfoOneContract.nature = item.nature
    this.newInfoOneContract.type = item.type
    this.newInfoOneContract.sla = item.sla
    if(item.type == 'INFOGERANCE'){
    this.newInfoOneContract.nbrJourChesClient = item.nbrJourChesClient
    this.newInfoOneContract.jourInfogerance = item.jourInfogerance
  }
  this.newListOfFiles = item.listOfFiles
console.log(this.newListOfFiles);
  }
  deleteUserContract(id) {
    let obj = { _id: id, contrcatID: this.newInfoOneContract._id };
    Swal.fire({
      title: 'Are you sure ?',
      text: " you want to delete this User ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',
      allowOutsideClick: true,
      allowEscapeKey: true,
    }).then((result) => {
      if (result.isConfirmed) {
        const aoiurl = environment.apiUrl + '/contract/deleteUserfromContract';
        this.backendService.post(aoiurl, obj).subscribe(new Observer(
          this.router, // just un class dans angular
          null, // 
          true, // relode
          true, // sweet alert
          this.sharedService, // oblegtour si ona reload
        ).OBSERVER_POST());
      }
    });
  }
  deleteVisaAvisContract(id) {
    let obj = {
      _id: id, // ID of the user you want to delete
      contractID: this.newInfoOneContract._id // ID of the contract you want to update
    }
    Swal.fire({
      title: 'Are you sure ?',
      text: " you want to delete this Contract manager?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',
      allowOutsideClick: true,
      allowEscapeKey: true,
    }).then((result) => {
      if (result.isConfirmed) {
        // const obj = { _id: id, contrcatID: this.newInfoContract._id };
        const aoiurl = environment.apiUrl + '/contract/deleteVisaAvisContract';
        this.backendService.post(aoiurl, obj).subscribe(new Observer(
          this.router, // just un class dans angular
          null, // 
          true, // relode
          true, // sweet alert
          this.sharedService, // oblegtour si ona reload
        ).OBSERVER_POST());
      }
    });
  }
  deleteFile(id) {
    Swal.fire({
      title: 'Are you sure ?',
      text: " you want to delete this file ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',
      allowOutsideClick: true,
      allowEscapeKey: true,
    }).then((result) => {
      if (result.isConfirmed) {
        const obj = { _id: id };
        const aoiurl = environment.apiUrl + '/files/deleteFile';
        this.backendService.post(aoiurl, obj).subscribe(new Observer(
          this.router, // just un class dans angular
          null, // 
          true, // relode
          true, // sweet alert
          this.sharedService, // oblegtour si ona reload
        ).OBSERVER_POST());
      }
    });
  }
  openAddFileContract(id_folder) {
    const modalRef = this.modalService.open(AddFilesToContractComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.title = 'New File';
    modalRef.componentInstance.id_folder = id_folder;
    modalRef.componentInstance.add = true;
  }
  openAddvisite() {
    const modalRef = this.modalService.open("AddAndUpdateContractComponent", { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.title = 'New preventive maintenance';
    modalRef.componentInstance.idcontract = "this.contractRef._id";
    modalRef.componentInstance.add = true;
  }
  goToTickets() {
    this.router.navigate(['/test/listTickets'])
  }
  addtemsToContract(id?: any) {
    const modalRef = this.modalService.open(AffecteTeamsComponent);
    modalRef.componentInstance.title = 'Assigned technician';
    modalRef.componentInstance.contractID = this.newInfoOneContract._id;
    modalRef.componentInstance.add = true;
    if (this.responsableEquipeTechnique.nomPrinom == "") {
      modalRef.componentInstance.addL3 = true;
    } else {
      modalRef.componentInstance.addL3 = false;
    }
  }
  updateTeechToContract(item) {
    const obj = { id_tech: item.tech._id, role: "equipeTechnique", niveauEscalade: item.niveauEscalade }
    const modalRef = this.modalService.open(AffecteTeamsComponent);
    modalRef.componentInstance.title = 'Update assigned technician';
    modalRef.componentInstance.contractID = this.newInfoOneContract._id;
    modalRef.componentInstance.add = false;
    modalRef.componentInstance.objectUsers = obj;
  }
  updateResponsableToContract(item) {
    const obj = { id_tech: this.responsableEquipeTechnique._id, role: "responsableEquipeTechnique", niveauEscalade: 'l3' }
    const modalRef = this.modalService.open(AffecteTeamsComponent);
    modalRef.componentInstance.title = 'Update assigned technician';
    modalRef.componentInstance.contractID = this.newInfoOneContract._id;
    modalRef.componentInstance.add = false;
    modalRef.componentInstance.objectUsers = obj;
  }
  oppenAddFile() {
    const modalRef = this.modalService.open(AddFilesToContractComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.title = 'Add files to contract';
    modalRef.componentInstance._id = this.newInfoOneContract._id;
    modalRef.componentInstance.add = true;
  }
  openAddVistepreventive(){ 
      const modalRef = this.modalService.open(AjouterEtmodifierVisiteComponent);
      modalRef.componentInstance.mytitle = 'New Preventive Visit Planning';
      modalRef.componentInstance.add = true;
      modalRef.componentInstance.id_folder = this.id_folder;
      modalRef.componentInstance.id_contract = this.newInfoOneContract._id;
  }
  deleteVisite(id){
    Swal.fire({
      title: 'Are you sure ?',
      text: " you want to delete this Preventive maintenance visit ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',
      allowOutsideClick: true,
      allowEscapeKey: true,
    }).then((result) => {
      if (result.isConfirmed) {
        const obj = { _id: id };
        const aoiurl = environment.apiUrl + '/contract/deleteVisitePrev';
        this.backendService.post(aoiurl, obj).subscribe(new Observer(
          this.router, // just un class dans angular
          null, // 
          true, // relode
          true, // sweet alert
          this.sharedService, // oblegtour si ona reload
        ).OBSERVER_POST());
      }
    });
  }
  openUpdatvisdite(item){
    let obj = item ;
    obj.siteID=item.siteID._id
    const modalRef = this.modalService.open(AjouterEtmodifierVisiteComponent);
    modalRef.componentInstance.mytitle = 'Update Preventive Visit Planning';
    modalRef.componentInstance.add = false;
    modalRef.componentInstance.id_folder = this.id_folder;
    modalRef.componentInstance.id_contract = this.newInfoOneContract._id;
    modalRef.componentInstance.obj = obj
  }

//   getNbrJour(date: string | Date): number {
//     const today = new Date();
//     const formattedDate = this.datePipe.transform(today, 'yyyy-MM-dd');
//     const objectDATE2 = this.convertStringToDate(formattedDate);

//     let dateEntr: Date;
//     if (typeof date === 'string') {
//         dateEntr = this.convertStringToDate(date);
//     } else {
//         dateEntr = date;
//     }

//     const differenceInDays = this.calculateDifferenceInDays(objectDATE2, dateEntr);
//     // console.log(differenceInDays);
//     return differenceInDays;
// }

calculateDifferenceInDays(date1: Date, date2: Date): number {
    const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
    const diffInTime = date2.getTime() - date1.getTime();
    return Math.round(diffInTime / oneDay);
}

convertStringToDate(dateString: string): Date {
    if (dateString.includes('-')) {
        const parts = dateString.split('-');
        if (parts[0].length === 4) {
            // Format is yyyy-MM-dd
            const [year, month, day] = parts.map(part => parseInt(part, 10));
            return new Date(year, month - 1, day); // month is 0-based
        } else {
            // Format is dd-MM-yyyy
            const [day, month, year] = parts.map(part => parseInt(part, 10));
            return new Date(year, month - 1, day); // month is 0-based
        }
    } else {
        throw new Error("Invalid date format");
    }
}
importCSV(event: any) {
  const modalRef = this.modalService.open(ImpoertListEquipmentHaredComponent);
  modalRef.componentInstance.title = 'Import list of equipment hard ';
  modalRef.componentInstance._id = this.infoOneSite._id;
  modalRef.componentInstance.add = true;
}

importCSV2(event: any) {
  const modalRef = this.modalService.open(ImpoertListEquipmentSoftComponent);
  modalRef.componentInstance.title = 'Import list of equipment soft ';
  modalRef.componentInstance._id = this.infoOneSite._id;
  modalRef.componentInstance.add = true;
}

exportCSV() {
  const table = document.getElementById('tabColler');
  const headers = table.querySelectorAll('thead th');
  const rows = table.querySelectorAll('tbody tr');

  const data = [];
  
  // Ajouter les titres des colonnes (en-tête de tableau) en excluant "Action"
  const headerRowData = [];
  headers.forEach(header => {
      if (header.textContent?.trim() !== 'Action') { // Exclure les éléments avec le texte "Action"
          headerRowData.push(header.textContent?.trim());
      }
  });
  data.push(headerRowData);

  // Ajouter les données de chaque ligne de la table
  rows.forEach(row => {
      const rowData = [];
      const cells = row.querySelectorAll('td');
      cells.forEach((cell, index) => {
          if (headers[index].textContent?.trim() !== 'Action') { // Exclure les cellules correspondant à l'en-tête "Action"
              rowData.push(cell.textContent?.trim());
          }
      });
      data.push(rowData);
  });

  // Convertir les données en CSV et exporter
  const csvContent = this.convertArrayToCSV(data);
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodedUri);
  link.setAttribute('download', 'list equipment hard.csv');
  document.body.appendChild(link);
  link.click();
}


convertArrayToCSV(data: any[]): string {
  const csvRows = [];
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(','));
  for (const row of data) {
      const values = headers.map(header => {
          const escaped = ('' + row[header]).replace(/"/g, '\\"');
          return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
  }
  return csvRows.join('\n');
}


// exportToPDF10() {
//   setTimeout(() => {
//     const data = document.getElementById('tabColler10');
//     if (data) {
//       const clonedTable = data.cloneNode(true) as HTMLElement;

//       // Remove the "Action" column from the header
//       const headers = clonedTable.querySelectorAll('th');
//       if (headers.length > 0) {
//         headers[headers.length - 1].remove();
//       }

//       // Remove the "Action" column from each row
//       const rows = clonedTable.querySelectorAll('tr');
//       rows.forEach(row => {
//         const cells = row.querySelectorAll('td');
//         if (cells.length > 0) {
//           cells[cells.length - 1].remove();
//         }
//       });

//       // Create a temporary container for the modified table
//       const tempDiv = document.createElement('div');
//       tempDiv.appendChild(clonedTable);
//       document.body.appendChild(tempDiv);

//       html2canvas(clonedTable).then(canvas => {
//         const imgWidth = 208;
//         const imgHeight = canvas.height * imgWidth / canvas.width;
//         const contentDataURL = canvas.toDataURL('image/png');
//         const pdf = new jsPDF('p', 'mm', 'a4');
//         const position = 0;
//         pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
//         pdf.save('table.pdf');
//         document.body.removeChild(tempDiv);  // Clean up
//       }).catch(error => {
//         console.error("Error generating PDF:", error);
//       });
//     }
//   }, 1000);  // Adjust the timeout duration if needed
// }







// ----------------------------------------------

// tabColler10
exportToPDF() {
  setTimeout(() => {
    // Create a temporary table with all data
    const tempTable = this.createFullTable(this.infoOneSite.listEquipment);

    // Remove the "Action" column
    const headers = tempTable.querySelectorAll('th');
    if (headers.length > 0) {
      headers[headers.length - 1].remove();
    }

    const rows = tempTable.querySelectorAll('tr');
    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      if (cells.length > 0) {
        cells[cells.length - 1].remove();
      }
    });

    // Inject styles into the cloned table
    const style = document.createElement('style');
    style.innerHTML = `
      #tabCollerz.table-hover tbody tr:hover {
        background-color: rgb(138, 188, 226);
      }
      #tabCollerz tbody {
        background-color: rgb(173, 218, 212);
        color: rgb(111, 105, 105);
      }
    `;
    tempTable.appendChild(style);

    // Append the table to a temporary container
    const tempDiv = document.createElement('div');
    tempDiv.appendChild(tempTable);
    document.body.appendChild(tempDiv);

    // Generate the PDF from the table
    html2canvas(tempTable).then(canvas => {
      const imgWidth = 208;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('List of hard equipment.pdf');
      document.body.removeChild(tempDiv);  // Clean up
    }).catch(error => {
      console.error("Error generating PDF:", error);
    });
  }, 1000);  // Adjust the timeout duration if needed
}
// Function to create a full table from the aggregated data
createFullTable(data: any[]): HTMLElement {
  const table = document.createElement('table');
  table.setAttribute('style', 'text-align: center;');
  table.setAttribute('class', 'table table-striped table-bordered nowrap table-hover');

  const thead = document.createElement('thead');
  thead.setAttribute('class', 'task-page');
  thead.setAttribute('style', 'background-color: rgb(58, 114, 179);');

  const headerRow = document.createElement('tr');
  const headers = ['Equipment Name', 'Serial Number', 'Support Type', 'Days left for support', 'Start Date Support', 'End Date Support', 'Status', 'Action'];
  headers.forEach(header => {
    const th = document.createElement('th');
    th.innerText = header;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  const tbody = document.createElement('tbody');

  data.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="text-center">${item.nomPice}</td>
      <td class="text-center">${item.SN}</td>
      <td class="text-center">${item.TypeSupport.supportName}</td>
      <td class="text-center " ${this.getDaysSupportStyle(item.endDateSupport)}>${this.getNbrJour(item.endDateSupport)} Days</td>
      <td class="text-center">${item.startDateSupport}</td>
      <td class="text-center">${item.endDateSupport}</td>
      <td class="text-center">${item.valid ? 'Active' : 'Inactive'}</td>
      <td class="text-center">
        <i (click)="upadteEqupemont(${item})" class="fas fa-edit f-18 ml-2"></i>
        <i (click)="deleteEqupemont(${item._id})" class="fas fa-trash-alt f-18 ml-2"></i>
      </td>
    `;
    tbody.appendChild(row);
  });

  table.appendChild(thead);
  table.appendChild(tbody);

  return table;
}
// Utility method to get the style for Days left for support column
getDaysSupportStyle(endDateSupport: string): string {
  const daysLeft = this.getNbrJour(endDateSupport);
  if (daysLeft < 0) return 'style="background-color: rgb(132, 122, 122); color: black;"';
  if (daysLeft >= 2 && daysLeft < 10) return 'style="background-color: rgb(255, 221, 0); color: black;"';
  if (daysLeft >= 0 && daysLeft < 2) return 'style="background-color: rgb(255, 0, 0); color: black;"';
  return 'style="color: black;"';
}
// Utility method to calculate number of days left for support
getNbrJour(endDateSupport: string): number {
  const endDate = new Date(endDateSupport);
  const currentDate = new Date();
  const diffTime = Math.abs(endDate.getTime() - currentDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}


// --------------------------------------

exportToPDF2() {
  setTimeout(() => {
    // Create a temporary table with all data
    const tempTable = this.createFullTable2(this.newListEquipmontSoft);

    // Remove the "Action" column
    const headers = tempTable.querySelectorAll('th');
    if (headers.length > 0) {
      headers[headers.length - 1].remove();
    }

    const rows = tempTable.querySelectorAll('tr');
    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      if (cells.length > 0) {
        cells[cells.length - 1].remove();
      }
    });

    // Inject styles into the cloned table
    const style = document.createElement('style');
    style.innerHTML = `
      #tabColler10.table-hover tbody tr:hover {
        background-color: rgb(138, 188, 226);
      }
      #tabColler10 tbody {
        background-color: rgb(173, 218, 212);
        color: rgb(111, 105, 105);
      }
    `;
    tempTable.appendChild(style);

    // Append the table to a temporary container
    const tempDiv = document.createElement('div');
    tempDiv.appendChild(tempTable);
    document.body.appendChild(tempDiv);

    // Generate the PDF from the table
    html2canvas(tempTable).then(canvas => {
      const imgWidth = 208;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('list of softe equipment.pdf');
      document.body.removeChild(tempDiv);  // Clean up
    }).catch(error => {
      console.error("Error generating PDF:", error);
    });
  }, 1000);  // Adjust the timeout duration if needed
}

// Function to create a full table from the aggregated data
createFullTable2(data: any[]): HTMLElement {
  const table = document.createElement('table');
  table.setAttribute('style', 'text-align: center;');
  table.setAttribute('class', 'table table-striped table-bordered nowrap table-hover');

  const thead = document.createElement('thead');
  thead.setAttribute('class', 'task-page');
  thead.setAttribute('style', 'background-color: rgb(58, 114, 179);');

  const headerRow = document.createElement('tr');
  const headers = ['Equipment Name', 'Version', 'Constructure', 'Support type', 'Days left for support', 'Start Date Support', 'End Date Support', 'Status', 'Action'];
  headers.forEach(header => {
    const th = document.createElement('th');
    th.innerText = header;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  const tbody = document.createElement('tbody');

  data.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="text-center">${item.equipmentName}</td>
      <td class="text-center">${item.version}</td>
      <td class="text-center">${item.constructure}</td>
      <td class="text-center">${item.TypeSupport.supportName}</td>
      <td class="text-center " ${this.getDaysSupportStyle(item.endDateSupport)}>${this.getNbrJour(item.endDateSupport)} Days</td>
      <td class="text-center">${item.startDateSupport}</td>
      <td class="text-center">${item.endDateSupport}</td>
      <td class="text-center">${item.valid ? 'Active' : 'Inactive'}</td>
      <td class="text-center">
        <i (click)="upadteEqupemontSoft(${item})" class="fas fa-edit f-18 ml-2"></i>
        <i (click)="deleteEqupemontSoft(${item._id})" class="fas fa-trash-alt f-18 ml-2"></i>
      </td>
    `;
    tbody.appendChild(row);
  });

  table.appendChild(thead);
  table.appendChild(tbody);

  return table;
}
}










