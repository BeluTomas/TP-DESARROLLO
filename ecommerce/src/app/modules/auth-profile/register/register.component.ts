import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  formGroup: FormGroup | undefined;
  constructor(
    public authServices: AuthService,
    public router: Router,
     private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    if (this.authServices.user) {
      this.router.navigate(["/"]);
    }
    this.loadForm();
  }

  loadForm() {
    this.formGroup = this.fb.group({
      name: [null, 
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.min(1),
          Validators.maxLength(250),
        ])
      ],
      surname: [null,
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.min(1),
          Validators.maxLength(250),
        ])
      ],
      email: [null,
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(1),
          Validators.min(1),
          Validators.maxLength(250),
        ])
      ],
      password: [null,
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.min(6),
          Validators.maxLength(250),
        ])
      ],
      repet_password: [null,
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.min(6),
          Validators.maxLength(250),
        ])
      ],
    });
  }

  registro() {
    

    if (this.formGroup?.value.password !== this.formGroup?.value.repet_password) {
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

    this.authServices.registro(this.formGroup?.value).subscribe((resp: any) => {
      console.log(resp);
      alertSuccess("Registrado correctamente");
      this.loadForm();
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
