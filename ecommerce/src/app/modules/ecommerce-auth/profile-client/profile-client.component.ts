import { Component, OnInit } from '@angular/core';
import { EcommerceAuthService } from '../_services/ecommerce-auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProfileClientS, SaleDetailOrder, SaleOrder } from 'src/app/config/interface';

declare function alertDanger([]):any;
declare function alertSuccess([]):any;
@Component({
  selector: 'app-profile-client',
  templateUrl: './profile-client.component.html',
  styleUrls: ['./profile-client.component.css']
})
export class ProfileClientComponent implements OnInit {

  sale_orders:any = []

  is_detail_sale:any = false;

  order_selected:any = null;
  //ADDRESS
  listAdressClient:any = [];
  name:any = null;
  surname:any = null;
  address:any = null;
  referencia:any = null;
  region:any = null;
  ciudad:any = null;
  telefono:any = null;
  email:any = null;
  nota:any = null;
  pais:any = 'Argentina'; 
  addressClientSelected:any = null;

  // datos del cliente
  name_c:any = null;
  surname_c:any = null;
  email_c:any = null;
  password:any = null;
  passwordRepet:any = null;
  // Review
  cantidad:any = 0;
  description:any = null;
  saleDetailSelected:SaleDetailOrder | undefined;
  formGroup: FormGroup | undefined;
  formGroup2: FormGroup | undefined;
  constructor(
    public authEcommerceService:EcommerceAuthService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.showProfileClient();
    this.name_c = this.authEcommerceService.authService.user.name ;
    this.surname_c = this.authEcommerceService.authService.user.surname ;
    this.email_c = this.authEcommerceService.authService.user.email;

    this.loadForm();
    this.loadForm2();
  }
  showProfileClient(){
    let data = {
      user_id: this.authEcommerceService.authService.user._id,
    }
    this.authEcommerceService.showProfileClient(data).subscribe((resp:ProfileClientS) => {
      console.log(resp);
      this.sale_orders = resp.sale_orders;
      this.listAdressClient = resp.address_client;
    })
  }

  getDate(date:any){
    let newDate = new Date(date);

    return `${newDate.getFullYear()}/${newDate.getMonth() + 1}/${newDate.getDate()}`;
  }

  viewDetailSale(order:SaleOrder){
    this.is_detail_sale = true;
    this.order_selected = order;
  }

  goHome(){
    this.is_detail_sale = false;
    this.order_selected = null;
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
      surname: [null,
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.min(1),
          Validators.maxLength(250),
        ])
      ],
      email: [null,
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(1),
          Validators.min(1),
          Validators.maxLength(250),
        ])
      ],
      address: [null, 
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.min(1),
          Validators.maxLength(250),
        ])
      ],
      region: [null, 
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.min(1),
          Validators.maxLength(35),
        ])
      ],
      ciudad: [null, 
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.min(1),
          Validators.maxLength(35),
        ])
      ],
      pais: [null, 
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.min(1),
          Validators.maxLength(35),
        ])
      ],
      telefono: [null, 
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.min(1),
          Validators.maxLength(25),
        ])
      ],
      nota: [null],
      referencia: [null],
      user: [this.authEcommerceService.authService.user._id]
    });
  }

  loadForm2() {
    this.formGroup2 = this.fb.group({
      name: [this.authEcommerceService.authService.user.name, 
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.min(1),
          Validators.maxLength(250),
        ])
      ],
      surname: [this.authEcommerceService.authService.user.surname,
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.min(1),
          Validators.maxLength(250),
        ])
      ],
      email: [this.authEcommerceService.authService.user.email,
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
      passwordRepet: [null,
        Validators.compose([
          Validators.nullValidator,
          Validators.minLength(6),
          Validators.min(6),
          Validators.maxLength(250),
        ])
      ],
      _id: [this.authEcommerceService.authService.user._id],
    });
  }

  store(){
    if(this.addressClientSelected){
      this.updateAddress();
    }else{
      this.registerAddress();
    }
  }

  registerAddress(){
    // if(!this.name ||
    //   !this.surname
    //   || !this.address
    //   || !this.region
    //   || !this.ciudad
    //   || !this.telefono
    //   || !this.email ||
    //   !this.pais){
    //   alertDanger("NECESITAS INGRESAR LOS CAMPOS OBLIGATORIOS DE LA DIRECCIÓN");
    //   return;
    // }
    // let data = {
    //   user: this.authEcommerceService.authService.user._id,
    //   name: this.name,
    //   surname: this.surname,
    //   address: this.address,
    //   referencia: this.referencia,
    //   region: this.region,
    //   ciudad: this.ciudad,
    //   telefono: this.telefono,
    //   email: this.email,
    //   nota: this.nota,
    //   pais: this.pais,
    // };
    this.authEcommerceService.registerAddressClient(this.formGroup?.value).subscribe((resp:any) => {
      console.log(resp);
      this.listAdressClient.push(resp.address_client);
      alertSuccess(resp.message);
      this.loadForm();
    })
  }

  updateAddress(){
    // if(!this.name ||
    //   !this.surname
    //   || !this.address
    //   || !this.region
    //   || !this.ciudad
    //   || !this.telefono
    //   || !this.email ||
    //   !this.pais){
    //   alertDanger("NECESITAS INGRESAR LOS CAMPOS OBLIGATORIOS DE LA DIRECCIÓN");
    //   return;
    // }
    // let data = {
    //   _id: this.addressClientSelected._id,
    //   user: this.authEcommerceService.authService.user._id,
    //   name: this.name,
    //   surname: this.surname,
    //   address: this.address,
    //   referencia: this.referencia,
    //   region: this.region,
    //   ciudad: this.ciudad,
    //   telefono: this.telefono,
    //   email: this.email,
    //   nota: this.nota,
    //   pais: this.pais,
    // };
    let data = this.formGroup?.value;
    data._id = this.addressClientSelected._id;
    this.authEcommerceService.updateAddressClient(data).subscribe((resp:any) => {
      console.log(resp);
      let INDEX = this.listAdressClient.findIndex((item:any) => item._id == this.addressClientSelected._id);
      this.listAdressClient[INDEX] = resp.address_client;
      alertSuccess(resp.message);
    })
  }

  resetFormulario(){
    this.name = null;
    this.surname = null;
    this.address = null;
    this.referencia = null;
    this.region = null;
    this.ciudad = null;
    this.telefono = null;
    this.email = null;
    this.nota = null;
  }
  newAddress(){
    this.resetFormulario();
    this.addressClientSelected = null;
  }
  addressClientSelectedT(list_address:any){
    this.addressClientSelected = list_address;
    // this.name = this.addressClientSelected.name;
    // this.surname = this.addressClientSelected.surname;
    // this.address = this.addressClientSelected.address;
    // this.referencia = this.addressClientSelected.referencia;
    // this.region = this.addressClientSelected.region;
    // this.ciudad = this.addressClientSelected.ciudad;
    // this.telefono = this.addressClientSelected.telefono;
    // this.email = this.addressClientSelected.email;
    // this.nota = this.addressClientSelected.nota;
    // this.pais = this.addressClientSelected.pais;

    this.formGroup?.patchValue({
      name: this.addressClientSelected.name,
      surname: this.addressClientSelected.surname,
      address: this.addressClientSelected.address,
      referencia: this.addressClientSelected.referencia,
      region: this.addressClientSelected.region,
      ciudad: this.addressClientSelected.ciudad,
      telefono: this.addressClientSelected.telefono,
      email: this.addressClientSelected.email,
      nota: this.addressClientSelected.nota,
      pais: this.addressClientSelected.pais,
    });
  }

  updateProfileClient(){
    // passwordRepet
    if(this.formGroup2?.value.password){
      if(this.formGroup2?.value.password != this.formGroup2?.value.passwordRepet){
        alertDanger("LAS CONTRASEÑAS SON INCORRECTAS");
        return;
      }
    }
    // let data = {
    //   _id: this.authEcommerceService.authService.user._id,
    //   name:this.name_c,
    //   surname:this.surname_c,
    //   email:this.email_c,
    //   password: this.password,
    // };
    this.authEcommerceService.updateProfileClient(this.formGroup2?.value).subscribe((resp:any) => {
      console.log(resp);
      alertSuccess(resp.message)
      if(resp.user){
        localStorage.setItem("user",JSON.stringify(resp.user));
      }
    })
  }

  viewReview(sale_detail:SaleDetailOrder){
    console.log(sale_detail);
    this.saleDetailSelected = sale_detail;
    if(this.saleDetailSelected.review){
      this.cantidad =this.saleDetailSelected.review.cantidad;
      this.description =this.saleDetailSelected.review.description;
    }else{
      this.cantidad =  null;
      this.description = null;
    }
  }
  goDetail(){
    this.saleDetailSelected = undefined;
  }
  addCantidad(cantidad:number){
    this.cantidad = cantidad;
  }
  save(){
    if(this.saleDetailSelected && this.saleDetailSelected.review){
      this.updateReview();
    }else{
      this.saveReview();
    }
  }
  saveReview(){
    if(!this.cantidad || !this.description){
      alertDanger("TODOS LOS CAMPOS DEL FORMULARIO RESEÑA SON IMPORTANTES");
      return;
    }
    let data = {
      product: this.saleDetailSelected?.product._id,
      sale_detail:this.saleDetailSelected?._id,
      user: this.authEcommerceService.authService.user._id,
      cantidad: this.cantidad,
      description: this.description,
    }

    this.authEcommerceService.registerProfileClientReview(data).subscribe((resp:any) => {
      console.log(resp);
      if(this.saleDetailSelected){
        this.saleDetailSelected.review = resp.review;
      }
      alertSuccess(resp.message);
    })
  }

  updateReview(){
    if(!this.cantidad || !this.description){
      alertDanger("TODOS LOS CAMPOS DEL FORMULARIO RESEÑA SON IMPORTANTES");
      return;
    }
    let data = {
      _id: this.saleDetailSelected?.review._id,
      product: this.saleDetailSelected?.product._id,
      sale_detail:this.saleDetailSelected?._id,
      user: this.authEcommerceService.authService.user._id,
      cantidad: this.cantidad,
      description: this.description,
    }

    this.authEcommerceService.updateProfileClientReview(data).subscribe((resp:any) => {
      console.log(resp);
      if(this.saleDetailSelected){
        this.saleDetailSelected.review = resp.review;
      }
      alertSuccess(resp.message);
    })
  }

  logout(){
    this.authEcommerceService.authService.logout();
  }

  isControlValid(controlName: string): boolean {
    const control = this.formGroup?.controls[controlName];
    return (control?.valid && (control?.dirty || control?.touched)) ?? false;
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup?.controls[controlName];
    return (control?.invalid && (control?.dirty || control?.touched)) ?? false;
  }

  controlHasError(validation:any, controlName:any): boolean {
    const control = this.formGroup?.controls[controlName];
    return (control?.hasError(validation) && (control?.dirty || control?.touched)) ?? false;
  }

  isControlTouched(controlName:any): boolean {
    const control = this.formGroup?.controls[controlName];
    return (control?.dirty || control?.touched) ?? false;
  }

  isControlValid2(controlName: string): boolean {
    const control = this.formGroup2?.controls[controlName];
    return (control?.valid && (control?.dirty || control?.touched)) ?? false;
  }

  isControlInvalid2(controlName: string): boolean {
    const control = this.formGroup2?.controls[controlName];
    return (control?.invalid && (control?.dirty || control?.touched)) ?? false;
  }

  controlHasError2(validation:any, controlName:any): boolean {
    const control = this.formGroup2?.controls[controlName];
    return (control?.hasError(validation) && (control?.dirty || control?.touched)) ?? false;
  }

  isControlTouched2(controlName:any): boolean {
    const control = this.formGroup2?.controls[controlName];
    return (control?.dirty || control?.touched) ?? false;
  }
}
