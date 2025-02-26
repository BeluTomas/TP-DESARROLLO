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
    variedades:any[],
    imagen_two:number,
    galerias:any[],
    avg_review:number,
    count_review:number,
    campaing_discount:any,
    FlashSale?:Discount,
}
export interface ProductR {
    product: Product,
}
export interface ProductL {
    products: Product[],
}

export interface Categorie {
    _id:string,
    title:string,
    imagen:string,
    imagen_home:string,
    state:Number,
}
export interface CategorieR {
    categorie: Categorie,
}
export interface CategorieL {
    categories: Categorie[],
}

export interface Slider {
    _id:string,
    title:string,
    link:string,
    imagen:string,
    imagen_home:string,
    state:Number,
}
export interface SliderR {
    slider: Slider,
}
export interface SliderL {
    sliders: Slider[],
}

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

export interface Variedad {
    _id:string,
    product:string,
    valor:number,
    stock:number,
}
export interface VariedadesR {
    variedad:Variedad,
}

export interface HomeData {
    sliders:Slider[],
    categories:Categorie[],
    best_products:Product[],
    our_products:Product[],
    FlashSale:Discount,
    campaign_products:Product[],
}

export interface ConfiaAll {
    categories:Categorie[],
    products:Product[],
    variedades:Variedad[]
}


export interface AddressClient {
    _id:string,
    user:string,
    name:string,
    surname:string,
    pais:string,
    address:string,
    referencia:string,
    ciudad:string,
    region:string,
    telefono:string,
    email:string,
    nota:string,
}
export interface AddressClientR {
    address_client: AddressClient,
    message?:string,
    message_text?:string,
}
export interface SaleDetailOrder {
    _id:string,
    product:{
        _id:string,
        title:string,
        sku:string,
        slug:string,
        imagen:string,
        categorie:string,
        price_pesos:number,
        price_usd:number,
    },
    type_discount:number,
    discount:number,
    cantidad:number,
    variedad:string,
    code_cupon:string,
    code_discount:string,
    price_unitario:number,
    subtotal:number,
    total:number,
    review:any
}
export interface SaleOrder {
    sale: {
        _id:string,
        user:string,
        currency_payment:string,
        method_payment:string,
        n_transacccion:string,
        total:number,
        currency_total:number,
        price_dolar:number,
    },
    sale_details: SaleDetailOrder[],
    sale_address: AddressClient[],
}

export interface ProfileClientS {
    sale_orders:SaleOrder[],
    address_client:AddressClient[]
}

export interface Cart {
    _id:string,
    user:string,
    product:{
        _id:string,
        title:string,
        sku:string,
        slug:string,
        imagen:string,
        categorie:string,
        price_pesos:number,
        price_usd:number,
    }
    type_discount:number,
    discount:number,
    cantidad:number,
    variedad:any,
    code_cupon:string,
    code_discount:string,
    price_unitario:number,
    subtotal:number,
    total:number,
}
export interface CartL {
    carts: Cart[],
}
export interface CartR {
    cart: Cart,
    message?:number,
    message_text?:string,
}