import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: any = null;
  token: any = null;

  constructor(private http: HttpClient, private router: Router) {
    this.getLocalStorage();
  }

  // Obtener los datos del LocalStorage
  getLocalStorage() {
    const tokenStorage = localStorage.getItem('token');
    const userStorage = localStorage.getItem('user');

    if (tokenStorage) {
      this.token = tokenStorage;
      try {
        this.user = JSON.parse(userStorage ?? '');
      } catch (error) {
        console.error('Error al parsear los datos del usuario:', error);
        this.user = null; // Datos corruptos, establecemos como null
      }
    } else {
      this.token = null;
      this.user = null;
    }
  }

  // Iniciar sesión
  login(email: string, password: string) {
    const URL = `${URL_SERVICIOS}users/login`;

    return this.http.post(URL, { email, password }).pipe(
      map((resp: any) => {
        if (resp.USER_FRONTED && resp.USER_FRONTED.token) {
          // Almacenar el token en el LocalStorage
          return this.localStorageSave(resp.USER_FRONTED);
        } else {
          // Devolver el estado de la respuesta
          return resp;
        }
      }),
      catchError((error: any) => {
        console.error('Error en el login:', error);
        return of(error);
      })
    );
  }

  // Guardar datos en el LocalStorage
  localStorageSave(USER_FRONTED: any) {
    localStorage.setItem('token', USER_FRONTED.token);
    localStorage.setItem('user', JSON.stringify(USER_FRONTED.user));
    return true;
  }

  // Registrar usuario
  registro(data: any) {
    const URL = `${URL_SERVICIOS}users/register`;
    return this.http.post(URL, data);
  }

  // Cerrar sesión
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    location.reload(); // Recargar la página para limpiar el estado de la aplicación
  }
}