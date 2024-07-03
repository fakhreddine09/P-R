import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { CalendarOptions } from '@fullcalendar/angular';
import Observer from 'src/app/services/observer';
import { environment } from 'src/environments/environment';
import { BackendService } from 'src/app/services/backend.service';
import localeFrTn from '@angular/common/locales/fr-TN';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { style } from '@angular/animations';

@Component({
  selector: 'app-clander-visitepreventive',
  templateUrl: './clander-visitepreventive.component.html',
  styleUrls: ['./clander-visitepreventive.component.scss']
})
export class ClanderVisitepreventiveComponent implements OnInit {
  clanderinfoEvent: any = [];
  infoEvent = { vistStatus:"",contractSatus:false,title: "", startDate: "", endDate: "", siteName: "", siteAdres: "", technicienName: "", status: "",typeContract:"",natureContract:"",startDateContract:"",endDateContract:"",SLA:"",responsableContr:"",techRespossable:"",techVisite:"",LEscalade:""};
  calendarOptions: CalendarOptions;
  constructor(
    private backendService: BackendService,
    private modalService: NgbModal
  ) { }
  ngOnInit() {
    this.getAllEventForAdmin();
  }
  async getAllEventForAdmin() {
    await this.backendService.get(`${environment.apiUrl}/vistepreventive/getlistvisiteprevForAdmin`).subscribe(
      new Observer().OBSERVER_GET((response) => {
        this.clanderinfoEvent = response.rows;
        this.clanderinfoEvent.forEach(element => {
          element.start = formatDate(element.start, 'yyyy-MM-dd', 'en-US');
          element.end = formatDate(element.end, 'yyyy-MM-dd', 'en-US');
        });
        this.initializeCalendar();
      })
    );
  }
  async getInfoOneVisite(id) {
    await this.backendService.get(`${environment.apiUrl}/vistepreventive/getOneVisitePrevBayId/${id}`).subscribe(
      new Observer().OBSERVER_GET((response) => {
        this.infoEvent.title = response.rows.title;
        this.infoEvent.startDate = response.rows.startDate;
        this.infoEvent.endDate = response.rows.endDate;
        this.infoEvent.siteName = response.rows.siteID.nomSite;
        this.infoEvent.siteAdres = response.rows.siteID.adress;
        this.infoEvent.technicienName = response.rows.technicien.firstName + ' ' + response.rows.technicien.lastName
        this.infoEvent.status = response.rows.status;
        this.infoEvent.typeContract = response.rows.contractID.type;
        this.infoEvent.natureContract = response.rows.contractID.nature;
        this.infoEvent.startDateContract = response.rows.contractID.startDate;
        this.infoEvent.endDateContract = response.rows.contractID.endDate;
        this.infoEvent.SLA = response.rows.contractID.SLA;
        this.infoEvent.vistStatus = response.rows.status;
        this.infoEvent.contractSatus = response.rows.contractID.valid;
        this.infoEvent.responsableContr = response.rows.contractID.responsableEquipeTechnique.responsable.firstName+'  '+response.rows.contractID.responsableEquipeTechnique.responsable.lastName        ;
        let listTeams= response.rows.contractID.equipeTechnique;
        const techId =response.rows.technicien._id.toString()
        listTeams.forEach(element => {
          if(techId == element.tech._id.toString()){
            this.infoEvent.LEscalade = element.niveauEscalade.toUpperCase();
          }
        });
        
      })
    );
  }
  initializeCalendar() {
    this.calendarOptions = {
      initialView: 'dayGridMonth', // Adjust based on your calendar needs
      events: this.clanderinfoEvent.map(e => {
        return {
          
          textColor: e.status == 'Pending' ? '#000' : '#FFFFFF',
          color: e.status == 'Pending' ? '#ffff00' : e.status == 'In progress' ? '#0000ff' : '#33cc33',
          ...e
        };
      }),
      eventClick: this.handleEventClick.bind(this)
    };
  }
  handleEventClick(info) {
    const event = info.event;
    const id = event.id;
    const contractNature = event.contractNature;
    this.openMyModal('modal-1');
    this.getInfoOneVisite(id)
  }

  openMyModal(modalID: string) {
    document.querySelector('#' + modalID).classList.add('md-show');
  }

  closeMyModal(event) {
    ((event.target.parentElement.parentElement).parentElement).classList.remove('md-show');
  }
}