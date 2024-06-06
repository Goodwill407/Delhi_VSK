import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { LoginClass } from '../login-page/login-page.component';
import { CommunicationService } from '../services/communication.service';
import { HttpServiceService } from '../services/http-service.service';

@Component({
  selector: 'app-login-page-otp',
  templateUrl: './login-page-otp.component.html',
  styleUrls: ['./login-page-otp.component.css']
})
export class LoginPageOtpComponent {
  loginForm: any = FormGroup;
  submitted: boolean = false;
  loginModel!: LoginClass;
  setLoginType: string = "";
  @Output() loginFlag = new EventEmitter<boolean>();
  communicationServiceMobile: any;
  OtpFlag: boolean = false;
  enterOtp: any = '';
  Selected_Role: any = '';
  Mobile_number: any;
  user: any;
  resendOtpEnabled: boolean = false;
  countdownTimer: number = 120;
  error: any;

  constructor(private fb: FormBuilder, private httpService: HttpServiceService, private route: ActivatedRoute, private router: Router, private spinner: NgxSpinnerService, private toastr: ToastrService, private communicationService: CommunicationService) {
    const user: any = JSON.parse(sessionStorage.getItem('userProfile')!);
    if (user) {
      this.router.navigateByUrl('/dashboard');
    }
    this.communicationServiceMobile = this.communicationService.isMobile;
  }

  ngOnInit() {
    this.initializeSaveFormValidations();
    this.route.queryParams.subscribe(params => {
      // this.portal = params['portal'];
    });
    this.checkIfAlreadyLogin();
    this.loginFlag.emit(false);
  }

  initializeSaveFormValidations() {
    this.loginForm = this.fb.group({
      userId: ['', Validators.required],
      Role: ['', Validators.required],
    });
  }

  checkIfAlreadyLogin() {
    const user = JSON.parse(sessionStorage.getItem('userProfile') || '{}');
    if (user) {
      if (user.role == "school") {
        this.router.navigateByUrl('contrnt/school');
      } else if (user.role == "district" || user.role == "zone" || user.role == "admin") {
        this.router.navigateByUrl('/content/admin-dashboard');
      }
    }
  }

  get f() { return this.loginForm.controls; }

  submitForm() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    } else {
      this.GetOtp();
      this.startCountdown()
    }
  }

  GetOtp() {
    this.spinner.show();
    const userId = this.loginForm.value.userId;
    this.httpService.post('auth/send-otp?userId=' + userId, userId).subscribe((data: any) => {
      if (data) {
        this.Mobile_number = data.mobNo;
        this.user = data.user;

        this.OtpFlag = true;
      }
      this.spinner.hide();
    }, (error) => {
      this.error = 'Invalid User Id'
      this.toastr.error('', 'Email Username or Password!');
      this.spinner.hide();
    });
  }

  verifyOTP() {
    const OTP = Number(this.enterOtp);
    const postData = {
      mobNo: this.Mobile_number.toString(),
      otp: OTP,
      role: this.loginForm.value.Role,
      assignedTO: this.user
    };

    this.httpService.post(`auth/verify-otp?mobNo=${this.Mobile_number.toString()}&otp=${OTP}&assignedTO=${this.user}&role=${this.loginForm.value.Role}`,postData).subscribe((response: any) => {
      if (response.user) {
        // const userRole = {
        //   role: this.loginForm.value.Role,
        //   userName: this.user
        // };
        // sessionStorage.setItem('userProfile', JSON.stringify(userRole));
        sessionStorage.setItem('userProfile', JSON.stringify(response.user));
        this.communicationService.setLoginDetails(response);
        if(response.user.role == 'zone'){
          this.router.navigateByUrl('/school');
        }else{
          this.router.navigateByUrl('/content/admin-dashboard');
        }
        this.loginFlag.emit(true);
      }
    }, (error) => {
      this.error = error
      this.toastr.error('OTP does not Match !!')
    });
  }
  // start resend otp stopwatch
  startCountdown() {
    this.resendOtpEnabled = false;
    this.countdownTimer = 120; // Reset the countdown timer
    const countdownInterval = setInterval(() => {
      this.countdownTimer--;
      if (this.countdownTimer <= 0) {
        clearInterval(countdownInterval);
        this.resendOtpEnabled = true;
      }
    }, 1000);
  }
  // Function to resend OTP
  resendOTP() {
    // this.GetOtp()
    const userId = this.loginForm.value.userName;
    this.httpService.post('auth/send-otp?userId=' + userId, userId).subscribe((data: any) => {
      if (data) {
        this.Mobile_number = data.mobNo;
        this.user = data.user;

        this.OtpFlag = true;
      }
      this.resendOtpEnabled = false;
      this.startCountdown();
    })
    // Disable the resend OTP button again

  }
}