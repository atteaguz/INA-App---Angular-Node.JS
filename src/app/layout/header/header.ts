import { Component } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../shared/material-imports';

@Component({
  selector: 'app-header',
  imports: [...MATERIAL_IMPORTS],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {}
