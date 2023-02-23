import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule} from "@angular/forms";
import { RouterModule } from "@angular/router";
import { AngularMaterialModule } from "../angular-material.module";
import { RequestResetComponent } from "./request-reset-password.component";


@NgModule({
  declarations:[
   RequestResetComponent
  ],

    imports:[
      CommonModule,
      AngularMaterialModule,
      RouterModule,
      ReactiveFormsModule
    ]
})
export class RequestResetModule{}
