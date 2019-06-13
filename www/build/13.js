webpackJsonp([13],{

/***/ 905:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ConversationsPageModule", function() { return ConversationsPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__conversations__ = __webpack_require__(927);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_image_loader__ = __webpack_require__(64);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




// Pages
let ConversationsPageModule = class ConversationsPageModule {
};
ConversationsPageModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2__conversations__["a" /* ConversationsPage */],
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_3_ionic_image_loader__["b" /* IonicImageLoader */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["IonicPageModule"].forChild(__WEBPACK_IMPORTED_MODULE_2__conversations__["a" /* ConversationsPage */]),
        ],
    })
], ConversationsPageModule);

//# sourceMappingURL=conversations.module.js.map

/***/ }),

/***/ 927:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConversationsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_storage__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_database_database__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_localstorage_localstorage__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_ionic_image_loader__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__conversation_conversation__ = __webpack_require__(472);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__attendees_attendees__ = __webpack_require__(197);
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


let ConversationsPage = class ConversationsPage {
    constructor(navCtrl, navParams, storage, databaseprovider, imageLoaderConfig, alertCtrl, cd, loadingCtrl, localstorage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.databaseprovider = databaseprovider;
        this.imageLoaderConfig = imageLoaderConfig;
        this.alertCtrl = alertCtrl;
        this.cd = cd;
        this.loadingCtrl = loadingCtrl;
        this.localstorage = localstorage;
        this.Conversations = [];
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad SpeakersPage');
    }
    NavToPage(PageID) {
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        switch (PageID) {
            case "AttendeesPage":
                this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_8__attendees_attendees__["a" /* AttendeesPage */], {}, { animate: true, direction: 'forward' });
                break;
        }
    }
    ;
    ionViewDidEnter() {
        console.log('ionViewDidEnter ConversationsPage');
        this.LoadData();
    }
    LoadData() {
        // Load initial data set here
        //let loading = this.loadingCtrl.create({
        //	spinner: 'crescent',
        //	content: 'Please wait...'
        //});
        //loading.present();
        // Blank and show loading info
        this.Conversations = [];
        this.cd.markForCheck();
        this.imageLoaderConfig.setFallbackUrl('assets/img/personIcon.png');
        // Temporary use variables
        var flags = "li|Time|";
        var DisplayName = "";
        var visDisplayCompany = "";
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        // Get the data
        this.databaseprovider.getMessagingData(flags, AttendeeID).then(data => {
            console.log("getMessagingData: " + JSON.stringify(data));
            if (data['length'] > 0) {
                for (var i = 0; i < data['length']; i++) {
                    DisplayName = "";
                    // Concatenate fields to build displayable name
                    DisplayName = DisplayName + data[i].LastName + ", " + data[i].FirstName;
                    // Use Credentials field for Company/Association
                    visDisplayCompany = "";
                    if (data[i].Company != "") {
                        visDisplayCompany = data[i].Company;
                    }
                    var imageAvatar = "https://demoplanner.convergence-us.com/AdminGateway/2019/images/Attendees/" + data[i].ConversationAttendeeID + ".jpg";
                    console.log('imageAvatar: ' + imageAvatar);
                    // Add current record to the list
                    this.Conversations.push({
                        ConversationAttendeeID: data[i].ConversationAttendeeID,
                        AttendeeName: DisplayName,
                        AttendeeOrganization: visDisplayCompany,
                        AttendeeAvatar: imageAvatar
                    });
                }
            }
            else {
                // No records to show
                this.Conversations.push({
                    ConversationAttendeeID: 0,
                    AttendeeName: "No conversations available",
                    AttendeeOrganization: "",
                    AttendeeAvatar: ""
                });
            }
            this.cd.markForCheck();
            //loading.dismiss();
        }).catch(function () {
            console.log("Promise Rejected");
        });
        // Update LastSync date for next run
        //var ThisDirectChatCheck = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        var ThisDirectChatCheck2 = new Date().toUTCString();
        var ThisDirectChatCheck = dateFormat(ThisDirectChatCheck2, "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'");
        this.localstorage.setLocalValue('LastDirectChatCheck', ThisDirectChatCheck);
    }
    ContinueConversation(ConversationAttendeeName, ConversationAttendeeID) {
        console.log(ConversationAttendeeID);
        //var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        //if (AttendeeID != '900000' && AttendeeID != '900001' && AttendeeID != '21' && AttendeeID != '22') {
        // Alert for successful save
        //	let savealert = this.alertCtrl.create({
        //		title: 'Conversations',
        //		subTitle: 'The direct chat feature is not available at this time.',
        //		buttons: ['Ok']
        //	});
        //	savealert.present();
        //} else {
        if (ConversationAttendeeID != 0) {
            // Navigate to Conversation Details page
            this.localstorage.setLocalValue('ConversationAttendeeName', ConversationAttendeeName);
            this.localstorage.setLocalValue('ConversationAttendeeID', ConversationAttendeeID);
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__conversation_conversation__["a" /* ConversationPage */], { ConversationAttendeeID: ConversationAttendeeID }, { animate: true, direction: 'forward' });
        }
        //}
    }
    ;
};
ConversationsPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-conversations',template:/*ion-inline-start:"/Users/petervroom/demoplanner/src/pages/conversations/conversations.html"*/'<ion-header>\n    <ion-navbar color="primary">\n		<button ion-button menuToggle>\n			<ion-icon name="menu"></ion-icon>\n		</button>\n		<ion-title>Attendee Conversations</ion-title>\n    </ion-navbar>\n  </ion-header>\n\n\n<ion-content>\n\n<!--\n	\n	<ion-item text-wrap>\n		<h2>Below are your current conversations with attendees at the \n		conference.&nbsp; Tap on one to continue chatting.&nbsp; Your \n		most recent message is at the top.</h2>\n	</ion-item>\n-->\n\n\n\n<ion-grid>\n	<ion-row>\n		<ion-col>\n\n				<button ion-button block color="secondary" style="margin-top:15px" (click)="NavToPage(\'AttendeesPage\')">Start a Conversation!</button>\n\n		</ion-col>\n	</ion-row>\n</ion-grid>\n\n\n\n\n	<ion-list style="margin-top:-10; margin-bottom:-10" *ngFor="let conversation of Conversations" >\n\n		<ion-item no-lines style="margin-top:-10; margin-bottom:-10" (tap)="ContinueConversation(conversation.AttendeeName, conversation.ConversationAttendeeID)">\n			<ion-avatar item-start>\n				<img  [src]="conversation.AttendeeAvatar" src="assets/img/personIcon.png" style="margin-top:0; margin-bottom:0" onerror="this.src=\'assets/img/personIcon.png\'">\n				<!--<img-loader [src]="conversation.AttendeeAvatar" style="margin-top:0; margin-bottom:0" useImg [spinner]=false></img-loader>-->\n			</ion-avatar>\n			<h2>{{conversation.AttendeeName}}</h2>\n			<h3>{{conversation.AttendeeOrganization}}</h3>\n		</ion-item>\n\n	</ion-list>\n\n</ion-content>\n'/*ion-inline-end:"/Users/petervroom/demoplanner/src/pages/conversations/conversations.html"*/,
        changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"],
        __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */],
        __WEBPACK_IMPORTED_MODULE_4__providers_database_database__["a" /* Database */],
        __WEBPACK_IMPORTED_MODULE_6_ionic_image_loader__["a" /* ImageLoaderConfig */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["AlertController"],
        __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["LoadingController"],
        __WEBPACK_IMPORTED_MODULE_5__providers_localstorage_localstorage__["a" /* Localstorage */]])
], ConversationsPage);

//# sourceMappingURL=conversations.js.map

/***/ })

});
//# sourceMappingURL=13.js.map