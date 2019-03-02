import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialsModule } from '../../materials/materials.module';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [HeaderComponent],
  imports: [
    CommonModule,
    MaterialsModule,
  ],
  exports: [
    HeaderComponent,
  ]
})
export class LayoutModule { }
