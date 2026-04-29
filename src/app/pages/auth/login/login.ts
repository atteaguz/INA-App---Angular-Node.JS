import { Component, inject } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../shared/material-imports';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/authService';
import { LoginModel } from '../../../models/loginModel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [...MATERIAL_IMPORTS, ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})

export class Login {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  loginForm = this.fb.group({
    username: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
  });

  login(): void{
      if(this.loginForm.valid){
        //console.log(this.loginForm.value, this.loginForm.value);
        this.authService.login(this.loginForm.value as LoginModel).subscribe({
          next: (resp) => {
            this.authService.saveSession(resp);
            //redireccionar a la pagina de inicio o dashboard
            this.router.navigate(['/dashboard'], { replaceUrl: true });
          },
          error: (error) => {
            console.error('Login fallo:', error);
          }
        });
      }
  }
}
