// Components, functions, plugins
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, NgModule } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Database } from './../../providers/database/database';
import { Localstorage } from '../../providers/localstorage/localstorage';

declare var dateFormat: any;
declare var formatTime: any;

// Pages
import { EducationDetailsPage } from '../educationdetails/educationdetails';

@Component({
  selector: 'page-myagendafull',
  templateUrl: 'myagendafull.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class MyAgendaFull {

	public ProgramListing: any[] = [];
	
	// Personal agenda
	public day1Items: any[] = [];
	public day2Items: any[] = [];
	public day3Items: any[] = [];
	public day4Items: any[] = [];
	public day5Items: any[] = [];
	
	public Day1Show = false;
	public Day2Show = false;
	public Day3Show = false;
	public Day4Show = false;
	public Day5Show = false;
	
	public Day1Label: string;
	public Day2Label: string;
	public Day3Label: string;
	public Day4Label: string;
	public Day5Label: string;
	
	// Full agenda
	public fullagendaDay1Items: any[] = [];
	public fullagendaDay2Items: any[] = [];
	public fullagendaDay3Items: any[] = [];
	public fullagendaDay4Items: any[] = [];
	public fullagendaDay5Items: any[] = [];

	public agenda: string;

	constructor(public navCtrl: NavController, 
				public navParams: NavParams,
				private storage: Storage,
				private databaseprovider: Database,
				private cd: ChangeDetectorRef,
				public loadingCtrl: LoadingController,
				private localstorage: Localstorage) {
					
	}



	ionViewDidLoad() {
		
		console.log('ionViewDidLoad MyAgendaFull');
				
	}

	ngOnInit() {

		// Load initial data set here
		let loading = this.loadingCtrl.create({
			spinner: 'crescent',
			content: 'Please wait...'
		});

		//loading.present();

		this.agenda = "myagenda";
		
		
		this.fullagendaDay1Items = [];
		this.fullagendaDay2Items = [];
		this.fullagendaDay3Items = [];
		this.fullagendaDay4Items = [];
		this.fullagendaDay5Items = [];
		
		// Blank and show loading info
		this.day1Items = [];
		this.day2Items = [];
		this.day3Items = [];
		this.day4Items = [];
		this.day5Items = [];
		this.cd.markForCheck();

		// Temporary use variables
		var flags;
		var visStartTime;
		var visEndTime;
		var eventIcon;
		var visEventName;
		var visEventLocation;
        var SQLDate;
		var DisplayDayLabel;
        var DisplayDay1Label;
        var DisplayDay2Label;
        var DisplayDay3Label;
        var DisplayDay4Label;
        var DisplayDay5Label;
        var dbEventDateTime;

		var AgendaDays = this.localstorage.getLocalValue("AgendaDays");
		var AgendaDates = this.localstorage.getLocalValue("AgendaDates");

		var DayLabels = AgendaDates.split("|");


		switch(AgendaDays) {
			case "1":
				this.Day1Show = true;
				this.Day2Show = false;
				this.Day3Show = false;
				this.Day4Show = false;
				this.Day5Show = false;
				dbEventDateTime = new Date(DayLabels[0] + "T05:00:00Z");
				DisplayDay1Label = dateFormat(dbEventDateTime, "dddd, mmmm d");
				this.Day1Label = DisplayDay1Label;
				this.Day2Label = "";
				this.Day3Label = "";
				this.Day4Label = "";
				this.Day5Label = "";
				break;
			case "2":
				this.Day1Show = true;
				this.Day2Show = true;
				this.Day3Show = false;
				this.Day4Show = false;
				this.Day5Show = false;
				dbEventDateTime = new Date(DayLabels[0] + "T05:00:00Z");
				DisplayDay1Label = dateFormat(dbEventDateTime, "dddd, mmmm d");
				this.Day1Label = DisplayDay1Label;
				dbEventDateTime = new Date(DayLabels[1] + "T05:00:00Z");
				DisplayDay2Label = dateFormat(dbEventDateTime, "dddd, mmmm d");
				this.Day2Label = DisplayDay2Label;
				this.Day3Label = "";
				this.Day4Label = "";
				this.Day5Label = "";
				break;
			case "3":
				this.Day1Show = true;
				this.Day2Show = true;
				this.Day3Show = true;
				this.Day4Show = false;
				this.Day5Show = false;
				dbEventDateTime = new Date(DayLabels[0] + "T05:00:00Z");
				DisplayDay1Label = dateFormat(dbEventDateTime, "dddd, mmmm d");
				this.Day1Label = DisplayDay1Label;
				dbEventDateTime = new Date(DayLabels[1] + "T05:00:00Z");
				DisplayDay2Label = dateFormat(dbEventDateTime, "dddd, mmmm d");
				this.Day2Label = DisplayDay2Label;
				dbEventDateTime = new Date(DayLabels[2] + "T05:00:00Z");
				DisplayDay3Label = dateFormat(dbEventDateTime, "dddd, mmmm d");
				this.Day3Label = DisplayDay3Label;
				this.Day4Label = "";
				this.Day5Label = "";
				break;
			case "4":
				this.Day1Show = true;
				this.Day2Show = true;
				this.Day3Show = true;
				this.Day4Show = true;
				this.Day5Show = false;
				dbEventDateTime = new Date(DayLabels[0] + "T05:00:00Z");
				DisplayDay1Label = dateFormat(dbEventDateTime, "dddd, mmmm d");
				this.Day1Label = DisplayDay1Label;
				dbEventDateTime = new Date(DayLabels[1] + "T05:00:00Z");
				DisplayDay2Label = dateFormat(dbEventDateTime, "dddd, mmmm d");
				this.Day2Label = DisplayDay2Label;
				dbEventDateTime = new Date(DayLabels[2] + "T05:00:00Z");
				DisplayDay3Label = dateFormat(dbEventDateTime, "dddd, mmmm d");
				this.Day3Label = DisplayDay3Label;
				dbEventDateTime = new Date(DayLabels[3] + "T05:00:00Z");
				DisplayDay4Label = dateFormat(dbEventDateTime, "dddd, mmmm d");
				this.Day4Label = DisplayDay4Label;
				this.Day5Label = "";
				break;
			case "5":
				this.Day1Show = true;
				this.Day2Show = true;
				this.Day3Show = true;
				this.Day4Show = true;
				this.Day5Show = true;
				dbEventDateTime = new Date(DayLabels[0] + "T05:00:00Z");
				DisplayDay1Label = dateFormat(dbEventDateTime, "dddd, mmmm d");
				this.Day1Label = DisplayDay1Label;
				dbEventDateTime = new Date(DayLabels[1] + "T05:00:00Z");
				DisplayDay2Label = dateFormat(dbEventDateTime, "dddd, mmmm d");
				this.Day2Label = DisplayDay2Label;
				dbEventDateTime = new Date(DayLabels[2] + "T05:00:00Z");
				DisplayDay3Label = dateFormat(dbEventDateTime, "dddd, mmmm d");
				this.Day3Label = DisplayDay3Label;
				dbEventDateTime = new Date(DayLabels[3] + "T05:00:00Z");
				DisplayDay4Label = dateFormat(dbEventDateTime, "dddd, mmmm d");
				this.Day4Label = DisplayDay4Label;
				dbEventDateTime = new Date(DayLabels[4] + "T05:00:00Z");
				DisplayDay5Label = dateFormat(dbEventDateTime, "dddd, mmmm d");
				this.Day5Label = DisplayDay5Label;
				break;
		}	
		
		// Get the data
		var AttendeeID = this.localstorage.getLocalValue('AttendeeID');

		if (AttendeeID != '' && AttendeeID != null) {
				
			// -------------------
			// Get data: Day 1
			// -------------------
			flags = "li|" + DayLabels[0];
			
			this.databaseprovider.getAgendaData(flags, AttendeeID).then(data => {
				
				console.log("getAgendaData: " + JSON.stringify(data));

				if (data['length']>0) {
					
					for (var i = 0; i < data['length']; i++) {

						visStartTime = formatTime(data[i].EventStartTime);
						visEndTime = formatTime(data[i].EventEndTime);

						if (data[i].EventID == "0") {
							eventIcon = "time";
							visEventName = data[i].EventName;
						} else {
							eventIcon = "list-box";
							visEventName = data[i].EventName;
						}
						
						// Status checks
						var SessionStatus = "";
						var StatusStyle = "SessionStatusNormal";
						
						// Room Capacity check
						if (parseInt(data[i].RoomCapacity) <= parseInt(data[i].Attendees)) {
							SessionStatus = "Course at Capacity";
							StatusStyle = "SessionStatusRed";
						}
						
						// Waitlist check
						if (data[i].Waitlist == "1") {
							if (SessionStatus == "") {
								SessionStatus = "You are Waitlisted";
								StatusStyle = "SessionStatusRed";
							} else {
								SessionStatus = SessionStatus + " / You are Waitlisted";
								StatusStyle = "SessionStatusRed";
							}
						}

						this.day1Items.push({
							EventName: visEventName,
							visEventTimeframe: visStartTime + " to " + visEndTime,
							visEventID: "'" + data[i].EventID + "|" + data[i].mtgID + "'",
							EventLocation: data[i].EventLocation,
							eventTypeIcon: eventIcon,
							continueIcon: "arrow-dropright",
							SessionStatusStyle: StatusStyle,
							SessionStatus: SessionStatus
						});

					}

				} else {
					
					dbEventDateTime = new Date(DayLabels[0] + "T05:00:00Z");
					DisplayDayLabel = dateFormat(dbEventDateTime, "dddd");
					
					this.day1Items.push({
						EventName: "No sessions scheduled for you for " + DisplayDayLabel,
						visEventTimeframe: "",
						EventLocation: "",
						visEventID: "'0|0'",
						eventTypeIcon: "remove-circle",
						continueIcon: "",
						SessionStatusStyle: "",
						SessionStatus: ""
					});

				}

				this.cd.markForCheck();

				
				// -------------------
				// Get data: Day 2
				// -------------------
				flags = "li|" + DayLabels[1];
				
				this.databaseprovider.getAgendaData(flags, AttendeeID).then(data => {
					
					console.log("getAgendaData: " + JSON.stringify(data));

					if (data['length']>0) {
						
						for (var i = 0; i < data['length']; i++) {

							visStartTime = formatTime(data[i].EventStartTime);
							visEndTime = formatTime(data[i].EventEndTime);

							if (data[i].EventID == "0") {
								eventIcon = "time";
								visEventName = data[i].EventName;
							} else {
								eventIcon = "list-box";
								visEventName = data[i].EventName;
							}
							
							// Status checks
							var SessionStatus = "";
							var StatusStyle = "SessionStatusNormal";
							
							// Room Capacity check
							if (parseInt(data[i].RoomCapacity) <= parseInt(data[i].Attendees)) {
								SessionStatus = "Course at Capacity";
								StatusStyle = "SessionStatusRed";
							}
							
							// Waitlist check
							if (data[i].Waitlist == "1") {
								if (SessionStatus == "") {
									SessionStatus = "You are Waitlisted";
									StatusStyle = "SessionStatusRed";
								} else {
									SessionStatus = SessionStatus + " / You are Waitlisted";
									StatusStyle = "SessionStatusRed";
								}
							}
							
							this.day2Items.push({
								EventName: visEventName,
								visEventTimeframe: visStartTime + " to " + visEndTime,
								visEventID: "'" + data[i].EventID + "|" + data[i].mtgID + "'",
								EventLocation: data[i].EventLocation,
								eventTypeIcon: eventIcon,
								continueIcon: "arrow-dropright",
								SessionStatusStyle: StatusStyle,
								SessionStatus: SessionStatus
							});

						}


					} else {
						
						dbEventDateTime = new Date(DayLabels[1] + "T05:00:00Z");
						DisplayDayLabel = dateFormat(dbEventDateTime, "dddd");
					
						this.day2Items.push({
							EventName: "No sessions scheduled for you for " + DisplayDayLabel,
							visEventTimeframe: "",
							EventLocation: "",
							visEventID: "'0|0'",
							eventTypeIcon: "remove-circle",
							continueIcon: "",
							SessionStatusStyle: "",
							SessionStatus: ""
						});

					}

					this.cd.markForCheck();
					
					// -------------------
					// Get data: Day 3
					// -------------------
					flags = "li|" + DayLabels[2];
					
					this.databaseprovider.getAgendaData(flags, AttendeeID).then(data => {
						
						console.log("getAgendaData: " + JSON.stringify(data));

						if (data['length']>0) {
							
							for (var i = 0; i < data['length']; i++) {

								visStartTime = formatTime(data[i].EventStartTime);
								visEndTime = formatTime(data[i].EventEndTime);

								if (data[i].EventID == "0") {
									eventIcon = "time";
									visEventName = data[i].EventName;
								} else {
									eventIcon = "list-box";
									visEventName = data[i].EventName;
								}
								
								// Status checks
								var SessionStatus = "";
								var StatusStyle = "SessionStatusNormal";
								
								// Room Capacity check
								if (parseInt(data[i].RoomCapacity) <= parseInt(data[i].Attendees)) {
									SessionStatus = "Course at Capacity";
									StatusStyle = "SessionStatusRed";
								}
								
								// Waitlist check
								if (data[i].Waitlist == "1") {
									if (SessionStatus == "") {
										SessionStatus = "You are Waitlisted";
										StatusStyle = "SessionStatusRed";
									} else {
										SessionStatus = SessionStatus + " / You are Waitlisted";
										StatusStyle = "SessionStatusRed";
									}
								}

								this.day3Items.push({
									EventName: visEventName,
									visEventTimeframe: visStartTime + " to " + visEndTime,
									visEventID: "'" + data[i].EventID + "|" + data[i].mtgID + "'",
									EventLocation: data[i].EventLocation,
									eventTypeIcon: eventIcon,
									continueIcon: "arrow-dropright",
									SessionStatusStyle: StatusStyle,
									SessionStatus: SessionStatus
								});

							}


						} else {
							
							dbEventDateTime = new Date(DayLabels[2] + "T05:00:00Z");
							DisplayDayLabel = dateFormat(dbEventDateTime, "dddd");
					
							this.day3Items.push({
								EventName: "No sessions scheduled for you for " + DisplayDayLabel,
								visEventTimeframe: "",
								EventLocation: "",
								visEventID: "'0|0'",
								eventTypeIcon: "remove-circle",
								continueIcon: "",
								SessionStatusStyle: "",
								SessionStatus: ""
							});

						}

						this.cd.markForCheck();

						// -------------------
						// Get data: Day 4
						// -------------------
						flags = "li|" + DayLabels[3];
						
						this.databaseprovider.getAgendaData(flags, AttendeeID).then(data => {
							
							console.log("getAgendaData: " + JSON.stringify(data));

							if (data['length']>0) {
								
								for (var i = 0; i < data['length']; i++) {

									visStartTime = formatTime(data[i].EventStartTime);
									visEndTime = formatTime(data[i].EventEndTime);

									if (data[i].EventID == "0") {
										eventIcon = "time";
										visEventName = data[i].EventName;
									} else {
										eventIcon = "list-box";
										visEventName = data[i].EventName;
									}
									
									// Status checks
									var SessionStatus = "";
									var StatusStyle = "SessionStatusNormal";
									
									// Room Capacity check
									if (parseInt(data[i].RoomCapacity) <= parseInt(data[i].Attendees)) {
										SessionStatus = "Course at Capacity";
										StatusStyle = "SessionStatusRed";
									}
									
									// Waitlist check
									if (data[i].Waitlist == "1") {
										if (SessionStatus == "") {
											SessionStatus = "You are Waitlisted";
											StatusStyle = "SessionStatusRed";
										} else {
											SessionStatus = SessionStatus + " / You are Waitlisted";
											StatusStyle = "SessionStatusRed";
										}
									}

									this.day4Items.push({
										EventName: visEventName,
										visEventTimeframe: visStartTime + " to " + visEndTime,
										visEventID: "'" + data[i].EventID + "|" + data[i].mtgID + "'",
										EventLocation: data[i].EventLocation,
										eventTypeIcon: eventIcon,
										continueIcon: "arrow-dropright",
										SessionStatusStyle: StatusStyle,
										SessionStatus: SessionStatus
									});

								}


							} else {
								
							dbEventDateTime = new Date(DayLabels[3] + "T05:00:00Z");
							DisplayDayLabel = dateFormat(dbEventDateTime, "dddd");
					
								this.day4Items.push({
									EventName: "No sessions scheduled for you for " + DisplayDayLabel,
									visEventTimeframe: "",
									EventLocation: "",
									visEventID: "'0|0'",
									eventTypeIcon: "remove-circle",
									continueIcon: "",
									SessionStatusStyle: "",
									SessionStatus: ""
								});

							}

							this.cd.markForCheck();

							// -------------------
							// Get data: Day 5
							// -------------------
							flags = "li|" + DayLabels[4];
							
							this.databaseprovider.getAgendaData(flags, AttendeeID).then(data => {
								
								console.log("getAgendaData: " + JSON.stringify(data));

								if (data['length']>0) {
									
									for (var i = 0; i < data['length']; i++) {

										visStartTime = formatTime(data[i].EventStartTime);
										visEndTime = formatTime(data[i].EventEndTime);

										if (data[i].EventID == "0") {
											eventIcon = "time";
											visEventName = data[i].EventName;
										} else {
											eventIcon = "list-box";
											visEventName = data[i].EventName;
										}
										
										// Status checks
										var SessionStatus = "";
										var StatusStyle = "SessionStatusNormal";
										
										// Room Capacity check
										if (parseInt(data[i].RoomCapacity) <= parseInt(data[i].Attendees)) {
											SessionStatus = "Course at Capacity";
											StatusStyle = "SessionStatusRed";
										}
										
										// Waitlist check
										if (data[i].Waitlist == "1") {
											if (SessionStatus == "") {
												SessionStatus = "You are Waitlisted";
												StatusStyle = "SessionStatusRed";
											} else {
												SessionStatus = SessionStatus + " / You are Waitlisted";
												StatusStyle = "SessionStatusRed";
											}
										}

										this.day5Items.push({
											EventName: visEventName,
											visEventTimeframe: visStartTime + " to " + visEndTime,
											visEventID: "'" + data[i].EventID + "|" + data[i].mtgID + "'",
											EventLocation: data[i].EventLocation,
											eventTypeIcon: eventIcon,
											continueIcon: "arrow-dropright",
											SessionStatusStyle: StatusStyle,
											SessionStatus: SessionStatus
										});

									}


								} else {
									
									dbEventDateTime = new Date(DayLabels[4] + "T05:00:00Z");
									DisplayDayLabel = dateFormat(dbEventDateTime, "dddd");
					
									this.day5Items.push({
										EventName: "No sessions scheduled for you for " + DisplayDayLabel,
										visEventTimeframe: "",
										EventLocation: "",
										visEventID: "'0|0'",
										eventTypeIcon: "remove-circle",
										continueIcon: "",
										SessionStatusStyle: "",
										SessionStatus: ""
									});

								}

								this.cd.markForCheck();
								//loading.dismiss();

							}).catch(function () {
								console.log("Day 5 Promise Rejected");
							});

						}).catch(function () {
							console.log("Day 4 Promise Rejected");
						});

					}).catch(function () {
						console.log("Day 3 Promise Rejected");
					});

				}).catch(function () {
					console.log("Day 2 Promise Rejected");
				});
				
			}).catch(function () {
				console.log("Day 1 Promise Rejected");
			});
			
		} else {
			console.log('User not logged in');
			//loading.dismiss();
		}


		// -------------------
		// Get data: All Sessions Day 1
		// -------------------
		flags = "li3|" + DayLabels[0];
		var CourseID = "";
		
		this.databaseprovider.getLectureData(flags, AttendeeID).then(data => {
			
			console.log("getLectureData: " + JSON.stringify(data));

			if (data['length']>0) {
				
				for (var i = 0; i < data['length']; i++) {

					var dbEventDateTime = data[i].session_start_time;
					dbEventDateTime = dbEventDateTime.replace(/-/g, '/');
					dbEventDateTime = dbEventDateTime.replace(/T/g, ' ');
					var SQLDate = new Date(dbEventDateTime);
					visStartTime = dateFormat(SQLDate, "h:MMtt");
					
					// Display end time
					dbEventDateTime = data[i].session_end_time;
					dbEventDateTime = dbEventDateTime.replace(/-/g, '/');
					dbEventDateTime = dbEventDateTime.replace(/T/g, ' ');
					SQLDate = new Date(dbEventDateTime);
					visEndTime = dateFormat(SQLDate, "h:MMtt");

					eventIcon = "list-box";
					visEventName = data[i].session_title;

					CourseID = "ID: " + data[i].session_id;

					// Status checks
					var SessionStatus = "";
					var StatusStyle = "SessionStatusNormal";
					
					// Room Capacity check
					if (parseInt(data[i].room_capacity) <= parseInt(data[i].Attendees)) {
						SessionStatus = "Course at Capacity";
						StatusStyle = "SessionStatusRed";
					}

					this.fullagendaDay1Items.push({
						EventName: visEventName,
						visEventTimeframe: visStartTime + " to " + visEndTime,
						visEventID: data[i].session_id,
						EventLocation: data[i].RoomName,
						visCourseID: CourseID,
						eventTypeIcon: eventIcon,
						SessionStatusStyle: StatusStyle,
						SessionStatus: SessionStatus
					});

				}


			} else {
				
				this.fullagendaDay1Items.push({
					EventName: "No sessions for this day",
					visEventTimeframe: "",
					EventLocation: "",
					visCourseID: "",
					visEventID: "0",
					eventTypeIcon: "remove-circle",
					SessionStatusStyle: "",
					SessionStatus: ""
				});

			}

			// -------------------
			// Get data: All Sessions Day 2
			// -------------------
			flags = "li3|" + DayLabels[1];
			
			this.databaseprovider.getLectureData(flags, AttendeeID).then(data => {
				
				console.log("getLectureData: " + JSON.stringify(data));

				if (data['length']>0) {
					
					for (var i = 0; i < data['length']; i++) {

						var dbEventDateTime = data[i].session_start_time;
						dbEventDateTime = dbEventDateTime.replace(/-/g, '/');
						dbEventDateTime = dbEventDateTime.replace(/T/g, ' ');
						var SQLDate = new Date(dbEventDateTime);
						visStartTime = dateFormat(SQLDate, "h:MMtt");
						
						// Display end time
						dbEventDateTime = data[i].session_end_time;
						dbEventDateTime = dbEventDateTime.replace(/-/g, '/');
						dbEventDateTime = dbEventDateTime.replace(/T/g, ' ');
						SQLDate = new Date(dbEventDateTime);
						visEndTime = dateFormat(SQLDate, "h:MMtt");

						eventIcon = "list-box";
						visEventName = data[i].session_title;

						CourseID = "ID: " + data[i].session_id;

						// Status checks
						var SessionStatus = "";
						var StatusStyle = "SessionStatusNormal";
						
						// Room Capacity check
						if (parseInt(data[i].room_capacity) <= parseInt(data[i].Attendees)) {
							SessionStatus = "Course at Capacity";
							StatusStyle = "SessionStatusRed";
						}

						this.fullagendaDay2Items.push({
							EventName: visEventName,
							visEventTimeframe: visStartTime + " to " + visEndTime,
							visEventID: data[i].session_id,
							visCourseID: CourseID,
							EventLocation: data[i].RoomName,
							eventTypeIcon: eventIcon,
							SessionStatusStyle: StatusStyle,
							SessionStatus: SessionStatus
						});

					}


				} else {
					
					this.fullagendaDay2Items.push({
						EventName: "No sessions for this day",
						visEventTimeframe: "",
						EventLocation: "",
						visCourseID: "",
						visEventID: "0",
						eventTypeIcon: "remove-circle",
						SessionStatusStyle: "",
						SessionStatus: ""
					});

				}

				// -------------------
				// Get data: All Sessions Day 3
				// -------------------
				flags = "li3|" + DayLabels[2];
				
				this.databaseprovider.getLectureData(flags, AttendeeID).then(data => {
					
					console.log("getLectureData: " + JSON.stringify(data));

					if (data['length']>0) {
						
						for (var i = 0; i < data['length']; i++) {

							var dbEventDateTime = data[i].session_start_time;
							dbEventDateTime = dbEventDateTime.replace(/-/g, '/');
							dbEventDateTime = dbEventDateTime.replace(/T/g, ' ');
							var SQLDate = new Date(dbEventDateTime);
							visStartTime = dateFormat(SQLDate, "h:MMtt");
							
							// Display end time
							dbEventDateTime = data[i].session_end_time;
							dbEventDateTime = dbEventDateTime.replace(/-/g, '/');
							dbEventDateTime = dbEventDateTime.replace(/T/g, ' ');
							SQLDate = new Date(dbEventDateTime);
							visEndTime = dateFormat(SQLDate, "h:MMtt");

							eventIcon = "list-box";
							visEventName = data[i].session_title;

							CourseID = "ID: " + data[i].session_id;

							// Status checks
							var SessionStatus = "";
							var StatusStyle = "SessionStatusNormal";
							
							// Room Capacity check
							if (parseInt(data[i].room_capacity) <= parseInt(data[i].Attendees)) {
								SessionStatus = "Course at Capacity";
								StatusStyle = "SessionStatusRed";
							}

							this.fullagendaDay3Items.push({
								EventName: visEventName,
								visEventTimeframe: visStartTime + " to " + visEndTime,
								visEventID: data[i].session_id,
								EventLocation: data[i].RoomName,
								visCourseID: CourseID,
								eventTypeIcon: eventIcon,
								SessionStatusStyle: StatusStyle,
								SessionStatus: SessionStatus
							});

						}


					} else {
						
						this.fullagendaDay3Items.push({
							EventName: "No sessions for this day",
							visEventTimeframe: "",
							EventLocation: "",
							visCourseID: "",
							visEventID: "0",
							eventTypeIcon: "remove-circle",
							SessionStatusStyle: "",
							SessionStatus: ""
						});

					}

					// -------------------
					// Get data: All Sessions Day 4
					// -------------------
					flags = "li3|" + DayLabels[3];
					
					this.databaseprovider.getLectureData(flags, AttendeeID).then(data => {
						
						console.log("getLectureData: " + JSON.stringify(data));

						if (data['length']>0) {
							
							for (var i = 0; i < data['length']; i++) {

								var dbEventDateTime = data[i].session_start_time;
								dbEventDateTime = dbEventDateTime.replace(/-/g, '/');
								dbEventDateTime = dbEventDateTime.replace(/T/g, ' ');
								var SQLDate = new Date(dbEventDateTime);
								visStartTime = dateFormat(SQLDate, "h:MMtt");
								
								// Display end time
								dbEventDateTime = data[i].session_end_time;
								dbEventDateTime = dbEventDateTime.replace(/-/g, '/');
								dbEventDateTime = dbEventDateTime.replace(/T/g, ' ');
								SQLDate = new Date(dbEventDateTime);
								visEndTime = dateFormat(SQLDate, "h:MMtt");

								eventIcon = "list-box";
								visEventName = data[i].session_title;

								CourseID = "ID: " + data[i].session_id;

								// Status checks
								var SessionStatus = "";
								var StatusStyle = "SessionStatusNormal";
								
								// Room Capacity check
								if (parseInt(data[i].room_capacity) <= parseInt(data[i].Attendees)) {
									SessionStatus = "Course at Capacity";
									StatusStyle = "SessionStatusRed";
								}

								this.fullagendaDay4Items.push({
									EventName: visEventName,
									visEventTimeframe: visStartTime + " to " + visEndTime,
									visEventID: data[i].session_id,
									visCourseID: CourseID,
									EventLocation: data[i].RoomName,
									eventTypeIcon: eventIcon,
									SessionStatusStyle: StatusStyle,
									SessionStatus: SessionStatus
								});

							}


						} else {
							
							this.fullagendaDay4Items.push({
								EventName: "No sessions for this day",
								visEventTimeframe: "",
								EventLocation: "",
								visCourseID: "",
								visEventID: "0",
								eventTypeIcon: "remove-circle",
								SessionStatusStyle: "",
								SessionStatus: ""
							});

						}

						// -------------------
						// Get data: All Sessions Day 5
						// -------------------
						flags = "li3|" + DayLabels[4];
						
						this.databaseprovider.getLectureData(flags, AttendeeID).then(data => {
							
							console.log("getLectureData: " + JSON.stringify(data));

							if (data['length']>0) {
								
								for (var i = 0; i < data['length']; i++) {

									var dbEventDateTime = data[i].session_start_time;
									dbEventDateTime = dbEventDateTime.replace(/-/g, '/');
									dbEventDateTime = dbEventDateTime.replace(/T/g, ' ');
									var SQLDate = new Date(dbEventDateTime);
									visStartTime = dateFormat(SQLDate, "h:MMtt");
									
									// Display end time
									dbEventDateTime = data[i].session_end_time;
									dbEventDateTime = dbEventDateTime.replace(/-/g, '/');
									dbEventDateTime = dbEventDateTime.replace(/T/g, ' ');
									SQLDate = new Date(dbEventDateTime);
									visEndTime = dateFormat(SQLDate, "h:MMtt");

									eventIcon = "list-box";
									visEventName = data[i].session_title;

									CourseID = "ID: " + data[i].session_id;

									// Status checks
									var SessionStatus = "";
									var StatusStyle = "SessionStatusNormal";
									
									// Room Capacity check
									if (parseInt(data[i].room_capacity) <= parseInt(data[i].Attendees)) {
										SessionStatus = "Course at Capacity";
										StatusStyle = "SessionStatusRed";
									}

									this.fullagendaDay5Items.push({
										EventName: visEventName,
										visEventTimeframe: visStartTime + " to " + visEndTime,
										visEventID: data[i].session_id,
										visCourseID: CourseID,
										EventLocation: data[i].RoomName,
										eventTypeIcon: eventIcon,
										SessionStatusStyle: StatusStyle,
										SessionStatus: SessionStatus
									});

								}


							} else {
								
								this.fullagendaDay5Items.push({
									EventName: "No sessions for this day",
									visEventTimeframe: "",
									EventLocation: "",
									visCourseID: "",
									visEventID: "0",
									eventTypeIcon: "remove-circle",
									SessionStatusStyle: "",
									SessionStatus: ""
								});

							}
							//loading.dismiss();

						}).catch(function () {
							console.log("Full Day 5 Promise Rejected");
						});

					}).catch(function () {
						console.log("Full Day 4 Promise Rejected");
					});

				}).catch(function () {
					console.log("Full Day 3 Promise Rejected");
				});

			}).catch(function () {
				console.log("Full Day 2 Promise Rejected");
			});
			
		}).catch(function () {
			console.log("Full Day 1 Promise Rejected");
		});

	}
	
    EventDetails(EventID) {
		
		console.log("Btn ID: " + EventID);
		
        var IDSplit = EventID.split("|");

        var storeEventID = IDSplit[0].replace("'","");
        var storePersonalEventID = IDSplit[1].replace("'", "");
		console.log("storeEventID: " + storeEventID);
		console.log("storePersonalEventID: " + storePersonalEventID);

        if (storeEventID == "0" && storePersonalEventID == "0") {
            // Do nothing
        } else {
            if (storeEventID == "0") {

                // Set EventID to LocalStorage
				this.localstorage.setLocalValue('PersonalEventID', storePersonalEventID);

                // Navigate to Education Details page
				this.navCtrl.push('MyAgendaPersonal', {EventID: storePersonalEventID}, {animate: true, direction: 'forward'});

            } else {

                // Set EventID to LocalStorage
				this.localstorage.setLocalValue('EventID', storeEventID);

                // Navigate to Education Details page
				this.navCtrl.push(EducationDetailsPage, {EventID: storeEventID}, {animate: true, direction: 'forward'});

            }
        }
    };

	SessionDetails(EventID) {
		
		console.log("Btn ID: " + EventID);
		
        if (EventID == "0") {
            // Do nothing
        } else {

			// Set EventID to LocalStorage
			this.localstorage.setLocalValue('EventID', EventID);

			// Navigate to Education Details page
			this.navCtrl.push(EducationDetailsPage, {EventID: EventID}, {animate: true, direction: 'forward'});

        }
    };

}

