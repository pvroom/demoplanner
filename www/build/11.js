webpackJsonp([11],{

/***/ 906:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EvaluationWorkshopModule", function() { return EvaluationWorkshopModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_forms__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__evaluationworkshop__ = __webpack_require__(927);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// Components, functions, plugins



// Pages

let EvaluationWorkshopModule = class EvaluationWorkshopModule {
};
EvaluationWorkshopModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["NgModule"])({
        declarations: [__WEBPACK_IMPORTED_MODULE_3__evaluationworkshop__["a" /* EvaluationWorkshop */]],
        imports: [
            __WEBPACK_IMPORTED_MODULE_0__angular_forms__["a" /* FormsModule */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["p" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_3__evaluationworkshop__["a" /* EvaluationWorkshop */])
        ],
        exports: [__WEBPACK_IMPORTED_MODULE_3__evaluationworkshop__["a" /* EvaluationWorkshop */]]
    })
], EvaluationWorkshopModule);

//# sourceMappingURL=evaluationworkshop.module.js.map

/***/ }),

/***/ 927:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EvaluationWorkshop; });
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






let EvaluationWorkshop = class EvaluationWorkshop {
    constructor(navCtrl, navParams, nav, cd, storage, loadingCtrl, alertCtrl, databaseprovider, localstorage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.nav = nav;
        this.cd = cd;
        this.storage = storage;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.databaseprovider = databaseprovider;
        this.localstorage = localstorage;
    }
    mcqAnswer(value) {
        console.log(value);
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad: EvaluationWorkshop');
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        var EventID = this.localstorage.getLocalValue('EventID');
        var dbEventDateTime;
        var SQLDate;
        var DisplayDateTime;
        var flags;
        this.CEEvaluationQ11 = "";
        this.CEEvaluationQ12 = "";
        this.CEEvaluationQ21 = "";
        this.CEEvaluationQ22 = "";
        this.CEEvaluationQ23 = "";
        this.CEEvaluationQ24 = "";
        this.CEEvaluationQ25 = "";
        this.CEEvaluationQ26 = "";
        this.CEEvaluationQ31 = "";
        this.CEEvaluationQ32 = "";
        this.CEEvaluationQ33 = "";
        this.CEEvaluationQ41 = "";
        flags = "ei|" + EventID + "|Workshop|0|0|0|0|0|0|0|0|0|0|0|0|0|0";
        this.databaseprovider.getEvaluationData(flags, AttendeeID).then(data => {
            console.log("getEvaluationData: " + JSON.stringify(data));
            if (data['length'] > 0) {
                dbEventDateTime = data[0].session_start_time.substring(0, 19);
                dbEventDateTime = dbEventDateTime.replace(/-/g, '/');
                dbEventDateTime = dbEventDateTime.replace(/T/g, ' ');
                SQLDate = new Date(dbEventDateTime);
                DisplayDateTime = dateFormat(SQLDate, "mm/dd h:MMtt");
                // Display end time
                dbEventDateTime = data[0].session_end_time.substring(0, 19);
                dbEventDateTime = dbEventDateTime.replace(/-/g, '/');
                dbEventDateTime = dbEventDateTime.replace(/T/g, ' ');
                SQLDate = new Date(dbEventDateTime);
                DisplayDateTime = DisplayDateTime + " to " + dateFormat(SQLDate, "h:MMtt");
                this.DisplayEventName = data[0].session_title;
                this.DisplayEventTimeDateLocation = DisplayDateTime + " in " + data[0].RoomName;
                this.CEEvaluationQ11 = data[0].Q11;
                this.CEEvaluationQ12 = data[0].Q12;
                this.CEEvaluationQ21 = data[0].Q21;
                this.CEEvaluationQ22 = data[0].Q22;
                this.CEEvaluationQ23 = data[0].Q23;
                this.CEEvaluationQ24 = data[0].Q24;
                this.CEEvaluationQ25 = data[0].Q25;
                this.CEEvaluationQ26 = data[0].Q26;
                this.CEEvaluationQ31 = data[0].Q31;
                this.CEEvaluationQ32 = data[0].Q32;
                this.CEEvaluationQ33 = data[0].Q33;
                this.CEEvaluationQ41 = data[0].Q41 || '';
                this.cd.markForCheck();
            }
        }).catch(function () {
            console.log("Promise Rejected");
        });
    }
    SubmitEvaluation() {
        console.log('Save evaluation (Workshop)...');
        // Saving progress
        let saving = this.loadingCtrl.create({
            spinner: 'crescent',
            content: 'Saving...'
        });
        // Alert for successful save
        let savealert = this.alertCtrl.create({
            title: 'Evaluation',
            subTitle: 'Evaluation has been saved.',
            buttons: ['Ok']
        });
        // Alert for failed save
        let failalert = this.alertCtrl.create({
            title: 'Evaluation Entry',
            subTitle: 'Unable to save your evaluation at this time - please try again in a little bit.',
            buttons: ['Ok']
        });
        // Alert for required fields
        let requiredalert = this.alertCtrl.create({
            title: 'Evaluation Entry',
            subTitle: 'All questions in blocks 1, 2 and 3 are required to be completed before saving.',
            buttons: ['Ok']
        });
        // Show saving progress
        saving.present();
        var Q11 = this.CEEvaluationQ11;
        var Q12 = this.CEEvaluationQ12;
        var Q21 = this.CEEvaluationQ21;
        var Q22 = this.CEEvaluationQ22;
        var Q23 = this.CEEvaluationQ23;
        var Q24 = this.CEEvaluationQ24;
        var Q25 = this.CEEvaluationQ25;
        var Q26 = this.CEEvaluationQ26;
        var Q31 = this.CEEvaluationQ31;
        var Q32 = this.CEEvaluationQ32;
        var Q33 = this.CEEvaluationQ33;
        var Q41 = this.CEEvaluationQ41 || '';
        var EventID = this.localstorage.getLocalValue('EventID');
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        var flags;
        // Validation checks
        var ValidationPass = true;
        if (this.CEEvaluationQ11 == null || this.CEEvaluationQ11 == "") {
            ValidationPass = false;
        }
        if (this.CEEvaluationQ12 == null || this.CEEvaluationQ12 == "") {
            ValidationPass = false;
        }
        if (this.CEEvaluationQ21 == null || this.CEEvaluationQ21 == "") {
            ValidationPass = false;
        }
        if (this.CEEvaluationQ22 == null || this.CEEvaluationQ22 == "") {
            ValidationPass = false;
        }
        if (this.CEEvaluationQ23 == null || this.CEEvaluationQ23 == "") {
            ValidationPass = false;
        }
        if (this.CEEvaluationQ24 == null || this.CEEvaluationQ24 == "") {
            ValidationPass = false;
        }
        if (this.CEEvaluationQ25 == null || this.CEEvaluationQ25 == "") {
            ValidationPass = false;
        }
        if (this.CEEvaluationQ26 == null || this.CEEvaluationQ26 == "") {
            ValidationPass = false;
        }
        if (this.CEEvaluationQ31 == null || this.CEEvaluationQ31 == "") {
            ValidationPass = false;
        }
        if (this.CEEvaluationQ32 == null || this.CEEvaluationQ32 == "") {
            ValidationPass = false;
        }
        if (this.CEEvaluationQ33 == null || this.CEEvaluationQ33 == "") {
            ValidationPass = false;
        }
        //if (this.CEEvaluationQ41 == null || this.CEEvaluationQ41 == "") {
        //    ValidationPass = false;
        //}
        if (ValidationPass == false) {
            saving.dismiss();
            requiredalert.present();
        }
        else {
            // Get last update performed by this app
            var ThisSync2 = new Date().toUTCString();
            var ThisSync = dateFormat(ThisSync2, "UTC:yyyy-mm-dd' 'HH:MM:ss");
            flags = "es|" + EventID + "|Workshop|" + Q11 + "|" + Q12 + "|" + Q21 + "|" + Q22 + "|" + Q23 + "|" + Q24 + "|" + Q25 + "|" + Q26 + "|" + Q31 + "|" + Q32 + "|" + Q33 + "|" + Q41 + "|" + ThisSync;
            console.log('Save Evaluation (Workshop) flags: ' + flags);
            this.databaseprovider.getEvaluationData(flags, AttendeeID).then(data => {
                console.log("getEvaluationData: " + JSON.stringify(data));
                if (data['length'] > 0) {
                    if (data[0].EVStatus == "Success") {
                        // Saved
                        saving.dismiss();
                        savealert.present();
                        this.navCtrl.pop();
                    }
                    else {
                        // Not saved
                        console.log("Query: " + data[0].EVQuery);
                        saving.dismiss();
                        failalert.present();
                    }
                }
                else {
                    // Not saved
                    console.log("No query to show");
                    saving.dismiss();
                    failalert.present();
                }
            }).catch(function () {
                console.log("Promise Rejected");
            });
        }
    }
};
EvaluationWorkshop = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-evaluationworkshop',template:/*ion-inline-start:"/Users/petervroom/demoplanner/src/pages/evaluationworkshop/evaluationworkshop.html"*/'<ion-header>\n\n  <ion-navbar color="primary">\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>Evaluation</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n\n\n<ion-content>\n\n	\n\n	<ion-list>\n\n		<ion-list-header text-wrap style="background:#283593; color:#fff">\n\n\n\n			<h2 style="color:#fff; font-weight:bold">Course Name</h2>\n\n			<h4 style="color:#fff">{{DisplayEventName}}</h4>\n\n			<h4 style="color:#fff">{{DisplayEventTimeDateLocation}}</h4>\n\n\n\n		</ion-list-header>\n\n\n\n\n\n		<ion-list-header text-wrap style="background:#283593">\n\n			<h2 text-wrap style="color:#fff">1)  Is this the first time you have attended a scientific session?</h2>\n\n		</ion-list-header>\n\n\n\n		<ion-list radio-group [(ngModel)]="CEEvaluationQ11" name="CEEvaluationQ11" (ionChange)="mcqAnswer($event)">\n\n			<ion-item>\n\n				<ion-label>Yes</ion-label>\n\n				<ion-radio value="Yes"></ion-radio>\n\n			</ion-item>\n\n			<ion-item>\n\n				<ion-label>No</ion-label>\n\n				<ion-radio value="No"></ion-radio>\n\n			</ion-item>\n\n		</ion-list>\n\n\n\n\n\n\n\n		<ion-card>\n\n			<ion-card-header text-wrap style="background:#283593">	\n\n				<h2 style="color:#fff">2)  I am a...</h2>\n\n			</ion-card-header>\n\n			<ion-card-content>\n\n				<ion-list radio-group [(ngModel)]="CEEvaluationQ12" name="CEEvaluationQ12">\n\n					<ion-item>\n\n						<ion-label>Doctor</ion-label>\n\n						<ion-radio value="Doctor"></ion-radio>\n\n					</ion-item>\n\n					<ion-item>\n\n						<ion-label>Laboratory Technician</ion-label>\n\n						<ion-radio value="LabTech"></ion-radio>\n\n					</ion-item>\n\n					<ion-item>\n\n						<ion-label>Team</ion-label>\n\n						<ion-radio value="Team"></ion-radio>\n\n					</ion-item>\n\n				</ion-list>\n\n			</ion-card-content>\n\n		</ion-card>\n\n\n\n\n\n\n\n		<ion-card>\n\n			<ion-card-header text-wrap style="background:#283593">	\n\n				<h2 text-wrap style="color:#fff">3) The learning objectives were delivered effectively.</h2>\n\n			</ion-card-header>\n\n		\n\n			<ion-card-content>\n\n				<ion-list radio-group [(ngModel)]="CEEvaluationQ21" name="CEEvaluationQ21">\n\n					<ion-item>\n\n						<ion-label>5 - Strongly Agree</ion-label>\n\n						<ion-radio value="5"></ion-radio>\n\n					</ion-item>\n\n					<ion-item>\n\n						<ion-label>4</ion-label>\n\n						<ion-radio value="4"></ion-radio>\n\n					</ion-item>\n\n					<ion-item>\n\n						<ion-label>3</ion-label>\n\n						<ion-radio value="3"></ion-radio>\n\n					</ion-item>\n\n					<ion-item>\n\n						<ion-label>2</ion-label>\n\n						<ion-radio value="2"></ion-radio>\n\n					</ion-item>\n\n					<ion-item>\n\n						<ion-label>1 - Strong Disagree</ion-label>\n\n						<ion-radio value="1"></ion-radio>\n\n					</ion-item>\n\n				</ion-list>\n\n			</ion-card-content>		\n\n		</ion-card>\n\n	\n\n\n\n\n\n\n\n		<ion-card>\n\n			<ion-card-header text-wrap style="background:#283593">	\n\n				<h2 text-wrap style="color:#fff">4) The synopsis was an accurate reflection of the course as presented.</h2>\n\n			</ion-card-header>\n\n\n\n			<ion-card-content>\n\n				<ion-list radio-group [(ngModel)]="CEEvaluationQ22" name="CEEvaluationQ22">\n\n					<ion-item>\n\n						<ion-label>5 - Strongly Agree</ion-label>\n\n						<ion-radio value="5"></ion-radio>\n\n					</ion-item>\n\n					<ion-item>\n\n						<ion-label>4</ion-label>\n\n						<ion-radio value="4"></ion-radio>\n\n					</ion-item>\n\n					<ion-item>\n\n						<ion-label>3</ion-label>\n\n						<ion-radio value="3"></ion-radio>\n\n					</ion-item>\n\n					<ion-item>\n\n						<ion-label>2</ion-label>\n\n						<ion-radio value="2"></ion-radio>\n\n					</ion-item>\n\n					<ion-item>\n\n						<ion-label>1 - Strongly Disagree</ion-label>\n\n						<ion-radio value="1"></ion-radio>\n\n					</ion-item>\n\n				</ion-list>\n\n			</ion-card-content>\n\n		</ion-card>\n\n\n\n\n\n\n\n		<ion-card>\n\n			<ion-card-header text-wrap style="background:#283593">	\n\n				<h2 text-wrap style="color:#fff">5) The presentation style and organization contributed positively to the course.</h2>\n\n			</ion-card-header>\n\n\n\n			<ion-card-content>\n\n				<ion-list radio-group [(ngModel)]="CEEvaluationQ23" name="CEEvaluationQ23">\n\n					<ion-item>\n\n						<ion-label>5 - Strongly Agree</ion-label>\n\n						<ion-radio value="5"></ion-radio>\n\n					</ion-item>\n\n					<ion-item>\n\n						<ion-label>4</ion-label>\n\n						<ion-radio value="4"></ion-radio>\n\n					</ion-item>\n\n					<ion-item>\n\n						<ion-label>3</ion-label>\n\n						<ion-radio value="3"></ion-radio>\n\n					</ion-item>\n\n					<ion-item>\n\n						<ion-label>2</ion-label>\n\n						<ion-radio value="2"></ion-radio>\n\n					</ion-item>\n\n					<ion-item>\n\n						<ion-label>1 - Strongly Disagree</ion-label>\n\n						<ion-radio value="1"></ion-radio>\n\n					</ion-item>\n\n				</ion-list>\n\n			</ion-card-content>\n\n		</ion-card>\n\n\n\n		\n\n\n\n		<ion-card>\n\n			<ion-card-header text-wrap style="background:#283593">	\n\n				<h2 text-wrap style="color:#fff">6) The material will be useful to me and my practice.</h2>\n\n			</ion-card-header>\n\n\n\n			<ion-card-content>\n\n				<ion-list radio-group [(ngModel)]="CEEvaluationQ24" name="CEEvaluationQ24">\n\n					<ion-item>\n\n						<ion-label>5 - Strongly Agree</ion-label>\n\n						<ion-radio value="5"></ion-radio>\n\n					</ion-item>\n\n					<ion-item>\n\n						<ion-label>4</ion-label>\n\n						<ion-radio value="4"></ion-radio>\n\n					</ion-item>\n\n					<ion-item>\n\n						<ion-label>3</ion-label>\n\n						<ion-radio value="3"></ion-radio>\n\n					</ion-item>\n\n					<ion-item>\n\n						<ion-label>2</ion-label>\n\n						<ion-radio value="2"></ion-radio>\n\n					</ion-item>\n\n					<ion-item>\n\n						<ion-label>1 - Strongly Disagree</ion-label>\n\n						<ion-radio value="1"></ion-radio>\n\n					</ion-item>\n\n				</ion-list>\n\n			</ion-card-content>\n\n		</ion-card>\n\n\n\n\n\n	   \n\n		<ion-card>\n\n			<ion-card-header text-wrap style="background:#283593">	\n\n				<h2 text-wrap style="color:#fff">7) The session provided opportunities for active learning.</h2>\n\n			</ion-card-header>\n\n\n\n			<ion-card-content>\n\n				<ion-list radio-group [(ngModel)]="CEEvaluationQ25" name="CEEvaluationQ25">\n\n					<ion-item>\n\n						<ion-label>5 - Strongly Agree</ion-label>\n\n						<ion-radio value="5"></ion-radio>\n\n					</ion-item>\n\n					<ion-item>\n\n						<ion-label>4</ion-label>\n\n						<ion-radio value="4"></ion-radio>\n\n					</ion-item>\n\n					<ion-item>\n\n						<ion-label>3</ion-label>\n\n						<ion-radio value="3"></ion-radio>\n\n					</ion-item>\n\n					<ion-item>\n\n						<ion-label>2</ion-label>\n\n						<ion-radio value="2"></ion-radio>\n\n					</ion-item>\n\n					<ion-item>\n\n						<ion-label>1 - Strongly Disagree</ion-label>\n\n						<ion-radio value="1"></ion-radio>\n\n					</ion-item>\n\n				</ion-list>\n\n			</ion-card-content>\n\n		</ion-card>\n\n\n\n\n\n		<ion-card>\n\n			<ion-card-header text-wrap style="background:#283593">	\n\n				<h2 text-wrap style="color:#fff">8) I would attend another course by this presenter.</h2>\n\n			</ion-card-header>\n\n\n\n			<ion-card-content>\n\n				<ion-list radio-group [(ngModel)]="CEEvaluationQ26" name="CEEvaluationQ26">\n\n					<ion-item>\n\n						<ion-label>5 - Strongly Agree</ion-label>\n\n						<ion-radio value="5"></ion-radio>\n\n					</ion-item>\n\n					<ion-item>\n\n						<ion-label>4</ion-label>\n\n						<ion-radio value="4"></ion-radio>\n\n					</ion-item>\n\n					<ion-item>\n\n						<ion-label>3</ion-label>\n\n						<ion-radio value="3"></ion-radio>\n\n					</ion-item>\n\n					<ion-item>\n\n						<ion-label>2</ion-label>\n\n						<ion-radio value="2"></ion-radio>\n\n					</ion-item>\n\n					<ion-item>\n\n						<ion-label>1 - Strongly Disagree</ion-label>\n\n						<ion-radio value="1"></ion-radio>\n\n					</ion-item>\n\n				</ion-list>\n\n			</ion-card-content>\n\n		</ion-card>\n\n\n\n\n\n\n\n		<ion-card>\n\n			<ion-card-header text-wrap style="background:#283593">	\n\n				<h2 text-wrap style="color:#fff">9) The presentation was not skewed toward the manufacture but balanced with regard to materials and equipment.</h2>\n\n			</ion-card-header>\n\n\n\n			<ion-card-content>\n\n				<ion-list radio-group [(ngModel)]="CEEvaluationQ31" name="CEEvaluationQ31">\n\n					<ion-item>\n\n						<ion-label>5 - Strongly Agree</ion-label>\n\n						<ion-radio value="5"></ion-radio>\n\n					</ion-item>\n\n					<ion-item>\n\n						<ion-label>4</ion-label>\n\n						<ion-radio value="4"></ion-radio>\n\n					</ion-item>\n\n					<ion-item>\n\n						<ion-label>3</ion-label>\n\n						<ion-radio value="3"></ion-radio>\n\n					</ion-item>\n\n					<ion-item>\n\n						<ion-label>2</ion-label>\n\n						<ion-radio value="2"></ion-radio>\n\n					</ion-item>\n\n					<ion-item>\n\n						<ion-label>1 - Strongly Disagree</ion-label>\n\n						<ion-radio value="1"></ion-radio>\n\n					</ion-item>\n\n				</ion-list>\n\n			</ion-card-content>\n\n		</ion-card>\n\n\n\n\n\n		<ion-card>\n\n\n\n			<ion-card-header text-wrap style="background:#283593">	\n\n				<h2 text-wrap style="color:#fff">10) The presenter allotted sufficient time for questions and answers.</h2>\n\n			</ion-card-header>\n\n\n\n			<ion-card-content>\n\n				<ion-list radio-group [(ngModel)]="CEEvaluationQ32" name="CEEvaluationQ32">\n\n					<ion-item>\n\n						<ion-label>5 - Strongly Agree</ion-label>\n\n						<ion-radio value="5"></ion-radio>\n\n					</ion-item>\n\n					<ion-item>\n\n						<ion-label>4</ion-label>\n\n						<ion-radio value="4"></ion-radio>\n\n					</ion-item>\n\n					<ion-item>\n\n						<ion-label>3</ion-label>\n\n						<ion-radio value="3"></ion-radio>\n\n					</ion-item>\n\n					<ion-item>\n\n						<ion-label>2</ion-label>\n\n						<ion-radio value="2"></ion-radio>\n\n					</ion-item>\n\n					<ion-item>\n\n						<ion-label>1 - Strongly Disagree</ion-label>\n\n						<ion-radio value="1"></ion-radio>\n\n					</ion-item>\n\n				</ion-list>\n\n			</ion-card-content>\n\n		</ion-card>\n\n\n\n\n\n\n\n\n\n		<ion-card>\n\n\n\n			<ion-card-header text-wrap style="background:#283593">	\n\n				<h2 text-wrap style="color:#fff">11) The balance of heavy emphasis on hands-on and minimal emphasis on lecture was good.</h2>\n\n			</ion-card-header>\n\n\n\n			<ion-card-content>\n\n				<ion-list radio-group [(ngModel)]="CEEvaluationQ33" name="CEEvaluationQ33">\n\n					<ion-item>\n\n						<ion-label>5 - Strongly Agree</ion-label>\n\n						<ion-radio value="5"></ion-radio>\n\n					</ion-item>\n\n					<ion-item>\n\n						<ion-label>4</ion-label>\n\n						<ion-radio value="4"></ion-radio>\n\n					</ion-item>\n\n					<ion-item>\n\n						<ion-label>3</ion-label>\n\n						<ion-radio value="3"></ion-radio>\n\n					</ion-item>\n\n					<ion-item>\n\n						<ion-label>2</ion-label>\n\n						<ion-radio value="2"></ion-radio>\n\n					</ion-item>\n\n					<ion-item>\n\n						<ion-label>1 - Strongly Disagree</ion-label>\n\n						<ion-radio value="1"></ion-radio>\n\n					</ion-item>\n\n				</ion-list>\n\n			</ion-card-content>\n\n		</ion-card>\n\n\n\n\n\n		<ion-card>\n\n			<ion-card-header text-wrap style="background:#283593">	\n\n				<h2 text-wrap style="color:#fff">12) Please contribute your additional comments or suggestions about this course below.</h2>\n\n			</ion-card-header>\n\n		\n\n			<ion-card-content>\n\n				<ion-textarea autocomplete="true" autocorrect="on" (input)=\'CEEvaluationQ41 = $event.target.value\' \n\n					name="CEEvaluationQ41"\n\n					[value]="CEEvaluationQ41" \n\n					id="CEEvaluationQ41"\n\n					placeholder="Enter text" rows="4"></ion-textarea>\n\n			</ion-card-content>\n\n		</ion-card>\n\n	</ion-list>\n\n\n\n	<div>\n\n		<button ion-button style="background:#2196f3; width:50%; margin-right:25%; margin-left:25%" (click)="SubmitEvaluation()">\n\n			SUBMIT\n\n		</button>\n\n	</div>\n\n	<br/><br/><br/>\n\n\n\n</ion-content>\n\n\n\n\n\n\n\n'/*ion-inline-end:"/Users/petervroom/demoplanner/src/pages/evaluationworkshop/evaluationworkshop.html"*/,
        changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"],
        __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* LoadingController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */],
        __WEBPACK_IMPORTED_MODULE_4__providers_database_database__["a" /* Database */],
        __WEBPACK_IMPORTED_MODULE_5__providers_localstorage_localstorage__["a" /* Localstorage */]])
], EvaluationWorkshop);

//# sourceMappingURL=evaluationworkshop.js.map

/***/ })

});
//# sourceMappingURL=11.js.map