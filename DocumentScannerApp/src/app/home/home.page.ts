import { Component } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import { OCR, OCRResult } from '@ionic-native/ocr/ngx';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})

export class HomePage {
  scannedText: string = '';

  constructor(private ocr: OCR) {}

  async captureImage() {
    try {
      const image = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
      });

      const imageData: string = image.dataUrl || '';

      this.ocr.recText(0, imageData)
        .then((res: OCRResult) => {
          this.scannedText = res.blocks.blocktext.map((block: any) => block.text).join(' ');
        })
        .catch((error: any) => console.error(error));
    } catch (error) {
      console.error('Error capturing image: ', error);
    }
  }

  generatePDF() {
    const doc = new jsPDF();
    doc.text(this.scannedText, 10, 10);
    doc.save('scanned-document.pdf');
  }
}
