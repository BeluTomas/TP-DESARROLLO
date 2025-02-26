import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../_services/cart.service';
import { EcommerceGuestService } from '../_services/ecommerce-guest.service';
import { Discount, Product, Variedad } from 'src/app/config/interface';

declare var $:any;
declare function LandingProductDetail():any;
declare function ModalProductDetail():any;
declare function alertDanger([]):any;
declare function alertWarning([]):any;
declare function alertSuccess([]):any;
@Component({
  selector: 'app-landing-product',
  templateUrl: './landing-product.component.html',
  styleUrls: ['./landing-product.component.css']
})
export class LandingProductComponent implements OnInit {

  slug:string = '';
  productSelected:Product | undefined;
  productSelectedModal:Product | undefined;
  relatedProducts:Product[] = [];
  variedadSelected:Variedad | undefined;

  discount_id:string = '';
  SaleFlash:Discount | undefined;

  REVIEWS:any[] = [];
  avgReview:number = 0;
  countReview:number = 0;
  constructor(
    public ecommerce_guest: EcommerceGuestService,
    public router: Router,
    public routerActived: ActivatedRoute,
    public cartService: CartService,
  ) { }

  ngOnInit(): void {
    console.log(this.ecommerce_guest._authService.user);
    this.routerActived.params.subscribe((resp) => {
      this.slug = resp["slug"];
    })
    this.routerActived.queryParams.subscribe((resp) => {
      this.discount_id = resp["_id"];
    })
    console.log(this.slug);
    this.ecommerce_guest.showLandingProduct(this.slug,this.discount_id).subscribe((resp:any) => {
      console.log(resp);
      this.productSelected = resp.product;
      this.relatedProducts = resp.related_products;
      this.SaleFlash = resp.SALE_FLASH;
      this.REVIEWS = resp.REVIEWS;
      this.avgReview = resp.AVG_REVIEW;
      this.countReview = resp.COUNT_REVIEW;
      setTimeout(() => {
        LandingProductDetail();
      }, 50);
    })
  }
  OpenModal(bestProd:Product,FlashSale:Discount | undefined = undefined){
    this.productSelectedModal = undefined;

    setTimeout(() => {
      this.productSelectedModal = bestProd;
      this.productSelectedModal.FlashSale = FlashSale;
      setTimeout(() => {
        ModalProductDetail();
      }, 50);
    }, 100);

  }
  getDiscount(){
    let discount = 0;
    if(this.productSelected && this.SaleFlash){
      if(this.SaleFlash.type_discount == 1){
        return this.SaleFlash.discount*this.productSelected.price_usd*0.01;
      }else{
        return this.SaleFlash.discount;
      }
    }
   return discount;
  }
  getCalNewPrice(product:any){
    // if(this.FlashSale.type_discount == 1){
    //   return product.price_usd - product.price_usd*this.FlashSale.discount*0.01;
    // }else{
    //   return product.price_usd - this.FlashSale.discount;
    // }
    return 0;
  }
  selectedVariedad(variedad:any){
    this.variedadSelected = variedad;
  }
  addCart(product:any) {
    console.log(product);
    if(!this.cartService._authService.user){
      alertDanger("NECESITAS AUTENTICARTE PARA PODER AGREGAR EL PRODUCTO AL CARRITO");
      return;
    }
    if($("#qty-cart").val() == 0){
      alertDanger("NECESITAS AGREGAR UNA CANTIDAD MAYOR A 0  DEL PRODUCTO PARA EL CARRITO");
      return;
    }
    if(this.productSelected && this.productSelected.type_inventario == 2){
      if(!this.variedadSelected){
        alertDanger("NECESITAS SELECCIONAR UNA VARIEDAD PARA EL PRODUCTO");
        return;
      }
      if(this.variedadSelected){
        if(this.variedadSelected.stock < $("#qty-cart").val()){
          alertDanger("NECESITAS AGREGAR UNA CANTIDAD MENOR PORQUE NO SE TIENE EL STOCK SUFICIENTE");
          return;
        }
      }
    }
    if(!this.productSelected){
      return;
    }
    let data = {
      user: this.cartService._authService.user._id,
      product: this.productSelected._id,
      type_discount: this.SaleFlash ? this.SaleFlash.type_discount : null,
      discount: this.SaleFlash ? this.SaleFlash.discount : 0,
      cantidad:  $("#qty-cart").val(),
      variedad: this.variedadSelected ? this.variedadSelected._id : null,
      code_cupon: null,
      code_discount: this.SaleFlash ? this.SaleFlash._id : null,
      price_unitario: this.productSelected.price_usd,
      subtotal: this.productSelected.price_usd - this.getDiscount(),//*$("#qty-cart").val()
      total: (this.productSelected.price_usd - this.getDiscount())*$("#qty-cart").val(),
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
}
