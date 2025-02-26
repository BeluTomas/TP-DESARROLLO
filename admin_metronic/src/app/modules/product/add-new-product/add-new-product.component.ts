import { Component, OnInit } from '@angular/core';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { CategoriesService } from '../../categories/_services/categories.service';
import { ProductService } from '../_services/product.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Categorie, CategorieL } from '../../categories/interface/categorie.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-new-product',
  templateUrl: './add-new-product.component.html',
  styleUrls: ['./add-new-product.component.scss']
})
export class AddNewProductComponent implements OnInit {

  title:string = null;
  sku:string = null;
  categorie:string = "";
  pricePesos:number = 0;  
  priceUsd:number = 0;  
  imagenFile: File = null;
  imagenPrevizualizacion: string | ArrayBuffer = null;
  resumen:string = null;
  description:string = null;
  // 
  tag:string = null;
  tags:string[] = [];
  categories:Categorie[] = [];

  isLoading$:Observable<boolean>;

  formGroup: FormGroup;
  isLoading:Boolean = false;
  
  constructor(
    public _productService:ProductService,
    public _categorieService:CategoriesService,
    public toaster:Toaster,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this._productService.isLoading$;
    this._categorieService.allCategories().subscribe((resp:CategorieL) => {
      console.log(resp);
      this.categories = resp.categories;
      this.loadServices();
    })
    this.loadForm();
  }

  loadForm() {
    this.formGroup = this.fb.group({
      title: [null, 
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.min(3),
          Validators.maxLength(250),
        ])
      ],
      sku: [null,
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.min(1),
          Validators.maxLength(250),
        ])
      ],
      categorie: [null,
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.min(1),
        ])
      ],
      pricePesos: [null,
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.min(1),
        ])
      ],
      priceUsd: [null,
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.min(1),
        ])
      ],
      resumen: [null,
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.min(1),
        ])
      ],
      description: [null,
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.min(1),
        ])
      ],
    });
  }

  loadServices(){
    this._productService.isLoadingSubject.next(true);
    setTimeout(() => {
      this._productService.isLoadingSubject.next(false);
    }, 50);
  }

  processFile($event){
    if($event.target.files[0].type.indexOf("image") < 0){
      this.imagenPrevizualizacion = null;
      this.toaster.open(NoticyAlertComponent,{text:`danger-'Upps! Necesita ingresar un archivo de tipo imagen.'`});
      return;
    }
    this.imagenFile = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.imagenFile);
    reader.onloadend = () => this.imagenPrevizualizacion = reader.result;
    this.loadServices();
  }

  addTag(){
    this.tags.push(this.tag);
    this.tag = "";
  }
  removeTag(i){
    this.tags.splice(i,1);
  }

  save(){
    // if(!this.title || !this.categorie || !this.pricePesos || !this.price_usd || !this.resumen || !this.description
    //   || !this.sku || this.tags.length == 0 || !this.imagenFile){
    //     this.toaster.open(NoticyAlertComponent,{text:`danger-'Upps! NECESITAS DIGITAR TODOS LOS CAMPOS DEL FORMULARIO.'`});
    //     return;
    // }
    if(this.tags.length == 0){
      this.toaster.open(NoticyAlertComponent,{text:`danger-'Upps! NECESITAS AGREGAR AL MENOS UNA TAG.'`});
      return;
    }
    let formData = new FormData();
    formData.append("title",this.formGroup.value.title);
    formData.append("categorie",this.formGroup.value.categorie);
    formData.append("sku",this.formGroup.value.sku);
    formData.append("price_pesos",this.formGroup.value.pricePesos);
    formData.append("price_usd",this.formGroup.value.priceUsd);
    formData.append("description",this.formGroup.value.description);
    formData.append("resumen",this.formGroup.value.resumen);
    formData.append("tags",JSON.stringify(this.tags));
    formData.append("imagen",this.imagenFile);
    this.isLoading = true;
    this._productService.createProduct(formData).subscribe((resp:any) => {
      console.log(resp);
      this.isLoading = false;
      if(resp.code == 403){
        this.toaster.open(NoticyAlertComponent,{text:`danger-'UPPS ! EL PRODUCTO YA EXISTE, DIGITAR OTRO NOMBRE'`});
        return;
      }else{
        this.toaster.open(NoticyAlertComponent,{text:`primary-'EL PRODUCTO SE REGISTRO CON EXITO'`});
        // this.title = null; 
        // this.categorie = null;
        // this.sku = null;
        // this.pricePesos = null;
        // this.priceUsd = null;
        // this.description = null;
        // this.resumen = null;
        // this.tags = [];
        // this.imagenFile = null;
        // this.imagenPrevizualizacion = null;
        this.loadForm();
        return;
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
