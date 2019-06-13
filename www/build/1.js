webpackJsonp([1],{

/***/ 920:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeakerDetailsPageModule", function() { return SpeakerDetailsPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_forms__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__speakerdetails__ = __webpack_require__(939);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// Components, functions, plugins



// Pages

let SpeakerDetailsPageModule = class SpeakerDetailsPageModule {
};
SpeakerDetailsPageModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["NgModule"])({
        declarations: [__WEBPACK_IMPORTED_MODULE_3__speakerdetails__["a" /* SpeakerDetailsPage */]],
        imports: [
            __WEBPACK_IMPORTED_MODULE_0__angular_forms__["a" /* FormsModule */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["IonicPageModule"].forChild(__WEBPACK_IMPORTED_MODULE_3__speakerdetails__["a" /* SpeakerDetailsPage */])
        ],
        exports: [__WEBPACK_IMPORTED_MODULE_3__speakerdetails__["a" /* SpeakerDetailsPage */]]
    })
], SpeakerDetailsPageModule);

//# sourceMappingURL=speakerdetails.module.js.map

/***/ }),

/***/ 939:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SpeakerDetailsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_storage__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_database_database__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_localstorage_localstorage__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__educationdetails_educationdetails__ = __webpack_require__(65);
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






// Pages

let SpeakerDetailsPage = class SpeakerDetailsPage {
    constructor(navCtrl, navParams, storage, databaseprovider, cd, loadingCtrl, alertCtrl, localstorage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.databaseprovider = databaseprovider;
        this.cd = cd;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.localstorage = localstorage;
        this.SessionListing = [];
        this.btnBookmarkManagement = false;
        this.BookmarkButtonColor = '#ffffff';
        this.BookmarkButtonTextColor = '#f53d3d';
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad SpeakersPage');
    }
    navToWebsite(WebsiteURL) {
        if (WebsiteURL === undefined) {
            // Do nothing
        }
        else {
            // Initiate web browser
            if ((WebsiteURL.substring(0, 7) != "http://") && (WebsiteURL.substring(0, 8) != "https://")) {
                WebsiteURL = "http://" + WebsiteURL;
            }
            console.log('Speaker Details: Navigating to: ' + WebsiteURL);
            window.open(WebsiteURL, '_system');
        }
    }
    ;
    EventDetails(EventID) {
        if (EventID != 0) {
            // Navigate to Education Details page
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__educationdetails_educationdetails__["a" /* EducationDetailsPage */], { EventID: EventID }, { animate: true, direction: 'forward' });
        }
    }
    ;
    ngOnInit() {
        // Load initial data set here
        //let loading = this.loadingCtrl.create({
        //	spinner: 'crescent',
        //	content: 'Please wait...'
        //});
        //loading.present();
        // Blank and show loading info
        this.SessionListing = [];
        this.cd.markForCheck();
        // Temporary use variables
        var flags = "dt|Alpha|" + this.navParams.get('SpeakerID');
        var DisplayName = "";
        var BioDisplay = "";
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        // Get the data
        this.databaseprovider.getSpeakerData(flags, AttendeeID).then(data => {
            console.log("getSpeakerDetails: " + JSON.stringify(data));
            if (data['length'] > 0) {
                DisplayName = "";
                // Concatenate fields to build displayable name
                //if (data[0].Prefix != "") {
                //    DisplayName = DisplayName + data[0].Prefix + " ";
                //}
                DisplayName = DisplayName + data[0].FirstName;
                //if (data[0].MiddleInitial != "") {
                //    DisplayName = DisplayName + " " + data[0].MiddleInitial;
                //}
                DisplayName = DisplayName + " " + data[0].LastName;
                //if (data[0].Suffix != "") {
                //    DisplayName = DisplayName + " " + data[0].Suffix;
                //}
                //if (data[0].imis_designation != "" && data[0].imis_designation != null) {
                //    DisplayName = DisplayName + ", " + data[0].imis_designation;
                //}
                //if (data[0].Credentials != "" && data[0].Credentials != null) {
                //	this.visualAffiliation = data[0].Credentials;
                //}
                if (data[0].Company != "" && data[0].Company != null) {
                    this.visualAffiliation = data[0].Company;
                }
                if (data[0].Website != "" && data[0].Website != null) {
                    this.visWebsite = data[0].Website;
                    this.WebsiteShow = true;
                }
                else {
                    this.WebsiteShow = false;
                }
                // Thumbnail
                var imageURL = "https://demoplanner.convergence-us.com/AdminGateway/2019/images/Speakers/" + data[0].imageFilename;
                //imageURL = imageURL.substr(0, imageURL.length - 3) + 'png';
                this.visualImageURL = imageURL;
                console.log("ImageURL: " + imageURL);
                this.visualDisplayName = DisplayName;
                //$scope.visualAffiliation = res.rows.item(0).Affiliation;
                // Values for Bookmark Management
                this.localstorage.setLocalValue("BookmarkID", this.navParams.get('SpeakerID'));
                this.localstorage.setLocalValue("BookmarkType", "Speakers");
                if (data[0].Bookmarked != "0") {
                    this.visBookmarkAddRemoveButton = "Remove";
                    this.BookmarkButtonColor = '#F15D22';
                    this.BookmarkButtonTextColor = '#ffffff';
                }
                else {
                    this.visBookmarkAddRemoveButton = "Bookmark";
                    this.BookmarkButtonColor = '#ffffff';
                    this.BookmarkButtonTextColor = '#F15D22';
                }
                // Biography
                if ((data[0].Bio == "") || (data[0].Bio == "&nbsp;") || (data[0].Bio == "TBD")) {
                    this.spkrDetails = "No biography provided";
                }
                else {
                    BioDisplay = data[0].Bio;
                    BioDisplay = BioDisplay.replace(/&nbsp;/g, ' ');
                    BioDisplay = BioDisplay.replace(/\r/g, '');
                    BioDisplay = BioDisplay.replace(/\n/g, '');
                    BioDisplay = BioDisplay.replace(/\t/g, '');
                    BioDisplay = BioDisplay.replace(/<div>/g, '');
                    BioDisplay = BioDisplay.replace(/<\/div>/g, '');
                    this.spkrDetails = BioDisplay;
                }
                // Get session records
                var coursescat = data[0].Courses;
                var courses = coursescat.split("|");
                var text = "('";
                for (var i = 0; i < courses.length; i++) {
                    text += courses[i] + "','";
                }
                var QueryParam = text.substring(0, text.length - 2);
                QueryParam = QueryParam + ")";
                console.log("Course listing parameters: " + QueryParam);
                flags = "cl|Alpha|" + this.navParams.get('SpeakerID') + "|" + QueryParam;
                var SQLDate;
                var DisplayDateTime;
                var dbEventDateTime;
                // Get the list of courses relevant to this speaker
                this.databaseprovider.getSpeakerData(flags, "0").then(data2 => {
                    console.log("getSpeakerData: " + JSON.stringify(data));
                    if (data2['length'] > 0) {
                        for (var i = 0; i < data2['length']; i++) {
                            console.log(data2[i].session_id);
                            dbEventDateTime = data2[i].session_start_time.substring(0, 19);
                            dbEventDateTime = dbEventDateTime.replace(/-/g, '/');
                            dbEventDateTime = dbEventDateTime.replace(/T/g, ' ');
                            SQLDate = new Date(dbEventDateTime);
                            DisplayDateTime = dateFormat(SQLDate, "mm/dd h:MMtt");
                            // Display end time
                            dbEventDateTime = data2[i].session_end_time.substring(0, 19);
                            dbEventDateTime = dbEventDateTime.replace(/-/g, '/');
                            dbEventDateTime = dbEventDateTime.replace(/T/g, ' ');
                            SQLDate = new Date(dbEventDateTime);
                            DisplayDateTime = DisplayDateTime + " to " + dateFormat(SQLDate, "h:MMtt");
                            this.SessionListing.push({
                                DisplayEventName: data2[i].session_title,
                                DisplayEventTimeDateLocation: DisplayDateTime + " in " + data2[i].RoomName,
                                EventID: data2[i].session_id
                            });
                        }
                    }
                    else {
                        // No records to show
                        this.SessionListing.push({
                            DisplayEventName: "No records available",
                            DisplayEventTimeDateLocation: "",
                            EventID: "0"
                        });
                    }
                    this.cd.markForCheck();
                }).catch(function () {
                    console.log("Promise Rejected");
                });
            }
            else {
                // No data to show
                this.visualDisplayName = "Unable to retrieve record";
                this.visualAffiliation = "";
            }
            this.cd.markForCheck();
            //loading.dismiss();
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
        if (this.visBookmarkAddRemoveButton == "Bookmark") {
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
                        this.visBookmarkAddRemoveButton = "Remove";
                        this.BookmarkButtonColor = '#F15D22';
                        this.BookmarkButtonTextColor = '#ffffff';
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
                        this.visBookmarkAddRemoveButton = "Bookmark";
                        this.BookmarkButtonColor = '#ffffff';
                        this.BookmarkButtonTextColor = '#F15D22';
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
SpeakerDetailsPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-speakerdetails',template:/*ion-inline-start:"/Users/petervroom/demoplanner/src/pages/speakerdetails/speakerdetails.html"*/'<ion-header>\n\n  <ion-navbar color="primary">\n    <button ion-button menuToggle>\n      <ion-icon color="secondary" name="menu"></ion-icon>\n    </button>\n    <ion-title>Speaker Details</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n<ion-content>\n\n	<ion-grid style="margin:0;padding:0; background:#283747">\n		<ion-row style="margin-top:15px">\n				<ion-col>\n					<img class="avatar" [src]="visualImageURL" onerror="this.src=\'assets/img/personIcon.png\'"\n						src="assets/img/personIcon.png" alt="Image error">\n				</ion-col>\n		</ion-row>\n		<ion-row>\n			<ion-col style="margin-top:15px; text-align: center!important; color:#fff">\n				<h2>{{visualDisplayName}}</h2>\n				<h4>{{visualAffiliation}}</h4>\n				<button ion-button outline *ngIf="btnBookmarkManagement" (click)="BookmarkManagement()" [style.background-color]="BookmarkButtonColor" [style.color]="BookmarkButtonTextColor" [style.border-color]="BookmarkButtonTextColor">\n					<div>\n						<ion-icon name="bookmark"></ion-icon>\n						<label>{{visBookmarkAddRemoveButton}}</label>\n					</div>\n				</button>\n			</ion-col>\n		</ion-row>\n	</ion-grid>\n\n	<ion-card *ngIf="WebsiteShow">\n		<ion-card-header class="cardHeader1">\n			Website\n		</ion-card-header>\n		<ion-card-content style="margin-top:5px">\n			<div class="list" (click)="navToWebsite(visWebsite)">\n				{{visWebsite}}\n			</div>\n		</ion-card-content>\n	</ion-card>\n\n	<ion-card>\n		<ion-card-header class="cardHeader1">\n			Biography\n		</ion-card-header>\n		<ion-card-content [innerHTML]="spkrDetails" style="margin-top:5px">\n			{{visualBiography}}\n		</ion-card-content>\n	</ion-card>\n\n	<ion-card>\n		<ion-card-header class="cardHeader1">\n			Sessions\n		</ion-card-header>\n		<ion-card-content>\n			<ion-list id="speakersessions-list3" style="margin-top:5px">\n				<ion-item class="item-icon-left item-icon-right" (click)="EventDetails(session.EventID)" *ngFor="let session of SessionListing" id="speakersessions-list-item19">\n					<ion-icon color="secondary" item-right name="arrow-dropright"></ion-icon>\n					<ion-icon color="secondary" item-left name="list"></ion-icon>\n					<h2 text-wrap> {{session.DisplayEventName}}</h2>\n					<p>{{session.DisplayEventTimeDateLocation}}</p>\n				</ion-item>\n			</ion-list>\n		</ion-card-content>\n	</ion-card>\n\n</ion-content>\n'/*ion-inline-end:"/Users/petervroom/demoplanner/src/pages/speakerdetails/speakerdetails.html"*/,
        changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"],
        __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */],
        __WEBPACK_IMPORTED_MODULE_4__providers_database_database__["a" /* Database */],
        __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["LoadingController"],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["AlertController"],
        __WEBPACK_IMPORTED_MODULE_5__providers_localstorage_localstorage__["a" /* Localstorage */]])
], SpeakerDetailsPage);

//# sourceMappingURL=speakerdetails.js.map

/***/ })

});
//# sourceMappingURL=1.js.map