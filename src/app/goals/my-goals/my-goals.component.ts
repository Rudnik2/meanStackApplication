import { Component,OnDestroy,OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthData } from "src/app/auth/auth-data.model";
import { AuthService } from "src/app/auth/auth.service";
import { Goal } from "../goal.model";
import { GoalsService } from "../goals.service";

@Component({
  selector:'app-my-goals',
  templateUrl: './my-goals.component.html',
  styleUrls: ['./my-goals.component.css']
})
export class MyGoalsComponent implements OnInit,OnDestroy{

  mode="myProfile";
  goals:Goal[] = [];
  isLoading = false;
  userIsAuthenticated = false;
  userId!: string;
  user: AuthData={
    id:null,
    Imie:null,
    Nazwisko:null,
    email:null,
    password:null,
    imagePath:null
  };

  constructor(public goalsService: GoalsService,private authService: AuthService, private route: ActivatedRoute ){}


  private goalsSub: Subscription = new Subscription;
  private authStatusSub: Subscription = new Subscription;;

  ngOnInit(){
    this.isLoading = true;
    this.goalsService.getGoals();

    this.goalsSub = this.goalsService.getGoalsUpdateListener().subscribe((goals: Goal[])=>{
      this.isLoading = false;
      this.goals=goals;
    });

    this.route.paramMap.subscribe((paramMap: ParamMap)=>{
      if(paramMap.has("userId")){
        this.mode="userProfile";
        this.userId = paramMap.get('userId')!;
        this.isLoading=true;
        this.authService.getUser(this.userId!).subscribe(userData=>{
          this.isLoading=false;
          this.user = {
            id:userData._id,
            Imie:userData.Imie,

            Nazwisko:userData.Nazwisko,
            email:userData.email,

            password:userData.password,
            imagePath:userData.imagePath};
        });
      }else{
        this.mode="myProfile";
        this.userId =this.authService.getUserId();
      }
    });

    this.userIsAuthenticated = this.authService.getIsAuth();
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


}
