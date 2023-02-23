import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators} from "@angular/forms";
import { AuthService } from "../auth/auth.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-request-reset',
  templateUrl:"./request-reset-password.component.html",
  styleUrls:["./request-reset-password.component.css"]
})
export class RequestResetComponent implements OnInit{

  RequestResetForm: FormGroup;
  forbiddenEmails: any;
  errorMessage: string;
  successMessage: string;
  IsvalidForm = true;

  constructor(
    private authService: AuthService,
    private router: Router,
   ) {

  }


  ngOnInit() {
    this.RequestResetForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email], this.forbiddenEmails),
    });
  }


  RequestResetUser(form:any) {
    console.log(form)
    if (form.valid) {
      this.IsvalidForm = true;
      this.authService.requestReset(this.RequestResetForm.value).subscribe(
        (data:any) => {
          this.RequestResetForm.reset();
          this.successMessage = "Reset password link send to email sucessfully.";
          setTimeout(() => {
            this.successMessage = null!;
            this.router.navigate(['login']);
          }, 3000);
        },
        (err:any) => {

          if (err.error.message) {
            this.errorMessage = err.error.message;
          }
        }
      );
    } else {
      this.IsvalidForm = false;
    }
  }
}
