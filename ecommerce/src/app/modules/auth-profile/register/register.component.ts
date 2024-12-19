import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';

declare function alertDanger(message: string): any;
declare function alertSuccess(message: string): any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  email: string = "";
  name: string = "";
  surname: string = "";
  password: string = "";
  repet_password: string = "";

  constructor(
    public authServices: AuthService,
    public router: Router,
  ) { }

  ngOnInit(): void {
    if (this.authServices.user) {
      this.router.navigate(["/"]);
    }
  }

  registro() {
    if (!this.email ||
      !this.name ||
      !this.surname ||
      !this.password ||
      !this.repet_password) {
      alertDanger("TODOS LOS CAMPOS SON REQUERIDOS");
      return;
    }

    if (this.password !== this.repet_password) {
      alertDanger("LAS CONTRASEÑAS DEBEN SER IGUALES");
      return;
    }

    let data = {
      email: this.email,
      name: this.name,
      surname: this.surname,
      password: this.password,
      rol: 'cliente',
    };

    this.authServices.registro(data).subscribe((resp: any) => {
      console.log(resp);
      alertSuccess("Registrado correctamente");
      this.limpiarCampos();
    }, (error) => {
      alertDanger("Error en el registro. Intente nuevamente");
    });
  }

  limpiarCampos() {
    this.email = "";
    this.name = "";
    this.surname = "";
    this.password = "";
    this.repet_password = "";
  }
}
