import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';

declare function alertDanger(message: string): any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string = "";
  password: string = "";

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.authService.user) {
      this.router.navigate(["/"]);
    }
  }

  login() {
    if (!this.email) {
      alertDanger("ES NECESARIO INGRESAR EL EMAIL");
      return;
    }

    if (!this.password) {
      alertDanger("ES NECESARIO INGRESAR UNA CONTRASEÑA");
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (resp: any) => {
        if (!resp.error) {
          this.router.navigate(["/"]); // Redirigir en lugar de recargar la página
        } else {
          alertDanger(resp.error.message);
        }
      },
      error: () => {
        alertDanger("Error en el servidor. Intente nuevamente.");
      }
    });
  }
}
