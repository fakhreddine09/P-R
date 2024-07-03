import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BackendService } from 'src/app/services/backend.service';
import Observer from 'src/app/services/observer';
import { SharedService } from 'src/app/services/shared.service';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { AddUpdateTiketesCustomerComponent } from '../add-update-tiketes-customer/add-update-tiketes-customer.component';
import { RaisenCancelTiketesComponent } from '../raisen-cancel-tiketes/raisen-cancel-tiketes.component';

@Component({
  selector: 'app-list-tiketes-customer',
  templateUrl: './list-tiketes-customer.component.html',
  styleUrls: ['./list-tiketes-customer.component.scss',
              '../../../../../node_modules/ngx-bar-rating/themes/br-movie-theme.css'
            ],
            encapsulation: ViewEncapsulation.None
})
export class ListTiketesCustomerComponent implements OnInit {
  id_contract
  id_client = "667ad209b69856844b46c3b9"
  listTickets: any = []
  public rateMovie = 1;
  // ------
  page = 1;
  pageSize = 5;
  pageSizes = [5, 10, 15];
  term: any;
  constructor(private route: ActivatedRoute, private backendService: BackendService, public sharedService: SharedService, private modalService: NgbModal, private router: Router) { }


  ngOnInit(): void {
    this.id_contract = this.route.snapshot.paramMap.get("id");
    this.getListTicketsForClient()
  }
  async getListTicketsForClient() {
    await this.backendService.get(`${environment.apiUrl}/ticket/getAllTicketByClientIdAndContract/${this.id_client}/${this.id_contract}`).subscribe(
      new Observer().OBSERVER_GET((response) => {
        this.listTickets = response.rows;
      })
    );
  }
  openAddTickets(){
    const modalRef = this.modalService.open(AddUpdateTiketesCustomerComponent);
    modalRef.componentInstance.mytitle = 'New Ticket';
    modalRef.componentInstance.id_contract = this.id_contract;
    modalRef.componentInstance.id_Client = this.id_client;
    modalRef.componentInstance.add = true;
  }
  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;//lorsque la taille de la page est modifie la pagination revient à la page 1
  }
  openUpdate(item){

    const modalRef = this.modalService.open(AddUpdateTiketesCustomerComponent);
    modalRef.componentInstance.mytitle = 'Update Ticket';
    modalRef.componentInstance.id_contract = this.id_contract;
    modalRef.componentInstance.id_Client = this.id_client;
    modalRef.componentInstance.add = false;
    modalRef.componentInstance.Obj = item;
  }


  openCancel(id){

    const modalRef = this.modalService.open(RaisenCancelTiketesComponent);
    modalRef.componentInstance.title = 'Request for Ticket Cancellation';
    modalRef.componentInstance.id_ticket = id;
  }
  // 
}
