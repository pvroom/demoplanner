webpackJsonp([17],{

/***/ 902:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ActivityFeedCommentPageModule", function() { return ActivityFeedCommentPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__activityfeedcomment__ = __webpack_require__(924);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



let ActivityFeedCommentPageModule = class ActivityFeedCommentPageModule {
};
ActivityFeedCommentPageModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2__activityfeedcomment__["a" /* ActivityFeedCommentPage */],
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["IonicPageModule"].forChild(__WEBPACK_IMPORTED_MODULE_2__activityfeedcomment__["a" /* ActivityFeedCommentPage */]),
        ],
        exports: [
            __WEBPACK_IMPORTED_MODULE_2__activityfeedcomment__["a" /* ActivityFeedCommentPage */]
        ]
    })
], ActivityFeedCommentPageModule);

//# sourceMappingURL=activityfeedcomment.module.js.map

/***/ }),

/***/ 924:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ActivityFeedCommentPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_storage__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_database_database__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_localstorage_localstorage__ = __webpack_require__(15);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






let ActivityFeedCommentPage = class ActivityFeedCommentPage {
    constructor(navParams, storage, databaseprovider, view, localstorage) {
        this.navParams = navParams;
        this.storage = storage;
        this.databaseprovider = databaseprovider;
        this.view = view;
        this.localstorage = localstorage;
    }
    ngOnInit() {
    }
    closeModal(UserAction) {
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        var ActivityFeedID = this.localstorage.getLocalValue('ActivityFeedID');
        if (UserAction == "Save") {
            var UserComment = this.CommentEntry;
            var flags = 'ad|' + ActivityFeedID + '|' + UserComment;
            this.databaseprovider.getActivityFeedData(flags, AttendeeID).then(data => {
                console.log("getActivityFeedData: " + JSON.stringify(data));
                if (data['length'] > 0) {
                    console.log("Return status: " + data[0].Status);
                    this.view.dismiss(UserAction);
                }
            }).catch(function () {
                console.log("Activity Feed Promise Rejected");
            });
        }
        if (UserAction == "Cancel") {
            this.view.dismiss(UserAction);
        }
    }
};
ActivityFeedCommentPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-activityfeedcomment',template:/*ion-inline-start:"/Users/petervroom/demoplanner/src/pages/activityfeedcomment/activityfeedcomment.html"*/'<ion-header>\n\n	<ion-navbar color="primary">\n		<ion-title>Add a Comment</ion-title>\n	</ion-navbar>\n\n</ion-header>\n\n\n<ion-content>\n\n\n		<ion-grid>\n			<ion-row>\n				<ion-col col-6 >\n					<button ion-button color="danger" (click)="closeModal(\'Save\')">\n						Save\n					</button>\n				</ion-col>\n				<ion-col col-6 >\n					<button ion-button color="danger" (click)="closeModal(\'Cancel\')">\n						Cancel\n					</button>\n				</ion-col>\n			</ion-row>\n		</ion-grid>\n\n\n\n		<ion-textarea autocomplete="true" autocorrect="on"\n		(input)=\'CommentEntry = $event.target.value\' \n		name="CommentEntry" \n		[value]="CommentEntry" \n		placeholder="Enter a comment..."\n		style="height:150px;"></ion-textarea>\n\n\n\n</ion-content>\n\n\n<!--\n\n<ion-footer>\n<ion-toolbar>\n	<ion-textarea \n		(input)=\'CommentEntry = $event.target.value\' \n		name="CommentEntry" \n		[value]="CommentEntry" \n		placeholder="Enter a comment..."\n		style="height:150px;"></ion-textarea>\n</ion-toolbar>\n</ion-footer>\n\n-->'/*ion-inline-end:"/Users/petervroom/demoplanner/src/pages/activityfeedcomment/activityfeedcomment.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"],
        __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */],
        __WEBPACK_IMPORTED_MODULE_4__providers_database_database__["a" /* Database */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["ViewController"],
        __WEBPACK_IMPORTED_MODULE_5__providers_localstorage_localstorage__["a" /* Localstorage */]])
], ActivityFeedCommentPage);

//# sourceMappingURL=activityfeedcomment.js.map

/***/ })

});
//# sourceMappingURL=17.js.map