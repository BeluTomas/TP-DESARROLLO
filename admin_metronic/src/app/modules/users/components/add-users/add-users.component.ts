import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { UsersService } from '../../_services/users.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormReactive } from 'src/app/config/config';

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.scss']
})
export class AddUsersComponent implements OnInit {

  @Output() UserC: EventEmitter<any> = new EventEmitter();
  name:string = null;
  surname:string = null;
  email:string = null;
  password:string = null;
  repetPassword:string = null;

  formGroup: FormGroup;
  isLoading:Boolean = false;
  
  formReactive = new FormReactive();
  constructor(
    public modal: NgbActiveModal,
    public userService: UsersService,
    private fb: FormBuilder,
    public toaster: Toaster,
  ) { }

  ngOnInit(): void {
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
      repetPassword: [null,
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.min(6),
          Validators.maxLength(250),
        ])
      ],
    });
  }

  save(){
    // if(!this.name || !this.surname || !this.email || !this.password || !this.repetPassword){
      //   // TODOS LO CAMPOS SON OBLIGATORIOS
      //   this.toaster.open(NoticyAlertComponent,{text:`danger-'Upps! Necesita ingresar todos los campos.'`});
      //   return;
      // }
      if(this.formGroup.value.password != this.formGroup.value.repetPassword){
        this.toaster.open(NoticyAlertComponent,{text:`danger-'Upps! Necesita ingresar contraseñas iguales.'`});
        return;
      }
      // let data = {
      //   name: this.name,
      //   surname: this.surname,
      //   email: this.email,
      //   password: this.password,
      //   repetPassword: this.repetPassword,
    // }
    this.isLoading = true;
    this.userService.createUser(this.formGroup.value).subscribe((resp:any) => {
      console.log(resp);
      this.isLoading = false;
      this.UserC.emit(resp.user);
      this.toaster.open(NoticyAlertComponent,{text:`success-'EL USUARIO SE REGISTRO CORRECTAMENTE.'`});
      this.modal.close();
    }, (error) => {
      this.isLoading = false;
      if(error.error){
        this.toaster.open(NoticyAlertComponent,{text:`danger-'${error.error.message}'`});
      }
    })
  }

  isControlValid(controlName: string): boolean {
    return this.formReactive.isControlValid(this.formGroup,controlName);
  }

  isControlInvalid(controlName: string): boolean {
    return this.formReactive.isControlInvalid(this.formGroup,controlName);
  }

  controlHasError(validation, controlName): boolean {
    return this.formReactive.controlHasError(this.formGroup,validation,controlName);
  }

  isControlTouched(controlName): boolean {
    return this.formReactive.isControlTouched(this.formGroup,controlName);
  }
}
