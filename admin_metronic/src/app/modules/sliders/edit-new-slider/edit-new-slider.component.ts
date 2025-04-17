import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { urlBackend } from 'src/app/config/config';
import { SliderService } from '../_services/slider.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Slider } from '../interface/slider.interface';

@Component({
  selector: 'app-edit-new-slider',
  templateUrl: './edit-new-slider.component.html',
  styleUrls: ['./edit-new-slider.component.scss']
})
export class EditNewSliderComponent implements OnInit {

  @Output() SliderE: EventEmitter<Slider> = new EventEmitter();
  @Input() sliderSelected:Slider;
  
  isLoading$:any;
  name:string = null;
  link:string = null;
  imagenFile: File = null;
  imagenPrevizualizacion: string | ArrayBuffer = null;
  state:number = 1;
  
  formGroup: FormGroup;
  isLoading:Boolean = false;
  constructor(
    public _sliderService: SliderService,
    public modal:NgbActiveModal,
    public toaster: Toaster,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    // this.name = this.sliderSelected.title;
    // this.link = this.sliderSelected.link;
    // this.state = this.sliderSelected.state;
    this.imagenPrevizualizacion = urlBackend+'api/sliders/uploads/slider/'+this.sliderSelected.imagen;

    this.loadForm();
  }

  loadForm() {
    this.formGroup = this.fb.group({
      name: [this.sliderSelected.title, 
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.min(1),
          Validators.maxLength(250),
        ])
      ],
      link: [this.sliderSelected.link,
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.min(1),
        ])
      ],
      state: [this.sliderSelected.state],
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
    // if(!this.name || !this.link){
    //   this.toaster.open(NoticyAlertComponent,{text:`danger-'Upps! Necesita ingresar todos los campos.'`});
    //   return;
    // }
    let formData = new FormData();
    formData.append('_id',this.sliderSelected._id);
    formData.append('title',this.formGroup.value.name);
    formData.append('link',this.formGroup.value.link);
    formData.append('state',this.formGroup.value.state);
    formData.append('portada',this.imagenFile);

    // 
    this._sliderService.updateSlider(formData).subscribe((resp:any) => {
      console.log(resp);
      this.SliderE.emit(resp.slider);
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
