import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { urlBackend } from 'src/app/config/config';
import { CategoriesService } from '../_services/categories.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Categorie } from '../interface/categorie.interface';

@Component({
  selector: 'app-edit-new-categorie',
  templateUrl: './edit-new-categorie.component.html',
  styleUrls: ['./edit-new-categorie.component.scss']
})
export class EditNewCategorieComponent implements OnInit {

  @Output() CategorieE: EventEmitter<Categorie> = new EventEmitter();
  @Input() categorieSelected:Categorie;
  isLoading$:Observable<boolean>;
  name:String = null;

  imagenFile: File = null;
  imagenPrevizualizacion: string | ArrayBuffer = null;
  state:Number = null;

  formGroup: FormGroup;
  isLoading:Boolean = false;
  constructor(
    public _categorieService: CategoriesService,
    public modal:NgbActiveModal,
    public toaster: Toaster,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    // this.name = this.categorieSelected.title;
    // this.state = this.categorieSelected.state;
    console.log(this.categorieSelected);
    this.imagenPrevizualizacion = urlBackend+'api/categories/uploads/categorie/'+this.categorieSelected.imagen;
    this.loadForm();
  }

  loadForm() {
    this.formGroup = this.fb.group({
      name: [this.categorieSelected.title, 
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.min(1),
          Validators.maxLength(250),
        ])
      ],
      state : [this.categorieSelected.state]
    });
  }

  processFile($event){
    console.log($event.target);
    if($event.target.files[0].type.indexOf("image") < 0){
      this.imagenPrevizualizacion = null;
      this.toaster.open(NoticyAlertComponent,{text:`danger-'Upps! Necesita ingresar un archivo de tipo imagen.'`});
      return;
    }
    this.imagenFile = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.imagenFile);
    reader.onloadend = () => this.imagenPrevizualizacion = reader.result;
  }

  save(){
    console.log(this.name);
    // if(!this.name){
    //   this.toaster.open(NoticyAlertComponent,{text:`danger-'Upps! Necesita ingresar todos los campos.'`});
    //   return;
    // }
    let formData = new FormData();
    formData.append('_id',this.categorieSelected._id);
    formData.append('title',this.formGroup.value.name);
    formData.append('state',this.formGroup.value.state);
    if(this.imagenFile){
      formData.append('portada',this.imagenFile);
    }

    // 
    this._categorieService.updateCategorie(formData).subscribe((resp:any) => {
      console.log(resp);
      this.CategorieE.emit(resp.categorie);
      this.modal.close();
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
