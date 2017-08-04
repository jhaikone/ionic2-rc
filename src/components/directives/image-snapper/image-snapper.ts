import { StorageKeys } from './../../../environment/environment';
import { ErrorService } from './../../../providers/error-service';
import { Storage } from '@ionic/storage';
import { UserDataInterface } from '../../../environment/user-data-interface';
import { AlertController } from 'ionic-angular';
import { Component, Input, ApplicationRef } from '@angular/core';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';

@Component({
  selector: 'imagesnapper',
  template: `
    <div class="portrait-content" text-center>
        <div class="container">
          <div class="portrait" (click)="getPicture()"><img class="portrait-image" [src]="base64Image"\></div>
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

    user: UserDataInterface;

    selectorWheelOptions: any = {
    };

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

  
    base64Image: String = '../assets/img/dashboard/portrait_test.jpg';

    constructor(
      private storage: Storage, 
      private errorService: ErrorService, 
      private alertController: AlertController,
      private camera: Camera,
      private imagePicker: ImagePicker,
      private applicationRef: ApplicationRef
    ) {}
    

    async ngOnInit () {
        this.user = await this.storage.get(StorageKeys.userData) || {};
        this.base64Image = this.user.imageUrl ? this.user.imageUrl : 'assets/img/dashboard/portrait_test.jpg';
        this.selectorWheelOptions = {
            title: "Aseta pelitasoitus",
            items:[
              [this.generateNumbers(55)],
              [this.generateNumbers(10)]
                //how many items to display, see examples below
                //the order of the items dictates the order they are displayed in the UI
                //also the result has an index which refers to the ordering (see examples below)
            ],
            defaultItems: [
                this.getDefaultHCP(0),
                this.getDefaultHCP(1)
                //which items to display, example ["2","Apple"] (if items.length is 2 for instance)
            ],
            positiveButtonText: "Aseta",
            negativeButtonText: "Peru",
            theme: "light",  //lighter or darker theme, not available on iOS yet
            wrapWheelText: true, //wrap the wheel for infinite scroll, not available on iOS
            //advanced usage:
          // displayKey: "description" //so can send in different json - see examples below
        }
        console.log('items', this.selectorWheelOptions);
    }

    getDefaultHCP (index) {
      return this.user.hcp.toString().split('.')[index] || 0;
    }

    showPrompt () {
      this.selectorWheelOptions.defaultItems.length = 0;
      this.selectorWheelOptions.defaultItems.push(this.getDefaultHCP(0));
      this.selectorWheelOptions.defaultItems.push(this.getDefaultHCP(1));
      let self = this;
      console.log( (<any>window));
      (<any>window).SelectorCordovaPlugin.showSelector(this.selectorWheelOptions, function(result) {
          console.log("result: " + JSON.stringify(result) );
          self.setHCP((result));
      }, function() {
          console.log('Canceled');
      });
      // let modal = this.modalController.create(UserDataPage, {label: 'hcp', user: this.user, value: this.user.hcp.toString()})
      // modal.present();
    }

    async setHCP (data) {
      console.log('data', data);
      let hcp = Number(data[0].description) + Number(data[1].description)/10;
      console.log('hcp', hcp);
      this.user.hcp = hcp;
      console.log('user', this.user);
      await this.storage.set(StorageKeys.userData, this.user);
      this.applicationRef.tick();
    }

    generateNumbers (value) {
      let val = Array.apply(null, {length: value}).map(Number.call, Number);
      return val.map((value) => {
        return {'description': value.toString()};
      });
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
