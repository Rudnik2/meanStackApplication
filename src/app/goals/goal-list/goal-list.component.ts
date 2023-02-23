import { Component,OnDestroy,OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthData } from "src/app/auth/auth-data.model";
import { AuthService } from "src/app/auth/auth.service";
import { Goal } from "../goal.model";
import { GoalsService } from "../goals.service";

@Component({
  selector:'app-goal-list',
  templateUrl: './goal-list.component.html',
  styleUrls: ['./goal-list.component.css']
})
export class GoalListComponent implements OnInit,OnDestroy{

  goals:Goal[] = [];
  followGoals:Goal[] = [];
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
  isLoading = false;
  userIsAuthenticated = false;
  userId!: string;

  constructor(public goalsService: GoalsService,private authService: AuthService){}


  private goalsSub: Subscription = new Subscription;
  private authStatusSub: Subscription = new Subscription;

  ngOnInit(){
    this.isLoading = true;
    this.goalsService.getGoals();
    this.userId = this.authService.getUserId();

    this.goalsSub = this.goalsService.getGoalsUpdateListener().subscribe((goals: Goal[])=>{
      this.isLoading = false;
      this.goals=goals;

      if(this.userIsAuthenticated){
        this.authService.getUser(this.authService.getUserId()).subscribe(userData=>{
          this.user.id = userData._id,
          this.user.Imie = userData.Imie,
          this.user.Nazwisko = userData.Nazwisko,
          this.user.email = userData.email
          this.user.password = userData.password,
          this.user.imagePath = userData.imagePath,
          this.user.followers = userData.followers,
          this.user.followings = userData.followings
          for(let goal of this.goals){
            if(this.user.followings.includes(goal.creator!)){
              this.followGoals.push(goal);
            }
          }
        });
      }
    });

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated=>{
       this.userIsAuthenticated = isAuthenticated;
       this.userId = this.authService.getUserId();
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
