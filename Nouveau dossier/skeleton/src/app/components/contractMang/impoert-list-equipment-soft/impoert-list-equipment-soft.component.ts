import { Component, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BackendService } from 'src/app/services/backend.service';
import { CsvParserService } from 'src/app/services/csv-parser.service';
import { Equipmenthared } from 'src/app/services/equipmenthared.model';
import { Equipmentsoft } from 'src/app/services/equipmentsoft.model';
import Observer from 'src/app/services/observer';
import { SharedService } from 'src/app/services/shared.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-impoert-list-equipment-soft',
  templateUrl: './impoert-list-equipment-soft.component.html',
  styleUrls: ['./impoert-list-equipment-soft.component.scss']
})
export class ImpoertListEquipmentSoftComponent implements OnInit {
  @Input() title;
  @Input() _id;
  @Input() add;
  model:any={}
  fileName: string = 'Choose file CSV';
  csvfile:any ;
  equipments: Equipmentsoft[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    public sharedService: SharedService,
    private csvParserService: CsvParserService,
    private backendService: BackendService,
    public router: Router

  ) { }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fileName = input.files[0].name;
    }
  }
  ngOnInit() {

  }
  downloadFile(): void {
    const fileUrl = 'http://localhost:4200/assets/TemplateSoftCSV.csv'; // URL of the file to download
    const link = document.createElement('a'); // Create a new <a> element
    link.setAttribute('target', '_blank'); // Set target="_blank" to open in a new tab/window
    link.setAttribute('href', fileUrl); // Set the URL of the file
    link.setAttribute('download', 'CSV_template_for_soft_equipment'); // Set the default filename for the download
    document.body.appendChild(link); // Append the <a> element to the document body
    link.click(); // Programmatically click the <a> element to trigger the download

    link.remove(); // Remove the <a> element from the DOM after triggering the download
  }
  Onsubmit(f: NgForm) {
      const payload = { equipmentsList: this.equipments , _id: this._id };
      this.backendService
        .post(`${environment.apiUrl}/equipmentSoft/createImportinEquipmentSoft`, payload)
        .subscribe(new Observer(
          this.router,// just un class dans angular
          null,//
          true,//relode
          true,//swwet alert
          this.sharedService,//obligtoir si ana reload
          this.activeModal
        ).OBSERVER_POST());
  }
  importCSV(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.csvParserService.parseCsvSoft(file).then((data: Equipmentsoft[]) => {
        this.equipments = data;
      }).catch((error) => {
        console.error('Error parsing CSV file:', error);
      });
    }
  }


}
