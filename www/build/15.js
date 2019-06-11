webpackJsonp([15],{

/***/ 911:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ActivityFeedPostingPageModule", function() { return ActivityFeedPostingPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__activityfeedposting__ = __webpack_require__(931);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



let ActivityFeedPostingPageModule = class ActivityFeedPostingPageModule {
};
ActivityFeedPostingPageModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2__activityfeedposting__["a" /* ActivityFeedPostingPage */],
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["IonicPageModule"].forChild(__WEBPACK_IMPORTED_MODULE_2__activityfeedposting__["a" /* ActivityFeedPostingPage */]),
        ],
        exports: [
            __WEBPACK_IMPORTED_MODULE_2__activityfeedposting__["a" /* ActivityFeedPostingPage */]
        ]
    })
], ActivityFeedPostingPageModule);

//# sourceMappingURL=activityfeedposting.module.js.map

/***/ }),

/***/ 931:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ActivityFeedPostingPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_storage__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_common_http__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_database_database__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_localstorage_localstorage__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_native_camera__ = __webpack_require__(526);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__angular_platform_browser__ = __webpack_require__(35);
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










let ActivityFeedPostingPage = class ActivityFeedPostingPage {
    constructor(navCtrl, navParams, storage, databaseprovider, cd, alertCtrl, view, http, loadingCtrl, camera, _DomSanitizer, localstorage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.databaseprovider = databaseprovider;
        this.cd = cd;
        this.alertCtrl = alertCtrl;
        this.view = view;
        this.http = http;
        this.loadingCtrl = loadingCtrl;
        this.camera = camera;
        this._DomSanitizer = _DomSanitizer;
        this.localstorage = localstorage;
    }
    addCameraImage() {
        const options = {
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            correctOrientation: true,
            mediaType: this.camera.MediaType.PICTURE
        };
        this.camera.getPicture(options).then((imageData) => {
            // imageData is either a base64 encoded string or a file URI
            // If it's base64:
            console.log('Camera image');
            /*
            if (this.platform.is('ios')) {
                this.base64Image = normalizeURL(imageData);
                // IF problem only occur in ios and normalizeURL
                //not work for you then you can also use
                //this.base64Image= imageData.replace(/^file:\/\//, '');
            } else {
                this.base64Image= "data:image/jpeg;base64," + imageData;
            }, error => {
                console.log('ERROR -> ' + JSON.stringify(error));
            });
            */
            this.ActivityFeedAttachment = 'data:image/jpeg;base64,' + imageData;
            //this.ActivityFeedAttachment = base64Image;
            this.localstorage.setLocalValue('ActivityFeedPostedImage', 'Y');
            this.cd.markForCheck();
        }, (err) => {
            // Handle error
            console.log('Camera error');
            console.log('Camera error: ' + JSON.stringify(err));
        });
    }
    addGalleryImage() {
        const options = {
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
            //if (this.platform.is('ios')) {
            //	imageData = _DomSanitizer.bypassSecurityTrustUrl(imageData);
            //}
            this.ActivityFeedAttachment = 'data:image/jpeg;base64,' + imageData;
            //this.ActivityFeedAttachment = base64Image;
            this.localstorage.setLocalValue('ActivityFeedPostedImage', 'Y');
            this.cd.markForCheck();
        }, (err) => {
            // Handle error
            console.log('Camera error');
            console.log('Camera error: ' + JSON.stringify(err));
        });
    }
    ionViewDidEnter() {
        this.ActivityFeedAttachment = '';
        this.localstorage.setLocalValue('ActivityFeedPostedImage', 'N');
        var CurrentDateTime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(/:/g, '').replace(/-/g, '').replace(' ', '');
        console.log('CurrentDateTime: ' + CurrentDateTime);
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
    closeModal(UserAction) {
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        if (UserAction == "Save") {
            var UserComment = this.CommentEntry || '';
            if (UserComment != '') {
                var afpImage = this.localstorage.getLocalValue('ActivityFeedPostedImage');
                // Load initial data set here
                let loading = this.loadingCtrl.create({
                    spinner: 'crescent',
                    content: 'Saving your posting and image...'
                });
                loading.present();
                var CurrentDateTime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
                var PostedDateTime = CurrentDateTime;
                CurrentDateTime = CurrentDateTime.replace(/T/, ' ').replace(/\..+/, '').replace(/:/g, '').replace(/-/g, '').replace(' ', '');
                var NewFilename = AttendeeID + '-' + CurrentDateTime;
                console.log('New filename: ' + NewFilename);
                //console.log('CommentEntry: ' + UserComment);
                //console.log('Image: ' + this.ActivityFeedAttachment);
                let url = 'https://demoplanner.convergence-us.com/AdminGateway/2019/image_uploader.php';
                let postData = new FormData();
                postData.append('file', this.ActivityFeedAttachment);
                postData.append('location', 'ActivityFeedAttachments');
                postData.append('filename', NewFilename);
                postData.append('Comment', UserComment);
                postData.append('afpImage', afpImage);
                postData.append('AttendeeID', AttendeeID);
                let data = this.http.post(url, postData);
                data.subscribe((Postingresult) => {
                    console.log("Image uploaded: " + JSON.stringify(Postingresult));
                    console.log('afID: ' + Postingresult.afID);
                    loading.dismiss();
                    this.view.dismiss(UserAction);
                    //var flags = 'ad|' + result.afID + '|' + UserComment + '|0|' + NewFilename + '.jpg|' + PostedDateTime;
                    //this.localstorage.setLocalValue('ActivityFeedFlags', flags);
                    //this.databaseprovider.getActivityFeedData(flags, AttendeeID).then(data3 => {
                    //	console.log("getActivityFeedData: " + JSON.stringify(data3));
                    //	if (data3['length']>0) {
                    //		console.log("Return status: " + data3[0].Status);
                    //		loading.dismiss();
                    //		this.view.dismiss(UserAction);
                    //	}
                    //}).catch(function () {
                    //	console.log("Activity Feed Promise Rejected");
                    //	loading.dismiss();
                    //});
                });
            }
            else {
                let alert = this.alertCtrl.create({
                    title: 'Posting Error',
                    subTitle: 'You cannot submit a posting with a blank comment.',
                    buttons: ['OK']
                });
                alert.present();
            }
        }
        if (UserAction == "Cancel") {
            this.view.dismiss(UserAction);
        }
    }
    closePage(UserAction) {
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        if (UserAction == "Save") {
            var afpImage = this.localstorage.getLocalValue('ActivityFeedPostedImage');
            // Load initial data set here
            let loading = this.loadingCtrl.create({
                spinner: 'crescent',
                content: 'Saving your posting and image...'
            });
            loading.present();
            var CurrentDateTime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
            var PostedDateTime = CurrentDateTime;
            CurrentDateTime = CurrentDateTime.replace(/T/, ' ').replace(/\..+/, '').replace(/:/g, '').replace(/-/g, '').replace(' ', '');
            var NewFilename = AttendeeID + '-' + CurrentDateTime;
            console.log('New filename: ' + NewFilename);
            var UserComment = this.CommentEntry || '';
            //console.log('CommentEntry: ' + UserComment);
            //console.log('Image: ' + this.ActivityFeedAttachment);
            let url = 'https://demoplanner.convergence-us.com/AdminGateway/2019/image_uploader.php';
            let postData = new FormData();
            postData.append('file', this.ActivityFeedAttachment);
            postData.append('location', 'ActivityFeedAttachments');
            postData.append('filename', NewFilename);
            postData.append('Comment', UserComment);
            postData.append('afpImage', afpImage);
            postData.append('AttendeeID', AttendeeID);
            let data = this.http.post(url, postData);
            console.log('Activity Feed Posting: Uploading image to URL: ' + url);
            data.subscribe((result) => {
                console.log("Image uploaded: " + JSON.stringify(result));
                console.log('afID: ' + result.afID);
                loading.dismiss();
                //this.navCtrl.setRoot(ActivityPage);
                this.navCtrl.pop();
                //var flags = 'ad|' + result.afID + '|' + UserComment + '|0|' + NewFilename + '.jpg|' + PostedDateTime;
                //this.localstorage.setLocalValue('ActivityFeedFlags', flags);
                //this.databaseprovider.getActivityFeedData(flags, AttendeeID).then(data3 => {
                //	console.log("getActivityFeedData: " + JSON.stringify(data3));
                //	if (data3['length']>0) {
                //		console.log("Return status: " + data3[0].Status);
                //		loading.dismiss();
                //		this.view.dismiss(UserAction);
                //	}
                //}).catch(function () {
                //	console.log("Activity Feed Promise Rejected");
                //	loading.dismiss();
                //});
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
            //this.navCtrl.setRoot(ActivityPage);
            this.navCtrl.pop();
        }
    }
};
ActivityFeedPostingPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-activityfeedposting',template:/*ion-inline-start:"/Users/petervroom/demoplanner/src/pages/activityfeedposting/activityfeedposting.html"*/'<ion-header>\n\n	<ion-navbar color="primary">\n		<ion-title>Add a Posting</ion-title>\n	</ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding>\n\n		<!-- Posting picture attachment -->\n		<img class="center" [src]="_DomSanitizer.bypassSecurityTrustUrl(ActivityFeedAttachment)" onerror="this.src=\'assets/img/missing-image.png\'">\n\n\n\n		<!-- Button controls -->\n		<ion-grid *ngIf=deviceButtons>\n			<ion-row>\n				<ion-col col-3 >\n					<button color="secondary" ion-button (click)="closeModal(\'Cancel\')">\n						Cancel\n					</button>\n				</ion-col>\n				<ion-col col-3 >\n					<button color="secondary" ion-button (click)="addGalleryImage()">\n						Gallery\n					</button>\n				</ion-col>\n				<ion-col col-3 >\n					<button color="secondary" ion-button (click)="addCameraImage()">\n						Camera\n					</button>\n				</ion-col>\n				<ion-col col-3 >\n					<button ion-button (click)="closeModal(\'Save\')">\n						Save\n					</button>\n				</ion-col>\n			</ion-row>\n		</ion-grid>\n\n		<ion-grid *ngIf=browserButtons>\n			<ion-row>\n				<ion-col col-3 >\n					<button ion-button color="secondary" (click)="closeModal(\'Cancel\')">\n						Cancel\n					</button>\n				</ion-col>\n				<ion-col col-6 >\n					<p style="text-align:center;">Please use the mobile app to upload an image</p>\n				</ion-col>\n				<ion-col col-3 >\n					<button ion-button color="secondary" (click)="closeModal(\'Save\')">\n						Save\n					</button>\n				</ion-col>\n			</ion-row>\n		</ion-grid>\n		\n</ion-content>\n\n\n		<!-- Comment -->\n\n<ion-footer>\n		<ion-toolbar>\n		<ion-textarea autocomplete="true" autocorrect="on"\n			(input)=\'CommentEntry = $event.target.value\' \n			name="CommentEntry" \n			[value]="CommentEntry" \n			placeholder="Enter a comment..."\n			style="height:150px;"></ion-textarea>\n		</ion-toolbar>\n	</ion-footer>'/*ion-inline-end:"/Users/petervroom/demoplanner/src/pages/activityfeedposting/activityfeedposting.html"*/,
        changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"],
        __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */],
        __WEBPACK_IMPORTED_MODULE_5__providers_database_database__["a" /* Database */],
        __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["AlertController"],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["ViewController"],
        __WEBPACK_IMPORTED_MODULE_3__angular_common_http__["a" /* HttpClient */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["LoadingController"],
        __WEBPACK_IMPORTED_MODULE_7__ionic_native_camera__["a" /* Camera */],
        __WEBPACK_IMPORTED_MODULE_8__angular_platform_browser__["c" /* DomSanitizer */],
        __WEBPACK_IMPORTED_MODULE_6__providers_localstorage_localstorage__["a" /* Localstorage */]])
], ActivityFeedPostingPage);

//# sourceMappingURL=activityfeedposting.js.map

/***/ })

});
//# sourceMappingURL=15.js.map