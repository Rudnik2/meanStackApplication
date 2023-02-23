import { animate, state, style, transition, trigger } from "@angular/animations";
import { Component,OnDestroy,OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { AuthData } from "../auth/auth-data.model";
import { Goal } from "../goals/goal.model";
import { GoalsService } from "../goals/goals.service";
import {mimeType} from "./mime-type.validator";

@Component({
  selector:'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit,OnDestroy{
  mode="myProfile";
  goals:Goal[] = [];
  alreadyFollowed = false; // na poczatku nie followujemy
  users: AuthData[];
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
  currentUser: AuthData={
    id:null,
    Imie:null,
    Nazwisko:null,
    email:null,
    password:null,
    imagePath:null,
    followers:null,
    followings:null
  };
  isLoading = false;
  userIsAuthenticated = false;
  userId!: string;
  form: FormGroup;
  imagePreview: string|null|ArrayBuffer;

  constructor(public goalsService: GoalsService,public route: ActivatedRoute,private authService: AuthService){}


  private goalsSub: Subscription = new Subscription;
  private authStatusSub: Subscription = new Subscription;

  ngOnInit(){
    this.form = new FormGroup({
      image:new FormControl(null,{validators:[Validators.required],asyncValidators: [mimeType]})
    });
    this.route.paramMap.subscribe((paramMap: ParamMap)=>{
      if(paramMap.has("userId")){
        this.mode= "userProfile";
        this.userId = paramMap.get('userId')!;
        this.isLoading=true;
      }else{
        this.mode="myProfile";
        this.userId =this.authService.getUserId();
      }
    });

    this.userIsAuthenticated = this.authService.getIsAuth();
    if(this.userIsAuthenticated){
      this.authService.getUser(this.userId).subscribe(userData=>{
        this.userId = userData._id,
        this.user.Imie = userData.Imie,
        this.user.Nazwisko = userData.Nazwisko,
        this.user.email = userData.email
        this.user.password = userData.password,
        this.user.imagePath = userData.imagePath
        this.user.followers = userData.followers, //ludzie co followuja Cie
        this.user.followings = userData.followings, // ludzie ktorych ty followujesz
        this.user.summaryType = userData.summaryType,
        this.user.summaryNotificationDate = userData.summaryNotificationDate
      });
      if(this.mode=='userProfile'){
        this.authService.getUser(this.authService.getUserId()).subscribe(userData=>{
          this.currentUser.id = userData._id,
          this.currentUser.Imie = userData.Imie,
          this.currentUser.Nazwisko = userData.Nazwisko,
          this.currentUser.email = userData.email
          this.currentUser.password = userData.password,
          this.currentUser.imagePath = userData.imagePath,
          this.currentUser.followers = userData.followers,
          this.currentUser.followings = userData.followings,
          this.currentUser.summaryType = userData.summaryType,
          this.currentUser.summaryNotificationDate = userData.summaryNotificationDate

          if(this.currentUser.followings.includes(this.userId)){
            this.alreadyFollowed = true;
          }
        });
      }
    }
    this.isLoading = true;
    this.goalsService.getGoals();



    this.goalsSub = this.goalsService.getGoalsUpdateListener().subscribe((goals: Goal[])=>{
      this.isLoading = false;
      this.goals=goals;
    });

    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated=>{
       this.userIsAuthenticated = isAuthenticated;
    });
   }



  onDelete(goalId: string){
    this.goalsService.deleteGoal(goalId);
  }
  ngOnDestroy(){
    this.goalsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
  onImagePicked(event: Event){
    const file = (event.target as HTMLInputElement).files![0];
    this.form.patchValue({image:file});
    this.form.get('image')!.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () =>{
      this.imagePreview = reader.result;
    }
    reader.readAsDataURL(file);

  }
  onSaveImage(){
    if(this.form.invalid){
      return;
    }
    this.authService.changeImage(
      this.userId
      ,this.user.Imie!,
      this.user.Nazwisko!,
      this.user.email!,
      this.user.password!,
      this.form.value.image,
      this.user.followers!,
      this.user.followings!,);
  }

  follow(){
    this.authService.followUser(
      this.currentUser.id!,
      this.currentUser.Imie!,
      this.currentUser.Nazwisko!,
      this.currentUser.email!,
      this.currentUser.password!,
      this.currentUser.imagePath!,
      this.currentUser.followers!,
      this.currentUser.followings!,
      this.userId);
  }
  unFollow(){
    this.authService.unfollowUser(
      this.currentUser.id!,
      this.currentUser.Imie!,
      this.currentUser.Nazwisko!,
      this.currentUser.email!,
      this.currentUser.password!,
      this.currentUser.imagePath!,
      this.currentUser.followers!,
      this.currentUser.followings!,
      this.userId);
  }

}
