import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {

  constructor() { }

  generatePDF(productos: any[]) {
    const doc = new jsPDF();

    doc.setFontSize(12);
    doc.text('Factura', 10, 10);

    let y = 20;
    productos.forEach(producto => {
      doc.text(`Descripción: ${producto.Descripcion}`, 10, y);
      doc.text(`Cantidad: ${producto.Cantidad}`, 10, y + 10);
      doc.text(`Precio: ${producto.Precio}`, 10, y + 20);
      doc.text(`Subtotal: ${producto.Subtotal}`, 10, y + 30);
      doc.text(`IVA: ${producto.IVA}`, 10, y + 40);
      doc.text(`Total: ${producto.Total}`, 10, y + 50);
      y += 60;
    });

    doc.save('factura.pdf');
  }
}