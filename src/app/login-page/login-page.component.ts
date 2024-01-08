import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpServiceService } from '../services/http-service.service';
import { ToastrService } from 'ngx-toastr';
import { CommunicationService } from '../services/communication.service';

export interface LoginClass {
  userName: string,
  Role: string

  
}
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {

  loginForm!: FormGroup;
  
  submitted: boolean = false;
  loginModel!: LoginClass;
  setLoginType: string = "admin";
  @Output() loginFlag = new EventEmitter<boolean>(); 
  communicationServiceMobile: any;

  OtpFlag: boolean=false
  enteredOTP: string = '';
  Selected_Role:any=''
  Mobile_number:any;
  user:any;
  

  constructor(private fb: FormBuilder, private httpService: HttpServiceService, private route: ActivatedRoute, private router: Router, private spinner: NgxSpinnerService, private toastr: ToastrService,private communicationService:CommunicationService) {
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
      'userName': new FormControl(''),
      'Role': new FormControl(''),
      'enteredOTP': new FormControl(''),
       });
  }

  checkIfAlreadyLogin() {
    const user = JSON.parse(sessionStorage.getItem('userProfile') || '{}');
    if (user) {
      if (user.role == "school") {
        this.router.navigateByUrl('contrnt/school');
      } else if (user.role == "district") {
        this.router.navigateByUrl('content/admin-dashboard');
      } else if (user.role == "zone") {
        this.router.navigateByUrl('content/admin-dashboard');
      } else if (user.role == "admin") {
        this.router.navigateByUrl('/content/admin-dashboard');
      }
    }
  }

  get f() { return this.loginForm.controls; }

  submitForm() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    else {
      this.GetOtp();
    }
  }

 
  GetOtp() {
      this.spinner.show();
     
      const userId=this.loginForm.value.userName;
  
      this.httpService.post('auth/send-otp?userId='+ userId, userId).subscribe((data: any) => {
        if (data) {
          this.Mobile_number =data.mobNo;
          this.user =data.user;
          this.toastr.success('', 'Logged in succesfully!');
          sessionStorage.setItem('userProfile', JSON.stringify(data.user));
          this.OtpFlag=true
            
        }
        this.spinner.hide();
      }, (error) => {
        this.toastr.error('', 'Email Username or Password !');
        this.spinner.hide();
      })
    }
 
  

    verifyOTP() {
      const OTP=Number(this.loginForm.value.enteredOTP)
     const postData = {
      mobNo: this.Mobile_number.toString(),
      otp: OTP
    };
    
   
    this.httpService.post('auth/verify-otp?mobNo=' + this.Mobile_number.toString() + '&otp=' + OTP,postData).subscribe((response:any) => {
        if (response.message =="OTP Verified successfully") {
        const  userRole={
          role:this.loginForm.value.Role,
          userName: this.user
        }
          sessionStorage.setItem('userProfile', JSON.stringify(userRole));
          const user   =  JSON.parse(sessionStorage.getItem('userProfile') || '{}');
         
          if(user.role =='admin'){
            this.router.navigateByUrl('/content/admin-dashboard');
            this.loginFlag.emit(true)
          }
          else if(user.role !== 'admin'){
            this.router.navigateByUrl('/school');
            this.loginFlag.emit(true)
          }
          // console.log('success');
          

        }

      }, (error)=> {
        
        // Handle error if necessary
        console.error('Error verifying OTP:', error);
      })
      }

   
 
  }        
         

  

  

