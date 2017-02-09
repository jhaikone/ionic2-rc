import { ToasterService } from '../../providers/toaster-service';
import { CustomValidator } from '../../environment/custom-validator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, ViewChild } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';

@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html'
})

export class SignUpPage {
  
  @ViewChild(Slides) slides: Slides;

  errorMessage: string = "Täytä puuttuvat kentät: ";

  public signupForm: any = this.formBuilder.group({
    firstName: ["", Validators.required],
    lastName: [""],
    hcp: ["", Validators.required],
    club: [""],
    email: ["", Validators.required],
    password: ["", [Validators.required, Validators.minLength(6)]]
  });

  constructor(private navCtrl: NavController, private formBuilder: FormBuilder, private toasterService: ToasterService) {}

  validateHCP(event) {
    CustomValidator.hcp(event, this.signupForm.value.hcp);
  }

  signUp() {
    console.log('this', this);
  }

  validateSlideChange() {
    if (this.slides.swipeDirection === 'next' && this.isBasicFormInvalid()) {
      this.slides.slidePrev();
      this.showErrorMessages();
    }
    
  }

  slideToNext() {
    if (this.isBasicFormInvalid()) {
      this.showErrorMessages();
    } else {
      this.slides.slideNext();
    }
  }

  private isBasicFormInvalid() {
    return this.signupForm.controls.firstName.invalid || this.signupForm.controls.hcp.invalid;
  }

  private showErrorMessages() {
      let messages = [];
      
      if (this.signupForm.controls.firstName.invalid) {
        messages.push('Etunimi')
      } 
      if (this.signupForm.controls.hcp.invalid) {
        messages.push('Pelitasoitus')
      }

      let message = this.errorMessage + messages.join(','); 

      this.toasterService.invalid(message);
  }

}
