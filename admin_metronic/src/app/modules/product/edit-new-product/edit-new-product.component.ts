import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { CategoriesService } from '../../categories/_services/categories.service';
import { DeleteGaleriaImagenComponent } from '../delete-galeria-imagen/delete-galeria-imagen.component';
import { DeleteNewVariedadComponent } from '../variedades/delete-new-variedad/delete-new-variedad.component';
import { EditNewVariedadComponent } from '../variedades/edit-new-variedad/edit-new-variedad.component';
import { ProductService } from '../_services/product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Categorie } from '../../categories/interface/categorie.interface';
import { Observable } from 'rxjs';
import { Product, ProductR } from '../interface/product.interface';

@Component({
  selector: 'app-edit-new-product',
  templateUrl: './edit-new-product.component.html',
  styleUrls: ['./edit-new-product.component.scss']
})
export class EditNewProductComponent implements OnInit {

  product_id:string = null;
  productSelected:Product;

  title:string = null;
  sku:string = null;
  categories:Categorie[] = [];
  categorie:string = "";
  price_pesos:number = 0;  
  price_usd:number = 0;  
  imagenFile: File = null;
  imagenPrevizualizacion: string | ArrayBuffer = null;
  resumen:string = null;
  description:string = null;
  state:string = "1";
  // 
  tag:string = null;
  tags:string[] = [];

  isLoading$:Observable<boolean>;
  typeInventario:number = 1;
  stock:number = 0;

  stock_multiple:number = 0;
  valor_multiple:string = "";

  variedades = [];

  imagenPrevizGaleria: string | ArrayBuffer = null;
  imagenFileGaleria: File = null;
  galerias = [];

  formGroup: FormGroup;
  isLoading:Boolean = false;

  constructor(
    public _productService:ProductService,
    public router:Router,
    public _categorieService:CategoriesService,
    public activeRouter:ActivatedRoute,
    public toaster: Toaster,
    public modalService: NgbModal,
     private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this._productService.isLoading$;
    this.activeRouter.params.subscribe((resp:any) => {
      console.log(resp);
      this.product_id = resp.id;
    });
    // this.loadForm();
    this._productService.showProduct(this.product_id).subscribe((resp:ProductR) => {
      console.log(resp);
      this.productSelected = resp.product;

      // this.title = this.productSelected.title;
      // this.sku = this.productSelected.sku;
      // this.categorie = this.productSelected.categorie._id;
      // this.price_pesos = this.productSelected.price_pesos;
      // this.price_usd = this.productSelected.price_usd;
      
      this.stock = this.productSelected.stock;

      this.imagenPrevizualizacion = this.productSelected.imagen;
      // this.resumen = this.productSelected.resumen;
      // this.description = this.productSelected.description;
      this.tags = this.productSelected.tags;
      this.variedades = this.productSelected.variedades;
      this.typeInventario = this.productSelected.type_inventario;
      // this.state = this.productSelected.state;
      this.galerias = this.productSelected.galerias;
      setTimeout(() => {
        this.loadForm();
      }, 25);
    })

    this._categorieService.allCategories().subscribe((resp:any) => {
      console.log(resp);
      this.categories = resp.categories;
      this.loadServices();
    })
  }

  loadForm() {
    this.formGroup = this.fb.group({
      title: [this.productSelected.title, 
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.min(3),
          Validators.maxLength(250),
        ])
      ],
      sku: [this.productSelected.sku, 
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.min(1),
          Validators.maxLength(250),
        ])
      ],
      categorie: [this.productSelected.categorie._id, 
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.min(1),
        ])
      ],
      pricePesos: [this.productSelected.price_pesos, 
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.min(1),
        ])
      ],
      priceUsd: [this.productSelected.price_usd, 
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.min(1),
        ])
      ],
      resumen: [this.productSelected.resumen, 
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.min(1),
        ])
      ],
      description: [this.productSelected.description, 
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.min(1),
        ])
      ],
      state: [this.productSelected.state],
    });
  }

  loadServices(){
    this._productService.isLoadingSubject.next(true);
    setTimeout(() => {
      this._productService.isLoadingSubject.next(false);
    }, 50);
  }

  processFile($event){
    if($event.target.files[0].type.indexOf("image") < 0){
      this.imagenPrevizualizacion = null;
      this.toaster.open(NoticyAlertComponent,{text:`danger-'Upps! Necesita ingresar un archivo de tipo imagen.'`});
      return;
    }
    this.imagenFile = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.imagenFile);
    reader.onloadend = () => this.imagenPrevizualizacion = reader.result;
    this.loadServices();
  }

  processFileGaleria($event){
    if($event.target.files[0].type.indexOf("image") < 0){
      this.imagenPrevizGaleria = null;
      this.toaster.open(NoticyAlertComponent,{text:`danger-'Upps! Necesita ingresar un archivo de tipo imagen.'`});
      return;
    }
    this.imagenFileGaleria = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.imagenFileGaleria);
    reader.onloadend = () => this.imagenPrevizGaleria = reader.result;
    this.loadServices();
  }

  addTag(){
    this.tags.push(this.tag);
    this.tag = "";
  }
  removeTag(i){
    this.tags.splice(i,1);
  }

  update(){
    // if(!this.title || !this.categorie || !this.price_pesos || !this.price_usd || !this.resumen || !this.description
    //   || !this.sku || this.tags.length == 0){
    //     this.toaster.open(NoticyAlertComponent,{text:`danger-'Upps! NECESITAS DIGITAR TODOS LOS CAMPOS DEL FORMULARIO.'`});
    //     return;
    // }

    if(this.tags.length == 0){
      this.toaster.open(NoticyAlertComponent,{text:`danger-'Upps! NECESITAS AGREGAR AL MENOS UNA TAG.'`});
      return;
    }
    let formData = new FormData();
    formData.append("_id",this.product_id);
    formData.append("title",this.formGroup.value.title);
    formData.append("categorie",this.formGroup.value.categorie);
    formData.append("sku",this.formGroup.value.sku);
    formData.append("price_pesos",this.formGroup.value.pricePesos);
    formData.append("price_usd",this.formGroup.value.priceUsd);
    formData.append("description",this.formGroup.value.description);
    formData.append("resumen",this.formGroup.value.resumen);
    formData.append("state",this.formGroup.value.state);
    formData.append("type_inventario",this.typeInventario+"");
    formData.append("tags",JSON.stringify(this.tags));
    formData.append("stock",this.stock+"");
    if(this.imagenFile){
      formData.append("imagen",this.imagenFile);
    }

    this._productService.updateProduct(formData).subscribe((resp:any) => {
      console.log(resp);
      if(resp.code == 403){
        this.toaster.open(NoticyAlertComponent,{text:`danger-'UPPS ! EL PRODUCTO YA EXISTE, DIGITAR OTRO NOMBRE'`});
        return;
      }else{
        this.toaster.open(NoticyAlertComponent,{text:`primary-'EL PRODUCTO SE HA EDITADO CON EXITO'`});
        return;
      }
    })

  }

  listProducts(){
    this.router.navigateByUrl("/productos/lista-de-todos-los-productos");
  }

  checkedInventario(value){
    this.typeInventario = value;
  }

  saveVariedad(){
    if(!this.valor_multiple || 
      !this.stock_multiple){
        this.toaster.open(NoticyAlertComponent,{text:`danger-'ES NECESARIO DIGITAR UN VALOR Y UNA CANTIDAD'`});
        return;
    }
    let data = {
      product: this.product_id,
      valor: this.valor_multiple,
      stock: this.stock_multiple,
    }
    this._productService.createVariedad(data).subscribe((resp:any) => {
      console.log(resp);
      
      this.valor_multiple = null;
      this.stock_multiple = null;
      let index = this.variedades.findIndex(item => item._id == resp.variedad._id);
      if(index != -1){
        this.variedades[index] = resp.variedad;
        this.toaster.open(NoticyAlertComponent,{text:`primary-'LA VARIEDAD SE EDITO CORRECTAMENTE'`});
      }else{
        this.variedades.unshift(resp.variedad)
        this.toaster.open(NoticyAlertComponent,{text:`primary-'LA VARIEDAD SE REGISTRO CORRECTAMENTE'`});
      }
    })
  }

  editVariedad(variedad){
    const modalRef = this.modalService.open(EditNewVariedadComponent,{centered:true, size: 'sm'});
    modalRef.componentInstance.variedad = variedad;

    modalRef.componentInstance.VariedadE.subscribe((variedadE:any) => {
      let index = this.variedades.findIndex(item => item._id == variedadE._id);
      if(index != -1){
        this.variedades[index] = variedadE;
        this.toaster.open(NoticyAlertComponent,{text:`primary-'LA VARIEDAD SE EDITO CORRECTAMENTE'`});
      }
    })
  }
  deleteVariedad(variedad){
    const modalRef = this.modalService.open(DeleteNewVariedadComponent,{centered:true, size: 'sm'});
    modalRef.componentInstance.variedad = variedad;

    modalRef.componentInstance.VariedadD.subscribe((resp:any) => {
      let index = this.variedades.findIndex(item => item._id == variedad._id);
      if(index != -1){
        this.variedades.splice(index,1);
        this.toaster.open(NoticyAlertComponent,{text:`primary-'LA VARIEDAD SE ELIMINO CORRECTAMENTE'`});
      }
    })
  }

  storeImagen(){
    if(!this.imagenFileGaleria){
      this.toaster.open(NoticyAlertComponent,{text:`danger-'NECESITAS SELECCIONAR UNA IMAGEN'`});
      return;
    }
    let formData = new FormData();
    formData.append("_id",this.product_id);
    formData.append("imagen",this.imagenFileGaleria);
    formData.append("__id",new Date().getTime().toString());
    this._productService.createGaleria(formData).subscribe((resp:any) => {
      console.log(resp);
      this.imagenFileGaleria = null;
      this.imagenPrevizGaleria = null;
      this.galerias.unshift(resp.imagen);
    })
  }

  removeImagen(imagen){
    const modalRef = this.modalService.open(DeleteGaleriaImagenComponent,{centered:true, size: 'sm'});
    modalRef.componentInstance.imagen = imagen; 
    modalRef.componentInstance.product_id = this.product_id;
    
    modalRef.componentInstance.ImagenD.subscribe((resp:any) => {
      let index = this.galerias.findIndex(item => item._id == imagen._id);
      if(index != -1){
        this.galerias.splice(index,1);
        this.toaster.open(NoticyAlertComponent,{text:`primary-'LA IMAGEN SE ELIMINO CORRECTAMENTE'`});
      }
    })
  }

  isControlValid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation, controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.dirty || control.touched;
  }
}
