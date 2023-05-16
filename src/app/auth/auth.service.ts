import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { AuthData } from './auth-data.model';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';
import { response } from 'express';

const BACKEND_URL = environment.apiUrl + '/user/';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = false;
  private token!: string;
  private userId!: string;
  refresh = new Subject<void>();
  private Nazwisko!: string;
  private Imie!: string;
  private email!: string;

  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();

  private users: AuthData[] = [];
  private usersUpdated = new Subject<AuthData[]>();

  constructor(private http: HttpClient, private router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  getToken() {
    return this.token;
  }
  getIsAuth() {
    return this.isAuthenticated;
  }
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
  getUserId() {
    return this.userId;
  }

  createUser(imie: string, nazwisko: string, email: string, password: string) {
    const now = new Date();
    const authData: AuthData = {
      Imie: imie,
      Nazwisko: nazwisko,
      email: email,
      password: password,
      summaryType: 'Miesieczne',
      summaryNotificationDate: now,
    };
    this.http.post<any>(BACKEND_URL + 'signup', authData).subscribe(
      (response) => {
        this.followUser(
          response.result._id,
          response.result.Imie,
          response.result.Nazwisko,
          response.result.Email,
          response.result.password,
          response.result.ImagePath,
          response.result.followers,
          response.result.followings,
          '6463548195bb1c8feb03c3de'
        );
        this.followUser(
          response.result._id,
          response.result.Imie,
          response.result.Nazwisko,
          response.result.Email,
          response.result.password,
          response.result.ImagePath,
          response.result.followers,
          response.result.followings,
          '646355d195bb1c8feb03c416'
        );
        this.router.navigate(['/login']);
      },
      (error) => {
        console.log(error);
        this.authStatusListener.next(false);
      }
    );
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        BACKEND_URL + '/login',
        authData
      )
      .subscribe(
        (response) => {
          const token = response.token;
          this.token = token;
          if (token) {
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.userId = response.userId;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            this.saveAuthData(token, expirationDate, this.userId);
            this.router.navigate(['/newsFeed']);
          }
        },
        (error) => {
          this.authStatusListener.next(false);
        }
      );
  }

  logout() {
    this.token != null;
    this.userId != null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation!.expirationDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.token = authInformation!.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId!;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  getUser(id: string) {
    return this.http.get<{
      _id: string;
      Imie: string;
      Nazwisko: string;
      email: string;
      password: string;
      imagePath: string;
      followers: Array<string>;
      followings: Array<string>;
      summaryType: string;
      summaryNotificationDate: Date;
    }>(BACKEND_URL + id);
  }

  getUsers() {
    this.http
      .get<{ message: string; users: any }>(BACKEND_URL)
      .pipe(
        map((userData) => {
          return userData.users.map(
            (user: {
              _id: any;
              Imie: any;
              Nazwisko: any;
              email: any;
              password: any;
              imagePath: any;
              summaryType: any;
              summaryNotificationDate: any;
            }) => {
              return {
                id: user._id,
                Imie: user.Imie,
                Nazwisko: user.Nazwisko,
                email: user.email,
                password: user.password,
                imagePath: user.imagePath,
                summaryType: user.summaryType,
                summaryNotificationDate: user.summaryNotificationDate,
              };
            }
          );
        })
      )
      .subscribe((transformedUsers) => {
        this.users = transformedUsers;
        this.usersUpdated.next([...this.users]);
      });
  }

  changeImage(
    id: string,
    Imie: string,
    Nazwisko: string,
    email: string,
    password: string,
    image: File,
    followers: Array<string>,
    followings: Array<string>
  ) {
    const userData = new FormData();
    userData.append('id', id);
    userData.append('Imie', Imie);
    userData.append('Nazwisko', Nazwisko);
    userData.append('email', email);
    userData.append('password', password);
    userData.append('image', image);

    this.http
      .put(BACKEND_URL + 'changeImage/' + id, userData)
      .subscribe((res: any) => {
        console.log(res.imagePath);
        const user: AuthData = {
          id: id,
          Imie: Imie,
          Nazwisko: Nazwisko,
          email: email,
          password: password,
          imagePath: res.imagePath,
          followers: followers,
          followings: followings,
        };
        const updatedUsers = [...this.users];
        const oldUserIndex = updatedUsers.findIndex((p) => p.id === id);
        updatedUsers[oldUserIndex] = user;
        this.users = updatedUsers;
        this.usersUpdated.next([...this.users]);
        this.router.navigate(['/newsFeed']);
      });
  }

  followUser(
    currentUserId: string,
    currentUserImie: string,
    currentUserNazwisko: string,
    currentUserEmail: string,
    currentUserPassword: string,
    currentUserImagePath: string,
    currentUserfollowers: Array<string>,
    currentUserfollowings: Array<string>,
    followUserId: string
  ) {
    const user: AuthData = {
      id: currentUserId,
      Imie: currentUserImie,
      Nazwisko: currentUserNazwisko,
      email: currentUserEmail,
      password: currentUserPassword,
      imagePath: currentUserImagePath,
      followers: currentUserfollowers,
      followings: currentUserfollowings,
    };

    this.http
      .put(BACKEND_URL + 'follow/' + followUserId, user)
      .subscribe((res: any) => {
        const updatedUsers = [...this.users];
        const oldUserIndex = updatedUsers.findIndex((p) => p.id === user.id);
        updatedUsers[oldUserIndex] = user;
        this.users = updatedUsers;
        this.usersUpdated.next([...this.users]);
        this.router.navigate(['/profile/' + followUserId]);
      });
  }
  unfollowUser(
    currentUserId: string,
    currentUserImie: string,
    currentUserNazwisko: string,
    currentUserEmail: string,
    currentUserPassword: string,
    currentUserImagePath: string,
    currentUserfollowers: Array<string>,
    currentUserfollowings: Array<string>,
    followUserId: string
  ) {
    const user: AuthData = {
      id: currentUserId,
      Imie: currentUserImie,
      Nazwisko: currentUserNazwisko,
      email: currentUserEmail,
      password: currentUserPassword,
      imagePath: currentUserImagePath,
      followers: currentUserfollowers,
      followings: currentUserfollowings,
    };

    this.http
      .put(BACKEND_URL + 'unfollow/' + followUserId, user)
      .subscribe((res: any) => {
        const updatedUsers = [...this.users];
        const oldUserIndex = updatedUsers.findIndex((p) => p.id === user.id);
        updatedUsers[oldUserIndex] = user;
        this.users = updatedUsers;
        this.usersUpdated.next([...this.users]);
        this.router.navigate(['/profile/' + followUserId]);
      });
  }

  updateSummary(
    userId: string,
    summaryType: string,
    summaryNotificationDate: Date
  ) {
    const user: AuthData = {
      id: userId,
      summaryType: summaryType,
      summaryNotificationDate: summaryNotificationDate,
    };

    this.http
      .put(BACKEND_URL + 'notification/' + userId, user)
      .subscribe((res: any) => {
        const updatedUsers = [...this.users];
        const oldUserIndex = updatedUsers.findIndex((p) => p.id === user.id);
        updatedUsers[oldUserIndex] = user;
        this.users = updatedUsers;
        this.usersUpdated.next([...this.users]);
      });
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
    };
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }
  getUsersUpdateListener() {
    return this.usersUpdated.asObservable();
  }

  verifyUser(code: string) {
    this.http
      .get(BACKEND_URL + 'confirm/' + code)
      .subscribe((response: any) => {
        return response.data;
      });
  }

  requestReset(body: any): Observable<any> {
    return this.http.post(BACKEND_URL + `/req-reset-password`, body);
  }

  newPassword(body: any): Observable<any> {
    return this.http.post(BACKEND_URL + `/new-password`, body);
  }

  ValidPasswordToken(body: any): Observable<any> {
    return this.http.post(BACKEND_URL + '/valid-password-token', body);
  }
}
