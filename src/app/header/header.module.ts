import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { AngularMaterialModule } from "../angular-material.module";
import {MatIconModule} from '@angular/material/icon';
import { HeaderComponent } from "./header.component";



@NgModule({
  declarations:[
    HeaderComponent
  ],
  imports:[
    CommonModule,
    AngularMaterialModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule
  ]
})
export class HeaderModule{}
