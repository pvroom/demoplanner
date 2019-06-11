webpackJsonp([14],{

/***/ 910:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AttendeesProfilePageModule", function() { return AttendeesProfilePageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__attendeesprofile__ = __webpack_require__(930);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_image_loader__ = __webpack_require__(56);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




let AttendeesProfilePageModule = class AttendeesProfilePageModule {
};
AttendeesProfilePageModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2__attendeesprofile__["a" /* AttendeesProfilePage */],
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_3_ionic_image_loader__["b" /* IonicImageLoader */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["IonicPageModule"].forChild(__WEBPACK_IMPORTED_MODULE_2__attendeesprofile__["a" /* AttendeesProfilePage */]),
        ],
    })
], AttendeesProfilePageModule);

//# sourceMappingURL=attendeesprofile.module.js.map

/***/ }),

/***/ 930:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AttendeesProfilePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_localstorage_localstorage__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_image_loader__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_database_database__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__conversation_conversation__ = __webpack_require__(525);
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





// Preload Pages

let AttendeesProfilePage = class AttendeesProfilePage {
    constructor(navCtrl, navParams, databaseprovider, loadingCtrl, alertCtrl, modal, imageLoaderConfig, cd, localstorage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.databaseprovider = databaseprovider;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.modal = modal;
        this.imageLoaderConfig = imageLoaderConfig;
        this.cd = cd;
        this.localstorage = localstorage;
        this.btnBookmarkManagement = false;
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad ProfilePage');
    }
    ngOnInit() {
        // Get AttendeeID
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        var oAttendeeID = this.localstorage.getLocalValue('oAttendeeID');
        this.prConversationAttendeeID = oAttendeeID;
        // Setup defaul tprofile image
        this.imageLoaderConfig.setFallbackUrl('assets/img/personIcon.png');
        //this.imageLoaderConfig.enableFallbackAsPlaceholder(true);
        // Get profile image if available
        this.visualImageURL = "https://demoplanner.convergence-us.com/AdminGateway/2019/images/Attendees/" + oAttendeeID + '.jpg';
        this.cd.markForCheck();
        // Get profile data
        var flags = "pr|" + AttendeeID;
        this.databaseprovider.getDatabaseStats(flags, oAttendeeID).then(data => {
            if (data['length'] > 0) {
                console.log('getDatabaseStats: ' + JSON.stringify(data));
                // Display attendee information
                this.prAttendeeName = data[0].FirstName + " " + data[0].LastName;
                this.prAttendeeTitle = data[0].Title;
                this.prAttendeeOrganization = data[0].Company;
                // Set color indications for social media icons
                if (data[0].showTwitter == "Y") {
                    this.statusTwitter = "white";
                    this.smURLTwitter = data[0].smTwitter;
                    this.showTwitter = true;
                }
                else {
                    this.statusTwitter = "white";
                    this.smURLTwitter = "";
                    this.showTwitter = false;
                }
                if (data[0].showFacebook == "Y") {
                    this.statusFacebook = "white";
                    this.smURLFacebook = data[0].smFacebook;
                    this.showFacebook = true;
                }
                else {
                    this.statusFacebook = "white";
                    this.smURLFacebook = "";
                    this.showFacebook = false;
                }
                if (data[0].showLinkedIn == "Y") {
                    this.statusLinkedIn = "white";
                    this.smURLLinkedIn = data[0].smLinkedIn;
                    this.showLinkedIn = true;
                }
                else {
                    this.statusLinkedIn = "white";
                    this.smURLLinkedIn = "";
                    this.showLinkedIn = false;
                }
                if (data[0].showInstagram == "Y") {
                    this.statusInstagram = "white";
                    this.smURLInstagram = data[0].smInstagram;
                    this.showInstagram = true;
                }
                else {
                    this.statusInstagram = "#fff";
                    this.smURLInstagram = "";
                    this.showInstagram = false;
                }
                if (data[0].showPinterest == "Y") {
                    this.statusPinterest = "white";
                    this.smURLPinterest = data[0].smPinterest;
                    this.showPinterest = true;
                }
                else {
                    this.statusPinterest = "white";
                    this.smURLPinterest = "";
                    this.showPinterest = false;
                }
                // Values for Bookmark Management
                this.localstorage.setLocalValue("BookmarkID", oAttendeeID);
                this.localstorage.setLocalValue("BookmarkType", "Attendees");
                if (data[0].Bookmarked != "0") {
                    this.visBookmarkAddRemoveButton = "Remove from Bookmarks";
                }
                else {
                    this.visBookmarkAddRemoveButton = "Add to Bookmarks";
                }
            }
            this.cd.markForCheck();
        }).catch(function () {
            console.log("Promise Rejected");
        });
        // -------------------
        // Get Attendee Status
        // -------------------
        console.log('Attendee Button Management, AttendeeID: ' + AttendeeID);
        if (AttendeeID == '0' || AttendeeID == '') {
            this.btnBookmarkManagement = false;
        }
        else {
            this.btnBookmarkManagement = true;
        }
    }
    StartContinueConversation(ConversationAttendeeName, ConversationAttendeeID) {
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        //if (AttendeeID != '900000' && AttendeeID != '900001' && AttendeeID != '21' && AttendeeID != '22') {
        // Alert for successful save
        //	let savealert = this.alertCtrl.create({
        //		title: 'Conversations',
        //		subTitle: 'The direct chat feature is not available at this time.',
        //		buttons: ['Ok']
        //	});
        //	savealert.present();
        //} else {
        this.localstorage.setLocalValue('ConversationAttendeeName', ConversationAttendeeName);
        this.localstorage.setLocalValue('ConversationAttendeeID', ConversationAttendeeID);
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__conversation_conversation__["a" /* ConversationPage */], { ConversationAttendeeID: ConversationAttendeeID }, { animate: true, direction: 'forward' });
        //}
    }
    viewSocialMedia(smURL) {
        if (smURL != "") {
            console.log('Attendee Profile Details: Navigating to: ' + smURL);
            window.open(smURL, '_system');
        }
    }
    BookmarkManagement() {
        console.log("Begin BookmarkManagement process...");
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        var BookmarkType = this.localstorage.getLocalValue("BookmarkType");
        var BookmarkID = this.localstorage.getLocalValue("BookmarkID");
        var flags = '';
        // Starting variables
        console.log("AttendeeID: " + AttendeeID);
        console.log("BookmarkType: " + BookmarkType);
        console.log("BookmarkID: " + BookmarkID);
        this.cd.markForCheck();
        // Get last update performed by this app
        var LastUpdateDate = this.localstorage.getLocalValue("LastUpdateDate");
        if (LastUpdateDate == null) {
            // If never, then set variable and localStorage item to NA
            LastUpdateDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
            this.localstorage.setLocalValue("LastUpdateDate", LastUpdateDate);
        }
        if (this.visBookmarkAddRemoveButton == "Add to Bookmarks") {
            // ------------------------
            // Add item to Bookmarks List
            // ------------------------
            flags = 'cb|0|' + BookmarkType + '|' + BookmarkID;
            console.log("flags: " + flags);
            this.databaseprovider.getBookmarksData(flags, AttendeeID).then(data => {
                console.log("getBookmarksData: " + JSON.stringify(data));
                if (data['length'] > 0) {
                    console.log("Return status: " + data[0].Status);
                    if (data[0].Status == "Saved") {
                        this.visBookmarkAddRemoveButton = "Remove from Bookmarks";
                        this.cd.markForCheck();
                    }
                    else {
                        console.log("Return query: " + data[0].Query);
                        let alert = this.alertCtrl.create({
                            title: 'Bookmarks',
                            subTitle: 'Unable to add the item to your bookmark list at this time. Please try again shortly.',
                            buttons: ['OK']
                        });
                        alert.present();
                    }
                }
            }).catch(function () {
                console.log("Promise Rejected");
            });
        }
        else {
            // -----------------------
            // Remove Item from Bookmarks List
            // -----------------------
            flags = 'rb|0|' + BookmarkType + '|' + BookmarkID;
            console.log("flags: " + flags);
            this.databaseprovider.getBookmarksData(flags, AttendeeID).then(data => {
                console.log("getBookmarksData: " + JSON.stringify(data));
                if (data['length'] > 0) {
                    console.log("Return status: " + data[0].Status);
                    if (data[0].Status == "Saved") {
                        this.visBookmarkAddRemoveButton = "Add to Bookmarks";
                        this.cd.markForCheck();
                    }
                    else {
                        console.log("Return query: " + data[0].Query);
                        let alert = this.alertCtrl.create({
                            title: 'Bookmarks',
                            subTitle: 'Unable to remove the item from your bookmark list at this time. Please try again shortly.',
                            buttons: ['OK']
                        });
                        alert.present();
                    }
                }
            }).catch(function () {
                console.log("Promise Rejected");
            });
        }
    }
    ;
};
AttendeesProfilePage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-attendeesprofile',template:/*ion-inline-start:"/Users/petervroom/demoplanner/src/pages/attendeesprofile/attendeesprofile.html"*/'<ion-header>\n	<ion-navbar color="primary">\n		<button ion-button menuToggle>\n			<ion-icon name="menu"></ion-icon>\n		</button>\n		<ion-title>Attendee Profile</ion-title>\n	</ion-navbar>\n</ion-header>\n\n<ion-content padding class="bg-style">\n\n    <ion-grid>\n        <ion-row>\n       \n          <ion-col>\n              <ion-item no-lines style="background:transparent">\n                  <ion-avatar class="center">\n					<!--<img-loader [src]="visualImageURL" useImg [spinner]=false [fallbackAsPlaceholder]=true></img-loader>-->\n					<img class="center" [src]="visualImageURL" src="assets/img/personIcon.png" onerror="this.src=\'assets/img/personIcon.png\'">\n                  </ion-avatar>\n                </ion-item>\n          </ion-col>\n		</ion-row>\n\n        <ion-row>\n            <ion-col>\n				<ion-item no-lines style="background:transparent; color:#444">\n					<p style="color:#fff;font-size:1.5em; text-align:center; font-weight:500">{{prAttendeeName}}</p>\n					<p text-wrap style="color:#fff; font-size:1.25em; text-align:center">{{prAttendeeTitle}}</p>\n					<p text-wrap style="color:#fff; font-size:1.25em; text-align:center">{{prAttendeeOrganization}}</p>\n				</ion-item>\n            </ion-col>\n        </ion-row>\n	</ion-grid>\n	\n\n\n\n					<!--\n					<ion-row *ngIf="btnBookmarkManagement == false">\n						<ion-col col-3>\n						</ion-col>\n						<ion-col col-4>\n							<button ion-button block (click)="StartContinueConversation()">\n								Start a Conversation\n							</button>\n						</ion-col>\n						<ion-col col-3>\n						</ion-col>\n					</ion-row>\n					-->\n\n				<ion-grid>\n					<ion-row *ngIf="btnBookmarkManagement">\n						<ion-col>\n							<button ion-button color=secondary full (click)="StartContinueConversation(prAttendeeName, prConversationAttendeeID)">\n								Direct Chat\n							</button>\n						</ion-col>\n				\n						<ion-col>\n							<button ion-button color=secondary full (click)="BookmarkManagement()">\n								{{visBookmarkAddRemoveButton}}\n							</button>\n						</ion-col>\n					</ion-row>\n\n<!--\n		<ion-col col-11>\n			<p style="color:#fff;text-align:center">Tap an icon to view that social media profile</p>\n		</ion-col>\n-->\n\n        <ion-row>\n            <ion-col col-1>\n            </ion-col>\n            <ion-col col-2 *ngIf=showTwitter>\n                <ion-icon style="color:#fff" name="logo-twitter" (tap)="viewSocialMedia(smURLTwitter)"></ion-icon>\n            </ion-col>\n            <ion-col col-2 *ngIf=showFacebook>\n                <ion-icon style="color:#fff" name="logo-facebook" (tap)="viewSocialMedia(smURLFacebook)"></ion-icon>\n            </ion-col>\n            <ion-col col-2 *ngIf=showLinkedIn>\n                <ion-icon style="color:#fff" name="logo-linkedin" (tap)="viewSocialMedia(smURLLinkedIn)"></ion-icon>\n            </ion-col>\n            <ion-col col-2 *ngIf=showInstagram>\n                <ion-icon style="color:#fff" name="logo-instagram" (tap)="viewSocialMedia(smURLInstagram)"></ion-icon>\n            </ion-col>\n            <ion-col col-2 *ngIf=showPinterest>\n                <ion-icon style="color:#fff" name="logo-pinterest" (tap)="viewSocialMedia(smURLPinterest)"></ion-icon>\n            </ion-col>\n        </ion-row>\n      </ion-grid>\n</ion-content>\n'/*ion-inline-end:"/Users/petervroom/demoplanner/src/pages/attendeesprofile/attendeesprofile.html"*/,
        changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"],
        __WEBPACK_IMPORTED_MODULE_4__providers_database_database__["a" /* Database */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["LoadingController"],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["AlertController"],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["ModalController"],
        __WEBPACK_IMPORTED_MODULE_3_ionic_image_loader__["a" /* ImageLoaderConfig */],
        __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"],
        __WEBPACK_IMPORTED_MODULE_2__providers_localstorage_localstorage__["a" /* Localstorage */]])
], AttendeesProfilePage);

//# sourceMappingURL=attendeesprofile.js.map

/***/ })

});
//# sourceMappingURL=14.js.map