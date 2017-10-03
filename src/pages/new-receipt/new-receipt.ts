import { DatabaseQuery } from 'angularfire2/database/interfaces';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as moment from 'moment';
import { ReceiptsPage } from "../receipts/receipts";
import { Camera, CameraOptions } from '@ionic-native/camera';

@Component({
  selector: 'page-new-receipt',
  templateUrl: 'new-receipt.html',
})
export class NewReceiptPage implements OnInit {
  public dbList: any;
  public receiptsList: FirebaseListObservable<any[]>
  public receiptName: string;
  public receiptDescription: string;
  public receiptValue: number;
  public receiptImage: string;
  public receiptDate: number;
  public showSpinner: boolean = false;
  public imageTaken: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public database: AngularFireDatabase,
    public camera: Camera
  ) {
  }


  ngOnInit() {
    this.dbList = 'dydo/receiptsItems/';
    this.receiptsList = this.database.list(this.dbList);
  }

  ionViewDidEnter() {
    this.imageTaken = false;
  }

  takePicture() {
    this.showSpinner = true;
    const options: CameraOptions = {
      quality: 80,
      correctOrientation: true,
      saveToPhotoAlbum: true,
      targetWidth: 700,
      targetHeight: 700,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA,
    }

    this.camera.getPicture(options).then((imageData) => {
      this.receiptImage = 'data:image/jpeg;base64,' + imageData;
      this.imageTaken = true;
      this.showSpinner = false;
    }, (err) => {
      console.log('error');
      this.showSpinner = false;
    });
  }

  getPicture() {
    this.showSpinner = true;
    const options: CameraOptions = {
      quality: 80,
      correctOrientation: true,
      saveToPhotoAlbum: true,
      targetWidth: 700,
      targetHeight: 700,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }

    this.camera.getPicture(options).then((imageData) => {
      this.receiptImage = 'data:image/jpeg;base64,' + imageData;
      this.imageTaken = true;
      this.showSpinner = false;
    }, (err) => {
      console.log('error');
      this.showSpinner = false;
    });
  }

  addReceipt() {
    this.showSpinner = true;
    let promise = this.receiptsList.push({
      date: moment().unix(),
      description: this.receiptDescription,
      image: this.receiptImage,
      name: this.receiptName,
      value: Number(this.receiptValue)
    });
    promise
      .then(_ => {
        this.showSpinner = false;
        console.log('success');
      })
      .catch(err => {
        this.showSpinner = false;
        console.log(err, 'Something went wrong!');
      });
    this.navCtrl.push(ReceiptsPage);
  }

}
