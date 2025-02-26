import { Categorie } from "../../categories/interface/categorie.interface";
import { Product } from "../../product/interface/product.interface";

export interface Discount {
    _id:string,
    type_campaign:number,
    type_discount:number,
    discount:number,
    start_date:string,
    end_date:string,
    start_date_num:number,
    end_date_num:number,
    state:number,
    type_segment:number,
    products:any[]
    categories:any[]
}
export interface DiscountR {
    discount: Discount,
}
export interface DiscountL {
    discounts: Discount[],
}

export interface ConfiaAll {
    categories:Categorie[],
    products:Product[],
}