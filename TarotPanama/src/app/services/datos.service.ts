import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environments.prod';
import { Datos } from '../interfaces/datos';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatosService {
  private appUrl: string;
  private apiUrl: string;
  constructor(private http: HttpClient) {
    this.appUrl = environment.apiUrl;
    this.apiUrl = 'api/registrar';
  }
  registrar(datos: Datos): Observable<any> {
    return this.http.post(this.appUrl + this.apiUrl, datos);
  }
}
