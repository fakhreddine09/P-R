import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { AddClientComponent } from '../add-client/add-client.component';
import Observer from 'src/app/services/observer';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-list-client',
  templateUrl: './list-client.component.html',
  styleUrls: ['./list-client.component.scss']
})
export class ListClientComponent implements OnInit {
  dtOptions: any;
  dtExportButtonOptions: any = {};
  listuset: any = [];

    
    constructor(private backendService: BackendService,public sharedService: SharedService,    private modalService: NgbModal,private router: Router) {}

  async ngOnInit() {
    this.dtExportButtonOptions = {
      ajax: {
        url: `${environment.apiUrl}/tech/getlisttechncian`,
        dataSrc: 'rows' // Assuming the response contains a 'rows' property with the data array
      },
      columns: [
        { title: 'First Name', data: 'firstName' },
        { title: 'Last Name', data: 'lastName' },
        // { title: 'Address', data: 'adress' },
        { title: 'Email', data: 'email' },
        { 
          title: 'Passport', 
          render: function(data, type, full, meta){
            if(full.passeport){
              return `Yes`;
            }else{
              return 'No';
            }

          }
        },
        { 
          title: 'Expiration date', 
          render: function(data, type, full, meta){
            if(full.passeport){
              return full.ExpiredAt;
            }else{
              return '___';
            }

          }
        },
        { 
          title: 'Driver license', 
          render: function(data, type, full, meta){
            if(full.permisConduire){
              return `Yes`;
            }else{
              return 'No';
            }

          }
        },
        { 
          title: 'Status', 
          render: function(data, type, full, meta){
            return `
              <div class="form-group">
                <div class="switch switch-${full.valid ? 'success' : 'danger'} d-inline m-r-10">
                  <input type="checkbox" id="switch-${full._id}" checked="${full.valid}" >
                  <label for="switch-${full._id}" class="cr"></label>
                </div>
                <label>${full.valid ? 'Enable' : 'Disable'}</label>
              </div>
            `;
          }
        },

      ],
      dom: 'Bfrtip',
      buttons: ['copy', 'print', 'excel', 'csv']
    };
  }

  ngAfterViewInit() {
    // Attach click event using jQuery after DataTable has been initialized
    $('#dataTable').on('click', '.fa-eye', (event) => {
      const id = $(event.target).data('id');
      this.opendetailes(id);
    });
    $('#dataTable').on('change', 'input[type="checkbox"]', (event) => {
      const id = $(event.target).attr('id').replace('switch-', '');
      const checked = $(event.target).prop('checked');
// alert(checked)

      this.onCheckboxChange(id, checked);
    });
  }

  opendetailes(_id) {
  this.router.navigate(['/test/folderDerailes/detailes',_id])

  }

  onCheckboxChange(itemId: string, checked: boolean) {
    alert("id:     "+itemId+"\n"+"checked!    "+checked)
    // this.changeStatCompte(itemId,checked)
    console.log("this status  has ben changed to "+!checked);
    
  }
  changeStatCompte(id, etat) {
    alert(etat)
    const payload = { _id: id, valid: etat };
    this.backendService
      .put(`${environment.apiUrl}/tech/updateStatTech`, payload)
      .subscribe(new Observer(
        this.router, 
        null,
        true,
        true,
        this.sharedService,
        null
      ).OBSERVER_PUT());
  }
}