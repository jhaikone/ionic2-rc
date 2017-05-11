import { StorageKeys } from './../../../environment/environment';
import { ErrorService } from './../../../providers/error-service';
import { Storage } from '@ionic/storage';
import { UserDataInterface } from '../../../environment/user-data-interface';
import { UserDataPage } from './../../../pages/user-data/user-data';
import { ModalController, AlertController } from 'ionic-angular';
import { Component, Input } from '@angular/core';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';

@Component({
  selector: 'imagesnapper',
  template: `
    <div class="portrait-content" text-center>
        <div class="container">
          <div class="portrait" (click)="getPicture()"><img class="portrait-image" [src]="base64Image"\></div>
          <div class="circle">
            <button ion-button icon-only clear (click)="showPrompt($event)">
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
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true,
      cameraDirection: this.camera.Direction.FRONT
    };

    pickerOptions: ImagePickerOptions = {
      quality: 100,
      maximumImagesCount: 1
    }

    user: UserDataInterface;
    base64Image: String = '../assets/img/dashboard/portrait_test.jpg';

    constructor(
      private modalController: ModalController, 
      private storage: Storage, 
      private errorService: ErrorService, 
      private alertController: AlertController,
      private camera: Camera,
      private imagePicker: ImagePicker
    ) {}
    

    async ngOnInit () {
        this.user = await this.storage.get(StorageKeys.userData) || {};
        this.base64Image = this.user.imageUrl ? this.user.imageUrl : 'assets/img/dashboard/portrait_test.jpg';
    }

    showPrompt ($event) {
      console.log('event', $event);
      $event.preventDefault();
      let modal = this.modalController.create(UserDataPage, {label: 'hcp', user: this.user, value: this.user.hcp.toString()})
      modal.present();
    }
    
    async getPicture () {
      let alert = this.alertController.create();

      alert.setTitle('Kuvan valinta');
      alert.setMessage('Luodaanko uusi kuva vai käytetäänkö vanhaa kuvaa?');
      
      alert.addButton({
            text: 'Uusi kuva',
            handler: () => {
              this.options.sourceType = this.camera.PictureSourceType.CAMERA;
              this.takeImageByCamera();
            }
          }
      );

      alert.addButton({
            text: 'Galleria',
            handler: () => {
              this.options.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
              this.takeImageByGallery();
            }
          }
      );

      alert.present();
    }

    async takeImageByCamera() {
      try {
        let picture = await this.camera.getPicture(this.options);
        this.base64Image = 'data:image/jpeg;base64,' + picture;
        this.user.imageUrl = this.base64Image;
        await this.storage.set(StorageKeys.userData, this.user);

      } catch (error) {
        this.errorService.catch(error);
      }
    }

    async takeImageByGallery () {
      try {
        let hasReadPermission = await this.imagePicker.hasReadPermission();
        console.log('hasRead', hasReadPermission);
        if (!hasReadPermission) {
          let permission = await this.imagePicker.requestReadPermission();
          console.log('has permission', permission);
        }
          
        let picture = await this.imagePicker.getPictures(this.pickerOptions);
        console.log('picture', picture);
        this.base64Image = picture;
        this.user.imageUrl = this.base64Image;
        await this.storage.set(StorageKeys.userData, this.user);

      } catch (error) {
        this.errorService.catch(error);
      }

    }




}
