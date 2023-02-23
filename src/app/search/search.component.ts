import { animate, state, style, transition, trigger } from "@angular/animations";
import { Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { AuthData } from "../auth/auth-data.model";
import { Router } from "@angular/router";

@Component({
  selector:'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class SearchComponent implements OnInit,OnDestroy{
  searchTerm = '';
  displayedColumns: string[] = ['Profilowe','Imie', 'Nazwisko'];
  public dataSource: MatTableDataSource<any> = new MatTableDataSource<AuthData>()
  @ViewChild(MatSort) sort!: MatSort;

  user: AuthData={
    Imie:null,
    Nazwisko:null,
    email:null,
    password:null,
    imagePath:null
  };
  userIsAuthenticated = false;
  private authListenerSubs!: Subscription;
  private authStatusSub: Subscription = new Subscription;
  private userId: string;

  constructor(private authService: AuthService,private router: Router){}

  onLogout(){
    this.authService.logout();
  }

  ngOnInit(){
    this.userIsAuthenticated = this.authService.getIsAuth();

    if(this.userIsAuthenticated){
      this.authService.getUsers();
      this.userId = this.authService.getUserId();

      this.authStatusSub = this.authService.getUsersUpdateListener().subscribe((users:AuthData[])=>{

          const objWithIdIndex = users.findIndex((obj) => obj.id === this.userId);
          if(objWithIdIndex != -1){
            users.splice(objWithIdIndex, 1);
          }
          this.dataSource = new MatTableDataSource<AuthData>(users);
     });
    }
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated=>{
      this.userIsAuthenticated = isAuthenticated;
    });
  }
  ngOnDestroy(){
    this.authListenerSubs.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  filterCountries(searchTerm: string) {
    this.dataSource.filter = searchTerm.trim().toLocaleLowerCase();
    const filterValue = searchTerm;
    this.dataSource.filter = filterValue.toLowerCase();
  }

  onMatSortChange() {
    this.dataSource.sort = this.sort;
  }
  navigateTo(row: any){
    this.router.navigate(['/profile',row.id])
  }
}
