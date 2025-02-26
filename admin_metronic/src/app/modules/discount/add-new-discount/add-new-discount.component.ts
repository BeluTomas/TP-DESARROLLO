import { Component, OnInit } from '@angular/core';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { DiscountService } from '../_services/discount.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Product } from '../../product/interface/product.interface';
import { Categorie } from '../../categories/interface/categorie.interface';
import { ConfiaAll } from '../interaface/discount.interface';

@Component({
  selector: 'app-add-new-discount',
  templateUrl: './add-new-discount.component.html',
  styleUrls: ['./add-new-discount.component.scss']
})
export class AddNewDiscountComponent implements OnInit {

  isLoading$:Observable<boolean>;

  products:Product[] = [];
  categories:Categorie[] = [];
  product:string = "";
  categorie:string = "";

  code:string = null;
  typeDiscount:number = 1;
  discount:number = 0;
  typeCount:number = 1;
  numUse:number = 0;
  typeSegment:number = 1;
  productsSelected:Product[] = [];
  categoriesSelected:Categorie[] = [];
  // start_date:any = null;
  // end_date:any = null;

  // 
  type_campaign:number = 1;
  // 
  formGroup: FormGroup;
  isLoading:Boolean = false;
  constructor(
    public _discountService:DiscountService,
    public toaster:Toaster,
     private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this._discountService.isLoading$;
    
    this._discountService.discountConfig().subscribe((resp:ConfiaAll) => {
      console.log(resp);
      this.categories = resp.categories;
      this.products = resp.products;
    })

    this.loadForm();
  }

  loadForm() {
    this.formGroup = this.fb.group({
      discount: [null,
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.min(1),
        ])
      ],
      startDate: [null,
        Validators.compose([
          Validators.required,
        ])
      ],
      endDate: [null,
        Validators.compose([
          Validators.required,
        ])
      ],
    });
  }

  checkedTypeCampaign(value){
    this.type_campaign = value;
    this.checkedTypeSegment(1);
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
  save(){

    // if(!this.discount || !this.start_date || !this.end_date){
    //   this.toaster.open(NoticyAlertComponent,{text:`danger-'UPPS ! ALGUNOS CAMPOS ESTAN VACIOS'`});
    //   return;
    // }
  
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
    let productS = [];
    let categorieS = [];
    this.productsSelected.forEach(element => {
      PRODUCTS.push({_id: element._id});
      productS.push(element._id);
    });

    this.categoriesSelected.forEach(element => {
      CATEGORIES.push({_id: element._id});
      categorieS.push(element._id);
    });

    let data = {
      type_campaign: this.type_campaign,
      type_discount: this.typeDiscount,
      discount: this.formGroup.value.discount,
      start_date: this.formGroup.value.startDate,
      end_date: this.formGroup.value.endDate,
      start_date_num: new Date(this.formGroup.value.startDate).getTime(),
      end_date_num: new Date(this.formGroup.value.endDate).getTime(),
      type_segment: this.typeSegment,
      products: PRODUCTS,
      categories: CATEGORIES,
      product_s: productS,
      categorie_s: categorieS,
    };

    this._discountService.createDiscount(data).subscribe((resp:any) => {
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
        this.numUse = null;
        this.typeSegment = 1;
        // this.start_date = null;
        // this.end_date = null;
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
