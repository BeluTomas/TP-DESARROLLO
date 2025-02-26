import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

declare function alertDanger(message: string): any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string = "";
  password: string = "";
  formGroup: FormGroup | undefined;
  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    if (this.authService.user) {
      this.router.navigate(["/"]);
    }
    this.initForm();
  }

  initForm() {
    this.formGroup = this.fb.group({
      email: [
        null,
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
        ]),
      ],
      password: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
    });
  }
  
  login() {
    // if (!this.email) {
    //   alertDanger("ES NECESARIO INGRESAR EL EMAIL");
    //   return;
    // }

    // if (!this.password) {
    //   alertDanger("ES NECESARIO INGRESAR UNA CONTRASEÑA");
    //   return;
    // }

    this.authService.login(this.formGroup?.value.email, this.formGroup?.value.password).subscribe({
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

  isControlValid(controlName: string): boolean {
    const control = this.formGroup?.controls[controlName];
    return (control?.valid && (control?.dirty || control?.touched)) ?? false;
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup?.controls[controlName];
    return (control?.invalid && (control?.dirty || control?.touched)) ?? false;
  }

  controlHasError(validation:any, controlName:any): boolean {
    const control = this.formGroup?.controls[controlName];
    return (control?.hasError(validation) && (control?.dirty || control?.touched)) ?? false;
  }

  isControlTouched(controlName:any): boolean {
    const control = this.formGroup?.controls[controlName];
    return (control?.dirty || control?.touched) ?? false;
  }
}
