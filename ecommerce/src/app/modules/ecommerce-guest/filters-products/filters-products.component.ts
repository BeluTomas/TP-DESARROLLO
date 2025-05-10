import { Component, OnInit } from '@angular/core';
import { EcommerceGuestService } from '../_services/ecommerce-guest.service';
import { CartService } from '../_services/cart.service';
import { Router } from '@angular/router';
import { Categorie, ConfiaAll, Product, Variedad } from 'src/app/config/interface';

declare function priceRangeSlider():any;
declare var $:any;
declare function alertDanger([]):any;
declare function alertSuccess([]):any;
declare function ModalProductDetail():any;
@Component({
  selector: 'app-filters-products',
  templateUrl: './filters-products.component.html',
  styleUrls: ['./filters-products.component.css']
})
export class FiltersProductsComponent implements OnInit {

  categories:Categorie[] = [];
  variedades:Variedad[] = [];

  categoriesSelecteds:string[] = [];
  isDiscount:number = 1; // 1 es normal y 2 es producto con descuento 
  variedadSelected:Variedad | undefined;
  products:Product[] = [];
  productSelected:Product | undefined;
  constructor(
    public ecommerceGuest:EcommerceGuestService,
    public cartService: CartService,
    public router: Router,
  ) { }

  ngOnInit(): void {
    this.ecommerceGuest.configInitial().subscribe((resp:ConfiaAll) => {
      console.log(resp);
      this.categories = resp.categories;
      this.variedades = resp.variedades;
    })
    setTimeout(() => {
      // priceRangeSlider();
      $('#slider-range').slider({
        range: true,
        min: 0,
        max: 5000,
        values: [0, 1000],
        slide: (event:any, ui:any) => {
            $('#amount').val('$' + ui.values[0] + '  $' + ui.values[1]);
            $('#amount-min').val(ui.values[0]);  
            $('#amount-max').val(ui.values[1]); 
            this.filterProduct();
        }
    });
      $('#amount').val('$' + $('#slider-range').slider('values', 0) +
          '  $' + $('#slider-range').slider('values', 1));
      $('#amount-min').val($('#slider-range').slider('values', 0));  
      $('#amount-max').val($('#slider-range').slider('values', 1)); 
    }, 50);
    this.filterProduct();
  }

  addCategorie(categorie:any){
    let index = this.categoriesSelecteds.findIndex((item:string) => item == categorie._id);
    if(index != -1){
      this.categoriesSelecteds.splice(index,1);
    }else{
      this.categoriesSelecteds.push(categorie._id);
    }
    this.filterProduct();
  }
  selectedDiscount(value:number){
    this.isDiscount = value;
    this.filterProduct();
  }
  selectedVariedad(variedad:any){
    this.variedadSelected = variedad;
    this.filterProduct();
  }

  filterProduct(){
    let data = {
      categoriesSelecteds: this.categoriesSelecteds,
      is_discount: this.isDiscount,
      variedad_selected: this.variedadSelected && this.variedadSelected._id ? this.variedadSelected : null,
      price_min: $("#amount-min").val(),
      price_max: $("#amount-max").val(),
    }
    this.ecommerceGuest.filterProduct(data).subscribe((resp:any) => {
      console.log(resp);
      this.products = resp.products;
    })
  }

  getRouterDiscount(product:any){
    if(product.campaing_discount){
      return {_id: product.campaing_discount._id};
    }
    return {};
  }

  getDiscountProduct(product:any){
    if(product.campaing_discount){
      if(product.campaing_discount.type_discount == 1){// 1 es porcentaje
        return product.price_usd*product.campaing_discount.discount*0.01;
      }else{// 2 es moneda
        return product.campaing_discount.discount;
      }
    }
    return 0;
  }

  addCart(product:any) {
    if(!this.cartService._authService.user){
      alertDanger("NECESITAS AUTENTICARTE PARA PODER AGREGAR EL PRODUCTO AL CARRITO");
      return;
    }
    if($("#qty-cart").val() == 0){
      alertDanger("NECESITAS AGREGAR UNA CANTIDAD MAYOR A 0  DEL PRODUCTO PARA EL CARRITO");
      return;
    }
    if(product.type_inventario == 2){
      this.router.navigateByUrl("/landing-producto/"+product.slug);
    }
    let type_discount = null;
    let discount = 0;
    let code_discount = null;
    if(product.campaing_discount){
      type_discount = product.campaing_discount.type_discount;
      discount = product.campaing_discount.discount;
      code_discount = product.campaing_discount._id;
    }
    let data = {
      user: this.cartService._authService.user._id,
      product: product._id,
      type_discount: type_discount,
      discount: discount,
      cantidad:  1,
      variedad: null,
      code_cupon: null,
      code_discount: code_discount,
      price_unitario: product.price_usd,
      subtotal: product.price_usd - this.getDiscountProduct(product),//*1
      total: (product.price_usd - this.getDiscountProduct(product))*1,
    }
    this.cartService.registerCart(data).subscribe((resp:any) => {
      if(resp.message == 403){
        alertDanger(resp.message_text);
        return;
      }else{
        this.cartService.changeCart(resp.cart);
        alertSuccess("EL PRODUCTO SE HA AGREGADO EXITOSAMENTE AL CARRITO");
      }
    },error => {
      console.log(error);
      if(error.error.message == "EL TOKEN NO ES VALIDO"){
        this.cartService._authService.logout();
      }
    })
  }

  OpenModal(product:Product | undefined){
    this.productSelected = undefined;

    setTimeout(() => {
      this.productSelected = product;
      setTimeout(() => {
        ModalProductDetail();
      }, 50);
    }, 100);

  }

  getCalNewPrice(product:Product){
    if(product.campaing_discount){
      if(product.campaing_discount.type_discount == 1){
        return product.price_usd - product.price_usd*product.campaing_discount.discount*0.01;
      }else{
        return product.price_usd - product.campaing_discount.discount;
      }
    }
    return 0;
  }
}
