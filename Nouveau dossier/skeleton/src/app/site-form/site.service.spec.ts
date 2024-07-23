import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private apiUrl = 'http://localhost:3000/api/address';

  constructor(private http: HttpClient) {}

  saveAddress(address: Address): Observable<any> {
    return this.http.post<any>(this.apiUrl, address);
  }
}

