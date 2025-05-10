import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { CuponeService } from '../_services/cupone.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Product } from '../../product/interface/product.interface';
import { Categorie } from '../../categories/interface/categorie.interface';
import { Cupone } from '../interaface/cupone.interface';

@Component({
  selector: 'app-edit-new-cupone',
  templateUrl: './edit-new-cupone.component.html',
  styleUrls: ['./edit-new-cupone.component.scss']
})
export class EditNewCuponeComponent implements OnInit {

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

  cuponeId:string = null;
  cuponeSelected:Cupone = null;
  state:number = 1;
  formGroup: FormGroup;
  isLoading:Boolean = false;
  constructor(
    public _cuponService:CuponeService,
    public toaster:Toaster,
    public activerouter:ActivatedRoute,
     private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this._cuponService.isLoading$;
    this.activerouter.params.subscribe((resp:any) => {
      this.cuponeId = resp["id"];
    });
    
    this._cuponService.cuponConfig().subscribe((resp:any) => {
      console.log(resp);
      this.categories = resp.categories;
      this.products = resp.products;
      this.showCupon();
    })
  }
  showCupon(){
    this._cuponService.showCupon(this.cuponeId).subscribe((resp:any) => {
      console.log(resp);
      this.cuponeSelected = resp.cupon;

      // this.code = this.cuponeSelected.code;
      this.typeDiscount = this.cuponeSelected.type_discount;
      // this.discount = this.cuponeSelected.discount;
      this.typeCount = this.cuponeSelected.type_count;
      // this.num_use = this.cuponeSelected.num_use;
      this.typeSegment = this.cuponeSelected.type_segment;
      this.state = this.cuponeSelected.state ? this.cuponeSelected.state : 1;

      this.loadForm();
      if(this.typeSegment == 1){
        this.cuponeSelected.products.forEach(product_s => {
          this.products.forEach(product => {
            if(product._id == product_s._id){
              this.productsSelected.push(product);
            }
          });
        });
        console.log(this.productsSelected);
      }else{
        this.cuponeSelected.categories.forEach(product_s => {
          this.categories.forEach(product => {
            if(product._id == product_s._id){
              this.categoriesSelected.push(product);
            }
          });
        });
        console.log(this.categoriesSelected);
      }

    });
  }

  loadForm() {
    this.formGroup = this.fb.group({
      code: [this.cuponeSelected.code, 
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.min(1),
          Validators.maxLength(250),
        ])
      ],
      discount: [this.cuponeSelected.discount,
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.min(1),
        ])
      ],
      num_use: [this.cuponeSelected.num_use,
        Validators.compose([
          Validators.nullValidator,
        ])
      ],
      state: [this.cuponeSelected.state]
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

  addProductOrCategorie(){
    if(this.typeSegment == 1){
      let INDEX = this.productsSelected.findIndex(item => item._id == this.product);
      if(INDEX != -1){
        this.toaster.open(NoticyAlertComponent,{text:`danger-'UPPS ! EL PRODUCTO YA EXISTE, SELECCIONA OTRO'`});
        return;
      }else{
        let PRODUCT_S = this.products.find(item => item._id == this.product);
        this.product = null;
        this.productsSelected.unshift(PRODUCT_S);
      }
    }else{
      let INDEX = this.categoriesSelected.findIndex(item => item._id == this.categorie);
      if(INDEX != -1){
        this.toaster.open(NoticyAlertComponent,{text:`danger-'UPPS ! LA CATEGORIA YA EXISTE, SELECCIONA OTRO'`});
        return;
      }else{
        let CATEGORIA_S = this.categories.find(item => item._id == this.categorie);
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
  update(){

    // if(!this.code || !this.discount){
    //   this.toaster.open(NoticyAlertComponent,{text:`danger-'UPPS ! ALGUNOS CAMPOS ESTAN VACIOS'`});
    //   return;
    // }
    if(this.typeCount == 2){
      if(this.num_use == 0){
        this.toaster.open(NoticyAlertComponent,{text:`danger-'UPPS ! TIENES QUE DIGITAR EL NUMERO DE USOS'`});
        return;
      }
    }
    if(this.typeSegment == 1){
      if(this.productsSelected.length == 0){
        this.toaster.open(NoticyAlertComponent,{text:`danger-'UPPS ! TIENES QUE SELECCIONAR UN PRODUCTO AL MENOS'`});
        return;
      }
    }
    if(this.typeSegment == 2){
      if(this.categoriesSelected.length == 0){
        this.toaster.open(NoticyAlertComponent,{text:`danger-'UPPS ! TIENES QUE SELECCIONAR UNA CATEGORIA AL MENOS'`});
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
      _id: this.cuponeId,
      code: this.formGroup.value.code,
      type_discount: this.typeDiscount,
      discount: this.formGroup.value.discount,
      type_count: this.typeCount,
      num_use: this.formGroup.value.num_use,
      type_segment: this.typeSegment,
      // state: this.state,
      products: PRODUCTS,
      categories: CATEGORIES,
      state: this.formGroup.value.state,
    };

    this._cuponService.updateCupone(data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toaster.open(NoticyAlertComponent,{text:`danger-'${resp.message_text}'`});
        return;
      }else{
        this.toaster.open(NoticyAlertComponent,{text:`primary-'${resp.message_text}'`});
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
