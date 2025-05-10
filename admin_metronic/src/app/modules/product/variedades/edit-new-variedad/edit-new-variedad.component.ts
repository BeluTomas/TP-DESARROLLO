import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from '../../_services/product.service';
import { Variedad, VariedadesR } from '../../interface/product.interface';

@Component({
  selector: 'app-edit-new-variedad',
  templateUrl: './edit-new-variedad.component.html',
  styleUrls: ['./edit-new-variedad.component.scss']
})
export class EditNewVariedadComponent implements OnInit {

  @Input() variedad:Variedad;
  @Output() VariedadE: EventEmitter<Variedad> = new EventEmitter();

  isLoading$:any;
  variedadMultiple = null;
  constructor(
    public modal:NgbActiveModal,
    public _serviceProduct: ProductService,
  ) { }

  ngOnInit(): void {
    this.variedadMultiple = this.variedad.valor;
  }

  update(){
    let data = {
      _id: this.variedad._id,
      valor: this.variedadMultiple,
    }
    this._serviceProduct.updateVariedad(data).subscribe((resp:VariedadesR) => {
      console.log(resp);
      this.VariedadE.emit(resp.variedad);
      this.modal.close();
    })
  }
}
