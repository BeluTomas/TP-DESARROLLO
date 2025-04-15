import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { CategoriesService } from '../_services/categories.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Categorie } from '../interface/categorie.interface';
import { FormReactive } from 'src/app/config/config';

@Component({
  selector: 'app-add-new-categorie',
  templateUrl: './add-new-categorie.component.html',
  styleUrls: ['./add-new-categorie.component.scss']
})
export class AddNewCategorieComponent implements OnInit {

  @Output() CategorieC: EventEmitter<Categorie> = new EventEmitter();

  isLoading$: Observable<boolean>;;
  name: string = null;
  imagenFile: File = null;
  imagenPrevizualizacion: string | ArrayBuffer = null;

  formGroup: FormGroup;
  isLoading:Boolean = false;
  
  formReactive = new FormReactive();
  constructor(
    public _categorieService: CategoriesService,
    public modal: NgbActiveModal,
    public toaster: Toaster,
    private fb: FormBuilder,
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
      });
    }

  processFile($event) {
    if ($event.target.files[0].type.indexOf("image") < 0) {
      this.imagenPrevizualizacion = null;
      this.toaster.open(NoticyAlertComponent, { text: `danger-'Upps! Necesita ingresar un archivo de tipo imagen.'` });
      return;
    }
    this.imagenFile = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.imagenFile);
    reader.onloadend = () => this.imagenPrevizualizacion = reader.result;
  }

  save() {
    if (!this.imagenFile) {
      this.toaster.open(NoticyAlertComponent, { text: `danger-'Upps! Necesita ingresar la imagen.'` });
      return;
    }
    let formData = new FormData();
    formData.append('title', this.formGroup.value.name);
    formData.append('portada', this.imagenFile);

    this._categorieService.createCategorie(formData).subscribe((resp: Categorie) => {
      this.CategorieC.emit(resp);
      this.modal.close();
    });
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
