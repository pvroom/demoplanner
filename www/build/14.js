webpackJsonp([14],{

/***/ 892:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CetrackingPageModule", function() { return CetrackingPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_forms__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__cetracking__ = __webpack_require__(915);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// Components, functions, plugins



// Pages

let CetrackingPageModule = class CetrackingPageModule {
};
CetrackingPageModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["NgModule"])({
        declarations: [__WEBPACK_IMPORTED_MODULE_3__cetracking__["a" /* CetrackingPage */]],
        imports: [
            __WEBPACK_IMPORTED_MODULE_0__angular_forms__["a" /* FormsModule */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["p" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_3__cetracking__["a" /* CetrackingPage */])
        ],
        exports: [__WEBPACK_IMPORTED_MODULE_3__cetracking__["a" /* CetrackingPage */]]
    })
], CetrackingPageModule);

//# sourceMappingURL=cetracking.module.js.map

/***/ }),

/***/ 915:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CetrackingPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_storage__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_database_database__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_localstorage_localstorage__ = __webpack_require__(13);
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






let CetrackingPage = class CetrackingPage {
    constructor(navCtrl, navParams, nav, cd, storage, events, databaseprovider, localstorage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.nav = nav;
        this.cd = cd;
        this.storage = storage;
        this.events = events;
        this.databaseprovider = databaseprovider;
        this.localstorage = localstorage;
        this.CEListing = [];
        this.LegendDetails = false;
        this.LegendDropdownIcon = 'arrow-dropdown-circle';
        // Listen for sync events and 
        // refresh side menu dashboard
        this.events.subscribe('sync:Status', (SyncType) => {
            console.log('CetrackingPage: Sync has ', SyncType);
            this.LoadCETrackerData();
        });
    }
    ionViewDidEnter() {
        console.log('ionViewDidEnter: CetrackingPage');
        this.LoadCETrackerData();
    }
    LoadCETrackerData() {
        this.CEListing = [];
        this.cd.markForCheck();
        // Load / refresh data when coming to this page
        var iconScan = "";
        // Icons
        var iconCEScanPendingScan = 'qr-scanner';
        var iconCEScanNotCompleted = 'close-circle';
        var iconCEScanTimeInSession = 'timer';
        var iconCEScanComplete = 'checkmark';
        var sumCreditsL = 0;
        var sumCreditsP = 0;
        /* Determine currently logged in user */
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        if (AttendeeID != '' && AttendeeID != null) {
            console.log('Stored AttendeeID: ' + AttendeeID);
            this.databaseprovider.getCETrackerData(AttendeeID).then(data => {
                console.log("getCETrackerData: " + JSON.stringify(data));
                if (data['length'] > 0) {
                    for (var i = 0; i < data['length']; i++) {
                        var EvalType = data[i].ce_credits_type.substring(0, 1);
                        var iconSet = 0;
                        if (EvalType == "") {
                            iconScan = iconCEScanComplete;
                            iconSet = 1;
                            //sumCreditsL = sumCreditsL + parseFloat(data[i].CEcreditsL);
                            //sumCreditsP = sumCreditsP + parseFloat(data[i].CEcreditsP);
                        }
                        if (data[i].ceStatusScan == "0" && iconSet == 0) {
                            iconScan = iconCEScanPendingScan;
                            iconSet = 1;
                        }
                        if ((data[i].Evaluated == "0" || data[i].Evaluated === null) && iconSet == 0) {
                            iconScan = iconCEScanNotCompleted;
                            iconSet = 1;
                        }
                        if (iconSet == 0) {
                            iconScan = iconCEScanComplete;
                            //sumCreditsL = sumCreditsL + parseFloat(data[i].CEcreditsL);
                            //sumCreditsP = sumCreditsP + parseFloat(data[i].CEcreditsP);
                        }
                        sumCreditsL = sumCreditsL + parseFloat(data[i].CEcreditsL);
                        sumCreditsP = sumCreditsP + parseFloat(data[i].CEcreditsP);
                        console.log("CE Record: " + data[i].session_title + ", Icon: " + iconScan);
                        this.CEListing.push({
                            EventID: data[i].session_id,
                            EvaluationType: EvalType,
                            DisplayEventName: data[i].session_title,
                            sessionScanStatusIcon: iconScan,
                            navigationRightArrow: "arrow-dropright"
                        });
                    }
                    this.creditsTypeL = sumCreditsL.toFixed(2);
                    this.creditsTypeP = sumCreditsP.toFixed(2);
                    this.cd.markForCheck();
                }
                else {
                    this.CEListing.push({
                        EventID: "0",
                        EvaluationType: "0",
                        DisplayEventName: "No CE records available",
                        sessionScanStatusIcon: iconCEScanPendingScan,
                        navigationRightArrow: ""
                    });
                    this.creditsTypeL = '0.00';
                    this.creditsTypeP = '0.00';
                    this.cd.markForCheck();
                }
            }).catch(function () {
                console.log("Promise Rejected");
            });
        }
        else {
            console.log('User not logged in');
            this.creditsTypeL = '0.00';
            this.creditsTypeP = '0.00';
        }
        this.events.publish('user:Status', 'CE Tracker Update');
    }
    toggleLegend() {
        console.log('Toggle Legend: ' + this.LegendDetails);
        this.LegendDetails = !this.LegendDetails;
        switch (this.LegendDetails) {
            case true:
                this.LegendDropdownIcon = 'arrow-dropup-circle';
                break;
            case false:
                this.LegendDropdownIcon = 'arrow-dropdown-circle';
                break;
        }
    }
    ;
    isLegendShown() {
        return this.LegendDetails;
    }
    ;
    ionViewDidLoad() {
        console.log('ionViewDidLoad: CetrackingPage');
    }
    Survey(EventID, EvalType) {
        console.log("Survey clicked; SurveyID: " + EventID + "; Evaluation Type: " + EvalType);
        if (EventID != "0") {
            this.localstorage.setLocalValue('MassEval', "1");
            this.localstorage.setLocalValue('EventID', EventID);
            if (EvalType == "L") {
                // Navigate to Lecture Evaluation page
                console.log('CE Tracker: Navigate to Lecture Evaluation');
                this.navCtrl.push('EvaluationLecture', { EventID: EventID }, { animate: true, direction: 'forward' });
            }
            if (EvalType == "P") {
                // Navigate to Workshop Evaluation page
                console.log('CE Tracker: Navigate to Workshop Evaluation');
                this.navCtrl.push('EvaluationWorkshop', { EventID: EventID }, { animate: true, direction: 'forward' });
            }
        }
    }
};
CetrackingPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-cetracking',template:/*ion-inline-start:"/Users/petervroom/demoplanner/src/pages/cetracking/cetracking.html"*/'<ion-header>\n\n  <ion-navbar color="primary">\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>CE Tracking</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n\n\n	<div>\n\n		<p class="myLabelLRMargin" style="text-align:left;font-size:16px">\n\n			Below is your list of CE courses attended and credits earned. \n\n			Your feedback is important to us. Please take a few minutes to complete the course evaluations.\n\n		</p>\n\n	</div>\n\n\n\n\n\n	<ion-list>\n\n			<ion-item class="LegendHeader" id="icons-list-item31">\n\n						Currently Completed Credits\n\n				</ion-item>\n\n\n\n				<ion-item>{{creditsTypeL}}L / {{creditsTypeP}}P    </ion-item>\n\n				</ion-list>\n\n\n\n	<ion-list id="CEScans-list3">\n\n		<ion-item class="LegendHeader" style="background:#283593;color:#fff">Scanned Courses\n\n		</ion-item>\n\n\n\n\n\n	<ion-item>\n\n	<ion-grid>\n\n	<ion-row>\n\n	<ion-col col-8>\n\n		<ion-icon name="close-circle"></ion-icon> Evaluation not completed\n\n	</ion-col>\n\n	<ion-col>\n\n		<ion-icon name="checkmark-circle"></ion-icon> Completed\n\n	</ion-col>\n\n</ion-row>\n\n</ion-grid>\n\n</ion-item>\n\n\n\n			<ion-item (click)="Survey(session.EventID,session.EvaluationType)" *ngFor="let session of CEListing" id="cescans-list-item19">\n\n				<ion-icon item-left name="{{session.sessionScanStatusIcon}}"></ion-icon>\n\n				<ion-icon item-right name="arrow-dropright"></ion-icon>\n\n				<h2 text-wrap>{{session.DisplayEventName}}</h2>\n\n			</ion-item>\n\n		</ion-list>\n\n\n\n\n\n\n\n\n\n</ion-content>'/*ion-inline-end:"/Users/petervroom/demoplanner/src/pages/cetracking/cetracking.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"],
        __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* Events */],
        __WEBPACK_IMPORTED_MODULE_4__providers_database_database__["a" /* Database */],
        __WEBPACK_IMPORTED_MODULE_5__providers_localstorage_localstorage__["a" /* Localstorage */]])
], CetrackingPage);

//# sourceMappingURL=cetracking.js.map

/***/ })

});
//# sourceMappingURL=14.js.map