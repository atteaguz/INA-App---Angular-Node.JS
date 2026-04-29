import { Component, ViewChild, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MATERIAL_IMPORTS } from '../../shared/material-imports';
import { Footer } from '../../layout/footer/footer';
import { AuthService } from '../../services/authService';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink,RouterOutlet, ...MATERIAL_IMPORTS,Footer],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})

export class Home {
  authService = inject(AuthService);
  router = inject(Router);

  @ViewChild('sidenav') sidenav?: MatSidenav;
  
  isLoggedIn = this.authService.isLoggedIn();

  titulo: string = 'Bienvenido a INA App';
    opened: boolean = true;
    menuItems = [
    { icon: 'home', label: 'Inicio', route: '/dashboard' },
    { icon: 'category', label: 'Categorías', route: '/listaCategorias' },
    { icon: 'people', label: 'Usuarios', route: '/listaUsuarios' },
  ];

  toggleMenu() {
    if (this.authService.isLoggedIn()) {
      this.sidenav?.toggle();
    }
  }

  closeMenu(): void {
    this.sidenav?.close();
  }

  logout(): void {
    this.authService.logout();
    this.closeMenu();
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
