import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { SliderService } from '../_services/slider.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Slider } from '../interface/slider.interface';
import { FormReactive } from 'src/app/config/config';

@Component({
  selector: 'app-add-new-slider',
  templateUrl: './add-new-slider.component.html',
  styleUrls: ['./add-new-slider.component.scss']
})
export class AddNewSliderComponent implements OnInit {

  @Output() SliderC: EventEmitter<Slider> = new EventEmitter();

  name:string = null;
  link:string = null;
  imagenFile: File = null;
  imagenPrevizualizacion: string | ArrayBuffer = null;

  formGroup: FormGroup;
  isLoading:Boolean = false;

  formReactive = new FormReactive();
  constructor(
    public _sliderService: SliderService,
    public modal:NgbActiveModal,
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
      link: [null,
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.min(1),
        ])
      ],
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
    if(!this.imagenFile){
      this.toaster.open(NoticyAlertComponent,{text:`danger-'Upps! Necesita agregar una imagen.'`});
      return;
    }
    let formData = new FormData();
    formData.append('title',this.formGroup.value.name);
    formData.append('link',this.formGroup.value.link);
    formData.append('portada',this.imagenFile);

    // 
    this._sliderService.createSlider(formData).subscribe((resp:Slider) => {
      console.log(resp);
      this.SliderC.emit(resp);
      this.modal.close();
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
