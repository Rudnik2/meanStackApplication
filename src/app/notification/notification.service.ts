import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Task } from "../tasks/task.model";
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import { Router } from "@angular/router";
import {environment} from "../../environments/environment.prod";
import { MatDialog } from "@angular/material/dialog";
import { response } from "express";
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";
import { AuthData } from "../auth/auth-data.model";
import { NotificationComponent } from "./notification.component";

const BACKEND_URL = environment.apiUrl+"/notification/";

@Injectable({providedIn: 'root'})

export class NotificationService{

  user: AuthData={
    id:null,
    Imie:null,
    Nazwisko:null,
    email:null,
    password:null,
    imagePath:null,
    followers:null,
    followings:null
  };
  userIsAuthenticated = false;
  userId:any;
  private authListenerSubs!: Subscription;


  constructor(public dialog: MatDialog,private http: HttpClient,private router: Router,private authService: AuthService){
  }


  checkDate(){
   // const now = new Date();
   // return this.http.get<{summaries:Summary[]}>(BACKEND_URL);
  }

  updateSummary(){

    this.userIsAuthenticated = this.authService.getIsAuth();

    if(this.userIsAuthenticated){
      this.authService.getUser(this.authService.getUserId()).subscribe(userData=>{
        this.userId = userData._id;
        this.user.summaryType = userData.summaryType;
        this.user.summaryNotificationDate = userData.summaryNotificationDate;

        const now = new Date(); // teraz
        let lastUpdate = new Date(this.user.summaryNotificationDate); //kiedy ostatnio pokazal się komunikat
        var difference = (now.getTime() - lastUpdate.getTime())/(1000*3600*24); // gdy będzie większe od 1, to znaczy że 1 dzień temu ostatni raz się wyświetlił komunikat

        console.log(now.getDay());
        if(now.getUTCDate()==1){ // jezeli jest 1 dzień nowego miesiąca
          if(difference>=1){
            this.authService.updateSummary(this.userId,"miesięczne",now);
            this.openDialog("miesięczne");
          }
        }

        if(now.getDay()==1){
          if(difference>=1){

            this.authService.updateSummary(this.userId,"tygodniowe",now);
          this.openDialog("tygodniowe");
          }
        }
      });
    }

  }

  openDialog(type:string){
   const dialogRef = this.dialog.open(NotificationComponent, {
      width: '500px',
      data: {content: "Sprawdź swoje podsumowanie "+type},
    });
  }

}
