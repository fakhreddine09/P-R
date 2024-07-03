import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isLoading = false

  get authority() {
    return sessionStorage.getItem("authority")
  }

  constructor() { }

  ngOnInit(): void {
  }

}
