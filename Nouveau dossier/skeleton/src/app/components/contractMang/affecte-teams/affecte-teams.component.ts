import { Component, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BackendService } from 'src/app/services/backend.service';
import Observer from 'src/app/services/observer';
import { SharedService } from 'src/app/services/shared.service';
import { environment } from 'src/environments/environment';
import { SelectOptionService } from '../../../theme/shared/components/select/select-option.service'
import { IOption } from 'ng-select';
@Component({
  selector: 'app-affecte-teams',
  templateUrl: './affecte-teams.component.html',
  styleUrls: ['./affecte-teams.component.scss']
})


export class AffecteTeamsComponent implements OnInit {
  @Input() title;
  @Input() contractID;
  @Input() add;
  @Input() addL3;
  @Input() objectUsers;
  typeTechncien: any;
  nivauxEscalade: any;
  listTechnicvien: any = []
  listtechAffecte: string[] = []
  model: any = { responsableEquipeTechnique: "", equipeTechnique: [] }
  simpleOption: Array<IOption> = [];


  constructor(
    public activeModal: NgbActiveModal,
    public sharedService: SharedService,

    private backendService: BackendService,
    public router: Router

  ) { }


  ngOnInit() {

    if (this.add) {
      this.getListTechAffecte()
      this.getListTech()
      this.model = {}
    } else {
      this.getListTechForUpdate()

      this.model.tech = this.objectUsers.id_tech
      this.model.role = this.objectUsers.role
      this.model.niveauEscalade = this.objectUsers.niveauEscalade
    }
  }

  Onsubmit(f: NgForm) {

    if (this.add) {
      let URL = ""
      let payload = {}
      if (this.typeTechncien == "equipeTechnique") {
        URL = "/contract/addEquipeTechnique";
        payload = {
          contractId: this.contractID,
          eqipe: [{ tech: f.value.tech, niveauEscalade: this.nivauxEscalade }]

        }
      } else {
        URL = "/contract/addResponableEquipeTechnique"
        payload = {
          contractId: this.contractID,
          responsableEquipeTechnique: { responsable: f.value.tech, niveauEscalade: this.nivauxEscalade }
        }
      }
      this.backendService
        .post(`${environment.apiUrl}${URL}`, payload)
        .subscribe(new Observer(
          this.router,// just un class dans angular
          null,//
          true,//relode
          true,//swwet alert
          this.sharedService,//obligtoir si ana reload
          this.activeModal
        ).OBSERVER_POST());
    } else {
      const payload = { ...f.value, _id: this.objectUsers._id }
      console.log(payload);
      this.backendService
        .put(`${environment.apiUrl}/folder/updateSite`, payload)
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


  getListTech() {
    this.backendService.get(`${environment.apiUrl}/tech/getAllEmployeesByValid/${true}`).subscribe(
      new Observer().OBSERVER_GET((response) => {
        this.listTechnicvien = response.rows;
        if (this.listtechAffecte.length != 0) {
          this.listTechnicvien = this.listTechnicvien.filter(tech => !this.listtechAffecte.includes(tech._id));
        }
      })
    );
  }
  getListTechForUpdate() {
    this.backendService.get(`${environment.apiUrl}/tech/getAllEmployeesByValid/${true}`).subscribe(
      new Observer().OBSERVER_GET((response) => {
        this.listTechnicvien = response.rows;
        // console.log(this.listTechnicvien);
      })
    );
  }
  getListTechAffecte() {
    this.backendService.get(`${environment.apiUrl}/contract/getListTemsAffected/${this.contractID}`).subscribe(
      new Observer().OBSERVER_GET((response) => {
        this.listtechAffecte = response.rows;
        console.log(this.listtechAffecte);
      })
    );
  }
  getValiousNiveauEscalade(event) {
    this.nivauxEscalade = event.target.value;
  }
  getValiousTypeAccount(event) {
    this.typeTechncien = event.target.value;
  }
}



