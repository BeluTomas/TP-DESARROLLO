import { Categorie } from "../../categories/interface/categorie.interface";
import { Product } from "../../product/interface/product.interface";

export interface Cupone {
    _id:string,
    code:string,
    type_discount:number,
    discount:number,
    type_count:number,
    num_use:number,
    type_segment:number,
    state:number,
    products:any[],
    categories:any[]
}
export interface CuponeR {
    cupone: Cupone,
}
export interface CuponeL {
    cupones: Cupone[],
}

export interface ConfiaAll {
    categories:Categorie[],
    products:Product[],
}