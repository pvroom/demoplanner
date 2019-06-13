webpackJsonp([2],{

/***/ 923:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SearchResultsPageModule", function() { return SearchResultsPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_forms__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__searchresults__ = __webpack_require__(942);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// Components, functions, plugins



// Pages

let SearchResultsPageModule = class SearchResultsPageModule {
};
SearchResultsPageModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["NgModule"])({
        declarations: [__WEBPACK_IMPORTED_MODULE_3__searchresults__["a" /* SearchResultsPage */]],
        imports: [
            __WEBPACK_IMPORTED_MODULE_0__angular_forms__["a" /* FormsModule */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["IonicPageModule"].forChild(__WEBPACK_IMPORTED_MODULE_3__searchresults__["a" /* SearchResultsPage */])
        ],
        exports: [
            __WEBPACK_IMPORTED_MODULE_3__searchresults__["a" /* SearchResultsPage */]
        ]
    })
], SearchResultsPageModule);

//# sourceMappingURL=searchresults.module.js.map

/***/ }),

/***/ 942:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SearchResultsPage; });
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

let SearchResultsPage = class SearchResultsPage {
    constructor(navCtrl, navParams, storage, databaseprovider, cd, loadingCtrl, localstorage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.databaseprovider = databaseprovider;
        this.cd = cd;
        this.loadingCtrl = loadingCtrl;
        this.localstorage = localstorage;
        this.sessionLW = [];
        this.sessionPart = [];
        this.sessionOE = [];
        this.Speakers = [];
        this.Exhibitors = [];
        this.Attendees = [];
        this.LWShow = false;
        this.PartShow = false;
        this.OtherShow = false;
        this.SpeakerShow = false;
        this.ExhibitorShow = false;
        this.AttendeeShow = false;
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad: SearchResultsPage');
    }
    ionViewDidEnter() {
        console.log('ionViewDidEnter: SearchResultsPage');
        // Load / refresh data when coming to this page
        this.LoadData();
    }
    LoadData() {
        // Load initial data set here
        //let loading = this.loadingCtrl.create({
        //	spinner: 'crescent',
        //	content: 'Loading results...'
        //});
        //loading.present();
        // Blank and show loading info
        this.sessionLW = [];
        this.sessionPart = [];
        this.sessionOE = [];
        this.Speakers = [];
        this.Exhibitors = [];
        this.Attendees = [];
        this.LWShow = false;
        this.PartShow = false;
        this.OtherShow = false;
        this.SpeakerShow = false;
        this.ExhibitorShow = false;
        this.AttendeeShow = false;
        this.cd.markForCheck();
        // Set default labels for headers
        this.visHeaderLW = "+ Lectures [0]";
        this.visHeaderPart = "+ Workshops [0]";
        this.visHeaderOE = "+ Other Events [0]";
        this.visHeaderSpkr = "+ Speakers [0]";
        this.visHeaderExh = "+ Exhibitors [0]";
        this.visHeaderAtt = "+ Attendees [0]";
        // Temporary use variables
        var flags;
        var DisplayLocation = "";
        var dbEventDateTime;
        var SQLDate;
        var DisplayDateTime;
        var AgendaButtonText;
        var visEventName;
        var ButtonStyle = "";
        var visEventNote = "";
        var LWCount = 0;
        var PartCount = 0;
        var OECount = 0;
        var SpkrCount = 0;
        var ExhCount = 0;
        var AttCount = 0;
        var whereClause = '';
        var DisplayName = "";
        // Get search terms
        var searchtermEntry = this.localstorage.getLocalValue("SearchTerms");
        var searchTerms = searchtermEntry.split(' ');
        // ---------
        // Lectures
        // ---------
        flags = "sr|0|0|0|" + searchtermEntry + "|L";
        console.log('Lecture query: ' + flags);
        this.databaseprovider.getLectureData(flags, "0").then(data => {
            console.log("getLectureData: " + JSON.stringify(data));
            // Process returned records to display
            this.sessionLW = [];
            LWCount = data['length'];
            this.localstorage.setLocalValue('LWCount', LWCount);
            if (this.LWShow == false) {
                this.visHeaderLW = "+ Lectures [" + LWCount + "]";
            }
            else {
                this.visHeaderLW = "- Lectures [" + LWCount + "]";
            }
            if (data['length'] > 0) {
                for (var i = 0; i < data['length']; i++) {
                    dbEventDateTime = data[i].session_start_time.substring(0, 19);
                    dbEventDateTime = dbEventDateTime.replace(/-/g, '/');
                    dbEventDateTime = dbEventDateTime.replace(/T/g, ' ');
                    SQLDate = new Date(dbEventDateTime);
                    DisplayDateTime = dateFormat(SQLDate, "mm/dd h:MMtt");
                    // Display end time
                    dbEventDateTime = data[i].session_end_time.substring(0, 19);
                    dbEventDateTime = dbEventDateTime.replace(/-/g, '/');
                    dbEventDateTime = dbEventDateTime.replace(/T/g, ' ');
                    SQLDate = new Date(dbEventDateTime);
                    DisplayDateTime = DisplayDateTime + " to " + dateFormat(SQLDate, "h:MMtt");
                    visEventName = data[i].session_title.replace("'", "\\'");
                    this.sessionLW.push({
                        EventID: data[i].session_id,
                        DisplayEventName: visEventName,
                        DisplayEventTimeDateLocation: DisplayDateTime + " in " + data[i].RoomName,
                        SpeakerDisplayName: data[i].other_speakers,
                        navigationRightArrow: "arrow-dropright"
                    });
                }
            }
            else {
                this.sessionLW.push({
                    EventID: "0",
                    DisplayEventName: "No matching records found",
                    DisplayEventTimeDateLocation: "",
                    SpeakerDisplayName: "",
                    navigationRightArrow: ""
                });
            }
            this.cd.markForCheck();
            // -------------
            // Participation
            // -------------
            flags = "sr|0|0|0|" + searchtermEntry + "|P";
            console.log('Particpation query: ' + flags);
            this.databaseprovider.getLectureData(flags, "0").then(data => {
                console.log("getLectureData: " + JSON.stringify(data));
                // Process returned records to display
                this.sessionPart = [];
                PartCount = data['length'];
                this.localstorage.setLocalValue('PartCount', PartCount);
                if (this.PartShow == false) {
                    this.visHeaderPart = "+ Workshops [" + PartCount + "]";
                }
                else {
                    this.visHeaderPart = "- Workshops [" + PartCount + "]";
                }
                if (data['length'] > 0) {
                    for (var i = 0; i < data['length']; i++) {
                        dbEventDateTime = data[i].session_start_time.substring(0, 19);
                        dbEventDateTime = dbEventDateTime.replace(/-/g, '/');
                        dbEventDateTime = dbEventDateTime.replace(/T/g, ' ');
                        SQLDate = new Date(dbEventDateTime);
                        DisplayDateTime = dateFormat(SQLDate, "mm/dd h:MMtt");
                        // Display end time
                        dbEventDateTime = data[i].session_end_time.substring(0, 19);
                        dbEventDateTime = dbEventDateTime.replace(/-/g, '/');
                        dbEventDateTime = dbEventDateTime.replace(/T/g, ' ');
                        SQLDate = new Date(dbEventDateTime);
                        DisplayDateTime = DisplayDateTime + " to " + dateFormat(SQLDate, "h:MMtt");
                        visEventName = data[i].session_title.replace("'", "\\'");
                        this.sessionPart.push({
                            EventID: data[i].session_id,
                            DisplayEventName: visEventName,
                            DisplayEventTimeDateLocation: DisplayDateTime + " in " + data[i].RoomName,
                            SpeakerDisplayName: data[i].other_speakers,
                            navigationRightArrow: "arrow-dropright"
                        });
                    }
                }
                else {
                    this.sessionPart.push({
                        EventID: "0",
                        DisplayEventName: "No matching records found",
                        DisplayEventTimeDateLocation: "",
                        SpeakerDisplayName: "",
                        navigationRightArrow: ""
                    });
                }
                this.cd.markForCheck();
                // -------------
                // Other Events
                // -------------
                flags = "sr|0|0|0|" + searchtermEntry + "|OE";
                console.log('Other Events query: ' + flags);
                this.databaseprovider.getLectureData(flags, "0").then(data => {
                    //console.log("getLectureData: " + JSON.stringify(data));
                    // Process returned records to display
                    this.sessionOE = [];
                    OECount = data['length'];
                    this.localstorage.setLocalValue('OECount', OECount);
                    if (this.OtherShow == false) {
                        this.visHeaderOE = "+ Other Events [" + OECount + "]";
                    }
                    else {
                        this.visHeaderOE = "- Other Events [" + OECount + "]";
                    }
                    if (data['length'] > 0) {
                        for (var i = 0; i < data['length']; i++) {
                            dbEventDateTime = data[i].session_start_time.substring(0, 19);
                            dbEventDateTime = dbEventDateTime.replace(/-/g, '/');
                            dbEventDateTime = dbEventDateTime.replace(/T/g, ' ');
                            SQLDate = new Date(dbEventDateTime);
                            DisplayDateTime = dateFormat(SQLDate, "mm/dd h:MMtt");
                            // Display end time
                            dbEventDateTime = data[i].session_end_time.substring(0, 19);
                            dbEventDateTime = dbEventDateTime.replace(/-/g, '/');
                            dbEventDateTime = dbEventDateTime.replace(/T/g, ' ');
                            SQLDate = new Date(dbEventDateTime);
                            DisplayDateTime = DisplayDateTime + " to " + dateFormat(SQLDate, "h:MMtt");
                            visEventName = data[i].session_title.replace("'", "\\'");
                            this.sessionOE.push({
                                EventID: data[i].session_id,
                                DisplayEventName: visEventName,
                                DisplayEventTimeDateLocation: DisplayDateTime + " in " + data[i].RoomName,
                                SpeakerDisplayName: data[i].other_speakers,
                                navigationRightArrow: "arrow-dropright"
                            });
                        }
                    }
                    else {
                        this.sessionOE.push({
                            EventID: "0",
                            DisplayEventName: "No matching records found",
                            DisplayEventTimeDateLocation: "",
                            SpeakerDisplayName: "",
                            navigationRightArrow: ""
                        });
                    }
                    this.cd.markForCheck();
                    // ---------
                    // Speakers
                    // ---------
                    flags = 'sr|0|0|' + searchtermEntry + '|0';
                    console.log('Speaker query: ' + flags);
                    this.databaseprovider.getSpeakerData(flags, "0").then(data => {
                        console.log("getSpeakerData: " + JSON.stringify(data));
                        // Process returned records to display
                        this.Speakers = [];
                        SpkrCount = data['length'];
                        this.localstorage.setLocalValue('SpkrCount', SpkrCount);
                        if (this.SpeakerShow == false) {
                            this.visHeaderSpkr = "+ Speakers [" + SpkrCount + "]";
                        }
                        else {
                            this.visHeaderSpkr = "- Speakers [" + SpkrCount + "]";
                        }
                        if (data['length'] > 0) {
                            for (var i = 0; i < data['length']; i++) {
                                DisplayName = "";
                                // Concatenate fields to build displayable name
                                DisplayName = DisplayName + data[i].LastName + ", " + data[i].FirstName;
                                //if (res.rows.item(i).MiddleInitial != "") {
                                //    DisplayName = DisplayName + " " + res.rows.item(i).MiddleInitial;
                                //}
                                // Add credentials
                                //if (data[i].Credentials != "") {
                                //	DisplayName = DisplayName + " " + data[i].Credentials;
                                //}
                                this.Speakers.push({
                                    SpeakerID: data[i].speakerID,
                                    DisplayNameLastFirst: DisplayName,
                                    Affiliation: data[i].Credentials
                                });
                            }
                        }
                        else {
                            this.Speakers.push({
                                SpeakerID: "0",
                                DisplayNameLastFirst: "No matching speakers found",
                                Affiliation: ""
                            });
                        }
                        this.cd.markForCheck();
                        // ----------
                        // Exhibitors
                        // ----------
                        flags = 'sr|0|0|' + searchtermEntry;
                        console.log('Exhibitor query: ' + flags);
                        this.databaseprovider.getExhibitorData(flags).then(data => {
                            //console.log("getExhibitorData: " + JSON.stringify(data));
                            // Process returned records to display
                            this.Exhibitors = [];
                            ExhCount = data['length'];
                            this.localstorage.setLocalValue('ExhCount', ExhCount);
                            if (this.ExhibitorShow == false) {
                                this.visHeaderExh = "+ Exhibitors [" + ExhCount + "]";
                            }
                            else {
                                this.visHeaderExh = "- Exhibitors [" + ExhCount + "]";
                            }
                            if (data['length'] > 0) {
                                for (var i = 0; i < data['length']; i++) {
                                    this.Exhibitors.push({
                                        ExhibitorID: data[i].ExhibitorID,
                                        DisplayCompanyName: data[i].CompanyName,
                                        BoothNumber: "Booth: " + data[i].BoothNumber,
                                        navigationRightArrow: "arrow-dropright"
                                    });
                                }
                            }
                            else {
                                this.Exhibitors.push({
                                    ExhibitorID: "0",
                                    DisplayCompanyName: "No matching exhibitors found",
                                    BoothNumber: "",
                                    navigationRightArrow: ""
                                });
                            }
                            this.cd.markForCheck();
                            // ----------
                            // Attendees
                            // ----------
                            flags = 'sr|0|0|' + searchtermEntry;
                            console.log('Attendee query: ' + flags);
                            this.databaseprovider.getMessagingData(flags, "0").then(data => {
                                //console.log("getMessagingData: " + JSON.stringify(data));
                                // Process returned records to display
                                this.Attendees = [];
                                AttCount = data['length'];
                                this.localstorage.setLocalValue('AttCount', AttCount);
                                if (this.AttendeeShow == false) {
                                    this.visHeaderAtt = "+ Attendees [" + AttCount + "]";
                                }
                                else {
                                    this.visHeaderAtt = "- Attendees [" + AttCount + "]";
                                }
                                if (data['length'] > 0) {
                                    for (var i = 0; i < data['length']; i++) {
                                        this.Attendees.push({
                                            AttendeeID: data[i].AttendeeID,
                                            DisplayAttendeeName: data[i].LastName + ", " + data[i].FirstName,
                                            DisplayAttendeeCompany: data[i].Company,
                                            navigationRightArrow: "arrow-dropright"
                                        });
                                    }
                                }
                                else {
                                    this.Attendees.push({
                                        AttendeeID: "0",
                                        DisplayAttendeeName: "No matching attendees found",
                                        DisplayAttendeeCompany: "",
                                        navigationRightArrow: ""
                                    });
                                }
                                this.cd.markForCheck();
                                //loading.dismiss();
                            }).catch(function () {
                                console.log("Attendee Promise Rejected");
                            });
                            //loading.dismiss();
                        }).catch(function () {
                            console.log("Exhibitor Promise Rejected");
                        });
                    }).catch(function () {
                        console.log("Promise Rejected");
                    });
                }).catch(function () {
                    console.log("Promise Rejected");
                });
            }).catch(function () {
                console.log("Promise Rejected");
            });
        }).catch(function () {
            console.log("Promise Rejected");
        });
    }
    ShowHideResults(SectionName) {
        switch (SectionName) {
            case "Lectures":
                this.LWShow = !this.LWShow;
                break;
            case "Participation":
                this.PartShow = !this.PartShow;
                break;
            case "OtherEvents":
                this.OtherShow = !this.OtherShow;
                break;
            case "Speakers":
                this.SpeakerShow = !this.SpeakerShow;
                break;
            case "Exhibitors":
                this.ExhibitorShow = !this.ExhibitorShow;
                break;
            case "Attendees":
                this.AttendeeShow = !this.AttendeeShow;
                break;
        }
        // Refresh headers
        this.RefreshHeaderCounts();
    }
    ;
    AttendeeDetails(AttendeeID) {
        if (AttendeeID != 0) {
            // Navigate to Attendee Profile page
            this.localstorage.setLocalValue("oAttendeeID", AttendeeID);
            this.navCtrl.push('AttendeesProfilePage', { oAttendeeID: AttendeeID }, { animate: true, direction: 'forward' });
        }
    }
    ;
    SpeakerDetails(SpeakerID) {
        if (SpeakerID != 0) {
            // Navigate to Speaker Details page
            this.navCtrl.push('SpeakerDetailsPage', { SpeakerID: SpeakerID }, { animate: true, direction: 'forward' });
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
    ExhibitorDetails(ExhibitorID) {
        if (ExhibitorID != 0) {
            // Navigate to Exhibitor Details page
            this.navCtrl.push('ExhibitorDetailsPage', { ExhibitorID: ExhibitorID }, { animate: true, direction: 'forward' });
        }
    }
    ;
    RefreshHeaderCounts() {
        // Refresh counters on header bars
        var LWCount = this.localstorage.getLocalValue('LWCount');
        var PartCount = this.localstorage.getLocalValue('PartCount');
        var OECount = this.localstorage.getLocalValue('OECount');
        var SpkrCount = this.localstorage.getLocalValue('SpkrCount');
        var ExhCount = this.localstorage.getLocalValue('ExhCount');
        var AttCount = this.localstorage.getLocalValue('AttCount');
        if (this.LWShow === false) {
            this.visHeaderLW = "+ Lectures [" + LWCount + "]";
        }
        else {
            this.visHeaderLW = "- Lectures [" + LWCount + "]";
        }
        if (this.PartShow === false) {
            this.visHeaderPart = "+ Workshops [" + PartCount + "]";
        }
        else {
            this.visHeaderPart = "- Workshops [" + PartCount + "]";
        }
        if (this.OtherShow === false) {
            this.visHeaderOE = "+ Other Events [" + OECount + "]";
        }
        else {
            this.visHeaderOE = "- Other Events [" + OECount + "]";
        }
        if (this.SpeakerShow === false) {
            this.visHeaderSpkr = "+ Speakers [" + SpkrCount + "]";
        }
        else {
            this.visHeaderSpkr = "- Speakers [" + SpkrCount + "]";
        }
        if (this.ExhibitorShow === false) {
            this.visHeaderExh = "+ Exhibitors [" + ExhCount + "]";
        }
        else {
            this.visHeaderExh = "- Exhibitors [" + ExhCount + "]";
        }
        if (this.AttendeeShow === false) {
            this.visHeaderAtt = "+ Attendees [" + AttCount + "]";
        }
        else {
            this.visHeaderAtt = "- Attendees [" + AttCount + "]";
        }
    }
    ;
};
SearchResultsPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-searchresults',template:/*ion-inline-start:"/Users/petervroom/demoplanner/src/pages/searchresults/searchresults.html"*/'<ion-header>\n	<ion-navbar color="primary">\n		<button ion-button menuToggle>\n			<ion-icon name="menu"></ion-icon>\n		</button>\n		<ion-title>Search Results</ion-title>\n	</ion-navbar>\n</ion-header>\n\n<ion-content padding>\n\n		<p class="myLabelPadding">\n			Search results are grouped below with number of results in each header.  Expand a group to see details.\n		</p>\n\n\n		<div class="card">\n			<div class="rowSearch item-divider item LegendHeader myMarginZero2" (click)="ShowHideResults(\'Lectures\')">\n				{{visHeaderLW}}\n			</div>\n			<div *ngIf="LWShow">\n				<ion-item (click)="EventDetails(sessionLW.EventID)" *ngFor="let sessionLW of sessionLW" id="lecture-list-item19">\n					<ion-icon item-right name="arrow-dropright"></ion-icon>\n					<h2>{{sessionLW.DisplayEventName}}</h2>\n					<p>{{sessionLW.DisplayEventTimeDateLocation}}</p>\n					<p>{{sessionLW.SpeakerDisplayName}}</p>\n				</ion-item>\n			</div>\n		</div>\n\n		<div class="card">\n			<div class="rowSearch item-divider item LegendHeader myMarginZero2" (click)="ShowHideResults(\'Participation\')">\n				{{visHeaderPart}}\n			</div>\n			<div *ngIf="PartShow">\n				<ion-item (click)="EventDetails(sessionPart.EventID)" *ngFor="let sessionPart of sessionPart" id="participation-list-item19">\n					<ion-icon item-right name="arrow-dropright"></ion-icon>\n					<h2>{{sessionPart.DisplayEventName}}</h2>\n					<p>{{sessionPart.DisplayEventTimeDateLocation}}</p>\n					<p>{{sessionPart.SpeakerDisplayName}}</p>\n				</ion-item>\n			</div>\n		</div>\n\n		<div class="card">\n			<div class="rowSearch item-divider item LegendHeader myMarginZero2" (click)="ShowHideResults(\'OtherEvents\')">\n				{{visHeaderOE}}\n			</div>\n			<div *ngIf="OtherShow">\n				<ion-item (click)="EventDetails(sessionOE.EventID)" *ngFor="let sessionOE of sessionOE" id="other-list-item19">\n					<ion-icon item-right name="arrow-dropright"></ion-icon>\n					<h2>{{sessionOE.DisplayEventName}}</h2>\n					<p>{{sessionOE.DisplayEventTimeDateLocation}}</p>\n					<p>{{sessionOE.SpeakerDisplayName}}</p>\n				</ion-item>\n			</div>\n		</div>\n\n		<div class="card">\n			<div class="rowSearch item-divider item LegendHeader myMarginZero2" (click)="ShowHideResults(\'Speakers\')">\n				{{visHeaderSpkr}}\n			</div>\n			<div *ngIf="SpeakerShow">\n				<ion-item (click)="SpeakerDetails(Speaker.SpeakerID)" *ngFor="let Speaker of Speakers" id="speaker-list-item19">\n					<ion-icon item-right name="arrow-dropright"></ion-icon>\n					<h2>{{Speaker.DisplayNameLastFirst}}</h2>\n					<p>{{Speaker.Affiliation}}</p>\n				</ion-item>\n			</div>\n		</div>\n\n		<div class="card">\n			<div class="rowSearch item-divider item LegendHeader myMarginZero2" (click)="ShowHideResults(\'Exhibitors\')">\n				{{visHeaderExh}}\n			</div>\n			<div *ngIf="ExhibitorShow">\n				<ion-item (click)="ExhibitorDetails(Exhibitor.ExhibitorID)" *ngFor="let Exhibitor of Exhibitors" id="Exhibitor-list-item19">\n					<ion-icon item-right name="arrow-dropright"></ion-icon>\n					<h2>{{Exhibitor.DisplayCompanyName}}</h2>\n					<p>{{Exhibitor.BoothNumber}}</p>\n				</ion-item>\n			</div>\n		</div>\n		\n		<div class="card">\n			<div class="rowSearch item-divider item LegendHeader myMarginZero2" (click)="ShowHideResults(\'Attendees\')">\n				{{visHeaderAtt}}\n			</div>\n			<div *ngIf="AttendeeShow">\n				<ion-item (click)="AttendeeDetails(Attendee.AttendeeID)" *ngFor="let Attendee of Attendees" id="Attendee-list-item19">\n					<ion-icon item-right name="arrow-dropright"></ion-icon>\n					<h2>{{Attendee.DisplayAttendeeName}}</h2>\n					<p>{{Attendee.DisplayAttendeeCompany}}</p>\n				</ion-item>\n			</div>\n		</div>\n\n'/*ion-inline-end:"/Users/petervroom/demoplanner/src/pages/searchresults/searchresults.html"*/,
        changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"],
        __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */],
        __WEBPACK_IMPORTED_MODULE_4__providers_database_database__["a" /* Database */],
        __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["LoadingController"],
        __WEBPACK_IMPORTED_MODULE_5__providers_localstorage_localstorage__["a" /* Localstorage */]])
], SearchResultsPage);

//# sourceMappingURL=searchresults.js.map

/***/ })

});
//# sourceMappingURL=2.js.map