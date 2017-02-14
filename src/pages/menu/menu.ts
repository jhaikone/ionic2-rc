import { Component } from '@angular/core';
import { MenuController} from 'ionic-angular';

/*
  Generated class for the Menu page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html'
})
export class MenuPage {

  constructor(private menu: MenuController) {}


  openMenu() {
   this.menu.open();
 }

}
