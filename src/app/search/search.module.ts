import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { AngularMaterialModule } from "../angular-material.module";
import {MatIconModule} from '@angular/material/icon';
import { SearchComponent } from "./search.component";
import { MatTableModule } from "@angular/material/table";



@NgModule({
  declarations:[
    SearchComponent
  ],
  imports:[
    CommonModule,
    AngularMaterialModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTableModule
  ]
})
export class SearchModule{}
