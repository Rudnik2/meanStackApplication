import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule} from "@angular/forms";
import { RouterModule } from "@angular/router";
import { AngularMaterialModule } from "../angular-material.module";
import { ResponseResetComponent } from "./response-reset-password.component";



@NgModule({
  declarations:[
   ResponseResetComponent
  ],

    imports:[
      CommonModule,
      AngularMaterialModule,
      RouterModule,
      ReactiveFormsModule
    ]
})
export class ResponseResetModule{}
