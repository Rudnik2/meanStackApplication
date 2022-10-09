import { Component,OnDestroy,OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { Goal } from "../goals/goal.model";
import { GoalsService } from "../goals/goals.service";

@Component({
  selector:'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit,OnDestroy{

  goals:Goal[] = [];
  isLoading = false;
  userIsAuthenticated = false;
  userId!: string;

  constructor(public goalsService: GoalsService,private authService: AuthService){}


  private goalsSub: Subscription = new Subscription;
  private authStatusSub: Subscription = new Subscription;;

  ngOnInit(){
    this.isLoading = true;
    this.goalsService.getGoals();

    this.userId = this.authService.getUserId();
    this.goalsSub = this.goalsService.getGoalsUpdateListener().subscribe((goals: Goal[])=>{
      this.isLoading = false;
      this.goals=goals;
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
