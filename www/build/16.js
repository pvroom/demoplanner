webpackJsonp([16],{

/***/ 914:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ActivityFeedDetailsPageModule", function() { return ActivityFeedDetailsPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_forms__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__activityfeeddetails__ = __webpack_require__(934);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// Components, functions, plugins



// Pages

let ActivityFeedDetailsPageModule = class ActivityFeedDetailsPageModule {
};
ActivityFeedDetailsPageModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["NgModule"])({
        declarations: [__WEBPACK_IMPORTED_MODULE_3__activityfeeddetails__["a" /* ActivityFeedDetailsPage */]],
        imports: [
            __WEBPACK_IMPORTED_MODULE_0__angular_forms__["a" /* FormsModule */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["IonicPageModule"].forChild(__WEBPACK_IMPORTED_MODULE_3__activityfeeddetails__["a" /* ActivityFeedDetailsPage */])
        ],
        exports: [__WEBPACK_IMPORTED_MODULE_3__activityfeeddetails__["a" /* ActivityFeedDetailsPage */]]
    })
], ActivityFeedDetailsPageModule);

//# sourceMappingURL=activityfeeddetails.module.js.map

/***/ }),

/***/ 934:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ActivityFeedDetailsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_storage__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_database_database__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_localstorage_localstorage__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_moment__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_moment__);
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







let ActivityFeedDetailsPage = class ActivityFeedDetailsPage {
    constructor(navCtrl, navParams, storage, databaseprovider, cd, alertCtrl, events, loadingCtrl, modal, localstorage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.databaseprovider = databaseprovider;
        this.cd = cd;
        this.alertCtrl = alertCtrl;
        this.events = events;
        this.loadingCtrl = loadingCtrl;
        this.modal = modal;
        this.localstorage = localstorage;
        this.afComments = [];
        this.showEmojiPicker = false;
        this.CommentEntry = '';
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad ActivityFeedDetailsPage');
    }
    AddComment(fab) {
        const AddCommentModalOptions = {
            enableBackdropDismiss: false
        };
        const AddCommentModal = this.modal.create('ActivityFeedCommentPage', {}, AddCommentModalOptions);
        AddCommentModal.present();
        AddCommentModal.onDidDismiss((data) => {
            // If saved, then re-run ngOnInit to refresh the listing
            if (data == "Save") {
                this.ngOnInit();
            }
        });
        fab.close();
    }
    onFocus() {
        this.showEmojiPicker = false;
        this.content.resize();
        // Disabled scrollToBottom per Peter Vroom (2019-02-06)
        // "I don’t think you do a lot of social media. ☺ Most recent 
        // comments always go at the top. Most commenters aren’t interested 
        // in seeing what everyone else wrote and don’t have the time."
        //this.scrollToBottom();
    }
    scrollToBottom() {
        setTimeout(() => {
            if (this.content.scrollToBottom !== null) {
                if (this.content.scrollToBottom) {
                    this.content.scrollToBottom();
                }
            }
        }, 400);
    }
    SaveComment() {
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        var ActivityFeedID = this.localstorage.getLocalValue('ActivityFeedID');
        var UserComment = this.CommentEntry || '';
        var flags = 'ad|' + ActivityFeedID + '|' + UserComment;
        if (UserComment != '') {
            this.databaseprovider.getActivityFeedData(flags, AttendeeID).then(data => {
                console.log("getActivityFeedData: " + JSON.stringify(data));
                if (data['length'] > 0) {
                    this.CommentEntry = '';
                    // Reload comments
                    console.log("Return status: " + data[0].Status);
                    this.ReloadComments();
                }
            }).catch(function () {
                console.log("Activity Feed Promise Rejected");
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
    timeDifference(laterdate, earlierdate) {
        console.log('Moment timeDifference output: ' + __WEBPACK_IMPORTED_MODULE_6_moment__(earlierdate).fromNow());
        return __WEBPACK_IMPORTED_MODULE_6_moment__(earlierdate).fromNow();
    }
    ngOnInit() {
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        if (AttendeeID == '' || AttendeeID == null) {
            AttendeeID = '0';
        }
        // Load initial data set here
        //let loading = this.loadingCtrl.create({
        //	spinner: 'crescent',
        //	content: 'Please wait...'
        //});
        //loading.present();
        // Blank and show loading info
        this.cd.markForCheck();
        // Temporary use variables
        var ActivityFeedID = this.localstorage.getLocalValue('ActivityFeedID');
        this.ActivityFeedID = ActivityFeedID;
        var flags = "dt|" + ActivityFeedID + "|Alpha|";
        // -------------------------
        // Get Activity Feed Details
        // -------------------------
        var PrimarySpeakerName = "";
        var SQLDate;
        var DisplayDateTime;
        var dbEventDateTime;
        var courseID = "";
        var UpdatedEventDescription;
        var UpdatedEventDescription2;
        var HandoutPDFName = "";
        this.afComments = [];
        var afWebLink;
        console.log('Activity Feed Details, flags: ' + flags);
        // Get Activity Feed detail record
        this.databaseprovider.getActivityFeedData(flags, AttendeeID).then(data => {
            console.log("getActivityFeedData: " + JSON.stringify(data));
            if (data['length'] > 0) {
                // Original posting details
                var imageAvatar = "https://demoplanner.convergence-us.com/AdminGateway/2019/images/Attendees/" + data[0].Poster + ".jpg";
                var imageAttachment = data[0].afImageAttachment;
                if (imageAttachment != "") {
                    imageAttachment = "https://demoplanner.convergence-us.com/AdminGateway/2019/images/ActivityFeedAttachments/" + imageAttachment;
                }
                var DisplayName = data[0].PosterFirst + " " + data[0].PosterLast;
                dbEventDateTime = data[0].Posted.substring(0, 19);
                dbEventDateTime = dbEventDateTime.replace(/-/g, '/');
                dbEventDateTime = dbEventDateTime.replace(/T/g, ' ');
                SQLDate = new Date(dbEventDateTime);
                DisplayDateTime = dateFormat(SQLDate, "mm/dd h:MMtt");
                var CurrentDateTime2 = new Date().toUTCString();
                var CurrentDateTime = dateFormat(CurrentDateTime2, "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'");
                dbEventDateTime = data[0].afDateTime.substring(0, 19);
                dbEventDateTime = dbEventDateTime.replace(' ', 'T');
                dbEventDateTime = dbEventDateTime + 'Z';
                var PostedDate2 = new Date(dbEventDateTime);
                var PostedDate = dateFormat(PostedDate2, "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'");
                var TimeDifference = this.timeDifference(CurrentDateTime, PostedDate);
                this.ActivityFeedCommentAvatar = imageAvatar;
                this.ActivityFeedCommentBy = DisplayName;
                this.ActivityFeedCommentPosted = DisplayDateTime;
                this.ActivityFeedComment = data[0].afMessage;
                this.ActivityFeedLikesCounter = data[0].afLikesCounter;
                this.ActivityFeedCommentsCounter = data[0].CommentsCount;
                this.ActivityFeedCommentPostedDuration = TimeDifference;
                this.ActivityFeedAttachment = imageAttachment;
                afWebLink = false;
                if (data[0].LinkedURL != "" && data[0].LinkedURL !== null) {
                    afWebLink = true;
                }
                this.ActivityFeedLinkedURL = data[0].LinkedURL;
                this.showActivityFeedLinkedURL = afWebLink;
                this.ActivityFeedAttendeeID = data[0].Poster;
                this.localstorage.setLocalValue('ActivityFeedIDCCount', data[0].CommentsCount);
                console.log('Initial post set');
                if (data[0].CommentsCount > 0) {
                    // Commenter details
                    for (var i = 0; i < data['length']; i++) {
                        var imageAvatar = "https://demoplanner.convergence-us.com/AdminGateway/2019/images/Attendees/" + data[i].Commenter + ".jpg";
                        DisplayName = data[i].CommenterFirst + " " + data[i].CommenterLast;
                        dbEventDateTime = data[i].CommentPosted.substring(0, 19);
                        dbEventDateTime = dbEventDateTime.replace(/-/g, '/');
                        dbEventDateTime = dbEventDateTime.replace(/T/g, ' ');
                        SQLDate = new Date(dbEventDateTime);
                        DisplayDateTime = dateFormat(SQLDate, "mm/dd h:MMtt");
                        var postComment = '';
                        if (data[i].DeletedYN == 'Y') {
                            postComment = '[Deleted]';
                        }
                        else {
                            postComment = data[i].afcComment;
                        }
                        // Show the current record
                        this.afComments.push({
                            afID: data[i].afID,
                            ActivityFeedCommentAvatar: imageAvatar,
                            ActivityFeedCommentBy: DisplayName,
                            ActivityFeedCommentByID: data[i].Commenter,
                            ActivityFeedCommentPosted: DisplayDateTime,
                            ActivityFeedComment: postComment
                        });
                    }
                }
            }
            this.cd.markForCheck();
            //loading.dismiss();
        }).catch(function () {
            console.log("Activity Feed Promise Rejected");
            //loading.dismiss();
        });
    }
    ReloadComments() {
        // Blank and show loading info
        this.cd.markForCheck();
        // Temporary use variables
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        var ActivityFeedID = this.localstorage.getLocalValue('ActivityFeedID');
        this.ActivityFeedID = ActivityFeedID;
        var flags = "dt|" + ActivityFeedID + "|Alpha|";
        var SQLDate;
        var DisplayDateTime;
        var dbEventDateTime;
        var DisplayName;
        var imageAvatar;
        console.log('Activity Feed Details, flags: ' + flags);
        // Get Activity Feed detail record
        this.databaseprovider.getActivityFeedData(flags, AttendeeID).then(data => {
            console.log("getActivityFeedData: " + JSON.stringify(data));
            if (data['length'] > 0) {
                this.ActivityFeedLikesCounter = data[0].afLikesCounter;
                this.ActivityFeedCommentsCounter = data[0].CommentsCount;
                if (data[0].CommentsCount > 0) {
                    this.afComments = [];
                    // Commenter details
                    for (var i = 0; i < data['length']; i++) {
                        imageAvatar = "https://demoplanner.convergence-us.com/AdminGateway/2019/images/Attendees/" + data[i].Commenter + ".jpg";
                        DisplayName = data[i].CommenterFirst + " " + data[i].CommenterLast;
                        dbEventDateTime = data[i].CommentPosted.substring(0, 19);
                        dbEventDateTime = dbEventDateTime.replace(/-/g, '/');
                        dbEventDateTime = dbEventDateTime.replace(/T/g, ' ');
                        SQLDate = new Date(dbEventDateTime);
                        DisplayDateTime = dateFormat(SQLDate, "mm/dd h:MMtt");
                        // Show the current record
                        this.afComments.push({
                            afID: data[i].afID,
                            ActivityFeedCommentAvatar: imageAvatar,
                            ActivityFeedCommentBy: DisplayName,
                            ActivityFeedCommentPosted: DisplayDateTime,
                            ActivityFeedComment: data[i].afcComment
                        });
                    }
                    this.cd.markForCheck();
                }
            }
        }).catch(function () {
            console.log("Activity Feed Comment Reload Promise Rejected");
        });
    }
    UpdateLikes() {
        console.log('Likes button tapped');
        var flags = "lu|" + this.ActivityFeedID;
        // Get the data
        this.databaseprovider.getActivityFeedData(flags, "0").then(data => {
            console.log(JSON.stringify(data));
            if (data['length'] > 0) {
                if (data[0].Status = "Saved") {
                    this.ActivityFeedLikesCounter = data[0].NewLikes;
                    this.cd.markForCheck();
                }
            }
        }).catch(function () {
            console.log("UpdateLikes Promise Rejected");
        });
    }
    AttendeeDetails(oAttendeeID) {
        console.log('oAttendeeID: ' + oAttendeeID);
        this.localstorage.setLocalValue("oAttendeeID", oAttendeeID);
        this.navCtrl.push('AttendeesProfilePage', { oAttendeeID: oAttendeeID }, { animate: true, direction: 'forward' });
    }
    navToWeb(wURL) {
        if (wURL != "") {
            if ((wURL.substring(0, 7).toLowerCase() != "http://") && (wURL.substring(0, 8).toLowerCase() != "https://")) {
                wURL = "http://" + wURL;
            }
            console.log('Attendee Profile Details: Navigating to: ' + wURL);
            window.open(wURL, '_system');
        }
    }
};
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["Content"]),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["Content"])
], ActivityFeedDetailsPage.prototype, "content", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('chat_input'),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"])
], ActivityFeedDetailsPage.prototype, "messageInput", void 0);
ActivityFeedDetailsPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-activityfeeddetails',template:/*ion-inline-start:"/Users/petervroom/demoplanner/src/pages/activityfeeddetails/activityfeeddetails.html"*/'<ion-header>\n\n	<ion-navbar color="primary">\n		<button ion-button menuToggle>\n			<ion-icon name="menu"></ion-icon>\n		</button>\n		<ion-title>Attendee Posting</ion-title>\n	</ion-navbar>\n\n</ion-header>\n\n<ion-content class="page-activityfeeddetails">\n\n\n\n	<!-- Initial posting by attendee -->\n	<ion-card>\n\n		<!-- Attendee avatar and name -->\n		<ion-item>\n			<ion-avatar item-start (click)="AttendeeDetails(ActivityFeedAttendeeID)">\n				<img src="{{ActivityFeedCommentAvatar}}" onerror="this.src=\'assets/img/personIcon.png\'">\n			</ion-avatar>\n			<div (click)="AttendeeDetails(ActivityFeedAttendeeID)">\n			<h2>{{ActivityFeedCommentBy}}</h2>\n			<p>{{ActivityFeedCommentPosted}}</p>\n			</div>\n		</ion-item>\n\n		<!-- Posting picture attachment -->\n		<img src="{{ActivityFeedAttachment}}">\n\n		<!-- Attendee\'s comment -->\n		<ion-card-content>\n			<p>{{ActivityFeedComment}}</p>\n		</ion-card-content>\n\n		<!-- Linked URL (Only for promoted postings entered via the Admin Gateway) -->\n		<ion-list>\n			<button ion-item *ngIf=showActivityFeedLinkedURL (click)="navToWeb(ActivityFeedLinkedURL)">\n				<ion-icon name="globe" item-start></ion-icon>\n				{{ActivityFeedLinkedURL}}\n			</button>\n		</ion-list>\n\n	</ion-card>\n\n\n\n\n	<!-- Footer with details \n		<ion-row>\n			<ion-col>\n				<button ion-button color="secondary" icon-left clear small tappable (click)="UpdateLikes(afID)">\n					<ion-icon name="thumbs-up"></ion-icon>\n					<div>{{ActivityFeedLikesCounter}} Likes</div>\n				</button>\n			</ion-col>\n			<ion-col>\n				<button ion-button color="secondary" icon-left clear small>\n					<ion-icon name="text"></ion-icon>\n					<div>{{ActivityFeedCommentsCounter}} Comments</div>\n				</button>\n			</ion-col>\n			<ion-col center text-center>\n				<ion-note>\n					{{ActivityFeedCommentPostedDuration}}\n				</ion-note>\n			</ion-col>\n		</ion-row>\n\n		<ion-row>\n			<ion-col col-12 no-border style="margin:0" [style.height]="showEmojiPicker ? \'255px\' : \'55px\'">\n				<div style="background:#fff; color:#444; margin:0" class="input-wrap">\n					<ion-textarea style="background:#fff;color:#444" #chat_input\n						placeholder="Enter a comment..."\n						[(ngModel)]="CommentEntry"\n						(keyup.enter)="SaveComment()"\n						(focusin)="onFocus()">\n					</ion-textarea>\n					<button ion-button clear icon-only item-right (tap)="SaveComment()">\n						<ion-icon name="ios-send" ios="ios-send" md="md-send"></ion-icon>\n					</button>\n				</div>\n			</ion-col>\n			</ion-row>\n\n\n\n	</ion-card>\n\n-->\n\n	\n	<!-- Comments to posting by other attendees -->\n    <ion-scroll scrollY="true" style="width: 100%; height: 100%;">\n	\n		<ion-card *ngFor="let comment of afComments">\n\n			<!-- Attendee avatar and name -->\n			<ion-item>\n				<ion-avatar item-start (click)="AttendeeDetails(comment.ActivityFeedCommentByID)">\n					<img src="{{comment.ActivityFeedCommentAvatar}}" onerror="this.src=\'assets/img/personIcon.png\'">\n				</ion-avatar>\n				<h2>{{comment.ActivityFeedCommentBy}}</h2>\n				<p>{{comment.ActivityFeedCommentPosted}}</p>\n			</ion-item>\n			<ion-card-content>\n				<p>{{comment.ActivityFeedComment}}</p>\n\n		\n			</ion-card-content>\n\n		</ion-card>\n\n	</ion-scroll>\n\n\n	\n\n	<!-- Floating button menu for adding new comment -->\n	<!-- Disabled 2018-11-01 JOhn Black\n	     Moving to different process for adding comments to activity feed -->\n	<!--\n    <ion-fab bottom right #fab>\n		<button ion-fab color="danger" ion-fab>\n			<ion-icon name="add"></ion-icon>\n		</button>\n		<ion-fab-list side="top">\n			<button ion-fab (click)="AddComment(fab)">\n				<ion-icon name="chatbubbles"></ion-icon>\n				<div class="fabdivbutton">Add a Comment</div>\n			</button>\n		</ion-fab-list>\n    </ion-fab>\n	-->\n\n\n\n<!--footer placement with input-->\n\n\n\n\n\n</ion-content>\n\n<ion-footer>\n<ion-toolbar>\n\n\n\n	<ion-row>\n		<ion-col col-12 no-border style="margin:0" [style.height]="showEmojiPicker ? \'255px\' : \'55px\'">\n			<div style="background:#fff; color:#444; margin:0" class="input-wrap">\n				<ion-textarea autocomplete="true" autocorrect="on" style="background:#fff;color:#444" #chat_input\n					placeholder="Enter a comment..."\n					[(ngModel)]="CommentEntry"\n					(keyup.enter)="SaveComment()"\n					(focusin)="onFocus()">\n				</ion-textarea>\n				<button ion-button clear icon-only item-right (tap)="SaveComment()">\n					<ion-icon name="ios-send" ios="ios-send" md="md-send"></ion-icon>\n				</button>\n			</div>\n		</ion-col>\n		</ion-row>\n	\n	\n		<ion-row>\n				<ion-col>\n					<button ion-button color="secondary" icon-left clear small tappable (click)="UpdateLikes(afID)">\n						<ion-icon name="thumbs-up"></ion-icon>\n						<div>{{ActivityFeedLikesCounter}} Likes</div>\n					</button>\n				</ion-col>\n				<ion-col>\n					<button ion-button color="secondary" icon-left clear small>\n						<ion-icon name="text"></ion-icon>\n						<div>{{ActivityFeedCommentsCounter}} Comments</div>\n					</button>\n				</ion-col>\n\n				<ion-col center text-center>\n						<button ion-button color="secondary" icon-left clear small>\n						<ion-icon name=""></ion-icon>\n					<div>\n						{{ActivityFeedCommentPostedDuration}}\n					</div>\n				</button>\n				</ion-col>\n			</ion-row>\n\n	</ion-toolbar>\n</ion-footer>\n\n\n\n\n\n\n\n'/*ion-inline-end:"/Users/petervroom/demoplanner/src/pages/activityfeeddetails/activityfeeddetails.html"*/,
        changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"],
        __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */],
        __WEBPACK_IMPORTED_MODULE_4__providers_database_database__["a" /* Database */],
        __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["AlertController"],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["Events"],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["LoadingController"],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["ModalController"],
        __WEBPACK_IMPORTED_MODULE_5__providers_localstorage_localstorage__["a" /* Localstorage */]])
], ActivityFeedDetailsPage);

//# sourceMappingURL=activityfeeddetails.js.map

/***/ })

});
//# sourceMappingURL=16.js.map