import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from '../../auth-profile/_services/auth.service';
import { Observable } from 'rxjs';
import { AddressClient, AddressClientR, ProfileClientS } from 'src/app/config/interface';

@Injectable({
  providedIn: 'root'
})
export class EcommerceAuthService {

  constructor(
    public authService: AuthService,
    public http: HttpClient,
  ) { }

  // DIRECCIÓN DE CLIENTE
  listAddressClient(user_id:any) {
    let headers = new HttpHeaders({'token': this.authService.token});
    let URL = URL_SERVICIOS+"address_client/list?user_id="+user_id;
    return this.http.get(URL,{headers:headers});
  }

  registerAddressClient(data:any) {
    let headers = new HttpHeaders({'token': this.authService.token});
    let URL = URL_SERVICIOS+"address_client/register";
    return this.http.post(URL,data,{headers: headers});
  }

  updateAddressClient(data:any):Observable<AddressClientR> {
    let headers = new HttpHeaders({'token': this.authService.token});
    let URL = URL_SERVICIOS+"address_client/update";
    return this.http.put<AddressClientR>(URL,data,{headers: headers});
  }

  deleteAddressClient(address_client_id:any){
    let headers = new HttpHeaders({'token': this.authService.token});
    let URL = URL_SERVICIOS+"address_client/delete/"+address_client_id;
    return this.http.delete(URL,{headers: headers});
  }
  // 

  registerSale(data:any){
    let headers = new HttpHeaders({'token': this.authService.token});
    let URL = URL_SERVICIOS+"sale/register";
    return this.http.post(URL,data,{headers: headers});
  }

  // 
  showProfileClient(data:any):Observable<ProfileClientS>{
    let headers = new HttpHeaders({'token': this.authService.token});
    let URL = URL_SERVICIOS+"home/profile_client";
    return this.http.post<ProfileClientS>(URL,data,{headers: headers});
  }
  updateProfileClient(data:any){
    let headers = new HttpHeaders({'token': this.authService.token});
    let URL = URL_SERVICIOS+"home/update_client";
    return this.http.post(URL,data,{headers: headers});
  }

  // REVIEW
  registerProfileClientReview(data:any){
    let headers = new HttpHeaders({'token': this.authService.token});
    let URL = URL_SERVICIOS+"review/register";
    return this.http.post(URL,data,{headers: headers});
  }
  updateProfileClientReview(data:any){
    let headers = new HttpHeaders({'token': this.authService.token});
    let URL = URL_SERVICIOS+"review/update";
    return this.http.put(URL,data,{headers: headers});
  }
}
