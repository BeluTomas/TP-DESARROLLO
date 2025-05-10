import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { DiscountService } from '../_services/discount.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Product } from '../../product/interface/product.interface';
import { Categorie } from '../../categories/interface/categorie.interface';
import { ConfiaAll, Discount, DiscountL, DiscountR } from '../interaface/discount.interface';

@Component({
  selector: 'app-edit-new-discount',
  templateUrl: './edit-new-discount.component.html',
  styleUrls: ['./edit-new-discount.component.scss']
})
export class EditNewDiscountComponent implements OnInit {

  isLoading$:Observable<boolean>;

  products:Product[] = [];
  categories:Categorie[] = [];
  product:string = "";
  categorie:string = "";

  code:string = null;
  typeDiscount:number = 1;
  discount:number = 0;
  type_count:number = 1;
  num_use:number = 0;
  typeSegment:number = 1;
  productsSelected:Product[] = [];
  categoriesSelected:Categorie[] = [];
  // start_date:any = null;
  // end_date:any = null;
  // 
  discountId:string = null;
  discountSelected:Discount = null;
  typeCampaign:number = 1;
  // 
  formGroup: FormGroup;
  isLoading:Boolean = false;
  constructor(
    public _discountService:DiscountService,
    public toaster:Toaster,
    public activedrouter: ActivatedRoute,
    public datePipe: DatePipe,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this._discountService.isLoading$;
    this.activedrouter.params.subscribe((resp:any) => {
      this.discountId = resp["id"];
    })
    this._discountService.discountConfig().subscribe((resp:ConfiaAll) => {
      console.log(resp);
      this.categories = resp.categories;
      this.products = resp.products;
      this.showDiscount();
    })
  }
  showDiscount(){
    this._discountService.showDiscount(this.discountId).subscribe((resp:DiscountR) => {
      console.log(resp);
      this.discountSelected = resp.discount;
      this.typeDiscount = this.discountSelected.type_discount ;
      // this.discount = this.discountSelected.discount ;
      // productsSelected
      // categoriesSelected
      // this.start_date = this.formatDate(this.discountSelected.start_date) ;
      // this.end_date = this.formatDate(this.discountSelected.end_date);

      this.typeSegment = this.discountSelected.type_segment;
      this.typeCampaign = this.discountSelected.type_campaign ? this.discountSelected.type_campaign : 1;
      if(this.typeSegment == 1){
        this.discountSelected.products.forEach(product_selected => {
          this.products.forEach(product => {
            if(product._id == product_selected._id){
              this.productsSelected.push(product);
            }
          });
        });
      }else{
        this.discountSelected.categories.forEach(categorie_selected => {
          this.categories.forEach(categorie => {
            if(categorie._id == categorie_selected._id){
              this.categoriesSelected.push(categorie);
            }
          });
        });
      }
      this.loadForm();
    })
  }

  loadForm() {
    this.formGroup = this.fb.group({
      discount: [this.discountSelected.discount,
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.min(1),
        ])
      ],
      startDate: [this.formatDate(this.discountSelected.start_date),
        Validators.compose([
          Validators.required,
        ])
      ],
      endDate: [this.formatDate(this.discountSelected.end_date),
        Validators.compose([
          Validators.required,
        ])
      ],
    });
  }

  formatDate(date){
    return this.datePipe.transform(date,"yyyy-MM-dd",'UTC');
  }
  checkedTypeCampaign(value){
    this.typeCampaign = value;
    this.checkedTypeSegment(1);
  }
  checkedTypeDiscount(value){
    this.typeDiscount = value;
  }
  checkedTypeCount(value){
    this.type_count = value;
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
    let product_s = [];
    let categorie_s = [];
    this.productsSelected.forEach(element => {
      PRODUCTS.push({_id: element._id});
      product_s.push(element._id);
    });

    this.categoriesSelected.forEach(element => {
      CATEGORIES.push({_id: element._id});
      categorie_s.push(element._id);
    });

    let data = {
      _id: this.discountId,
      type_campaign: this.typeCampaign,
      type_discount: this.typeDiscount,
      discount: this.formGroup.value.discount,
      start_date: this.formGroup.value.startDate,
      end_date: this.formGroup.value.endDate,
      start_date_num: new Date(this.formGroup.value.startDate).getTime(),
      end_date_num: new Date(this.formGroup.value.endDate).getTime(),
      type_segment: this.typeSegment,
      products: PRODUCTS,
      categories: CATEGORIES,
      product_s: product_s,
      categorie_s: categorie_s,
    };

    this._discountService.updateDiscount(data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toaster.open(NoticyAlertComponent,{text:`danger-'${resp.message_text}'`});
        return;
      }else{
        this.toaster.open(NoticyAlertComponent,{text:`primary-'${resp.message_text}'`});
        // this.productsSelected = [];
        // this.categoriesSelected = [];
        // this.code = null;
        // this.type_discount = 1;
        // this.discount = null;
        // this.type_count = 1;
        // this.num_use = null;
        // this.type_segment = 1;
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
