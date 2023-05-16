import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { AuthData } from '../auth/auth-data.model';
import { NotificationService } from '../notification/notification.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  userId: any;
  private authListenerSubs!: Subscription;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  onLogout() {
    this.authService.logout();
  }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.notificationService.updateSummary();
      });
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
