import { Routes } from '@angular/router';
//import { authGuard } from './guards/auth-guard';

export const routes: Routes = [

    //guard
    {path:'', loadComponent: () => import('./pages/auth/login/login').then(m => m.Login)},
    {path: 'inicio', loadComponent: () => import('./pages/home/home').then(m => m.Home)},
    {path: 'iniciarsesion', loadComponent: () => import('./pages/auth/login/login').then(m => m.Login)},
    {path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard)},
    {path: 'listaCategorias', loadComponent: () => import('./pages/categorias/lista-categoria/lista-categoria').then(m => m.ListaCategoria)},
    {path: 'listaUsuarios', loadComponent: () => import('./pages/usuarios/lista-usuarios/lista-usuarios').then(m => m.ListaUsuario)},
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: '**', redirectTo: 'login'},
];
