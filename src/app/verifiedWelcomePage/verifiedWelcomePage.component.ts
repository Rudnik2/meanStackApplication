import {Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from '../auth/auth.service';


@Component({
  selector: 'app-verifiedWelcomePage',
  styleUrls: ['verifiedWelcomePage.component.css'],
  templateUrl: 'verifiedWelcomePage.component.html',
})
export class verifiedWelcomePageComponent implements OnInit,OnDestroy{

  constructor(private authService: AuthService, public route: ActivatedRoute){}

  isLoading = true;
  confirmationCode: string|null;

  ngOnInit(){
    this.isLoading = false;
    this.route.paramMap.subscribe((paramMap: ParamMap)=>{
      if(paramMap.has("confirmationCode")){
        this.confirmationCode = paramMap.get('confirmationCode');
        this.authService.verifyUser(this.confirmationCode!);
      }else{
        console.log("Sorry, something went wrong. Please contact our support team!")
      }
    });

  }

  ngOnDestroy(){
  }
}
