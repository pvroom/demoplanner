webpackJsonp([7],{

/***/ 902:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NotesDetailsPageModule", function() { return NotesDetailsPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_forms__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__notesdetails__ = __webpack_require__(924);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// Components, functions, plugins



// Pages

let NotesDetailsPageModule = class NotesDetailsPageModule {
};
NotesDetailsPageModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["NgModule"])({
        declarations: [__WEBPACK_IMPORTED_MODULE_3__notesdetails__["a" /* NotesDetailsPage */]],
        imports: [
            __WEBPACK_IMPORTED_MODULE_0__angular_forms__["a" /* FormsModule */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["IonicPageModule"].forChild(__WEBPACK_IMPORTED_MODULE_3__notesdetails__["a" /* NotesDetailsPage */])
        ],
        exports: [__WEBPACK_IMPORTED_MODULE_3__notesdetails__["a" /* NotesDetailsPage */]]
    })
], NotesDetailsPageModule);

//# sourceMappingURL=notesdetails.module.js.map

/***/ }),

/***/ 924:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NotesDetailsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_database_database__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_localstorage_localstorage__ = __webpack_require__(12);
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





let NotesDetailsPage = class NotesDetailsPage {
    constructor(navCtrl, navParams, databaseprovider, cd, loadingCtrl, alertCtrl, localstorage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.databaseprovider = databaseprovider;
        this.cd = cd;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.localstorage = localstorage;
        this.EventID = this.navParams.get('EventID');
        this.DisplayEventName = "";
        this.SpeakerDisplayName = "";
        this.NoteDetails = "";
        this.AttendeeID = "";
        this.NoteID = "";
        this.NoteStatus = "";
    }
    ngOnInit() {
        // Load initial data set here
        //let loading = this.loadingCtrl.create({
        //	spinner: 'crescent',
        //	content: 'Please wait...'
        //});
        // Blank and show loading info
        this.cd.markForCheck();
        // Temporary use variables
        var flags;
        // Get the data
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        var EventID = this.localstorage.getLocalValue('EventID');
        if (AttendeeID != '' && AttendeeID != null) {
            //loading.present();
            flags = "0|dt|" + EventID;
            this.databaseprovider.getNotesData(flags, AttendeeID).then(data => {
                console.log("getNotesData: " + JSON.stringify(data));
                if (data['length'] > 0) {
                    console.log('Session Title: ' + data[0].session_title);
                    if (data[0].Note != "" && data[0].Note != null && data[0].Note != undefined) {
                        console.log('Existing note');
                        this.DisplayEventName = data[0].session_title;
                        this.NoteDetails = data[0].Note;
                        this.NoteID = data[0].id;
                        this.NoteStatus = 'Update';
                    }
                    else {
                        console.log('New note');
                        this.DisplayEventName = data[0].session_title;
                        this.NoteDetails = "";
                        this.NoteID = '0';
                        this.NoteStatus = 'New';
                    }
                    this.cd.markForCheck();
                }
                //console.log('Note details: ' + data[0].Note);
                //loading.dismiss();
            }).catch(function () {
                console.log("Promise Rejected");
            });
        }
        else {
            console.log('User not logged in');
            //loading.dismiss();
        }
    }
    SaveNote() {
        console.log('Process note');
        // Saving progress
        let saving = this.loadingCtrl.create({
            spinner: 'crescent',
            content: 'Saving...'
        });
        // Alert for successful save
        let savealert = this.alertCtrl.create({
            title: 'Note Entry',
            subTitle: 'Note has been saved.',
            buttons: ['Ok']
        });
        // Alert for failed save
        let failalert = this.alertCtrl.create({
            title: 'Note Entry',
            subTitle: 'Unable to save your note at this time - please try again in a little bit.',
            buttons: ['Ok']
        });
        // Show saving progress
        saving.present();
        var NoteStatus = this.NoteStatus;
        var NoteID = this.NoteID;
        var sessionID = this.EventID;
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        var NoteEventID = this.localstorage.getLocalValue('EventID');
        var NewNote = this.NoteDetails;
        var flags;
        // If New note, create record
        if (NoteStatus == 'New') {
            console.log('Save New Note');
            flags = "0|sn|" + NoteEventID + "|" + NoteID + "|" + NewNote;
            this.databaseprovider.getNotesData(flags, AttendeeID).then(data => {
                console.log("getNotesData: " + JSON.stringify(data));
                if (data['length'] > 0) {
                    if (data[0].status == "Saved") {
                        // Saved
                        saving.dismiss();
                        savealert.present();
                        this.navCtrl.pop();
                    }
                    else {
                        // Not saved
                        saving.dismiss();
                        failalert.present();
                    }
                }
                else {
                    // Not saved
                    saving.dismiss();
                    failalert.present();
                }
            }).catch(function () {
                console.log("Promise Rejected");
            });
        }
        // If existing note, update record
        if (NoteStatus == 'Update') {
            console.log('Update Existing Note');
            flags = "0|un|" + NoteEventID + "|" + NoteID + "|" + NewNote;
            this.databaseprovider.getNotesData(flags, AttendeeID).then(data => {
                console.log("getNotesData: " + JSON.stringify(data));
                if (data['length'] > 0) {
                    if (data[0].status == "Saved") {
                        // Saved
                        saving.dismiss();
                        savealert.present();
                        this.navCtrl.pop();
                    }
                    else {
                        // Not saved
                        saving.dismiss();
                        failalert.present();
                    }
                }
                else {
                    // Not saved
                    saving.dismiss();
                    failalert.present();
                }
            }).catch(function () {
                console.log("Promise Rejected");
            });
        }
    }
    ;
    // Cancel by returning to calling page.  This could be the Notes Listing or Education Details page
    CancelNote() {
        this.navCtrl.pop();
    }
    ;
};
NotesDetailsPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-notesdetails',template:/*ion-inline-start:"/Users/petervroom/demoplanner/src/pages/notesdetails/notesdetails.html"*/'<ion-header>\n	<ion-navbar color="primary">\n		<button ion-button menuToggle>\n			<ion-icon name="menu"></ion-icon>\n		</button>\n		<ion-title>Notes</ion-title>\n	</ion-navbar>\n</ion-header>\n\n<ion-content>\n\n	<ion-card>\n\n		<ion-card-header style="background:#2c3e50; color:#fff">\n			{{DisplayEventName}}\n			{{SpeakerDisplayName}}\n		</ion-card-header>\n\n		<ion-card-content>\n			<ion-textarea autocomplete="true" autocorrect="on" (input)=\'NoteDetails = $event.target.value\' name="NoteDetails" [value]="NoteDetails" placeholder="Enter notes..."></ion-textarea>\n		</ion-card-content>\n\n	</ion-card>\n\n	<ion-grid>\n		<ion-row>\n			<ion-col col-3 >\n				<button ion-button full color=secondary (click)="SaveNote()">\n					Save\n				</button>\n			</ion-col>\n			<ion-col col-3 >\n				<button ion-button full color=secondary (click)="CancelNote()">\n					Cancel\n				</button>\n			</ion-col>\n		</ion-row>\n	</ion-grid>\n\n	<div style=\'display:none\'>\n		{{AttendeeID}}\n		{{EventID}}\n		{{NoteID}}\n		{{NoteStatus}}\n	</div>\n	\n</ion-content>\n'/*ion-inline-end:"/Users/petervroom/demoplanner/src/pages/notesdetails/notesdetails.html"*/,
        changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"],
        __WEBPACK_IMPORTED_MODULE_3__providers_database_database__["a" /* Database */],
        __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["LoadingController"],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["AlertController"],
        __WEBPACK_IMPORTED_MODULE_4__providers_localstorage_localstorage__["a" /* Localstorage */]])
], NotesDetailsPage);

//# sourceMappingURL=notesdetails.js.map

/***/ })

});
//# sourceMappingURL=7.js.map