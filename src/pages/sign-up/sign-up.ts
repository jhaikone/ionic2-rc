import { DashboardPage } from '../dashboard/dashboard-page';
import { StorageKeys } from './../../environment/environment';
import { Storage } from '@ionic/storage';
import { ApiService } from './../../providers/api-service';
import { SignUpConfirmationPage } from './sign-up-confirmation/sign-up-confirmation';
import { ModalService } from '../../providers/modal-service';
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

  constructor(private navCtrl: NavController, private formBuilder: FormBuilder, private toasterService: ToasterService, private apiService: ApiService, private storage: Storage) {}

  validateHCP(event) {
    CustomValidator.hcp(event, this.signupForm.value.hcp);
  }

  async signUp() {
    if (this.isCredFromInvalid()) {
      this.showErrorMessages();
    } else {
      console.log('kirjaudutaan...')
      let signUpData = await this.apiService.signUp(this.signupForm.value);
      let signInData = await this.apiService.signIn(signUpData.username, this.signupForm.value.password);
      console.log('signin', signInData);
      signInData.hcp = this.signupForm.value.hcp;
      signInData.club = this.signupForm.value.club;
      await this.storage.set(StorageKeys.userData, signInData);
      this.navCtrl.setRoot(DashboardPage);
    }
  }

  validateSlideChange(event) {
    
    if (event.getPreviousIndex() !== 1 && this.isBasicFormInvalid()) {
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

  private isCredFromInvalid() {
    return this.signupForm.controls.email.invalid || this.signupForm.controls.password.invalid;
  }

  private showErrorMessages() {
      if (this.signupForm.controls.password.errors && this.signupForm.controls.password.errors.minlength) {
        this.toasterService.invalid('Salasanan oltava vähintään ' + this.signupForm.controls.password.errors.minlength.requiredLength + ' merkkiä pitkä');
        return;
      }

      let messages = [];
      let index = this.slides.realIndex;
      if (this.signupForm.controls.firstName.invalid && index === 0) {
        messages.push('Etunimi')
      } 
      if (this.signupForm.controls.hcp.invalid && index === 0) {
        messages.push('Pelitasoitus')
      }

      if (this.signupForm.controls.email.invalid && index === 1) {
        messages.push('Sähköpostiosoite');
      }

      if (this.signupForm.controls.password.invalid && index === 1) {
        messages.push('Salasana');
      }

      let message = this.errorMessage + messages.join(','); 

      this.toasterService.invalid(message);
  }

}
