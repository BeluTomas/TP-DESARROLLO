import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CartService } from '../../ecommerce-guest/_services/cart.service';
import { EcommerceAuthService } from '../_services/ecommerce-auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AddressClient, AddressClientR, Cart } from 'src/app/config/interface';

declare function alertDanger([]):any;
declare function alertSuccess([]):any;
declare var paypal:any;
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  @ViewChild('paypal',{static: true}) paypalElement?: ElementRef;

  listAdressClient:AddressClient[] = [];
  name:string = '';
  surname:string = '';
  address:string = '';
  referencia:string = '';
  region:string = '';
  ciudad:string = '';
  telefono:string = '';
  email:string = '';
  nota:string = '';
  pais:string = 'Argentina';

  addressClientSelected:AddressClient | undefined;

  listCarts:Cart[] = [];
  totalCarts:number = 0;

  formGroup: FormGroup | undefined;
  constructor(
    public authEcommerce: EcommerceAuthService,
    public cartService: CartService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.authEcommerce.listAddressClient(this.authEcommerce.authService.user._id).subscribe((resp:any) => {
      console.log(resp);
      this.listAdressClient = resp.address_client;
    })

    this.loadForm();

    this.cartService.currentDataCart$.subscribe((resp) => {
      console.log(resp);
      this.listCarts = resp;
      this.totalCarts = this.listCarts.reduce((sum:number,item:Cart) => sum + item.total, 0);
    })

    paypal.Buttons({
      // optional styling for buttons
      // https://developer.paypal.com/docs/checkout/standard/customize/buttons-style-guide/
      style: {
        color: "gold",
        shape: "rect",
        layout: "vertical"
      },
      // set up the transaction
      createOrder: (data:any, actions:any) => {
          // pass in any options from the v2 orders create call:
          // https://developer.paypal.com/api/orders/v2/#orders-create-req-body
          if(this.listCarts.length == 0){
            alertDanger("NO SE PUEDE PROCESAR UNA ORDEN SIN NINGUN ELEMENTO DENTRO DEL CARRITO");
            return;
          }
          if(!this.addressClientSelected){
            alertDanger("NECESITAS SELECCIONAR UNA DIRECIÓN DE ENVIO");
            return;
          }
          const createOrderPayload = {
            purchase_units: [
              {
                amount: {
                    description: "COMPRAR POR EL ECOMMERCE",
                    value: this.totalCarts
                }
              }
            ]
          };

          return actions.order.create(createOrderPayload);
      },

      // finalize the transaction
      onApprove: async (data:any, actions:any) => {
          
          let Order = await actions.order.capture();
  
          // Order.purchase_units[0].payments.captures[0].id

          let sale = {
            user: this.authEcommerce.authService.user._id,
            currency_payment: 'USD',
            method_payment: 'PAYPAL',
            n_transacccion: Order.purchase_units[0].payments.captures[0].id,
            total: this.totalCarts,
          };

          let sale_address = {
              name: this.name,
              surname: this.surname,
              pais: this.pais,
              address: this.address,
              referencia: this.referencia,
              ciudad: this.ciudad,
              region: this.region,
              telefono: this.telefono,
              email: this.email,
              nota: this.nota,
          }

          this.authEcommerce.registerSale({sale: sale, sale_address: sale_address}).subscribe((resp:any) => {
            console.log(resp);
            alertSuccess(resp.message);
            location.reload();
          })
          // return actions.order.capture().then(captureOrderHandler);
      },

      // handle unrecoverable errors
      onError: (err:any) => {
          console.error('An error prevented the buyer from checking out with PayPal');
      }
    }).render(this.paypalElement?.nativeElement);
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
      pais: ['Argentina', 
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
      user: [this.authEcommerce.authService.user._id]
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
    //   user: this.authEcommerce.authService.user._id,
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
    this.authEcommerce.registerAddressClient(this.formGroup?.value).subscribe((resp:any) => {
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
    //   user: this.authEcommerce.authService.user._id,
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
    data._id = this.addressClientSelected?._id;
    this.authEcommerce.updateAddressClient(data).subscribe((resp:AddressClientR) => {
      console.log(resp);
      let INDEX = this.listAdressClient.findIndex((item:any) => item._id == this.addressClientSelected?._id);
      this.listAdressClient[INDEX] = resp.address_client;
      if(resp.message){
        alertSuccess(resp.message);
      }
    })
  }

  resetFormulario(){
    this.name = '';
    this.surname = '';
    this.address = '';
    this.referencia = '';
    this.region = '';
    this.ciudad = '';
    this.telefono = '';
    this.email = '';
    this.nota = '';
  }
  newAddress(){
    // this.resetFormulario();
    this.loadForm();
    this.addressClientSelected = undefined;
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
      name: this.addressClientSelected?.name,
      surname: this.addressClientSelected?.surname,
      address: this.addressClientSelected?.address,
      referencia: this.addressClientSelected?.referencia,
      region: this.addressClientSelected?.region,
      ciudad: this.addressClientSelected?.ciudad,
      telefono: this.addressClientSelected?.telefono,
      email: this.addressClientSelected?.email,
      nota: this.addressClientSelected?.nota,
      pais: this.addressClientSelected?.pais,
    });
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
}
