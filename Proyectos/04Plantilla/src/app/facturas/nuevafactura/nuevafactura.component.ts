import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ClientesService } from '../../Services/clientes.service';
import { FacturaService } from '../../Services/factura.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PdfGeneratorService } from '../../Services/pdf-generator.service';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-nuevafactura',
  templateUrl: './nuevafactura.component.html',
  styleUrls: ['./nuevafactura.component.css']
})
export class NuevafacturaComponent implements OnInit {
  frm_factura: FormGroup;
  listaClientes: any[] = [];
  listaClientesFiltrada: any[] = [];
  productoelejido: any[] = [];
  totalapagar: number = 0;

  constructor(
    private clietesServicios: ClientesService,
    private facturaService: FacturaService,
    private navegacion: Router,
    private modal: NgbModal,
    private pdfGeneratorService: PdfGeneratorService
  ) {}

  ngOnInit(): void {
    this.frm_factura = new FormGroup({
      Fecha: new FormControl('', Validators.required),
      Sub_total: new FormControl('', Validators.required),
      Sub_total_iva: new FormControl('', Validators.required),
      Valor_IVA: new FormControl('0.15', Validators.required),
      Clientes_idClientes: new FormControl('', Validators.required)
    });

    this.clietesServicios.todos().subscribe({
      next: (data) => {
        this.listaClientes = data;
        this.listaClientesFiltrada = data;
      },
      error: (e) => {
        console.log(e);
      }
    });
  }

  productosLista(evnto) {
    alert('lista de prductos cargandp');
    //servicio de prodcuto para cargar los productos
  }

  cargaModal(valoresModal: any) {
    const nuevoProducto: any = {
      Descripcion: 'prodcuto 4',
      Cantidad: 15,
      Precio: 12.23,
      Subtotal: 15.2,
      IVA: 15,
      Total: 185.9
    };
    this.productoelejido.push(nuevoProducto);
    this.modal.dismissAll();

    this.productoelejido.reduce((valor, producto) => {
      this.totalapagar += producto.Total;
    }, 0);
  }

  grabar() {
    //pdf con html2canvas
    const DATA: any = document.getElementById('impresion');
    html2canvas(DATA).then((canvas) => {
      const anchoorignal = canvas.width;
      const altooriginal = canvas.height;
      const anchoPDF = 210;
      const altoPDF = (altooriginal * anchoPDF) / anchoorignal;
      const archivoPDF = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      archivoPDF.addImage(imgData, 'PNG', 0, 0, anchoPDF, altoPDF);
      archivoPDF.save('factura.pdf');
    });
  }

  generatePDF() {
    this.pdfGeneratorService.generatePDF(this.productoelejido);
  }
}