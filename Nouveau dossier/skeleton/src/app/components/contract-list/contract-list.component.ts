import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from 'src/app/services/backend.service';
import Observer from 'src/app/services/observer';
import { SharedService } from 'src/app/services/shared.service';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddUpdateFoldersComponent } from '../MangFolders/add-update-folders/add-update-folders.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';


@Component({
  selector: 'app-contract-list',
  templateUrl: './contract-list.component.html',
  styleUrls: ['./contract-list.component.scss']
})
export class ContractListComponent implements OnInit {
  listContract
  term: any;
  constructor(
    public sahredserv: SharedService,
    private backendService: BackendService,
    public sharedService: SharedService,
    public router: Router,
    private modalService: NgbModal,
  ) {}
  ngOnInit(): void {
    this.getListFolsers()
  } 
  getListFolsers() {
    this.backendService.get(`${environment.apiUrl}/folder/getAllFoldres`).subscribe(
      new Observer().OBSERVER_GET((response) => {
        this.listContract = response.rows ;
        console.log(this.listContract);
        
       
      })
    );
  }

  openAddFolder(){
    const modalRef = this.modalService.open(AddUpdateFoldersComponent);
    modalRef.componentInstance.title = 'Add new Folder';
    modalRef.componentInstance.add = true;
  }

  openUpdateFolder(item){
    
    const modalRef = this.modalService.open(AddUpdateFoldersComponent);
    modalRef.componentInstance.title = 'Update Folder';
    modalRef.componentInstance.add = false;
    modalRef.componentInstance.id_folder = item._id;
    modalRef.componentInstance.name = item.name;
    modalRef.componentInstance.color = item.colorfoldr;
    
  }

  deleteFolder(id){
      let obj = { _id: id};
      Swal.fire({
        title: 'Are you sure ?',
        text: " you want to delete this folder ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Confirmer',
        cancelButtonText: 'Annuler',
        allowOutsideClick: true,
        allowEscapeKey: true,
      }).then((result) => {
        if (result.isConfirmed) {
          // const obj = { _id: id, contrcatID: this.newInfoContract._id };
          const aoiurl = environment.apiUrl + '/folder/deleteFolder';
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
  isLightColor(color: string): boolean {
    // Convert hex color to RGB
    const rgb = this.hexToRgb(color);
    if (!rgb) return false;
    
    // Calculate the perceived brightness using the formula
    // brightness = (R * 299 + G * 587 + B * 114) / 1000
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    
    // Return true if brightness is greater than 128, else false
    return brightness > 128;
}

// Method to convert hex color to RGB
hexToRgb(hex: string): { r: number, g: number, b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return null;
    return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    };
}

}
