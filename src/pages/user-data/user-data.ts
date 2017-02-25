import { ApiService } from '../../providers/api-service';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';



@Component({
  selector: 'page-user-data',
  templateUrl: 'user-data.html'
})
export class UserDataPage {

  hcp: number;
  club: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private apiService: ApiService, 
    private viewCtrl: ViewController,
    private loadingCtrl: LoadingController
  ) {}

  ionViewDidLoad() {
    if (this.navParams.data.label === 'hcp') {
      this.hcp = this.navParams.data.value;
      console.log('thisnav', this.navParams)
      console.log('hcp', this.hcp);
    } else {
      this.club = this.navParams.data.value;
    }
  }

  closeDialog () {
    this.viewCtrl.dismiss();
  }

  async update () {

    let req = this.navParams.data.label === 'hcp' ? {hcp: this.hcp} : {club: this.club};

    let loader = this.loadingCtrl.create(
      { content: "Tallennetaan..." }
    );

    loader.present ();
    await this.apiService.updateUser(req, this.navParams.data.user);
    loader.dismiss();
    
    this.closeDialog();
  }

}
