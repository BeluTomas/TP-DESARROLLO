import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { urlBackend } from 'src/app/config/config';
import { AddNewSliderComponent } from '../add-new-slider/add-new-slider.component';
import { DeleteNewSliderComponent } from '../delete-new-slider/delete-new-slider.component';
import { EditNewSliderComponent } from '../edit-new-slider/edit-new-slider.component';
import { SliderService } from '../_services/slider.service';
import { Slider, SliderL } from '../interface/slider.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-list-slider',
  templateUrl: './list-slider.component.html',
  styleUrls: ['./list-slider.component.scss']
})
export class ListSliderComponent implements OnInit {

  sliders:Slider[] = [];
  search:string = "";
  isLoading$:Observable<boolean>;

  urlBackend:string = urlBackend;
  constructor(
    public _serviceSlider: SliderService,
    public modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this._serviceSlider.isLoading$;
    this.allSliders();
  }
  allSliders(){
    this._serviceSlider.allSlider(this.search).subscribe((resp:SliderL) => {
      console.log(resp);
      this.sliders = resp.sliders;
    })
  }
  refresh(){
    this.search = "";
    this.allSliders();
  }
  openCreate(){
    const modalRef = this.modalService.open(AddNewSliderComponent,{centered:true, size: 'md'});

    modalRef.componentInstance.SliderC.subscribe((slider) => {
      this.sliders.unshift(slider);
    })
  }

  editSlider(slider){
    const modalRef = this.modalService.open(EditNewSliderComponent,{centered:true, size: 'md'});
    modalRef.componentInstance.sliderSelected = slider;

    modalRef.componentInstance.SliderE.subscribe((slider) => {
      let index = this.sliders.findIndex(item => item._id == slider._id);
      if(index != -1){
        this.sliders[index] = slider;
      }
    })
  }
  delete(slider){
    const modalRef = this.modalService.open(DeleteNewSliderComponent,{centered:true, size: 'md'});
    modalRef.componentInstance.sliderSelected = slider;

    modalRef.componentInstance.SliderD.subscribe((resp) => {
      let index = this.sliders.findIndex(item => item._id == slider._id);
      if(index != -1){
        this.sliders.splice(index,1);
      }
    })
  }

}
