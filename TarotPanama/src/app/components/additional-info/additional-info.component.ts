import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';

import * as CryptoJS from 'crypto-js';

import { ParticlesComponent } from '../../shared/particles/particles.component';

@Component({
  selector: 'app-additional-info',
  imports: [ParticlesComponent,FormsModule,CommonModule],
  templateUrl: './additional-info.component.html',
  styleUrl: './additional-info.component.css',
   animations: [
        trigger('fadeIn', [
          state('void', style({ opacity: 0 })),
          transition(':enter', [animate('1s ease-in', style({ opacity: 1 }))]),
        ]),
      ],
})
export class AdditionalInfoComponent implements OnInit  {
  countryCode: string = '';
  phone: string = '';
  nombreCliente: string = '';
  descriptionsText: string = '';  
  selectedCards: any[] = [];
  private encryptionKey = 'U0qQ0TGufDDJqCNvQS0b795q8EZPAp9E';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    const encryptedData = localStorage.getItem('paymentData');
    if (encryptedData) {
      try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        this.descriptionsText = decryptedData.descriptionsText;
        this.selectedCards = decryptedData.selectedCards;
      } catch (e) {
        console.error('Error al desencriptar los datos:', e);
      }
    }
  }

  submitPhone(): void {
    const errorMessage = document.getElementById('errorMessage');
    const numErrorMessage = document.getElementById('numErrorMessage');

    if (isNaN(Number(this.phone))) {
      numErrorMessage?.classList.add('show');
      numErrorMessage?.classList.remove('none');
      return;
    } else {
      numErrorMessage?.classList.remove('show');
      numErrorMessage?.classList.add('none');
    }

    if (!this.countryCode) {
      errorMessage?.classList.add('show');
      errorMessage?.classList.remove('none');
      return;
    } else {
      errorMessage?.classList.remove('show');
      errorMessage?.classList.add('none');
    }

    if (this.phone) {
      document.getElementById('phoneContainer')?.classList.remove('show');
      setTimeout(() => {
        document.getElementById('phoneContainer')!.style.display = 'none';
        document.getElementById('thankYouMessage')!.style.display = 'block';
        document.getElementById('thankYouMessage')!.classList.add('show');
      }, 500);

      // Recopilar datos de las cartas seleccionadas
      const cardDetails = this.selectedCards.map(card => ({
        name: card.name,
        description: card.descriptions[0] // Asumiendo que solo hay una descripción por carta
      }));
     
      console.log('Card Details:', cardDetails);
      const nombreCliente = this.nombreCliente;
      const numeroCliente = `${this.countryCode}${this.phone}`;
      const numeroMaestro = '+573217374091';
      console.log(this.nombreCliente)
      const datosMod = {
        sessionId: '1234',
        nombreCliente: nombreCliente,
        phoneNumberCliente: numeroCliente,
        phoneNumberMaestro: numeroMaestro,
        nombreDelCliente: this.nombreCliente,
        message: `Nueva consulta de ${this.nombreCliente} (${numeroCliente}): \n\n${cardDetails.map(card => `Carta: ${card.name}, Descripción: ${card.description}`).join('\n')} \n\nPonte en contacto con el cliente:\n\nhttps://wa.me/${numeroCliente}`,
      };

      const url = 'https://gestor-de-mesajeria-via-whatsapp-g5hc.onrender.com/api/messages/CrearMensaje';
      this.http.post(url, datosMod).subscribe(
        (response) => {
          console.log('Respuesta del servidor:', response);
        },
        (error) => {
          console.error('Error al realizar el POST:', error);
        }
      );
      this.router.navigate(['/agradecimiento']);
    } else {
      alert('Por favor, ingresa tu número de teléfono.');
    }
  }

  
}
