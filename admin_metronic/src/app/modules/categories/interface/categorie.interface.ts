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