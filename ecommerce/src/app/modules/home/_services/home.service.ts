import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URL_SERVICIOS } from 'src/app/config/config';
import { HomeData } from 'src/app/config/interface';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(
    public http: HttpClient,
  ) { }

  listHome(TIME_NOW:number = 0): Observable<HomeData>{
    let URL = URL_SERVICIOS+"/home/list?TIME_NOW="+TIME_NOW;
    return this.http.get<HomeData>(URL);
  }
}
