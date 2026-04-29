import { Component, inject } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../shared/material-imports';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Categorias } from '../../../models/categoria.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-categoria-form',
  imports: [...MATERIAL_IMPORTS, ReactiveFormsModule],
  templateUrl: './categoria-form.html',
  styleUrl: './categoria-form.scss',
})
export class CategoriaForm {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<CategoriaForm>);
  data = inject(MAT_DIALOG_DATA) as {categoria: Categorias | null, isModificar: boolean};

  form = this.fb.group({
    id: [{ value: this.data.categoria?.id || '', disabled: true }],
 
    nombre: [
      this.data.categoria?.nombre || '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(100)],
    ],
 
    descripcion: [
      this.data.categoria?.descripcion || '',
      [Validators.required, Validators.maxLength(500)],
    ],
  });

  constructor() {
    console.log('Datos recibidos en el formulario:', this.data);
    //Detalle
    if(!this.data.isModificar && this.data.categoria){
      this.form.disable();
    }
  }

  guardar(){
    if(this.form.valid){
      const categoriaData = this.form.getRawValue() as Categorias;
      
      console.log('Datos a guardar:', categoriaData);
      this.dialogRef.close(categoriaData);
    }
  }

}

