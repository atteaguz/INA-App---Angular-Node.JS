// src/app/pages/usuarios/usuario-form/usuario-form.ts
import { Component, inject } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../shared/material-imports';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Usuario, UsuarioResponse } from '../../../models/usuario.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserRole } from '../../../shared/enums/enums';

@Component({
  selector: 'app-usuario-form',
  imports: [...MATERIAL_IMPORTS, ReactiveFormsModule],
  templateUrl: './usuarios-form.html',
  styleUrl: './usuarios-form.scss',
})
export class UsuarioForm {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<UsuarioForm>);
  data = inject(MAT_DIALOG_DATA) as { usuario: UsuarioResponse | null; isModificar: boolean };
  hidePassword = true;

  roles = Object.values(UserRole);

  form = this.fb.group({
    id: [{ value: this.data.usuario?.id || '', disabled: true }],

    username: [
      this.data.usuario?.username || '',
      [Validators.required, Validators.email, Validators.minLength(6), Validators.maxLength(100)],
    ],

    password: [
      '',
      this.data.isModificar
        ? [] // En modificación, la contraseña es opcional
        : [Validators.required, Validators.minLength(6), Validators.maxLength(100)],
    ],

    role: [
      this.data.usuario?.role || UserRole.USER,
      [Validators.required],
    ],
  });

  constructor() {
    console.log('Datos recibidos en el formulario:', this.data);

    // Modo detalles: deshabilitar todo el formulario
    if (!this.data.isModificar && this.data.usuario) {
      this.form.disable();
    }
  }

  guardar() {
    if (this.form.valid) {
      const usuarioData = this.form.getRawValue() as Usuario;

      // Si no hay contraseña en modificación, la eliminamos del objeto
      if (this.data.isModificar && !usuarioData.password) {
        delete usuarioData.password;
      }

      console.log('Datos a guardar:', usuarioData);
      this.dialogRef.close(usuarioData);
    }
  }
}