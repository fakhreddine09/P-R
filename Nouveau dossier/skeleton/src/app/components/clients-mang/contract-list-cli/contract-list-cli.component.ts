import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BackendService } from 'src/app/services/backend.service';
import Observer from 'src/app/services/observer';
import { SharedService } from 'src/app/services/shared.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-contract-list-cli',
  templateUrl: './contract-list-cli.component.html',
  styleUrls: ['./contract-list-cli.component.scss']
})
export class ContractListCliComponent implements OnInit {
  id_user: string = "667ad096b27af5a578db0818";
  listContrct: any = []
  constructor(private backendService: BackendService, public sharedService: SharedService, private modalService: NgbModal, private router: Router) { }

  ngOnInit(): void {
    this.getlistContractFoClient()
    // this.calculatePeriods("21-06-2024","18-06-2024")
  }
  async getlistContractFoClient() {
    await this.backendService.get(`${environment.apiUrl}/client/getListContractByClient/${this.id_user}`).subscribe(
      new Observer().OBSERVER_GET((response) => {
        this.listContrct = response.rows;
      })
    );
  }

  calculatePeriods(startDate: string, endDate: string): { daysBetweenNowAndEnd: number, daysBetweenStartAndEnd: number } {
    // alert(startDate+"/"+endDate)
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    const daysBetweenNowAndEnd = this.getDaysDifference(now, end);
    const daysBetweenStartAndEnd = this.getDaysDifference(start, end);
// alert("daysBetweenNowAndEnd : "+daysBetweenNowAndEnd+"/ daysBetweenStartAndEnd : "+daysBetweenStartAndEnd)
    return {
      daysBetweenNowAndEnd,
      daysBetweenStartAndEnd
    };
  }
  getDaysDifference(date1: Date, date2: Date): number {
    const oneDay = 24 * 60 * 60 * 1000; // Hours*minutes*seconds*milliseconds
    return Math.round(((date2.getTime() - date1.getTime()) / oneDay));
  }
  comperDateContract(startDate, endDate) {
    let res = ""
    const { daysBetweenNowAndEnd, daysBetweenStartAndEnd } = this.calculatePeriods(startDate, endDate);
    // const hafePeriode:any= daysBetweenStartAndEnd/2;
    if (daysBetweenNowAndEnd > daysBetweenStartAndEnd / 2) {
      res = "1"
    }
    if (0 < daysBetweenNowAndEnd && (daysBetweenNowAndEnd < daysBetweenStartAndEnd / 2)) {
        res = "2"
    }
    if (daysBetweenNowAndEnd < 0) {
      res = "3"

    }
    return res;
  }

  getCardClass(item: any): string {
    const result = this.comperDateContract(item.startDate, item.endDate);
    switch (result) {
      case "1":
        return 'card-border-c-green';
      case "2":
        return 'card-border-c-yellow';
      case "3":
        return 'card-border-c-red';
      default:
        return 'card-border-c-blue'; // Classe par défaut
    }
  }
}


