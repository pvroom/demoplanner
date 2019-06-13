webpackJsonp([6],{

/***/ 908:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProfileImagePageModule", function() { return ProfileImagePageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__profileimage__ = __webpack_require__(929);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



let ProfileImagePageModule = class ProfileImagePageModule {
};
ProfileImagePageModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2__profileimage__["a" /* ProfileImagePage */],
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["IonicPageModule"].forChild(__WEBPACK_IMPORTED_MODULE_2__profileimage__["a" /* ProfileImagePage */]),
        ],
        exports: [
            __WEBPACK_IMPORTED_MODULE_2__profileimage__["a" /* ProfileImagePage */]
        ]
    })
], ProfileImagePageModule);

//# sourceMappingURL=profileimage.module.js.map

/***/ }),

/***/ 929:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProfileImagePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_storage__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_common_http__ = __webpack_require__(86);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_database_database__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_localstorage_localstorage__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_native_camera__ = __webpack_require__(473);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__angular_platform_browser__ = __webpack_require__(37);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// Components, functions, plugins









let ProfileImagePage = class ProfileImagePage {
    constructor(navParams, navCtrl, alertCtrl, storage, databaseprovider, cd, view, loadingCtrl, http, camera, _DomSanitizer, localstorage) {
        this.navParams = navParams;
        this.navCtrl = navCtrl;
        this.alertCtrl = alertCtrl;
        this.storage = storage;
        this.databaseprovider = databaseprovider;
        this.cd = cd;
        this.view = view;
        this.loadingCtrl = loadingCtrl;
        this.http = http;
        this.camera = camera;
        this._DomSanitizer = _DomSanitizer;
        this.localstorage = localstorage;
    }
    addCameraImage() {
        const options = {
            quality: 100,
            targetWidth: 900,
            targetHeight: 600,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            correctOrientation: true,
            mediaType: this.camera.MediaType.PICTURE,
            sourceType: 1
        };
        this.camera.getPicture(options).then((imageData) => {
            // imageData is either a base64 encoded string or a file URI
            // If it's base64:
            console.log('Camera image');
            //let base64Image = 'data:image/jpeg;base64,' + imageData;
            //this.ProfileImageAttachment = base64Image;
            this.ProfileImageAttachment = 'data:image/jpeg;base64,' + imageData;
            this.cd.markForCheck();
        }, (err) => {
            // Handle error
            console.log('Camera error');
        });
    }
    addGalleryImage() {
        const options = {
            quality: 80,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            correctOrientation: true,
            allowEdit: true,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
        };
        this.camera.getPicture(options).then((imageData) => {
            // imageData is either a base64 encoded string or a file URI
            // If it's base64:
            console.log('Camera image');
            this.ProfileImageAttachment = 'data:image/jpeg;base64,' + imageData;
            this.cd.markForCheck();
        }, (err) => {
            // Handle error
            console.log('Camera error');
        });
    }
    ionViewDidEnter() {
        var DevicePlatform = this.localstorage.getLocalValue('DevicePlatform');
        // Disable access to camera and gallery buttons when running in a browser
        // until the ability to pull an image via the browser can be implemented
        if (DevicePlatform == 'Browser') {
            console.log('Browser button settings');
            this.deviceButtons = false;
            this.browserButtons = true;
        }
        else {
            console.log('Device button settings');
            this.deviceButtons = true;
            this.browserButtons = false;
        }
        this.cd.markForCheck();
    }
    /*
    closeModal(UserAction) {
        
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');

        if (UserAction == "Save") {

            // Load initial data set here
            let loading = this.loadingCtrl.create({
                spinner: 'crescent',
                content: 'Saving your profile image...'
            });

            loading.present();

            var NewFilename = AttendeeID;
            console.log('New filename: ' + NewFilename);
                        
            let url = 'https://naeyc.convergence-us.com/AdminGateway/image_uploader.php';
            let postData = new FormData();
            postData.append('file', this.ProfileImageAttachment);
            postData.append('location', 'Attendees');
            postData.append('filename', NewFilename);
            postData.append('AttendeeID', AttendeeID);
            
            let data:Observable<any> = this.http.post(url, postData);
            
            data.subscribe((result) => {
                
                console.log("Image uploaded: " + JSON.stringify(result));
                loading.dismiss();
                this.view.dismiss(UserAction);

            });
                            
        }
        
        if (UserAction == "Cancel") {
            this.view.dismiss(UserAction);
        }
        
    }
    */
    closePage(UserAction) {
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        if (UserAction == "Save") {
            // Load initial data set here
            let loading = this.loadingCtrl.create({
                spinner: 'crescent',
                content: 'Saving your profile image...'
            });
            loading.present();
            var NewFilename = AttendeeID;
            console.log('New filename: ' + NewFilename);
            let url = 'https://aacdmobile.convergence-us.com/AdminGateway/2019/image_uploader.php';
            let postData = new FormData();
            postData.append('file', this.ProfileImageAttachment);
            postData.append('location', 'Attendees');
            postData.append('filename', NewFilename);
            postData.append('AttendeeID', AttendeeID);
            let data = this.http.post(url, postData);
            data.subscribe((result) => {
                console.log("Image uploaded: " + JSON.stringify(result));
                loading.dismiss();
                this.navCtrl.pop();
            }, err => {
                loading.dismiss();
                let alert = this.alertCtrl.create({
                    title: 'Image Upload Error',
                    subTitle: 'Problem receiving feedback from server - check log.',
                    buttons: ['OK']
                });
                alert.present();
                console.log(err.status);
                console.log("Image uploader error: ", JSON.stringify(err));
            });
        }
        if (UserAction == "Cancel") {
            this.navCtrl.pop();
        }
    }
};
ProfileImagePage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-profileimage',template:/*ion-inline-start:"/Users/petervroom/demoplanner/src/pages/profileimage/profileimage.html"*/'<ion-header>\n\n	<ion-navbar color="primary">\n		<ion-title>Add a Profile Image</ion-title>\n	</ion-navbar>\n\n</ion-header>\n\n\n<ion-content>\n<!-- Posting picture attachment -->\n<img class="center" [src]="_DomSanitizer.bypassSecurityTrustUrl(ProfileImageAttachment)" onerror="this.src=\'assets/img/missing-image.png\'">\n\n<!-- Button controls -->\n<ion-grid *ngIf=deviceButtons>\n	<ion-row>\n		<ion-col col-3 >\n			<button ion-button color="secondary" (click)="closePage(\'Cancel\')">\n				Cancel\n			</button>\n		</ion-col>\n		<ion-col col-3 >\n			<button color="secondary" ion-button  (click)="addGalleryImage()">\n				Gallery\n			</button>\n		</ion-col>\n		<ion-col col-3 >\n			<button color="secondary" ion-button  (click)="addCameraImage()">\n				Camera\n			</button>\n		</ion-col>\n		<ion-col col-3 >\n			<button color="secondary" ion-button  (click)="closePage(\'Save\')">\n				Save\n			</button>\n		</ion-col>\n	</ion-row>\n</ion-grid>\n\n		<ion-grid *ngIf=browserButtons>\n			<ion-row>\n				<ion-col col-3 >\n					<button ion-button color="secondary" (click)="closePage(\'Cancel\')">\n						Cancel\n					</button>\n				</ion-col>\n				<ion-col col-6 >\n					<p style="text-align:center;">Please use the mobile app to upload an image</p>\n				</ion-col>\n				<ion-col col-3 >\n					<button ion-button color="secondary" (click)="closePage(\'Save\')">\n						Save\n					</button>\n				</ion-col>\n			</ion-row>\n		</ion-grid>\n		\n</ion-content>\n'/*ion-inline-end:"/Users/petervroom/demoplanner/src/pages/profileimage/profileimage.html"*/,
        changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["AlertController"],
        __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */],
        __WEBPACK_IMPORTED_MODULE_5__providers_database_database__["a" /* Database */],
        __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["ViewController"],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["LoadingController"],
        __WEBPACK_IMPORTED_MODULE_3__angular_common_http__["a" /* HttpClient */],
        __WEBPACK_IMPORTED_MODULE_7__ionic_native_camera__["a" /* Camera */],
        __WEBPACK_IMPORTED_MODULE_8__angular_platform_browser__["c" /* DomSanitizer */],
        __WEBPACK_IMPORTED_MODULE_6__providers_localstorage_localstorage__["a" /* Localstorage */]])
], ProfileImagePage);

//# sourceMappingURL=profileimage.js.map

/***/ })

});
//# sourceMappingURL=6.js.map