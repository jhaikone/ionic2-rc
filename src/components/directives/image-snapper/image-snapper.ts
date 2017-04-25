import { ErrorService } from './../../../providers/error-service';
import { StorageKeys } from '../../../environment/environment';
import { Storage } from '@ionic/storage';
import { UserDataInterface } from '../../../environment/user-data-interface';
import { UserDataPage } from './../../../pages/user-data/user-data';
import { ModalController, AlertController } from 'ionic-angular';
import { Component, Input } from '@angular/core';

import { Camera, CameraOptions, ImagePicker, ImagePickerOptions } from 'ionic-native';

@Component({
  selector: 'imagesnapper',
  template: `
    <div class="portrait-content" text-center>
        <div class="container" (click)="getPicture()">
          <div class="portrait"><img class="portrait-image" [src]="base64Image ? base64Image : '../assets/img/dashboard/portrait_test.jpg'"\></div>
          <div class="circle">
            <button ion-button icon-only clear (click)="showPrompt()">
              <a ion-text class="font-small" color="primary">{{user?.hcp}}</a>
            </button>
          </div>
        </div>
    </div>
  ` 
})

export class ImageSnapper {

    @Input() img : any;

    options: CameraOptions = {
      quality: 100,
      destinationType: Camera.DestinationType.DATA_URL,
      encodingType: Camera.EncodingType.JPEG,
      mediaType: Camera.MediaType.PICTURE,
      allowEdit: true,
      cameraDirection: Camera.Direction.FRONT
    };

    pickerOptions: ImagePickerOptions = {
      quality: 100,
      maximumImagesCount: 1
    }

    user: UserDataInterface;
    base64Image: String = '../assets/img/dashboard/portrait_test.jpg';

    constructor(private modalController: ModalController, private storage: Storage, private errorService: ErrorService, private alertController: AlertController) {
      console.log('camera', Camera);
    }
    

    async ngOnInit () {
        this.user = await this.storage.get(StorageKeys.userData) || {};
    }

    showPrompt () {
      let modal = this.modalController.create(UserDataPage, {label: 'hcp', user: this.user, value: this.user.hcp.toString()})
      modal.present();
    }
    
    async getPicture () {
      let confirmSourceType = this.alertController.create({
        title: 'Kuvan valinta',
        message: 'Luodaanko uusi kuva vai käytetäänkö vanhaa kuvaa?',
        buttons: [
          {
            text: 'Uusi kuva',
            handler: () => {
              this.options.sourceType = Camera.PictureSourceType.CAMERA;
              this.takeImageByCamera();
            }
          },
            {
            text: 'Galleria',
            handler: () => {
              this.options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
              this.takeImageByGallery();
            }
          }
        ]
      });

      confirmSourceType.present();
    }

    async takeImageByCamera() {
      try {
        let picture = await Camera.getPicture(this.options);
        this.base64Image = 'data:image/jpeg;base64,' + picture;
        console.log('base', this.base64Image);
      } catch (error) {
        this.errorService.catch(error);
      }
    }

    async takeImageByGallery () {
      try {
        let hasReadPermission = await ImagePicker.hasReadPermission();
        if (!hasReadPermission) {
          let permission = await ImagePicker.requestReadPermission();
        }
          
        let picture = await ImagePicker.getPictures(this.pickerOptions);
        console.log('picture', picture);
        this.base64Image = picture;

      } catch (error) {
        this.errorService.catch(error);
      }

    }




}
