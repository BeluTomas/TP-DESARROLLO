import { Component, OnInit } from '@angular/core';
import { HomeService } from './_services/home.service';
import { CartService } from '../ecommerce-guest/_services/cart.service';
import { Router } from '@angular/router';
import { Categorie, Discount, HomeData, Product, Slider } from 'src/app/config/interface';

declare var $:any;
declare function HOMEINITTEMPLATE([]):any;
declare function ModalProductDetail():any;
declare function alertDanger([]):any;
declare function alertSuccess([]):any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  sliders:Slider[] = [];
  categories:Categorie[] = [];
  bestProducts:Product[]=[];
  ourProducts:Product[] = [];
  productSelected:Product | undefined;
  flashSale:Discount | undefined;
  flashProductList:Product[] = [];
  constructor(
    public homeService: HomeService,
    public cartService: CartService,
    public router:Router,
  ) { }

  ngOnInit(): void {

    let TIME_NOW = new Date().getTime();
    this.homeService.listHome(TIME_NOW).subscribe((resp:HomeData) => {
      console.log(resp,"1");
      this.sliders =resp.sliders;
      this.categories = resp.categories;
      this.bestProducts = resp.best_products;
      this.ourProducts = resp.our_products;
      this.flashSale = resp.FlashSale;
      this.flashProductList = resp.campaign_products;
      setTimeout(() => {
        if(this.flashSale){
          var eventCounter = $(".sale-countdown");
          let PARSE_DATE = new Date(this.flashSale.end_date);
          // console.log(PARSE_DATE.getMonth(),PARSE_DATE.getDate());
          let DATE = PARSE_DATE.getFullYear() + "/"+ (PARSE_DATE.getMonth()+1) + "/" + (PARSE_DATE.getDate()+1);
            if (eventCounter.length) {
                eventCounter.countdown(DATE, function(e:any) {
                  eventCounter.html(
                        e.strftime(
                            "<div class='countdown-section'><div><div class='countdown-number'>%-D</div> <div class='countdown-unit'>Day</div> </div></div><div class='countdown-section'><div><div class='countdown-number'>%H</div> <div class='countdown-unit'>Hrs</div> </div></div><div class='countdown-section'><div><div class='countdown-number'>%M</div> <div class='countdown-unit'>Min</div> </div></div><div class='countdown-section'><div><div class='countdown-number'>%S</div> <div class='countdown-unit'>Sec</div> </div></div>"
                        )
                    );
                });
          }
        }

        HOMEINITTEMPLATE($);
      }, 50);
    });

  }

  OpenModal(bestProd:Product,FlashSale:Discount | undefined = undefined){
    this.productSelected = undefined;

    setTimeout(() => {
      this.productSelected = bestProd;
      this.productSelected.FlashSale = FlashSale;
      setTimeout(() => {
        ModalProductDetail();
      }, 50);
    }, 100);

  }

  getCalNewPrice(product:Product){
    if(this.flashSale){
      if(this.flashSale.type_discount == 1){
        return product.price_usd - product.price_usd*this.flashSale.discount*0.01;
      }else{
        return product.price_usd - this.flashSale.discount;
      }
    }
    return product.price_usd - 0;
  }

  getDiscountProduct(bestProd:Product,is_sale_flash=null){
    if(this.flashSale){
      if(is_sale_flash){
        if(this.flashSale.type_discount == 1){// 1 es porcentaje
          return bestProd.price_usd*this.flashSale.discount*0.01;
        }else{// 2 es moneda
          return this.flashSale.discount;
        }
      }else{
        if(bestProd.campaing_discount){
          if(bestProd.campaing_discount.type_discount == 1){// 1 es porcentaje
            return bestProd.price_usd*bestProd.campaing_discount.discount*0.01;
          }else{// 2 es moneda
            return bestProd.campaing_discount.discount;
          }
        }
      }
    }
    return 0;
  }

  getRouterDiscount(bestProd:any){
    if(bestProd.campaing_discount){
      return {_id: bestProd.campaing_discount._id};
    }
    return {};
  }

  addCart(product:any,is_sale_flash:any = null) {
    console.log(product);
    if(!this.cartService._authService.user){
      alertDanger("NECESITAS AUTENTICARTE PARA PODER AGREGAR EL PRODUCTO AL CARRITO");
      return;
    }
    if($("#qty-cart").val() == 0){
      alertDanger("NECESITAS AGREGAR UNA CANTIDAD MAYOR A 0  DEL PRODUCTO PARA EL CARRITO");
      return;
    }
    if(product.type_inventario == 2){
      let LINK_DISCOUNT = "";
      if(is_sale_flash){
        LINK_DISCOUNT = "?_id="+this.flashSale?._id;
      }else{
        if(product.campaing_discount){
          LINK_DISCOUNT = "?_id="+product.campaing_discount._id;
        }
      }
      this.router.navigateByUrl("/landing-producto/"+product.slug+LINK_DISCOUNT);
    }
    let type_discount = null;
    let discount = 0;
    let code_discount = null;
    if(is_sale_flash){
      type_discount = this.flashSale?.type_discount;
      discount = this.flashSale?.discount ?? 0;
      code_discount = this.flashSale?._id;
    }else{
      if(product.campaing_discount){
        type_discount = product.campaing_discount.type_discount;
        discount = product.campaing_discount.discount;
        code_discount = product.campaing_discount._id;
      }
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
      subtotal: product.price_usd - this.getDiscountProduct(product,is_sale_flash),//*1
      total: (product.price_usd - this.getDiscountProduct(product,is_sale_flash))*1,
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
