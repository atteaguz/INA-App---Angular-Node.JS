import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CategoriaService } from '../../../services/categoria-service';
import { Categorias } from '../../../models/categoria.model';
import { MATERIAL_IMPORTS } from '../../../shared/material-imports';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { CategoriaForm } from '../categoria-form/categoria-form';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-lista-categoria',
  imports: [...MATERIAL_IMPORTS],
  templateUrl: './lista-categoria.html',
  styleUrl: './lista-categoria.scss',
})
export class ListaCategoria implements OnInit {
  categorias: Categorias[]=[];
  private categoriaService = inject(CategoriaService);
  private dialog = inject(MatDialog);
  private toastr = inject(ToastrService);
  //constructor(private dialog: MatDialog) {}

  displayedColumns: string[] = ['id', 'nombre','acciones'];
  dataSource = new MatTableDataSource<Categorias>([]);

  //Referencias a los componentes de paginación y ordenamiento de Angular Material
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  //Forzar actualizacion de la tabla
  @ViewChild(MatTable) table!: MatTable<Categorias>;

  
  //Hook del ciclo de vida para inicializar la tabla después de que se hayan cargado los datos
  ngOnInit():void{
    this.loadCategorias();
  }

  loadCategorias(): void {
    this.categoriaService.getCategorias().subscribe({
      next: (data) => {
        /* this.categorias = data;
        this.dataSource = new MatTableDataSource<Categorias>(this.categorias);
        console.log('Categorias cargadas:', data); */

        //Forzar actualizacion de la tabla
        this.dataSource.data = data;
        this.table.renderRows();
      },
      error: (error) => {
        console.error('Erro al cargar categorias:', error);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

crearModificarCategoria(categoria: Categorias | null, isMod: boolean): void {
  const dialogRef = this.dialog.open(CategoriaForm, {
    width: '600px',
    height: '800px',
    data: { categoria, isModificar: isMod },
  });

  dialogRef.afterClosed().subscribe(result => {
    if (!result) {
      return; // Usuario canceló
    }

    if (isMod && categoria) {
      // 🔄 MODO MODIFICACIÓN
      this.categoriaService.modificarCategoria(result).subscribe({
        next: (data) => {
          this.toastr.success('Categoría modificada exitosamente', 'Éxito');
          this.loadCategorias();
        },
        error: (error) => {
          this.toastr.error('Error al modificar la categoría', 'Error');
          console.error('Error al modificar la categoría:', error);
        }
      });
    } else {
      // ✨ MODO CREACIÓN
      this.categoriaService.crearCategoria(result).subscribe({
        next: (data) => {
          this.toastr.success('Categoría creada exitosamente', 'Éxito');
          this.loadCategorias();
        },
        error: (error) => {
          this.toastr.error('Error al crear la categoría', 'Error');
          console.error('Error al crear la categoría:', error);
        }
      });
    }
  });
}

  eliminarCategoria(cat: Categorias): void{
     if (confirm(`¿Estás seguro de eliminar la categoría "${cat.nombre}"?`)) {
      this.categoriaService.eliminarCategoria(cat.id).subscribe({
        next: () => {
          this.toastr.success('Categoría eliminada exitosamente', 'Éxito');
          this.loadCategorias(); // Recargar la lista después de eliminar
        },
        error: (error) => {
          this.toastr.error('Error al eliminar la categoría', 'Error');
          console.error('Error al eliminar la categoría:', error);
        },
      });
    }
  }
}
