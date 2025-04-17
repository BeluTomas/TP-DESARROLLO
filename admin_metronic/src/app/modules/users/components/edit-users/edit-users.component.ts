import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { UsersService } from '../../_services/users.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User, UserR } from '../../interface/user.interface';

@Component({
  selector: 'app-edit-users',
  templateUrl: './edit-users.component.html',
  styleUrls: ['./edit-users.component.scss']
})
export class EditUsersComponent implements OnInit {

  @Input() user_selected:User;

  @Output() UserE: EventEmitter<User> = new EventEmitter();
  name:string = null;
  surname:string = null;
  email:string = null;
  password:string = null;
  repetPassword:string = null;

  formGroup: FormGroup;
  isLoading:Boolean = false;
  constructor(
    public modal: NgbActiveModal,
    public userService: UsersService,
     private fb: FormBuilder,
    public toaster: Toaster,
  ) { }

  ngOnInit(): void {
    // this.name = this.user_selected.name;
    // this.surname = this.user_selected.surname;
    // this.email = this.user_selected.email;
    this.loadForm();
  }

   loadForm() {
      this.formGroup = this.fb.group({
        _id: [this.user_selected._id],
        name: [this.user_selected.name, 
          Validators.compose([
            Validators.required,
            Validators.minLength(1),
            Validators.min(1),
            Validators.maxLength(250),
          ])
        ],
        surname: [this.user_selected.surname,
          Validators.compose([
            Validators.required,
            Validators.minLength(1),
            Validators.min(1),
            Validators.maxLength(250),
          ])
        ],
        email: [this.user_selected.email,
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
            Validators.nullValidator,
            Validators.minLength(6),
            Validators.min(6),
            Validators.maxLength(250),
          ])
        ],
        repetPassword: [null,
          Validators.compose([
            Validators.nullValidator,
            Validators.minLength(6),
            Validators.min(6),
            Validators.maxLength(250),
          ])
        ],
      });
  }

  save(){
    // if(!this.name || !this.surname || !this.email){
    //   // TODOS LO CAMPOS SON OBLIGATORIOS
    //   this.toaster.open(NoticyAlertComponent,{text:`danger-'Upps! Necesita ingresar todos los campos.'`});
    //   return;
    // }
    if(this.formGroup.value.password && this.formGroup.value.password != this.formGroup.value.repetPassword){
      this.toaster.open(NoticyAlertComponent,{text:`danger-'Upps! Necesita ingresar contraseñas iguales.'`});
      return;
    }
    // let data = {
    //   _id: this.user_selected._id,
    //   name: this.name,
    //   surname: this.surname,
    //   email: this.email,
    //   // password: this.password,
    //   repetPassword: this.repetPassword,
    // }
    this.userService.updateUser(this.formGroup.value).subscribe((resp:UserR) => {
      console.log(resp);
      this.UserE.emit(resp.user);
      this.toaster.open(NoticyAlertComponent,{text:`success-'EL USUARIO SE ACTUALIZO CORRECTAMENTE.'`});
      this.modal.close();
    }, (error) => {
      if(error.error){
        this.toaster.open(NoticyAlertComponent,{text:`danger-'${error.error.message}'`});
      }
    })
  }

  isControlValid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation, controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.dirty || control.touched;
  }
}
