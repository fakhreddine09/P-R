import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BackendService {
  constructor(private httpClient: HttpClient,private router: Router,) {}

  get(endpoint: string, limit?: number, offset?: number) {
    return this.httpClient.get(
      limit  ? `${endpoint}?limit=${limit}&offset=${offset}` : endpoint
    );
  }
  delete(endpoint: string) {
    return this.httpClient.delete(endpoint,{});
  }

  post(endpoint: string, object: any) {
    return this.httpClient.post(endpoint, object);
  }
  put(endpoint: string, object: any) {
    return this.httpClient.put(endpoint, object);
  }
  reloadComponent() {
    const currentRoute = this.router.url;
    this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
      this.router.navigate([currentRoute]);
    });
  }

} 
 export class AuthService {

    private apiUrl = 'http://localhost:3000/api/login'; // Remplacez par votre URL API
  
    constructor(private http: HttpClient) { }
  
    login(email: string, password: string): Observable<any> {
      return this.http.post<any>(this.apiUrl, { email, password });
    }
  }
