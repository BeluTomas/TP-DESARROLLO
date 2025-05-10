import { Component, OnInit } from '@angular/core';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { CuponeService } from '../_services/cupone.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfiaAll } from '../interaface/cupone.interface';
import { Product } from '../../product/interface/product.interface';
import { Categorie } from '../../categories/interface/categorie.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-new-cupone',
  templateUrl: './add-new-cupone.component.html',
  styleUrls: ['./add-new-cupone.component.scss']
})
export class AddNewCuponeComponent implements OnInit {

  isLoading$:Observable<boolean>;

  products:Product[] = [];
  categories:Categorie[] = [];
  product:string = "";
  categorie:string = "";

  code:string = null;
  typeDiscount:number = 1;
  discount:number = 0;
  typeCount:number = 1;
  num_use:number = 0;
  typeSegment:number = 1;
  productsSelected:Product[] = [];
  categoriesSelected:Categorie[] = [];

  formGroup: FormGroup;
  isLoading:Boolean = false;
  constructor(
    public _cuponService:CuponeService,
    public toaster:Toaster,
     private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this._cuponService.isLoading$;
    
    this._cuponService.cuponConfig().subscribe((resp:ConfiaAll) => {
      console.log(resp);
      this.categories = resp.categories;
      this.products = resp.products;
    })

    this.loadForm();
  }

  loadForm() {
    this.formGroup = this.fb.group({
      code: [null, 
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.min(1),
          Validators.maxLength(250),
        ])
      ],
      discount: [null,
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.min(1),
        ])
      ],
      numUse: [null,
        Validators.compose([
          Validators.nullValidator,
          Validators.minLength(1),
          Validators.min(1),
        ])
      ],
    });
  }
    
  checkedTypeDiscount(value){
    this.typeDiscount = value;
  }
  checkedTypeCount(value){
    this.typeCount = value;
  }
  checkedTypeSegment(value){
    this.typeSegment = value;
    this.categoriesSelected = [];
    this.productsSelected = [];
  }

 addProductOrCategorie() {
  if (this.typeSegment == 1) {
    const INDEX = this.productsSelected.findIndex(item => item._id == this.product);
    if (INDEX != -1) {
      this.toaster.open(NoticyAlertComponent, { text: `danger-'UPPS! EL PRODUCTO YA EXISTE, SELECCIONA OTRO'` });
      return;
    } else {
      const PRODUCT_S = this.products.find(item => item._id == this.product);
      this.product = null;
      this.productsSelected.unshift(PRODUCT_S);
    }
  } else {
    const INDEX = this.categoriesSelected.findIndex(item => item._id == this.categorie);
    if (INDEX != -1) {
      this.toaster.open(NoticyAlertComponent, { text: `danger-'UPPS! LA CATEGORIA YA EXISTE, SELECCIONA OTRA'` });
      return;
    } else {
      const CATEGORIA_S = this.categories.find(item => item._id == this.categorie);
      this.categorie = null;
      this.categoriesSelected.unshift(CATEGORIA_S);
    }
  }
}

  removeProduct(product){
    let INDEX = this.productsSelected.findIndex(item => item._id == product._id);
    if(INDEX != -1){
      this.productsSelected.splice(INDEX,1);
    }
  }
  removeCategorie(categorie){
    let INDEX = this.categoriesSelected.findIndex(item => item._id == categorie._id);
    if(INDEX != -1){
      this.categoriesSelected.splice(INDEX,1);
    }
  }
  save(){

    // if(!this.code || !this.discount){
    //   this.toaster.open(NoticyAlertComponent,{text:`danger-'UPPS! ALGUNOS CAMPOS ESTAN VACIOS'`});
    //   return;
    // }
    if(this.typeCount == 2){
      if(this.num_use == 0){
        this.toaster.open(NoticyAlertComponent,{text:`danger-'UPPS! TIENES QUE DIGITAR EL NUMERO DE USOS'`});
        return;
      }
    }
    if(this.typeSegment == 1){
      if(this.productsSelected.length == 0){
        this.toaster.open(NoticyAlertComponent,{text:`danger-'UPPS! TIENES QUE SELECCIONAR AL MENOS UN PRODUCTO '`});
        return;
      }
    }
    if(this.typeSegment == 2){
      if(this.categoriesSelected.length == 0){
        this.toaster.open(NoticyAlertComponent,{text:`danger-'UPPS! TIENES QUE SELECCIONAR AL MENOS UNA CATEGORIA '`});
        return;
      }
    }

    let PRODUCTS = [];
    let CATEGORIES = [];

    this.productsSelected.forEach(element => {
      PRODUCTS.push({_id: element._id});
    });

    this.categoriesSelected.forEach(element => {
      CATEGORIES.push({_id: element._id});
    });

    let data = {
      code: this.formGroup.value.code,
      type_discount: this.typeDiscount,
      discount: this.formGroup.value.discount,
      type_count: this.typeCount,
      num_use: this.formGroup.value.numUse,
      type_segment: this.typeSegment,
      products: PRODUCTS,
      categories: CATEGORIES,
    };

    this._cuponService.createCupone(data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toaster.open(NoticyAlertComponent,{text:`danger-'${resp.message_text}'`});
        return;
      }else{
        this.toaster.open(NoticyAlertComponent,{text:`primary-'${resp.message_text}'`});
        this.productsSelected = [];
        this.categoriesSelected = [];
        this.code = null;
        this.typeDiscount = 1;
        this.discount = null;
        this.typeCount = 1;
        this.num_use = null;
        this.typeSegment = 1;
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
