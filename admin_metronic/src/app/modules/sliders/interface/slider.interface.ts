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