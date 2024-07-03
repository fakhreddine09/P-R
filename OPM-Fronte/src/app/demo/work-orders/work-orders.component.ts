import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DataService } from 'src/app/services/data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-work-orders',
  templateUrl: './work-orders.component.html',
  styleUrls: ['./work-orders.component.scss']
})
export class WorkOrdersComponent implements OnInit {

  isLoading = true
  workOrders: any[] = []
  folder: any = {}
  folderId: string = ""
  selectedWorkOrder: any | undefined = undefined
  displayShowModal = false
  displayAssignTechModal = false
  apiUrl: string = environment.apiUrl

  constructor(private route: ActivatedRoute, private dataService: DataService, private messageService: MessageService, private confirmService: ConfirmationService) {

  }

  ngOnInit(): void {
    this.route
      .paramMap
      .subscribe(params => {
        this.folderId = params.get('folderId')!
      });
    this.getFolderById(this.folderId)
  }

  getFolderById(id: string) {
    this.dataService.getFolderById(id).subscribe((response: any) => {
      this.folder = response.rows
      this.getWorkOrdersByClientId(response.rows.clientId)
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: error.error.message })
    })
  }

  getWorkOrdersByClientId(id: string) {
    this.isLoading = true
    this.dataService.getWorkOrdersByClientId(id).subscribe((response: any) => {
      this.workOrders = response.rows
      this.isLoading = false
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: error.error.message })
    })
  }

  selectWorkOrder(id: string) {
    this.selectedWorkOrder = this.workOrders.find(wo => wo._id === id)
    if (this.selectWorkOrder) this.displayShowModal = true
  }

  deleteWorkOrder(event: MouseEvent, id: string) {
    event.stopPropagation()
    event.preventDefault()
    this.confirmService.confirm({
      message: "Are you sure?",
      accept: () => {
        this.dataService.deleteWorkOrder(id).subscribe(response => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Deleted successfully.' });
          this.getWorkOrdersByClientId(this.folder.clientId)
        }, error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message });
        })
      }
    })
  }
}
