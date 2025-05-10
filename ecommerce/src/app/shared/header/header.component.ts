import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Cart, CartL, CartR, Product } from 'src/app/config/interface';
import { CartService } from 'src/app/modules/ecommerce-guest/_services/cart.service';

declare function headerIconToggle():any;
declare var $:any;
declare function alertDanger([]):any;
declare function alertSuccess([]):any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,AfterViewInit {

  listCarts:Cart[] = [];

  totalCarts:number = 0;
  user:any;

  searchProduct:string = '';
  productsSearch:Product[] = [];

  source:any;
  @ViewChild("filter") filter?:ElementRef;
  
  constructor(
    public router: Router,
    public cartService: CartService,
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      headerIconToggle();
    }, 50);
    this.user = this.cartService._authService.user;
    this.cartService.currentDataCart$.subscribe((resp) => {
      console.log(resp);
      this.listCarts = resp;
      this.totalCarts = this.listCarts.reduce((sum:number,item:Cart) => sum + item.total, 0);
    })
    if(this.cartService._authService.user){
      this.cartService.lisCarts(this.cartService._authService.user._id).subscribe((resp:CartL) => {
        console.log(resp);
        resp.carts.forEach((cart:Cart) => {
          this.cartService.changeCart(cart);
        });
      })
    }
  }

  ngAfterViewInit(): void {
    this.source = fromEvent(this.filter?.nativeElement, "keyup");
    this.source.pipe(debounceTime(500)).subscribe((c:any) => {
      let data = {
        searchProduct: this.searchProduct,
      }
      if(this.searchProduct.length > 1){
        this.cartService.searchProduct(data).subscribe((resp:any) => {
          console.log(resp);
          this.productsSearch = resp.products;
        })
      }
    })
  }

  searchProductTT(){
    let data = {
      searchProduct: this.searchProduct,
    }
    if(this.searchProduct.length > 1){
      this.cartService.searchProduct(data).subscribe((resp:any) => {
        console.log(resp);
        this.productsSearch = resp.products;
      })
    }
  }

  isHome(){
    return this.router.url == "" || this.router.url == "/" ? true : false;
  }

  logout(){
    this.cartService._authService.logout();
  }

  getRouterDiscount(product:Product){
    if(product.campaing_discount){
      return {_id: product.campaing_discount._id};
    }
    return {};
  }

  getDiscountProduct(product:Product){
    if(product.campaing_discount){
      if(product.campaing_discount.type_discount == 1){
        return product.price_usd*product.campaing_discount.discount*0.01;
      }else{
        return product.campaing_discount.discount;
      }
    }
    return 0;
  }

  removeCart(cart:Cart){
    this.cartService.deleteCart(cart._id).subscribe((resp:any) =>{
      console.log(resp);
      this.cartService.removeItemCart(cart);
    })
  }

  addCart(product:Product) {
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
    this.cartService.registerCart(data).subscribe((resp:CartR) => {
      if(resp.message == 403 && resp.message_text){
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
