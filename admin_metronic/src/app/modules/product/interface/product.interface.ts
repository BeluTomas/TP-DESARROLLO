export interface Product {
    _id:string,
    title:string,
    sku:string,
    slug:string,
    imagen:string,
    categorie:any,
    price_pesos:number,
    price_usd:number,
    stock:number,
    description:string,
    resumen:string,
    tags:[],
    type_inventario:number,
    state:string,
    variedades:[],
    imagen_two:number,
    galerias:[],
    avg_review:number,
    count_review:number,
    campaing_discount:any,
}
export interface ProductR {
    product: Product,
}
export interface ProductL {
    products: Product[],
}
export interface Variedad {
    _id:string,
    product:string,
    valor:number,
    stock:number,
}
export interface VariedadesR {
    variedad:Variedad,
}