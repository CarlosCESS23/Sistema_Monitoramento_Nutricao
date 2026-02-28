import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login-page/login-page';
import { RegistroPage } from './pages/register/registro-page/registro-page';
import { DashboardNutricionistaPage } from './pages/dashboard-nutricionista/dashboard-nutricionista';
import { DashboardPaiPage } from './pages/dashboard-pai/dashboard-pai';

export const routes: Routes = [
  // Redireciona a raiz para /login
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Rotas públicas
  { path: 'login', component: LoginPage },
  { path: 'registro', component: RegistroPage },
  { path: 'dashboard/nutricionista', component: DashboardNutricionistaPage },
  { path: 'dashboard/pai', component: DashboardPaiPage },

  // Fallback — qualquer rota desconhecida volta para login
  { path: '**', redirectTo: '/login' },
];
