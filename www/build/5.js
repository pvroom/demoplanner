webpackJsonp([5],{

/***/ 898:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProfilePasswordChangePageModule", function() { return ProfilePasswordChangePageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__profilepasswordchange__ = __webpack_require__(920);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



let ProfilePasswordChangePageModule = class ProfilePasswordChangePageModule {
};
ProfilePasswordChangePageModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2__profilepasswordchange__["a" /* ProfilePasswordChangePage */],
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__profilepasswordchange__["a" /* ProfilePasswordChangePage */]),
        ],
        exports: [
            __WEBPACK_IMPORTED_MODULE_2__profilepasswordchange__["a" /* ProfilePasswordChangePage */]
        ]
    })
], ProfilePasswordChangePageModule);

//# sourceMappingURL=profilepasswordchange.module.js.map

/***/ }),

/***/ 920:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProfilePasswordChangePage; });
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






let ProfilePasswordChangePage = class ProfilePasswordChangePage {
    constructor(navParams, storage, databaseprovider, cd, alertCtrl, view, localstorage) {
        this.navParams = navParams;
        this.storage = storage;
        this.databaseprovider = databaseprovider;
        this.cd = cd;
        this.alertCtrl = alertCtrl;
        this.view = view;
        this.localstorage = localstorage;
        this.passwordType = 'password';
        this.passwordIcon = 'eye-off';
    }
    ngOnInit() {
    }
    hideShowPassword() {
        this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
        this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
    }
    closeModal(UserAction) {
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        if (UserAction == "Save") {
            var saveCheck = true;
            console.log('saveCheck: ' + saveCheck);
            console.log('passwordOld: ' + this.passwordOld);
            console.log('passwordNew1: ' + this.passwordNew1);
            console.log('passwordNew2: ' + this.passwordNew2);
            if (this.passwordOld === undefined) {
                let savealert1 = this.alertCtrl.create({
                    title: 'Password Change',
                    subTitle: 'Your old password cannot be blank.',
                    buttons: ['Ok']
                });
                savealert1.present();
                saveCheck = false;
            }
            if ((saveCheck == true) && (this.passwordNew1 === undefined || this.passwordNew2 === undefined)) {
                let savealert2 = this.alertCtrl.create({
                    title: 'Password Change',
                    subTitle: 'Your new password cannot be blank.',
                    buttons: ['Ok']
                });
                savealert2.present();
                saveCheck = false;
            }
            if ((saveCheck == true) && (this.passwordNew1 != this.passwordNew2)) {
                let savealert3 = this.alertCtrl.create({
                    title: 'Password Change',
                    subTitle: 'The new passwords do not match.',
                    buttons: ['Ok']
                });
                savealert3.present();
                saveCheck = false;
            }
            if (saveCheck == true) {
                console.log('saveCheck: ' + saveCheck);
                console.log('passwordOld: ' + this.passwordOld);
                console.log('passwordNew1: ' + this.passwordNew1);
                console.log('passwordNew2: ' + this.passwordNew2);
                var flags = 'pw|' + this.passwordOld + '|' + this.passwordNew1;
                this.databaseprovider.getDatabaseStats(flags, AttendeeID).then(data => {
                    console.log("getDatabaseStats: " + JSON.stringify(data));
                    if (data['length'] > 0) {
                        //console.log("Return status: " + JSON.stringify(data));
                        var ReturnStatus = data[0].Status;
                        switch (ReturnStatus) {
                            case "Saved":
                                let savealert4 = this.alertCtrl.create({
                                    title: 'Password Change',
                                    subTitle: 'Your password has been updated.',
                                    buttons: ['Ok']
                                });
                                savealert4.present();
                                this.view.dismiss(UserAction);
                                break;
                            case "Failed":
                                let savealert5 = this.alertCtrl.create({
                                    title: 'Password Change',
                                    subTitle: 'There was a problem with your entries. Either the old password is incorrect, the new one does not meet minimum requirements, or there was a problem connecting to the server. Please re-check and try again.',
                                    buttons: ['Ok']
                                });
                                savealert5.present();
                                break;
                            case "OldFail":
                                let savealert6 = this.alertCtrl.create({
                                    title: 'Password Change',
                                    subTitle: 'Your old password is not correct. Please re-check and try again.',
                                    buttons: ['Ok']
                                });
                                savealert6.present();
                                break;
                        }
                    }
                }).catch(function () {
                    console.log("Password Change Promise Rejected");
                });
            }
        }
        if (UserAction == "Cancel") {
            this.view.dismiss(UserAction);
        }
    }
};
ProfilePasswordChangePage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-profilepasswordchange',template:/*ion-inline-start:"/Users/petervroom/demoplanner/src/pages/profilepasswordchange/profilepasswordchange.html"*/'<ion-header>\n\n	<ion-navbar color="primary">\n		<ion-title>Password Change</ion-title>\n	</ion-navbar>\n\n</ion-header>\n\n<ion-content padding>\n\n	<ion-item>\n		<ion-label floating>Old Password</ion-label>\n		<ion-input class="InputBoxW" [type]="passwordType" placeholder="" (input)=\'passwordOld = $event.target.value\' name="passwordOld" [value]="passwordOld" id="passwordOld"></ion-input>\n		<ion-icon item-end [name]="passwordIcon" class="passwordIcon" (click)=\'hideShowPassword()\'></ion-icon>\n	</ion-item>\n\n	<ion-item>\n		<ion-label floating>New Password</ion-label>\n		<ion-input class="InputBoxW" [type]="passwordType" placeholder="" (input)=\'passwordNew1 = $event.target.value\' name="passwordNew1" [value]="passwordNew1" id="passwordNew1"></ion-input>\n		<ion-icon item-end [name]="passwordIcon" class="passwordIcon" (click)=\'hideShowPassword()\'></ion-icon>\n	</ion-item>\n\n	<ion-item>\n		<ion-label floating>Re-type New Password</ion-label>\n		<ion-input class="InputBoxW" [type]="passwordType" placeholder="" (input)=\'passwordNew2 = $event.target.value\' name="passwordNew2" [value]="passwordNew2" id="passwordNew2"></ion-input>\n		<ion-icon item-end [name]="passwordIcon" class="passwordIcon" (click)=\'hideShowPassword()\'></ion-icon>\n	</ion-item>\n\n	<ion-grid>\n\n		<ion-row>\n			<ion-col col-6 >\n				<button ion-button block color="danger" (click)="closeModal(\'Save\')">\n					Save\n				</button>\n			</ion-col>\n			<ion-col col-6 >\n				<button ion-button block color="danger" (click)="closeModal(\'Cancel\')">\n					Cancel\n				</button>\n			</ion-col>\n		</ion-row>\n	</ion-grid>\n	\n</ion-content>\n'/*ion-inline-end:"/Users/petervroom/demoplanner/src/pages/profilepasswordchange/profilepasswordchange.html"*/,
        changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */],
        __WEBPACK_IMPORTED_MODULE_4__providers_database_database__["a" /* Database */],
        __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["A" /* ViewController */],
        __WEBPACK_IMPORTED_MODULE_5__providers_localstorage_localstorage__["a" /* Localstorage */]])
], ProfilePasswordChangePage);

//# sourceMappingURL=profilepasswordchange.js.map

/***/ })

});
//# sourceMappingURL=5.js.map