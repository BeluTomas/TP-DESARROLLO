import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { urlBackend } from 'src/app/config/config';
import { AddNewCategorieComponent } from '../add-new-categorie/add-new-categorie.component';
import { DeleteNewCategorieComponent } from '../delete-new-categorie/delete-new-categorie.component';
import { EditNewCategorieComponent } from '../edit-new-categorie/edit-new-categorie.component';
import { CategoriesService } from '../_services/categories.service';
import { Categorie, CategorieL } from '../interface/categorie.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-lits-categories',
  templateUrl: './lits-categories.component.html',
  styleUrls: ['./lits-categories.component.scss']
})
export class LitsCategoriesComponent implements OnInit {

  categories:any = [];
  search:any = "";
  isLoading$:Observable<boolean>;

  urlBackend:any = urlBackend;
  constructor(
    public serviceCategorie: CategoriesService,
    public modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.serviceCategorie.isLoading$;
    this.allCategories();
  }
  allCategories(){
    this.serviceCategorie.allCategories(this.search).subscribe((resp:CategorieL) => {
      this.categories = resp.categories;
    })
  }
  refresh(){
    this.search = "";
    this.allCategories();
  }
  openCreate(){
    const modalRef = this.modalService.open(AddNewCategorieComponent,{centered:true, size: 'md'});

    modalRef.componentInstance.CategorieC.subscribe((categorie:Categorie) => {
      this.categories.unshift(categorie);
    })
  }

  editCategorie(categorie){
    const modalRef = this.modalService.open(EditNewCategorieComponent,{centered:true, size: 'md'});
    modalRef.componentInstance.categorieSelected = categorie;

    modalRef.componentInstance.CategorieE.subscribe((categorie:Categorie) => {
      let index = this.categories.findIndex(item => item._id == categorie._id);
      if(index != -1){
        this.categories[index] = categorie;
      }
    })
  }
  delete(categorie){
    const modalRef = this.modalService.open(DeleteNewCategorieComponent,{centered:true, size: 'md'});
    modalRef.componentInstance.categorieSelected = categorie;

    modalRef.componentInstance.CategorieD.subscribe((resp:string) => {
      let index = this.categories.findIndex(item => item._id == categorie._id);
      if(index != -1){
        this.categories.splice(index,1);
      }
    })
  }
}
