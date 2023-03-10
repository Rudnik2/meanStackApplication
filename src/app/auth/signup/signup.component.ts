import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { AuthService } from "../auth.service";

@Component({
  templateUrl:"./signup.component.html",
  styleUrls:["./signup.component.css"]
})
export class SignupComponent implements OnInit,OnDestroy{
  isLoading = false;
  private authStatusSub!: Subscription;
  constructor(public authService: AuthService){}

  ngOnInit(){
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus =>{
        this.isLoading=false;
      }
    );
  }
  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }
  onSignup(form: NgForm){
    if(form.invalid){
      return;
    }else {
      this.isLoading=true;
      this.authService.createUser(form.value.Imie,form.value.nazwisko,form.value.email,form.value.password);
    }
  }
}
