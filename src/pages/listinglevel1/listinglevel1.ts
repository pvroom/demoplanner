// Components, functions, plugins
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, NgModule } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Database } from './../../providers/database/database';
import { Localstorage } from './../../providers/localstorage/localstorage';

// Pages
import { LoginPage } from '../login/login';
import { EducationDetailsPage } from '../educationdetails/educationdetails';

declare var dateFormat: any;

@IonicPage()
@Component({
  selector: 'page-listinglevel1',
  templateUrl: 'listinglevel1.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListingLevel1 {

	public ProgramListing: any[] = [];
	public ProgramTitle: string;
	public daysShow = true;
	public EntryTerms: string;

	// Day buttons
	public dayButton1 = "myButtonGreyBlue";
	public dayButton2 = "myButtonGreyBlue";
	public dayButton3 = "myButtonGreyBlue";
	public dayButton4 = "myButtonGreyBlue";
	public dayButton5 = "myButtonGreyBlue";

	public DayButton1Show = false;
	public DayButton2Show = false;
	public DayButton3Show = false;
	public DayButton4Show = false;
	public DayButton5Show = false;
	
	public DayButton1Label: string;
	public DayButton2Label: string;
	public DayButton3Label: string;
	public DayButton4Label: string;
	public DayButton5Label: string;

	constructor(public navCtrl: NavController, 
				public navParams: NavParams,
				private storage: Storage,
				private databaseprovider: Database,
				private cd: ChangeDetectorRef,
				public loadingCtrl: LoadingController,
				public events: Events,
				private alertCtrl: AlertController, 
				private localstorage: Localstorage) {
				
				if (this.navParams.get('listingType') == 'Participation') {
					this.ProgramTitle = "Workshops";
				} else {
					this.ProgramTitle = this.navParams.get('listingType');
				}
				
	}

	
	ngOnInit() {

		// Load initial data set here
		//switch(this.navParams.get('listingType')) {
		//		case "Lectures":
		//			this.daysShow = true;
		//			console.log('Showing day bar');
		//			break;
		//		default:
		//			this.daysShow = false;
		//			console.log('Hiding day bar');
		//			break;
		//}

		//let loading = this.loadingCtrl.create({
		//	spinner: 'crescent',
		//	content: 'Please wait...'
		//});

		//loading.present();

		// Blank and show loading info
		this.ProgramListing = [];
		this.cd.markForCheck();
		

		var flags;
		var NotesButtonStatus = true;
		// Disabled per LIsa Bollenbach 2018-04-19
		var AgendaButtonStatus = false;
		var dayID;
        var AgendaQueryDate = "";
		
		var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
		var ProgramDay = this.localstorage.getLocalValue('ProgramDay');

		this.dayButton1 = "myButtonGreyBlue";
		this.dayButton2 = "myButtonGreyBlue";
		this.dayButton3 = "myButtonGreyBlue";
		this.dayButton4 = "myButtonGreyBlue";
		this.dayButton5 = "myButtonGreyBlue";

		var AgendaDays = this.localstorage.getLocalValue("AgendaDays");
		var AgendaDayButtonLabels = this.localstorage.getLocalValue("AgendaDayButtonLabels");
		var AgendaDates = this.localstorage.getLocalValue("AgendaDates");
		var AgendaDisplayDate = this.localstorage.getLocalValue('AgendaDisplayDate');
		var AgendaQueryDates = AgendaDates.split("|");
		var DayLabel = AgendaDayButtonLabels.split("|");
		
		console.log('AgendaDays: ' + AgendaDays);
		
		switch(AgendaDays) {
			case "1":
				this.DayButton1Show = true;
				this.DayButton2Show = false;
				this.DayButton3Show = false;
				this.DayButton4Show = false;
				this.DayButton5Show = false;
				this.DayButton1Label = DayLabel[0];
				this.DayButton2Label = "";
				this.DayButton3Label = "";
				this.DayButton4Label = "";
				this.DayButton5Label = "";
				break;
			case "2":
				this.DayButton1Show = true;
				this.DayButton2Show = true;
				this.DayButton3Show = false;
				this.DayButton4Show = false;
				this.DayButton5Show = false;
				this.DayButton1Label = DayLabel[0];
				this.DayButton2Label = DayLabel[1];
				this.DayButton3Label = "";
				this.DayButton4Label = "";
				this.DayButton5Label = "";
				break;
			case "3":
				this.DayButton1Show = true;
				this.DayButton2Show = true;
				this.DayButton3Show = true;
				this.DayButton4Show = false;
				this.DayButton5Show = false;
				this.DayButton1Label = DayLabel[0];
				this.DayButton2Label = DayLabel[1];
				this.DayButton3Label = DayLabel[2];
				this.DayButton4Label = "";
				this.DayButton5Label = "";
				break;
			case "4":
				this.DayButton1Show = true;
				this.DayButton2Show = true;
				this.DayButton3Show = true;
				this.DayButton4Show = true;
				this.DayButton5Show = false;
				this.DayButton1Label = DayLabel[0];
				this.DayButton2Label = DayLabel[1];
				this.DayButton3Label = DayLabel[2];
				this.DayButton4Label = DayLabel[3];
				this.DayButton5Label = "";
				break;
			case "5":
				this.DayButton1Show = true;
				this.DayButton2Show = true;
				this.DayButton3Show = true;
				this.DayButton4Show = true;
				this.DayButton5Show = true;
				this.DayButton1Label = DayLabel[0];
				this.DayButton2Label = DayLabel[1];
				this.DayButton3Label = DayLabel[2];
				this.DayButton4Label = DayLabel[3];
				this.DayButton5Label = DayLabel[4];
				break;
		}	
		
		switch (AgendaDisplayDate) {
			case AgendaQueryDates[0]:
				this.dayButton1 = "myButtonActive";
				AgendaQueryDate = AgendaQueryDates[0];
				break;
			case AgendaQueryDates[1]:
				this.dayButton2 = "myButtonActive";
				AgendaQueryDate = AgendaQueryDates[1];
				break;
			case AgendaQueryDates[2]:
				this.dayButton3 = "myButtonActive";
				AgendaQueryDate = AgendaQueryDates[2];
				break;
			case AgendaQueryDates[3]:
				this.dayButton4 = "myButtonActive";
				AgendaQueryDate = AgendaQueryDates[3];
				break;
			case AgendaQueryDates[4]:
				this.dayButton5 = "myButtonActive";
				AgendaQueryDate = AgendaQueryDates[4];
				break;
			default:
				this.dayButton1 = "myButtonActive";
				this.storage.set('AgendaDisplayDate', AgendaQueryDates[0]);
				AgendaQueryDate = AgendaQueryDates[0];
				break;
		}
		
		flags = AgendaQueryDate;

		console.log('Flags: ' + flags);
		
		//if (AttendeeID != '' && AttendeeID != null) {
										
			this.databaseprovider.getLecturesByDay(flags, this.navParams.get('listingType'), AttendeeID).then(data => {
				
				console.log("getLecturesByDay: " + JSON.stringify(data));

				if (data['length']>0) {
					
					for (var i = 0; i < data['length']; i++) {

						var SubjectCodeCECredits = "";

						var dbEventDateTime = data[i].session_start_time.substring(0, 19);
						dbEventDateTime = dbEventDateTime.replace(/-/g, '/');
						dbEventDateTime = dbEventDateTime.replace(/T/g, ' ');
						var SQLDate = new Date(dbEventDateTime);
						var DisplayDateTime = dateFormat(SQLDate, "mm/dd h:MMtt");

						// Display end time
						dbEventDateTime = data[i].session_end_time.substring(0, 19);
						dbEventDateTime = dbEventDateTime.replace(/-/g, '/');
						dbEventDateTime = dbEventDateTime.replace(/T/g, ' ');
						SQLDate = new Date(dbEventDateTime);
						DisplayDateTime = DisplayDateTime + " to " + dateFormat(SQLDate, "h:MMtt");

						//console.log('Session ID: ' + data[i].session_id + ', OnAgenda: ' + data[i].OnAgenda);

						var AgendaButtonText = "";
						
						if (data[i].OnAgenda != null) {
							AgendaButtonText = "Remove";
						//    ButtonStyle = "myButtonColor";
						} else {
							AgendaButtonText = "Add";
						//    ButtonStyle = "myButtonGreyBlue";
						}

						var visEventName = data[i].session_title;
						var DisplayDateRoom = "";
						
						if (data[i].RoomName.length==0) {
							DisplayDateRoom = DisplayDateTime;
						} else {
							DisplayDateRoom = DisplayDateTime + " in " + data[i].RoomName;
						}

						if (data[i].subject != null && data[i].subject != "") {
							SubjectCodeCECredits = "Subject code: " + data[i].subject;
						}
						if (data[i].subject != null && data[i].subject != "") {
							if (data[i].cs_credits != null && data[i].cs_credits != "") {
								SubjectCodeCECredits = SubjectCodeCECredits + " - CE Credits: " + data[i].cs_credits;
							}
						} else {
							if (data[i].cs_credits != null && data[i].cs_credits != "") {
								SubjectCodeCECredits = "CE Credits: " + data[i].cs_credits;
							}
						}
						
						// Status checks
						var visSessionStatus = "";
						var visStatusStyle = "SessionStatusNormal";
						
						// Room Capacity check
						if (parseInt(data[i].room_capacity) <= parseInt(data[i].Attendees)) {
							visSessionStatus = "Course at Capacity";
							visStatusStyle = "SessionStatusRed";
						}
						
						// Waitlist check
						if (data[i].Waitlist == "1") {
							if (visSessionStatus == "") {
								visSessionStatus = "You are Waitlisted";
								visStatusStyle = "SessionStatusRed";
							} else {
								visSessionStatus = visSessionStatus + " / You are Waitlisted";
								visStatusStyle = "SessionStatusRed";
							}
						}

						console.log("Course: " + data[i].session_title);
						console.log("Room Capacity: " + data[i].room_capacity);
						console.log("Attendees: " + data[i].Attendees);
						console.log("Status Text: " + visSessionStatus);
				
						this.ProgramListing.push({
							DisplayEventName: visEventName,
							DisplayEventTimeDateLocation: DisplayDateRoom,
							SpeakerDisplayName: data[i].other_speakers,
							EventID: data[i].session_id,
							visAgendaAddRemoveButton: AgendaButtonText,
							btnEvalShow: false,
							btnNotesShow: NotesButtonStatus,
							btnAgendaShow: AgendaButtonStatus,
							btnEmailShow: true,
							DisplaySubjectCodeCECredits: SubjectCodeCECredits,
							SessionStatusStyle: visStatusStyle,
							SessionStatus: visSessionStatus
						});

					}

				} else {
					
					this.ProgramListing.push({
						DisplayEventName: "No records available",
						DisplayEventTimeDateLocation: "",
						SpeakerDisplayName: "",
						EventID: 0,
						btnEvalShow: false,
						btnNotesShow: false,
						btnAgendaShow: false,
						btnEmailShow: false,
						DisplaySubjectCodeCECredits: "",
						SessionStatusStyle: "",
						SessionStatus: ""
					});

				}

				this.cd.markForCheck();

				//loading.dismiss();
				
			}).catch(function () {
				console.log("Promise Rejected");
			});
			
		//} else {
		//	console.log('User not logged in');
		//	loading.dismiss();
		//}
		
	}

	ionViewDidLoad() {
		
		console.log('ionViewDidLoad ListingLevel1');
				
	}

    GetSearchResults() {

        var SearchTerms = this.EntryTerms;

        if ((SearchTerms == undefined) || (SearchTerms == "")) {
            // Do nothing or show message
			
        } else {

            this.localstorage.setLocalValue("SearchTerms", SearchTerms);
			this.navCtrl.push('SearchResultsPage', {SearchTerms: SearchTerms}, {animate: true, direction: 'forward'});

        }
    };

    EventDetails(EventID) {
		
		this.localstorage.setLocalValue('EventID', EventID);

		if (EventID != 0) {

			var MassAddFlag = "0";
            var MassEvalFlag = "0";
            var MassContactFlag = "0";
            var MassEmailFlag = "0";
            var MassAgendaFlag = "0";
            var MassNotesFlag = "0";
			
            MassAddFlag = this.localstorage.getLocalValue("MassAdd");
            MassEvalFlag = this.localstorage.getLocalValue("MassEval");
            MassContactFlag = this.localstorage.getLocalValue("MassContact");
            MassEmailFlag = this.localstorage.getLocalValue("MassEmail");
            MassAgendaFlag = this.localstorage.getLocalValue("MassAgenda");
            MassNotesFlag = this.localstorage.getLocalValue("MassNotes");

            if ((MassAddFlag != "0") || (MassEvalFlag != "0") || (MassContactFlag != "0") || (MassEmailFlag != "0") || (MassAgendaFlag != "0") || (MassNotesFlag != "0")) {

                this.localstorage.setLocalValue("MassAdd", "0");
                this.localstorage.setLocalValue("MassEval", "0");
                this.localstorage.setLocalValue("MassContact", "0");
				this.localstorage.setLocalValue("MassEmail", "0");
                this.localstorage.setLocalValue("MassAgenda", "0");
                this.localstorage.setLocalValue("MassNotes", "0");
				
			} else {
				// Navigate to Exhibitor Details page
				this.navCtrl.push(EducationDetailsPage, {EventID: EventID}, {animate: true, direction: 'forward'});
			}
        }

    };

    navToNotes(EventID) {

		console.log("NoteDetails: " + EventID);
        this.localstorage.setLocalValue("MassNotes", "1");

		var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
		if (AttendeeID == '' || AttendeeID == null) {
			// If not, store the page they want to go to and go to the Login page
			console.log('Stored AttendeeID: ' + AttendeeID);
			this.localstorage.setLocalValue('NavigateToPage', "NotesDetailsPage");
			this.navCtrl.push(LoginPage, {}, {animate: true, direction: 'forward'});
		} else {
			// Otherwise just go to the page they want
			this.navCtrl.push('NotesDetailsPage', {EventID: EventID}, {animate: true, direction: 'forward'});
		}

	};

    eMailCourse(CourseTitle) {

        this.localstorage.setLocalValue("MassEmail", "1");
        window.open("mailto:info@mailaddress.com?subject=" + CourseTitle + "&body=From the AACD San Diego 2019 Conference...", '_system');

    };
	
    DayUpdate(DayName) {

		var AgendaDates = this.localstorage.getLocalValue("AgendaDates");
		var AgendaQueryDates = AgendaDates.split("|");

        switch (DayName) {
            case "1":
				this.localstorage.setLocalValue('AgendaDisplayDate', AgendaQueryDates[0]);
                break;
            case "2":
				this.localstorage.setLocalValue('AgendaDisplayDate', AgendaQueryDates[1]);
                break;
            case "3":
				this.localstorage.setLocalValue('AgendaDisplayDate', AgendaQueryDates[2]);
                break;
            case "4":
				this.localstorage.setLocalValue('AgendaDisplayDate', AgendaQueryDates[3]);
                break;
            case "5":
				this.localstorage.setLocalValue('AgendaDisplayDate', AgendaQueryDates[4]);
                break;
            default:
				this.localstorage.setLocalValue('AgendaDisplayDate', AgendaQueryDates[0]);
                break
        }
		
		this.ngOnInit();
		
	}

    AgendaUpdate(session, EventID, sessionCard) {

		console.log('Agenda Update called');
		console.log('Session: ' + JSON.stringify(session));
		console.log('EventID: ' + EventID);
		
		var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        this.localstorage.setLocalValue("MassAdd", "1");
        this.localstorage.setLocalValue("EventID", EventID);
        this.localstorage.setLocalValue("MassAddTag", EventID);
		var flags = '';

        if (AttendeeID !== null) {
			
            if (AttendeeID.length > 0) {

                //var elem = angular.element(e.srcElement);

                // Get last update performed by this app
				var LastUpdateDate = this.localstorage.getLocalValue("LastUpdateDate");
				if (LastUpdateDate == null) {
					// If never, then set variable and localStorage item to NA
					LastUpdateDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
					this.localstorage.setLocalValue("LastUpdateDate", LastUpdateDate);
				}

                // If so, remove it
                //if (elem.text().trim() == "Remove") {
                if (session.visAgendaAddRemoveButton == "Remove") {

					console.log('Remove detected');
					
					flags = "dt|0|Alpha|" + EventID;

					this.databaseprovider.getLectureData(flags, AttendeeID).then(data => {
						
						console.log("getLectureData: " + JSON.stringify(data));

						if (data['length']>0) {

							// Values for Agenda Management
							this.localstorage.setLocalValue("AAOID", EventID);
							this.localstorage.setLocalValue("EventStartTime", data[0].session_start_time.substring(11,19));
							this.localstorage.setLocalValue("EventEndTime", data[0].session_end_time.substring(11,19));
							this.localstorage.setLocalValue("EventLocation", data[0].RoomName);
							this.localstorage.setLocalValue("EventName", data[0].session_title);
							this.localstorage.setLocalValue("EventDate", data[0].session_start_time.substring(0,10));

							var AAOID = this.localstorage.getLocalValue("AAOID");
							var EventID = this.localstorage.getLocalValue("EventID");
							var EventStartTime = this.localstorage.getLocalValue("EventStartTime");
							var EventEndTime = this.localstorage.getLocalValue("EventEndTime");
							var EventLocation = this.localstorage.getLocalValue("EventLocation");
							var EventName = this.localstorage.getLocalValue("EventName");
							EventName = EventName.replace(/'/g, "''");
							var EventDate = this.localstorage.getLocalValue("EventDate");

							// -----------------------
							// Remove Item from Agenda
							// -----------------------
							flags = 'dl|0|' + EventID + '|' + EventStartTime + '|' + EventEndTime + '|' + EventLocation + '|' + EventName + '|' + EventDate + '|' + AAOID + '|' + LastUpdateDate;
							console.log("flags: " + flags);
							
							this.databaseprovider.getAgendaData(flags, AttendeeID).then(data => {
								
								console.log("getAgendaData: " + JSON.stringify(data));

								if (data['length']>0) {

									console.log("Return status: " + data[0].DeleteStatus);

									if (data[0].DeleteStatus == "Success") {
										
										this.events.publish('user:Status', 'AgendaItem Remove');
										session.visAgendaAddRemoveButton = "Add";
										this.cd.markForCheck();
										
									} else {
										
										console.log("Return query: " + data[0].DeleteQuery);
										
										let alert = this.alertCtrl.create({
											title: 'Agenda Item',
											subTitle: 'Unable to remove the item from your agenda at this time. Please try again shortly.',
											buttons: ['OK']
										});
										
										alert.present();
										
									}
									
								}

							}).catch(function () {
								console.log("Promise Rejected");
							});

						}
						
					}).catch(function () {
						console.log("Promise Rejected");
					});

                }

                // If not, add it
                //if (elem.text().trim() == "Add") {
                if (session.visAgendaAddRemoveButton == "Add") {

					console.log('Add detected');
					
					flags = "dt|0|Alpha|" + EventID;

					this.databaseprovider.getLectureData(flags, AttendeeID).then(data => {
						
						console.log("getLectureData: " + JSON.stringify(data));

						if (data['length']>0) {

							// Values for Agenda Management
							this.localstorage.setLocalValue("AAOID", EventID);
							this.localstorage.setLocalValue("EventStartTime", data[0].session_start_time.substring(11,19));
							this.localstorage.setLocalValue("EventEndTime", data[0].session_end_time.substring(11,19));
							this.localstorage.setLocalValue("EventLocation", data[0].RoomName);
							this.localstorage.setLocalValue("EventName", data[0].session_title);
							this.localstorage.setLocalValue("EventDate", data[0].session_start_time.substring(0,10));

							var AAOID = this.localstorage.getLocalValue("AAOID");
							var EventID = this.localstorage.getLocalValue("EventID");
							var EventStartTime = this.localstorage.getLocalValue("EventStartTime");
							var EventEndTime = this.localstorage.getLocalValue("EventEndTime");
							var EventLocation = this.localstorage.getLocalValue("EventLocation");
							var EventName = this.localstorage.getLocalValue("EventName");
							EventName = EventName.replace(/'/g, "''");
							var EventDate = this.localstorage.getLocalValue("EventDate");
							
							// ------------------------
							// Add item to Agenda
							// ------------------------
							flags = 'ad|0|' + EventID + '|' + EventStartTime + '|' + EventEndTime + '|' + EventLocation + '|' + EventName + '|' + EventDate + '|' + AAOID + '|' + LastUpdateDate;
							console.log("flags: " + flags);
							
							this.databaseprovider.getAgendaData(flags, AttendeeID).then(data => {
								
								console.log("getAgendaData: " + JSON.stringify(data));

								if (data['length']>0) {

									console.log("Return status: " + data[0].AddStatus);

									if (data[0].AddStatus == "Success") {
										
										this.events.publish('user:Status', 'AgendaItem Add');
										session.visAgendaAddRemoveButton = "Remove";
										this.cd.markForCheck();
										
									} else {
										
										console.log("Return query: " + data[0].AddQuery);
										
										let alert = this.alertCtrl.create({
											title: 'Agenda Item',
											subTitle: 'Unable to add the item to your agenda at this time. Please try again shortly.',
											buttons: ['OK']
										});
										
										alert.present();
										
									}
									
								}

							}).catch(function () {
								console.log("Promise Rejected");
							});
			
						}
						
					}).catch(function () {
						console.log("Promise Rejected");
					});
					
                }

                // Flip button text
                //if (elem.text().trim() == "Add") {
                //    elem.text("Remove");
                //} else {
                //    elem.text("Add");
                //}

				
            } else {
                // Not logged in
				this.localstorage.setLocalValue('NavigateToPage', "listingLevel1");
                this.localstorage.setLocalValue("LoginWarning", "2");
				this.navCtrl.push(LoginPage, {}, {animate: true, direction: 'forward'});
            }
        } else {
            // Not logged in
			this.localstorage.setLocalValue('NavigateToPage', "listingLevel1");
			this.localstorage.setLocalValue("LoginWarning", "2");
			this.navCtrl.push(LoginPage, {}, {animate: true, direction: 'forward'});
        }

    };
	
}

