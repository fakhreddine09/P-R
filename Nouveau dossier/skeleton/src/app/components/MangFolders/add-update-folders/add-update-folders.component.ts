import { formatDate } from '@angular/common';
import { Component, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BackendService } from 'src/app/services/backend.service';
import Observer from 'src/app/services/observer';
import { SharedService } from 'src/app/services/shared.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-update-folders',
  templateUrl: './add-update-folders.component.html',
  styleUrls: ['./add-update-folders.component.scss']
})
export class AddUpdateFoldersComponent implements OnInit {
  @Input() title;
  @Input() id_folder;
  @Input() add;
  @Input() name;
  @Input() color;
  model: any = { name: ""}
  // formData:FormData;
  public showColorCode = '#db968d';
  FileLogo:any

  // public basicColor = '#4099ff';

  constructor(
    public activeModal: NgbActiveModal,
    public sharedService: SharedService,

    private backendService: BackendService,
    public router: Router
  
  ) {

  }


  ngOnInit() {
    if (this.add) {
      this.model = {}
    } else {
    // console.log(item);

      this.model.name = this.name
      this.showColorCode = this.color
    }
  }
  Onsubmit(f: NgForm) {
    if(this.add){
      let data = new FormData();
      data.append("name",f.value.name);
      data.append("colorfoldr",this.showColorCode);
      data.append("files",this.FileLogo);
      // const payload={name:,colorfoldr:};
      this.backendService
    .post(`${environment.apiUrl}/folder/createFolder`, data)
    .subscribe(new Observer(
      this.router,// just un class dans angular
         null,//
         true,//relode
         true,//swwet alert
         this.sharedService,//obligtoir si ana reload
         this.activeModal
      ).OBSERVER_POST());

    }else{
      const payload ={...f.value,_id:this.id_folder,colorfoldr:this.showColorCode}
      this.backendService
      .put(`${environment.apiUrl}/folder/updateFolder`, payload)
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
  onColorChange(event){
    this.showColorCode=event
    // console.log(this.showColorCode)
  }

  updateFileName(event: any) {
    this.FileLogo =event.target.files[0]
    console.log(this.FileLogo);
    const fileName = event.target.files[0].name;
    const fileLabel = document.getElementById('fileInputLabel');
    if (fileLabel) {
      fileLabel.textContent = fileName;
    }
  }
}
