import { Routes } from '@angular/router';

import {
  AdditionalInfoComponent,
} from './components/additional-info/additional-info.component';
import {
  AgradecimientoComponent,
} from './components/agradecimiento/agradecimiento.component';
import { CardsComponent } from './components/cards/cards.component';
import {
  DescriptionComponent,
} from './components/description/description.component';
import {
  TerminosCondicionesComponent,
} from './components/terminos-condiciones/terminos-condiciones.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { ParticlesComponent } from './shared/particles/particles.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full',
  },
  {
    path: 'welcome', component: WelcomeComponent
  },
  {
    path: 'cartas/:theme', component: CardsComponent
  },
  {
    path: 'descripcion-cartas', component: DescriptionComponent
  },
  {
    path: 'informacion', component: AdditionalInfoComponent
  },
  {
    path: 'particulas', component: ParticlesComponent
  },
  {
    path: 'agradecimiento', component: AgradecimientoComponent
  },
  {
    path: 'terminos-y-condiciones', component: TerminosCondicionesComponent 
  }


];
