// Components, functions, plugins
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Platform, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/catch';

declare var formatTime: any;
declare var dateFormat: any;

// Global URL and conference year reference used for all AJAX-to-MySQL calls
var APIURLReference: string = "https://demoplanner.convergence-us.com/cvPlanner.php?acy=2019&";
var AttendeeListing = 'Offline';

@Injectable()
export class Database {

	/* Setup page variables */
	public DevicePlatform: string;
    private storage: SQLite;
    private isOpen: boolean;
	private db: SQLiteObject;
	 
    public constructor(public pltfrm: Platform, 
						public httpCall: Http,
						public alertCtrl: AlertController,
						private sqlite: SQLite) {

        
		if(!this.isOpen) {

			// Determine platform that the app is running on
			this.DevicePlatform = "Browser";
			pltfrm.ready().then(() => {

				if (pltfrm.is('android')) {
					console.log("Database: Running on Android device");
					this.DevicePlatform = "Android";
				}
				if (pltfrm.is('ios')) {
					console.log("Database: Running on iOS device");
					this.DevicePlatform = "iOS";
				}
				
				console.log("Database: App DB platform: " + this.DevicePlatform);
				
				if (this.DevicePlatform == "iOS" || this.DevicePlatform == "Android") {

					this.isOpen = true;
					console.log("Database: Local SQLite database is now available.");
					
				} else {
									
					this.isOpen = true;
					console.log("Database: Network database is now available.");
		
				}
			});

		}
    }

	// -----------------------------------
	// 
	// Messaging Functions
	// 
	// -----------------------------------
	public getMessagingData(flags, AttendeeID) {

		console.log("flags passed: " + flags);
		console.log("AttendeeID passed: " + AttendeeID);

		var flagValues = flags.split("|");
		var listingType = flagValues[0];
		var sortingType = flagValues[1];
		var receiverID = flagValues[2];
		var pnTitle = flagValues[3];
		var pnMessage = flagValues[4];
		var DateTimeReceived = flagValues[5];
		
		if (this.DevicePlatform == "iOS" || this.DevicePlatform == "Android") {
			
			if (listingType == "li") {	// List of conversations

				// Perform query against server-based MySQL database
				var url = APIURLReference + "action=msgquery&flags=" + flags + "&AttendeeID=" + AttendeeID;
				var emptyJSONArray = {};

				return new Promise(resolve => {
					this.httpCall.get(url).subscribe(
						response => {
							console.log('msgquery response: ' + JSON.stringify(response.json()));
							resolve(response.json());
						},
						err => {
							if (err.status == "412") {
								console.log("App and API versions don't match.");
								resolve(emptyJSONArray);
							} else {
								console.log(err.status);
								console.log("API Error: ", err);
								resolve(emptyJSONArray);
							}
						}
					);
				});
				
				/*
				var SQLquery = "";
				SQLquery = "SELECT DISTINCT m.ct_id, m.last_name, m.first_name, m.company ";
				SQLquery = SQLquery + "FROM ( ";
				SQLquery = SQLquery + "SELECT DISTINCT a.ct_id, a.last_name, a.first_name, a.company, am.DateTimeSent ";
				SQLquery = SQLquery + "FROM attendee_messaging am ";
				SQLquery = SQLquery + "INNER JOIN attendees a ON a.ct_id = am.ReceiverAttendeeID ";
				SQLquery = SQLquery + "WHERE am.SenderAttendeeID = '" + AttendeeID + "' ";
				SQLquery = SQLquery + "UNION ";
				SQLquery = SQLquery + "SELECT DISTINCT a.ct_id, a.last_name, a.first_name, a.company, am.DateTimeSent ";
				SQLquery = SQLquery + "FROM attendee_messaging am ";
				SQLquery = SQLquery + "INNER JOIN attendees a ON a.ct_id = am.SenderAttendeeID ";
				SQLquery = SQLquery + "WHERE am.ReceiverAttendeeID = '" + AttendeeID + "' ";
				SQLquery = SQLquery + ") AS m ";
				
				if (sortingType == "Time") {
					SQLquery = SQLquery + "ORDER BY m.DateTimeSent DESC";
				}
				if (sortingType == "Alpha") {
					SQLquery = SQLquery + "ORDER BY m.LastName, m.FirstName";
				}
				
				// Perform query against local SQLite database
				return new Promise(resolve => {
					
					this.sqlite.create({name: 'cvPlanner.db', location: 'default', createFromLocation: 1}).then((db: SQLiteObject) => {

						console.log('Database: Opened DB for Messaging query');
						
						this.db = db;
						
						console.log('Database: Set Messaging query db variable');
						
						this.db.executeSql(SQLquery, <any>{}).then((data) => {
							//console.log('Database: Messaging query: ' + JSON.stringify(data));
							console.log('Database: Messaging query rows: ' + data.rows.length);
							let DatabaseResponse = [];
							if(data.rows.length > 0) {
								for(let i = 0; i < data.rows.length; i++) {
									DatabaseResponse.push({
										ConversationAttendeeID: data.rows.item(i).ct_id,
										LastName: data.rows.item(i).last_name,
										FirstName: data.rows.item(i).first_name,
										Company: data.rows.item(i).company
									});
								}
							}
							resolve(DatabaseResponse);
						})
						.catch(e => console.log('Database: Messaging query error: ' + JSON.stringify(e)))
					});
					console.log('Database: Stats query complete');

				});
				*/
			}
			
			if (listingType == "pn") {	// List of push notifications received

				var SQLquery = "";
				SQLquery = "SELECT pushTitle, pushMessage, datetime(pushDateTimeReceived, 'localtime') AS localDateTime ";
				SQLquery = SQLquery + "FROM attendee_push_notifications ";
				SQLquery = SQLquery + "ORDER BY pushDateTimeReceived ";
				
				// Perform query against local SQLite database
				return new Promise(resolve => {
					
					this.sqlite.create({name: 'cvPlanner.db', location: 'default', createFromLocation: 1}).then((db: SQLiteObject) => {

						console.log('Database: Opened DB for Messaging query');
						
						this.db = db;
						
						console.log('Database: Set Messaging query db variable');
						
						this.db.executeSql(SQLquery, <any>{}).then((data) => {
							console.log('Database: Messaging query rows: ' + data.rows.length);
							let DatabaseResponse = [];
							if(data.rows.length > 0) {
								for(let i = 0; i < data.rows.length; i++) {
									DatabaseResponse.push({
										pushTitle: data.rows.item(i).pushTitle,
										pushMessage: data.rows.item(i).pushMessage,
										pushDateTimeReceived: data.rows.item(i).localDateTime
									});
								}
							}
							resolve(DatabaseResponse);
						})
						.catch(e => console.log('Database: Messaging query error: ' + JSON.stringify(e)))
					});
					console.log('Database: Stats query complete');

				});
			}

			if (listingType == "ps") {	// Save push notification received

				var SQLquery = "";
				SQLquery = "INSERT INTO attendee_push_notifications(pushTitle, pushMessage, pushDateTimeReceived) ";
				SQLquery = SQLquery + "VALUES('" + pnTitle + "','" + pnMessage + "','" + DateTimeReceived + "')";
				
				// Perform query against local SQLite database
				return new Promise(resolve => {
					
					this.sqlite.create({name: 'cvPlanner.db', location: 'default', createFromLocation: 1}).then((db: SQLiteObject) => {

						console.log('Database: Opened DB for Messaging query');
						
						this.db = db;
						
						console.log('Database: Set Messaging query db variable');
						
						this.db.executeSql(SQLquery, <any>{}).then((data) => {
							console.log('Database: Messaging query rows: ' + data.rows.length);
							let DatabaseResponse = [];
							if (data.rowsAffected == "1") {
								DatabaseResponse.push({
									status: "Saved"
								});
							} else {
								DatabaseResponse.push({
									status: "Failed"
								});
							}
							resolve(DatabaseResponse);
						})
						.catch(e => console.log('Database: Messaging query error: ' + JSON.stringify(e)))
					});
					console.log('Database: Stats query complete');

				});
			}

			if (listingType == "al" || listingType == "sr") {	// Attendee Listing

				console.log('Attendee Listing: ' + AttendeeListing);

				if (AttendeeListing == 'Online') {

					// Perform query against server-based MySQL database
					var url = APIURLReference + "action=msgquery&flags=" + flags + "&AttendeeID=" + AttendeeID;
					var emptyJSONArray = {};

					return new Promise(resolve => {
						this.httpCall.get(url).subscribe(
							response => {
								console.log('msgquery response: ' + JSON.stringify(response.json()));
								resolve(response.json());
							},
							err => {
								if (err.status == "412") {
									console.log("App and API versions don't match.");
									resolve(emptyJSONArray);
								} else {
									console.log(err.status);
									console.log("API Error: ", err);
									resolve(emptyJSONArray);
								}
							}
						);
					});
				
				} else {

					var SQLquery = "";
					SQLquery = "SELECT AttendeeID, LastName, FirstName, Title, Company, avatarFilename ";
					SQLquery = SQLquery + "FROM attendees ";
					SQLquery = SQLquery + "WHERE ActiveYN = 'Y' ";
					SQLquery = SQLquery + "AND badge = '1' ";
					if (listingType == "sr") {		// If searching, then add where clause criteria
						// Split search terms by space to create WHERE clause
						var whereClause = 'AND (';
						var searchTerms = pnTitle.split(" ");
						
						for (var i = 0; i < searchTerms.length; i++){
							whereClause = whereClause + 'SearchField LIKE "%' + searchTerms[i] + '%" AND ';
						}
						// Remove last AND from where clause
						whereClause = whereClause.substring(0, whereClause.length-5);        
						whereClause = whereClause + ') ';
						SQLquery = SQLquery + whereClause ;
					}
					
					SQLquery = SQLquery + "ORDER BY lower(LastName), lower(FirstName) ";
					
					console.log('SQL Query: ' + SQLquery);
					
					// Perform query against local SQLite database
					return new Promise(resolve => {
						
						this.sqlite.create({name: 'cvPlanner.db', location: 'default', createFromLocation: 1}).then((db: SQLiteObject) => {

							console.log('Database: Opened DB for Messaging query');
							
							this.db = db;
							
							console.log('Database: Set Messaging query db variable');
							
							this.db.executeSql(SQLquery, <any>{}).then((data) => {
								console.log('Database: Messaging query rows: ' + data.rows.length);
								let DatabaseResponse = [];
								if(data.rows.length > 0) {
									for(let i = 0; i < data.rows.length; i++) {
										DatabaseResponse.push({
											AttendeeID: data.rows.item(i).AttendeeID,
											LastName: data.rows.item(i).LastName,
											FirstName: data.rows.item(i).FirstName,
											avatarFilename: data.rows.item(i).avatarFilename,
											Title: data.rows.item(i).Title,
											Company: data.rows.item(i).Company
										});
									}
								}
								resolve(DatabaseResponse);
							})
							.catch(e => console.log('Database: Messaging query error: ' + JSON.stringify(e)))
						});
						console.log('Database: Stats query complete');

					});
				}
			}

			if (listingType == "al2") {	// Attendee Listing by Letter

				console.log('Attendee Listing: ' + AttendeeListing);

				if (AttendeeListing == 'Online') {

					// Perform query against server-based MySQL database
					var url = APIURLReference + "action=msgquery&flags=" + flags + "&AttendeeID=" + AttendeeID;
					var emptyJSONArray = {};

					return new Promise(resolve => {
						this.httpCall.get(url).subscribe(
							response => {
								console.log('msgquery response: ' + JSON.stringify(response.json()));
								resolve(response.json());
							},
							err => {
								if (err.status == "412") {
									console.log("App and API versions don't match.");
									resolve(emptyJSONArray);
								} else {
									console.log(err.status);
									console.log("API Error: ", err);
									resolve(emptyJSONArray);
								}
							}
						);
					});
				
				} else {
				
					var SQLquery = "";
					SQLquery = "SELECT AttendeeID, LastName, FirstName, Title, Company, avatarFilename ";
					SQLquery = SQLquery + "FROM attendees ";
					SQLquery = SQLquery + "WHERE ActiveYN = 'Y' ";
					SQLquery = SQLquery + "AND badge = '1' ";
					SQLquery = SQLquery + "WHERE last_name LIKE '" + sortingType + "%' ";
					SQLquery = SQLquery + "ORDER BY lower(LastName), lower(FirstName) ";
					
					// Perform query against local SQLite database
					return new Promise(resolve => {
						
						this.sqlite.create({name: 'cvPlanner.db', location: 'default', createFromLocation: 1}).then((db: SQLiteObject) => {

							console.log('Database: Opened DB for Messaging query');
							
							this.db = db;
							
							console.log('Database: Set Messaging query db variable');
							
							this.db.executeSql(SQLquery, <any>{}).then((data) => {
								console.log('Database: Messaging query rows: ' + data.rows.length);
								let DatabaseResponse = [];
								if(data.rows.length > 0) {
									for(let i = 0; i < data.rows.length; i++) {
										DatabaseResponse.push({
											AttendeeID: data.rows.item(i).AttendeeID,
											LastName: data.rows.item(i).LastName,
											FirstName: data.rows.item(i).FirstName,
											avatarFilename: data.rows.item(i).avatarFilename,
											Title: data.rows.item(i).Title,
											Company: data.rows.item(i).Company
										});
									}
								}
								resolve(DatabaseResponse);
							})
							.catch(e => console.log('Database: Messaging query error: ' + JSON.stringify(e)))
						});
						console.log('Database: Stats query complete');

					});
				}
			}
			
		} else {
			
			// Perform query against server-based MySQL database
			var url = APIURLReference + "action=msgquery&flags=" + flags + "&AttendeeID=" + AttendeeID;

			return new Promise(resolve => {
				this.httpCall.get(url).subscribe(
					response => {
						console.log('msgquery response: ' + JSON.stringify(response.json()));
						resolve(response.json());
					},
					err => {
						if (err.status == "412") {
							console.log("App and API versions don't match.");
							var emptyJSONArray = {};
							resolve(emptyJSONArray);
						} else {
							console.log(err.status);
							console.log("API Error: ", err);
						}
					}
				);
			});
			
		}
			
	}

	// -----------------------------------
	// 
	// Bookmark Functions
	// 
	// -----------------------------------
	public getBookmarksData(flags, AttendeeID) {

		console.log("flags passed: " + flags);
		console.log("AttendeeID passed: " + AttendeeID);

		var flagValues = flags.split("|");
		var listingType = flagValues[0];
		var listingFilter = flagValues[1];
		var BookmarkType = flagValues[2];
		var BookmarkID = flagValues[3];
		
		
		if (this.DevicePlatform == "iOS" || this.DevicePlatform == "Android") {
			
			if (listingType == "li") { // List bookmarks
			
				var SQLquery = "";

				switch(listingFilter) {
					case "Sessions":

						SQLquery = "SELECT DISTINCT c.session_id, c.session_title, c.primary_speaker, c.other_speakers, c.session_start_time, c.session_end_time, ";
						SQLquery = SQLquery + "lr.RoomName, lr.FloorNumber, lr.RoomX, lr.RoomY, c.cs_credits, c.subject, c.room_capacity, s.itID AS OnAgenda, ";
						SQLquery = SQLquery + "(SELECT COUNT(acID) AS Attendees FROM attendee_courses ac WHERE ac.session_id = c.session_id) AS Attendees, ";
						SQLquery = SQLquery + "(SELECT CASE waitlist WHEN NULL THEN 0 ELSE waitlist END FROM attendee_courses ac2 WHERE ac2.session_id = c.session_id AND ac2.ct_id = '" + AttendeeID + "') AS Waitlist ";
						SQLquery = SQLquery + "FROM courses c ";
						SQLquery = SQLquery + "INNER JOIN lookup_rooms lr ON c.room_number = lr.RoomName ";
						SQLquery = SQLquery + "LEFT OUTER JOIN itinerary s ON s.EventID = c.session_id AND s.AttendeeID = '" + AttendeeID + "' ";
						SQLquery = SQLquery + "INNER JOIN attendee_bookmarks ab ON ab.AttendeeID = '" + AttendeeID + "' ";
						SQLquery = SQLquery + "		AND ab.BookmarkType = 'Sessions' ";
						SQLquery = SQLquery + "		AND ab.BookmarkID = c.session_id ";
						SQLquery = SQLquery + "WHERE ab.UpdateType != 'Delete' ";
						SQLquery = SQLquery + "ORDER BY c.session_start_time, c.course_id";

						// Perform query against local SQLite database
						return new Promise(resolve => {
							
							this.sqlite.create({name: 'cvPlanner.db', location: 'default', createFromLocation: 1}).then((db: SQLiteObject) => {

								console.log('Database: Opened DB for Messaging query');
								
								this.db = db;
								
								console.log('Database: Set Messaging query db variable');
								
								this.db.executeSql(SQLquery, <any>{}).then((data) => {
									console.log('Database: Messaging query rows: ' + data.rows.length);
									let DatabaseResponse = [];
									if(data.rows.length > 0) {
										for(let i = 0; i < data.rows.length; i++) {
											DatabaseResponse.push({
												session_id: data.rows.item(i).session_id,
												session_title: data.rows.item(i).session_title,
												primary_speaker: data.rows.item(i).primary_speaker,
												other_speakers: data.rows.item(i).other_speakers,
												session_start_time: data.rows.item(i).session_start_time,
												session_end_time: data.rows.item(i).session_end_time,
												RoomName: data.rows.item(i).RoomName,
												FloorNumber: data.rows.item(i).FloorNumber,
												RoomX: data.rows.item(i).RoomX,
												RoomY: data.rows.item(i).RoomY,
												cs_credits: data.rows.item(i).cs_credits,
												subject: data.rows.item(i).subject,
												OnAgenda: data.rows.item(i).OnAgenda,
												Attendees: data.rows.item(i).Attendees,
												Waitlist: data.rows.item(i).Waitlist,
												room_capacity: data.rows.item(i).room_capacity								
											});
										}
									}
									resolve(DatabaseResponse);
								})
								.catch(e => console.log('Database: Messaging query error: ' + JSON.stringify(e)))
							});
							console.log('Database: Stats query complete');

						});
						//break;
					case "Speakers":

						SQLquery = "SELECT DISTINCT s.speakerID, s.LastName, s.FirstName, s.Credentials, s.Title, s.Company, s.imageFilename ";
						SQLquery = SQLquery + "FROM courses_speakers s ";
						SQLquery = SQLquery + "INNER JOIN attendee_bookmarks ab ON ab.AttendeeID = '" + AttendeeID + "' ";
						SQLquery = SQLquery + "		AND ab.BookmarkType = 'Speakers' ";
						SQLquery = SQLquery + "		AND ab.BookmarkID = s.speakerID ";
						SQLquery = SQLquery + "WHERE ab.UpdateType != 'Delete' ";
						SQLquery = SQLquery + "ORDER BY s.LastName, s.FirstName";
			
						// Perform query against local SQLite database
						return new Promise(resolve => {
							
							this.sqlite.create({name: 'cvPlanner.db', location: 'default', createFromLocation: 1}).then((db: SQLiteObject) => {

								console.log('Database: Opened DB for Messaging query');
								
								this.db = db;
								
								console.log('Database: Set Messaging query db variable');
								
								this.db.executeSql(SQLquery, <any>{}).then((data) => {
									console.log('Database: Messaging query rows: ' + data.rows.length);
									let DatabaseResponse = [];
									if(data.rows.length > 0) {
										for(let i = 0; i < data.rows.length; i++) {
											DatabaseResponse.push({
												speakerID: data.rows.item(i).speakerID,
												LastName: data.rows.item(i).LastName,
												FirstName: data.rows.item(i).FirstName,
												Credentials: data.rows.item(i).Credentials,
												Company: data.rows.item(i).Company,
												Title: data.rows.item(i).Title,
												imageFilename: data.rows.item(i).imageFilename							
											});
										}
									}
									resolve(DatabaseResponse);
								})
								.catch(e => console.log('Database: Messaging query error: ' + JSON.stringify(e)))
							});
							console.log('Database: Stats query complete');

						});
						//break;
					case "Exhibitors":

						SQLquery = "SELECT DISTINCT e.ExhibitorID, e.CompanyName, e.City, e.State, e.Country, e.BoothNumber ";
						SQLquery = SQLquery + "FROM exhibitors e ";
						SQLquery = SQLquery + "INNER JOIN attendee_bookmarks ab ON ab.AttendeeID = '" + AttendeeID + "' ";
						SQLquery = SQLquery + "		AND ab.BookmarkType = 'Exhibitors' ";
						SQLquery = SQLquery + "		AND ab.BookmarkID = e.ExhibitorID ";
						SQLquery = SQLquery + "WHERE ab.UpdateType != 'Delete' ";
						SQLquery = SQLquery + "ORDER BY e.CompanyName";
						
						// Perform query against local SQLite database
						return new Promise(resolve => {
							
							this.sqlite.create({name: 'cvPlanner.db', location: 'default', createFromLocation: 1}).then((db: SQLiteObject) => {

								console.log('Database: Opened DB for Messaging query');
								
								this.db = db;
								
								console.log('Database: Set Messaging query db variable');
								
								this.db.executeSql(SQLquery, <any>{}).then((data) => {
									console.log('Database: Messaging query rows: ' + data.rows.length);
									let DatabaseResponse = [];
									if(data.rows.length > 0) {
										for(let i = 0; i < data.rows.length; i++) {
											DatabaseResponse.push({
												ExhibitorID: data.rows.item(i).ExhibitorID,
												CompanyName: data.rows.item(i).CompanyName,
												City: data.rows.item(i).City,
												State: data.rows.item(i).State,
												Country: data.rows.item(i).Country,
												BoothNumber: data.rows.item(i).BoothNumber							
											});
										}
									}
									resolve(DatabaseResponse);
								})
								.catch(e => console.log('Database: Messaging query error: ' + JSON.stringify(e)))
							});
							console.log('Database: Stats query complete');

						});
						//break;
					case "Attendees":

						SQLquery = "SELECT DISTINCT a.AttendeeID, a.LastName, a.FirstName, a.Title, a.Company ";
						SQLquery = SQLquery + "FROM attendees a ";
						SQLquery = SQLquery + "INNER JOIN attendee_bookmarks ab ON ab.AttendeeID = '" + AttendeeID + "' ";
						SQLquery = SQLquery + "		AND ab.BookmarkType = 'Attendees' ";
						SQLquery = SQLquery + "		AND ab.BookmarkID = a.AttendeeID ";
						SQLquery = SQLquery + "WHERE a.ActiveYN = 'Y' ";
						SQLquery = SQLquery + "AND ab.UpdateType != 'Delete' ";
						SQLquery = SQLquery + "ORDER BY a.LastName, a.FirstName ";
						
						// Perform query against local SQLite database
						return new Promise(resolve => {
							
							this.sqlite.create({name: 'cvPlanner.db', location: 'default', createFromLocation: 1}).then((db: SQLiteObject) => {

								console.log('Database: Opened DB for Messaging query');
								
								this.db = db;
								
								console.log('Database: Set Messaging query db variable');
								
								this.db.executeSql(SQLquery, <any>{}).then((data) => {
									console.log('Database: Messaging query rows: ' + data.rows.length);
									let DatabaseResponse = [];
									if(data.rows.length > 0) {
										for(let i = 0; i < data.rows.length; i++) {
											DatabaseResponse.push({
												AttendeeID: data.rows.item(i).AttendeeID,
												LastName: data.rows.item(i).LastName,
												FirstName: data.rows.item(i).FirstName,
												Title: data.rows.item(i).Title,
												Company: data.rows.item(i).Company
											});
										}
									}
									resolve(DatabaseResponse);
								})
								.catch(e => console.log('Database: Messaging query error: ' + JSON.stringify(e)))
							});
							console.log('Database: Stats query complete');

						});
				}
			}

			if (listingType == "cb") { // Create Bookmark
			
				SQLquery = "SELECT * FROM attendee_bookmarks ";
				SQLquery = SQLquery + "WHERE BookmarkType = '" + BookmarkType + "' ";
				SQLquery = SQLquery + "AND BookmarkID = '" + BookmarkID + "' ";
				SQLquery = SQLquery + "AND AttendeeID = '" + AttendeeID + "'";
				
				// Perform query against local SQLite database
				return new Promise(resolve => {
					
					this.sqlite.create({name: 'cvPlanner.db', location: 'default', createFromLocation: 1}).then((db: SQLiteObject) => {

						console.log('Database: Opened DB for Create Bookmark query');
						
						this.db = db;
						
						console.log('Database: Set Create Bookmark query db variable');
						
						this.db.executeSql(SQLquery, <any>{}).then((data) => {
							console.log('Database: Create Bookmark query: ' + JSON.stringify(data));
							console.log('Database: Create Bookmark query rows: ' + data.rows.length);
							var SQLquery2 = "";
							let DatabaseResponse = [];
							console.log('Database: BookmarkType: ' + BookmarkType);
							console.log('Database: listingType: ' + listingType);
							if(data.rows.length > 0) {
								SQLquery2 = "UPDATE attendee_bookmarks ";
								SQLquery2 = SQLquery2 + "SET UpdateType = 'Insert' ";
								SQLquery2 = SQLquery2 + "WHERE AttendeeID = '" + AttendeeID + "' ";
								SQLquery2 = SQLquery2 + "AND BookmarkType = '" + BookmarkType + "' ";
								SQLquery2 = SQLquery2 + "AND BookmarkID = '" + BookmarkID + "' ";
								console.log('Database: Create Bookmark query2: ' + SQLquery2);
								this.db.executeSql(SQLquery2, <any>{}).then((data2) => {
									console.log('Database: Create Bookmark query2: ' + JSON.stringify(data2));
									if(data2.rowsAffected > 0) {
										DatabaseResponse.push({
											Status: "Saved",
											Query: ""
										});
									} else {
										DatabaseResponse.push({
											Status: "Failed",
											Query: ""
										});
									}
									resolve(DatabaseResponse);
								})
								.catch(e => console.log('Database: Agenda query2 error: ' + JSON.stringify(e)))
							} else {
								var CurrentDateTime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
								SQLquery2 = "INSERT INTO attendee_bookmarks(AttendeeID, BookmarkType, BookmarkID, DateAdded, UpdateType) ";
								SQLquery2 = SQLquery2 + "VALUES('" + AttendeeID + "','" + BookmarkType + "','" + BookmarkID + "','" + CurrentDateTime + "','Insert')";
								console.log('Database: Create Bookmark query2: ' + SQLquery2);

								this.db.executeSql(SQLquery2, <any>{}).then((data2) => {
									console.log('Database: Create Bookmark query2: ' + JSON.stringify(data2));
									if(data2.rowsAffected > 0) {
										DatabaseResponse.push({
											Status: "Saved",
											Query: ""
										});
									} else {
										DatabaseResponse.push({
											Status: "Failed",
											Query: ""
										});
									}
									resolve(DatabaseResponse);
								})
								.catch(e => console.log('Database: Create Bookmark query2 error: ' + JSON.stringify(e)))
							}
										
						})
						.catch(e => console.log('Database: Create Bookmark query error: ' + JSON.stringify(e)))
					});
					console.log('Database: Create Bookmark query complete');

				});
				
			}

			if (listingType == "rb") { // Remove Bookmark
			
				SQLquery = "SELECT * FROM attendee_bookmarks ";
				SQLquery = SQLquery + "WHERE BookmarkType = '" + BookmarkType + "' ";
				SQLquery = SQLquery + "AND BookmarkID = '" + BookmarkID + "' ";
				SQLquery = SQLquery + "AND AttendeeID = '" + AttendeeID + "'";
				
				// Perform query against local SQLite database
				return new Promise(resolve => {
					
					this.sqlite.create({name: 'cvPlanner.db', location: 'default', createFromLocation: 1}).then((db: SQLiteObject) => {

						console.log('Database: Opened DB for Create Bookmark query');
						
						this.db = db;
						
						console.log('Database: Set Create Bookmark query db variable');
						
						this.db.executeSql(SQLquery, <any>{}).then((data) => {
							console.log('Database: Create Bookmark query: ' + JSON.stringify(data));
							console.log('Database: Create Bookmark query rows: ' + data.rows.length);
							var SQLquery2 = "";
							let DatabaseResponse = [];
							console.log('Database: BookmarkType: ' + BookmarkType);
							console.log('Database: listingType: ' + listingType);
							if(data.rows.length > 0) {
								SQLquery2 = "UPDATE attendee_bookmarks ";
								SQLquery2 = SQLquery2 + "SET UpdateType = 'Delete' ";
								SQLquery2 = SQLquery2 + "WHERE AttendeeID = '" + AttendeeID + "' ";
								SQLquery2 = SQLquery2 + "AND BookmarkType = '" + BookmarkType + "' ";
								SQLquery2 = SQLquery2 + "AND BookmarkID = '" + BookmarkID + "' ";
								console.log('Database: Create Bookmark query2: ' + SQLquery2);
								this.db.executeSql(SQLquery2, <any>{}).then((data2) => {
									console.log('Database: Create Bookmark query2: ' + JSON.stringify(data2));
									if(data2.rowsAffected > 0) {
										DatabaseResponse.push({
											Status: "Saved",
											Query: ""
										});
									} else {
										DatabaseResponse.push({
											Status: "Failed",
											Query: ""
										});
									}
									resolve(DatabaseResponse);
								})
								.catch(e => console.log('Database: Agenda query2 error: ' + JSON.stringify(e)))
							} else {
								var CurrentDateTime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
								SQLquery2 = "INSERT INTO attendee_bookmarks(AttendeeID, BookmarkType, BookmarkID, DateAdded, UpdateType) ";
								SQLquery2 = SQLquery2 + "VALUES('" + AttendeeID + "','" + BookmarkType + "','" + BookmarkID + "','" + CurrentDateTime + "','Delete')";
								console.log('Database: Create Bookmark query2: ' + SQLquery2);

								this.db.executeSql(SQLquery2, <any>{}).then((data2) => {
									console.log('Database: Create Bookmark query2: ' + JSON.stringify(data2));
									if(data2.rowsAffected > 0) {
										DatabaseResponse.push({
											Status: "Saved",
											Query: ""
										});
									} else {
										DatabaseResponse.push({
											Status: "Failed",
											Query: ""
										});
									}
									resolve(DatabaseResponse);
								})
								.catch(e => console.log('Database: Create Bookmark query2 error: ' + JSON.stringify(e)))
							}
										
						})
						.catch(e => console.log('Database: Create Bookmark query error: ' + JSON.stringify(e)))
					});
					console.log('Database: Create Bookmark query complete');

				});

			}
					
		} else {
		
			// Perform query against server-based MySQL database
			var url = APIURLReference + "action=bmkquery&flags=" + flags + "&AttendeeID=" + AttendeeID;

			return new Promise(resolve => {
				this.httpCall.get(url).subscribe(
					response => {resolve(response.json());
					},
					err => {
						if (err.status == "412") {
							console.log("App and API versions don't match.");
							var emptyJSONArray = {};
							resolve(emptyJSONArray);
						} else {
							console.log(err.status);
							console.log("API Error: ", err);
						}
					}
				);
			});
			
		}
			
	}

	// -----------------------------------
	// 
	// Activity Feed Database Functions
	// 
	// -----------------------------------
	public getActivityFeedData(flags, AttendeeID) {

		console.log("getActivityFeedData flags passed: " + flags);
		var SQLquery = "";
				
		if (this.DevicePlatform == "iOS" || this.DevicePlatform == "Android") {
			
			var flagValues = flags.split("|");
			var listingType = flagValues[0];
			var activityfeedID = flagValues[1];
			var afComment = flagValues[2];
			var QueryParam = flagValues[3] || '';			// Search parameters for activity feed
			var afFilename = flagValues[4];
			var afPostedDateTime = flagValues[5];
			
			if (listingType == "li" || listingType == "sr") {	// List of activity feed
		
				// Perform query against server-based MySQL database
				var url = APIURLReference + "action=afquery&flags=" + flags + "&AttendeeID=" + AttendeeID;

				return new Promise(resolve => {
					this.httpCall.get(url).subscribe(
						response => {resolve(response.json());
						},
						err => {
							if (err.status == "412") {
								console.log("App and API versions don't match.");
								var emptyJSONArray = {};
								resolve(emptyJSONArray);
							} else {
								console.log(err.status);
								console.log("API Error: ", err);
								var emptyJSONArray = {};
								resolve(emptyJSONArray);
								/*
								// Split search terms by space to create WHERE clause
								var whereClause = 'WHERE (';
								var searchTerms = QueryParam.split(" ");
								
								for (var i = 0; i < searchTerms.length; i++){
									whereClause = whereClause + 'e.SearchField LIKE "%' + searchTerms[i] + '%" AND ';
								}
								// Remove last AND from where clause
								whereClause = whereClause.substring(0, whereClause.length-5);
								whereClause = whereClause + ') ';

								SQLquery = SQLquery + whereClause;

								// Validate query
								SQLquery = "SELECT af.afID, af.AttendeeID, a.last_name AS PosterLast, a.first_name AS PosterFirst, af.afDateTime AS Posted, af.afLikesCounter, af.afMessage, af.afImageAttachment, ";
								SQLquery = SQLquery + "(SELECT COUNT(afcID) FROM activities_feed_comments afc WHERE afc.afID = af.afID) AS CommentsCount ";
								SQLquery = SQLquery + "FROM activities_feed af ";
								SQLquery = SQLquery + "INNER JOIN attendees a ON a.ct_id = af.AttendeeID ";
								
								if (listingType == "sr") {		// If searching activities, then add where clause criteria

									SQLquery = SQLquery + whereClause;
									SQLquery = SQLquery + "ORDER BY DateAdded DESC ";

								} else {
							
									SQLquery = SQLquery + "ORDER BY DateAdded DESC ";
							
								}

								console.log("Activity feed Query: " + SQLquery);

								// Perform query against local SQLite database
								return new Promise(resolve => {
									
									this.sqlite.create({name: 'cvPlanner.db', location: 'default', createFromLocation: 1}).then((db: SQLiteObject) => {

										console.log('Database: Opened DB for Activity feed query');
										
										this.db = db;
										
										console.log('Database: Set Activity feed query db variable');
										
										this.db.executeSql(SQLquery, <any>{}).then((data) => {
											console.log('Database: Activity feed query: ' + JSON.stringify(data));
											console.log('Database: Activity feed query rows: ' + data.rows.length);
											let DatabaseResponse = [];
											if(data.rows.length > 0) {
												for(let i = 0; i < data.rows.length; i++) {
													DatabaseResponse.push({
														afID: data.rows.item(i).afID,
														AttendeeID: data.rows.item(i).AttendeeID,
														PosterLast: data.rows.item(i).PosterLast,
														PosterFirst: data.rows.item(i).PosterFirst,
														Posted: data.rows.item(i).Posted,
														afLikesCounter: data.rows.item(i).afLikesCounter,
														afMessage: data.rows.item(i).afMessage,
														afImageAttachment: data.rows.item(i).afImageAttachment,
														CommentsCount: data.rows.item(i).CommentsCount
													});
												}
											}
											resolve(DatabaseResponse);
										})
										.catch(e => console.log('Database: Activity feed query error: ' + JSON.stringify(e)))
									});
									console.log('Database: Activity feed query complete');

								});
								*/
							}
						}
					);
				});
			}
		
			if (listingType == "ad") {
				
				// Perform query against server-based MySQL database
				var url = APIURLReference + "action=afquery&flags=" + flags + "&AttendeeID=" + AttendeeID;

				return new Promise(resolve => {
					this.httpCall.get(url).subscribe(
						response => {resolve(response.json());
						}
					);
				});
				
			}
			
			if (listingType == "dt") {	// Activity feed details
			
				// Perform query against server-based MySQL database
				var url = APIURLReference + "action=afquery&flags=" + flags + "&AttendeeID=" + AttendeeID;

				return new Promise(resolve => {
					this.httpCall.get(url).subscribe(
						response => {resolve(response.json());
						}
					);
				});

			}
			
			if (listingType == "lu") {		// Likes incrementer (update)
				
				// Perform query against server-based MySQL database
				var url = APIURLReference + "action=afquery&flags=" + flags + "&AttendeeID=" + AttendeeID;

				return new Promise(resolve => {
					this.httpCall.get(url).subscribe(
						response => {resolve(response.json());
						}
					);
				});

				/*
				var SQLquery = "SELECT afLikesCounter FROM activities_feed WHERE afID = " + activityfeedID + " ";
				
				// Perform query against local SQLite database
				return new Promise(resolve => {
					
					this.sqlite.create({name: 'cvPlanner.db', location: 'default', createFromLocation: 1}).then((db: SQLiteObject) => {

						console.log('Database: Opened DB for Likes Update query');
						
						this.db = db;
						
						console.log('Database: Set Likes Update query db variable');
						
						this.db.executeSql(SQLquery, <any>{}).then((data) => {
							console.log('Database: Likes Update query: ' + JSON.stringify(data));
							console.log('Database: Likes Update query rows: ' + data.rows.length);
							let DatabaseResponse = [];
							console.log('Database: activityfeedID: ' + activityfeedID);
							if(data.rows.length > 0) {
								
								var SQLquery2 = "";
								var newLikes = data.rows.item(0).afLikesCounter;
								newLikes = newLikes + 1;
								
								SQLquery2 = "UPDATE activities_feed ";
								SQLquery2 = SQLquery2 + "SET afLikesCounter = " + newLikes + " ";
								SQLquery2 = SQLquery2 + "WHERE afID = " + activityfeedID + " ";
								console.log('Database: Likes Update query2: ' + SQLquery2);
								
								this.db.executeSql(SQLquery2, <any>{}).then((data2) => {
									console.log('Database: Likes Update query2: ' + JSON.stringify(data2));
									if(data2.rowsAffected > 0) {
										DatabaseResponse.push({
											Status: "Saved",
											Query: "",
											NewLikes: newLikes
										});
									} else {
										DatabaseResponse.push({
											Status: "Failed",
											Query: "",
											NewLikes: 0
										});
									}
									resolve(DatabaseResponse);
								})
								.catch(e => console.log('Database: Likes Update query2 error: ' + JSON.stringify(e)))
							}
										
						})
						.catch(e => console.log('Database: Likes Update query error: ' + JSON.stringify(e)))
					});
					console.log('Database: Likes Update query complete');

				});
				*/
			}

			
		} else {
			
			// Perform query against server-based MySQL database
			var url = APIURLReference + "action=afquery&flags=" + flags + "&AttendeeID=" + AttendeeID;

			return new Promise(resolve => {
				this.httpCall.get(url).subscribe(
					response => {resolve(response.json());
					},
					err => {
						if (err.status == "412") {
							console.log("App and API versions don't match.");
							var emptyJSONArray = {};
							resolve(emptyJSONArray);
						} else {
							console.log(err.status);
							console.log("API Error: ", err);
						}
					}
				);
			});
			
		}
			
    }

	// -----------------------------------
	// 
	// CE Database Functions
	// 
	// -----------------------------------
    public getCETrackerData(AttendeeID) {

		console.log("Database: AttendeeID passed: " + AttendeeID);
				
		if (this.DevicePlatform == "iOS" || this.DevicePlatform == "Android") {
			
			var SQLquery = "SELECT DISTINCT c.session_id, c.course_id, c.session_title, ce.scannedYN AS ceStatusScan, ce.evalID AS ceStatusEval, c.ce_credits_type, ";
			SQLquery = SQLquery + "e.evalID AS Evaluated, c.CEcreditsL, c.CEcreditsP ";
			SQLquery = SQLquery + "FROM attendee_ces ce ";
			SQLquery = SQLquery + "INNER JOIN courses c ON ce.session_id = c.session_id ";
			SQLquery = SQLquery + "LEFT OUTER JOIN evaluations e ON e.session_id = c.session_id AND e.AttendeeID = '" + AttendeeID + "' ";
			SQLquery = SQLquery + "WHERE ce.AttendeeID = '" + AttendeeID + "' ";
			SQLquery = SQLquery + "ORDER BY c.course_id";

			//console.log("CE Query: " + SQLquery);
			
			// Perform query against local SQLite database
			return new Promise(resolve => {
				
				this.sqlite.create({name: 'cvPlanner.db', location: 'default', createFromLocation: 1}).then((db: SQLiteObject) => {

					console.log('Database: Opened DB for CE query');
					
					this.db = db;
					
					console.log('Database: Set CE query db variable');
					
					this.db.executeSql(SQLquery, <any>{}).then((data) => {
						//console.log('Database: CE query: ' + JSON.stringify(data));
						console.log('Database: CE query rows: ' + data.rows.length);
						let DatabaseResponse = [];
						if(data.rows.length > 0) {
							for(let i = 0; i < data.rows.length; i++) {
								DatabaseResponse.push({
									session_id: data.rows.item(i).session_id,
									session_title: data.rows.item(i).session_title,
									course_id: data.rows.item(i).course_id,
									ceStatusScan: data.rows.item(i).ceStatusScan,
									ceStatusEval: data.rows.item(i).ceStatusEval,
									ce_credits_type: data.rows.item(i).ce_credits_type,
									Evaluated: data.rows.item(i).Evaluated,
									CEcreditsL: data.rows.item(i).CEcreditsL,
									CEcreditsP: data.rows.item(i).CEcreditsP
								});
							}
						}
						resolve(DatabaseResponse);
					})
					.catch(e => console.log('Database: CE query error: ' + JSON.stringify(e)))
				});
				console.log('Database: CE query complete');

			});
			
		} else {
			
			// Perform query against server-based MySQL database
			var url = APIURLReference + "action=cequery&flags=cl&AttendeeID=" + AttendeeID;

			return new Promise(resolve => {
				this.httpCall.get(url).subscribe(
					response => {resolve(response.json());
					},
					err => {
						if (err.status == "412") {
							console.log("App and API versions don't match.");
							var emptyJSONArray = {};
							resolve(emptyJSONArray);
						} else {
							console.log(err.status);
							console.log("API Error: ", err);
						}
					}
				);
			});
			
		}
			
    }

	// -----------------------------------
	// 
	// Evaluation Database Functions
	// 
	// -----------------------------------
	public getEvaluationData(flags, AttendeeID) {

		console.log("flags passed: " + flags);

		var flagValues = flags.split("|");
		var listingType = flagValues[0];
		var EventID = flagValues[1];    
		var EvalType = flagValues[2];
		var SQLquery = "";
		var Q11 = "";
		var Q12 = "";
		var Q21 = "";
		var Q22 = "";
		var Q23 = "";
		var Q24 = "";
		var Q25 = "";
		var Q26 = "";
		var Q31 = "";
		var Q32 = "";
		var Q33 = "";
		var Q41 = "";
		var Q1 = "";
		var Q2 = "";
		var Q3 = "";
		var Q4 = "";
		var Q5 = "";
		var Q5C = "";
		var Q6 = "";
		var Q7 = "";
		var Q7C = "";
		var Q8 = "";
		var Q9 = "";
		var Q10 = "";
		var Q10C = "";
		var Q11C = "";
		var LastUpdated = "";    
		
		if (this.DevicePlatform == "iOS" || this.DevicePlatform == "Android") {
			
			if (EvalType == "Lecture" || EvalType == "Workshop") {
				
				console.log('Database: Lecture/Workshop Evaluation');
				
				// Individual session evaluations
				Q11 = flagValues[3];
				Q12 = flagValues[4];
				Q21 = flagValues[5];
				Q22 = flagValues[6];
				Q23 = flagValues[7];
				Q24 = flagValues[8];
				Q25 = flagValues[9];
				Q26 = flagValues[10];
				Q31 = flagValues[11];
				Q32 = flagValues[12];
				Q33 = flagValues[13];
				Q41 = flagValues[14];
				LastUpdated = flagValues[15];    
				
				if (listingType == "ei") {	// Retrieve session evaluations
				
					SQLquery = "SELECT e.*, c.session_title, c.session_start_time, c.session_end_time, c.room_number AS RoomName ";
					SQLquery = SQLquery + "FROM courses c ";
					SQLquery = SQLquery + "LEFT OUTER JOIN evaluations e ON e.session_id = c.session_id AND e.AttendeeID = '" + AttendeeID + "' AND e.evaluationType = '" + EvalType + "' ";
					SQLquery = SQLquery + "WHERE c.session_id = '" + EventID + "' ";

				}
			
				if (listingType == "ec") {	// Retrieve session evaluation
				
					SQLquery = "SELECT e.* ";
					SQLquery = SQLquery + "FROM evaluations e ";
					SQLquery = SQLquery + "WHERE e.AttendeeID = '" + AttendeeID + "' ";
					SQLquery = SQLquery + "AND e.evaluationType = '" + EvalType + "' ";

				}

				if (listingType == "es") {	// Save (new/update) evaluation
				
					SQLquery = "SELECT * FROM evaluations WHERE AttendeeID = '" + AttendeeID + "' AND session_id = '" + EventID + "' AND evaluationType = '" + EvalType + "' ";
				}

				console.log('Database: SQL Query: ' + SQLquery);

				console.log("Evaluation Query: " + SQLquery);

				// Perform query against local SQLite database
				return new Promise(resolve => {
					
					this.sqlite.create({name: 'cvPlanner.db', location: 'default', createFromLocation: 1}).then((db: SQLiteObject) => {

						console.log('Database: Opened DB for Evaluation query');
						
						this.db = db;
						
						console.log('Database: Set Evaluation query db variable');
						
						this.db.executeSql(SQLquery, <any>{}).then((data) => {
							console.log('Database: Evaluation query: ' + JSON.stringify(data));
							console.log('Database: Evaluation query rows: ' + data.rows.length);
							var SQLquery2 = "";
							let DatabaseResponse = [];
							if (EvalType == "Lecture" || EvalType == "Workshop") {
								console.log('Database: EvalType: ' + EvalType);
								if (listingType == "ei") {
									console.log('Database: listingType: ' + listingType);
									if(data.rows.length > 0) {
										for(let i = 0; i < data.rows.length; i++) {
											DatabaseResponse.push({
												evalID: data.rows.item(i).evalID,
												AttendeeID: data.rows.item(i).AttendeeID,
												session_id: data.rows.item(i).session_id,
												evaluationType: data.rows.item(i).evaluationType,
												session_title: data.rows.item(i).session_title,
												session_start_time: data.rows.item(i).session_start_time,
												session_end_time: data.rows.item(i).session_end_time,
												RoomName: data.rows.item(i).RoomName,
												Q11: data.rows.item(i).Q11,
												Q12: data.rows.item(i).Q12,
												Q21: data.rows.item(i).Q21,
												Q22: data.rows.item(i).Q22,
												Q23: data.rows.item(i).Q23,
												Q24: data.rows.item(i).Q24,
												Q25: data.rows.item(i).Q25,
												Q26: data.rows.item(i).Q26,
												Q31: data.rows.item(i).Q31,
												Q32: data.rows.item(i).Q32,
												Q33: data.rows.item(i).Q33,
												Q41: data.rows.item(i).Q41,
												UpdateType: data.rows.item(i).UpdateType,
												LastUpdated: data.rows.item(i).LastUpdated
											});
											resolve(DatabaseResponse);
										}
									}
								}
								if (listingType == "es") {
									console.log('Database: listingType: ' + listingType);
									if(data.rows.length > 0) {
										SQLquery2 = "UPDATE evaluations ";
										SQLquery2 = SQLquery2 + "SET UpdateType = 'Update', ";
										SQLquery2 = SQLquery2 + "Q11 = '" + Q11 + "', ";
										SQLquery2 = SQLquery2 + "Q12 = '" + Q12 + "', ";
										SQLquery2 = SQLquery2 + "Q21 = '" + Q21 + "', ";
										SQLquery2 = SQLquery2 + "Q22 = '" + Q22 + "', ";
										SQLquery2 = SQLquery2 + "Q23 = '" + Q23 + "', ";
										SQLquery2 = SQLquery2 + "Q24 = '" + Q24 + "', ";
										SQLquery2 = SQLquery2 + "Q25 = '" + Q25 + "', ";
										SQLquery2 = SQLquery2 + "Q26 = '" + Q26 + "', ";
										SQLquery2 = SQLquery2 + "Q31 = '" + Q31 + "', ";
										SQLquery2 = SQLquery2 + "Q32 = '" + Q32 + "', ";
										SQLquery2 = SQLquery2 + "Q33 = '" + Q33 + "', ";
										SQLquery2 = SQLquery2 + "Q41 = '" + Q41 + "', ";
										SQLquery2 = SQLquery2 + "LastUpdated = '" + LastUpdated + "' ";
										SQLquery2 = SQLquery2 + "WHERE session_id = '" + EventID + "' ";
										SQLquery2 = SQLquery2 + "AND AttendeeID = '" + AttendeeID + "' ";
										SQLquery2 = SQLquery2 + "AND evaluationType = '" + EvalType + "'";
										console.log('Database: evaluation query2: ' + SQLquery2);
										this.db.executeSql(SQLquery2, <any>{}).then((data2) => {
											console.log('Database: evaluation query2: ' + JSON.stringify(data2));
											if(data2.rowsAffected > 0) {
												DatabaseResponse.push({
													EVStatus: "Success",
													EVQuery: ""
												});
											} else {
												DatabaseResponse.push({
													EVStatus: "Fail",
													EVQuery: ""
												});
											}
											resolve(DatabaseResponse);
										})
										.catch(e => console.log('Database: Agenda query2 error: ' + JSON.stringify(e)))
									} else {
										SQLquery2 = "INSERT INTO evaluations (AttendeeID, session_id, evaluationType, Q11, Q12, Q21, Q22, Q23, Q24, Q25, Q26, Q31, Q32, Q33, Q41, LastUpdated, UpdateType) ";
										SQLquery2 = SQLquery2 + "VALUES ('" + AttendeeID + "', ";
										SQLquery2 = SQLquery2 + "'" + EventID + "', ";
										SQLquery2 = SQLquery2 + "'" + EvalType + "', ";
										SQLquery2 = SQLquery2 + "'" + Q11 + "', ";
										SQLquery2 = SQLquery2 + "'" + Q12 + "', ";
										SQLquery2 = SQLquery2 + "'" + Q21 + "', ";
										SQLquery2 = SQLquery2 + "'" + Q22 + "', ";
										SQLquery2 = SQLquery2 + "'" + Q23 + "', ";
										SQLquery2 = SQLquery2 + "'" + Q24 + "', ";
										SQLquery2 = SQLquery2 + "'" + Q25 + "', ";
										SQLquery2 = SQLquery2 + "'" + Q26 + "', ";
										SQLquery2 = SQLquery2 + "'" + Q31 + "', ";
										SQLquery2 = SQLquery2 + "'" + Q32 + "', ";
										SQLquery2 = SQLquery2 + "'" + Q33 + "', ";
										SQLquery2 = SQLquery2 + "'" + Q41 + "', ";
										SQLquery2 = SQLquery2 + "'" + LastUpdated + "', ";
										SQLquery2 = SQLquery2 + "'Insert')";
										console.log('Database: evaluation query2: ' + SQLquery2);

										this.db.executeSql(SQLquery2, <any>{}).then((data2) => {
											console.log('Database: evaluation query2: ' + JSON.stringify(data2));
											if(data2.rowsAffected > 0) {
												DatabaseResponse.push({
													EVStatus: "Success",
													EVQuery: ""
												});
											} else {
												DatabaseResponse.push({
													EVStatus: "Fail",
													EVQuery: ""
												});
											}
											resolve(DatabaseResponse);
										})
										.catch(e => console.log('Database: evaluation query2 error: ' + JSON.stringify(e)))
									}
								}
							}
							
						})
						.catch(e => console.log('Database: Evaluation query error: ' + JSON.stringify(e)))
					});
					console.log('Database: Evaluation query complete');

				});
				
			} else {
			
				console.log('Database: Conference Evaluation');

				// Perform query against server-based MySQL database
				var url = APIURLReference + "action=evalquery&flags=" + flags + "&AttendeeID=" + AttendeeID;
				
				return new Promise(resolve => {
					this.httpCall.get(url).subscribe(
						response => {resolve(response.json());
						},
						err => {
							if (err.status == "412") {
								console.log("App and API versions don't match.");
								var emptyJSONArray = {};
								resolve(emptyJSONArray);
							} else {
								console.log(err.status);
								console.log("API Error: ", err);
							}
						}
					);
				});
				
			}							
			
		} else {
			
			// Perform query against server-based MySQL database
			var url = APIURLReference + "action=evalquery&flags=" + flags + "&AttendeeID=" + AttendeeID;
			
			return new Promise(resolve => {
				this.httpCall.get(url).subscribe(
					response => {resolve(response.json());
					},
					err => {
						if (err.status == "412") {
							console.log("App and API versions don't match.");
							var emptyJSONArray = {};
							resolve(emptyJSONArray);
						} else {
							console.log(err.status);
							console.log("API Error: ", err);
						}
					}
				);
			});
			
		}
			
    }

	// -----------------------------------
	// 
	// Settings Database Functions
	// 
	// -----------------------------------
	public getSettingsData(flags, AttendeeID) {

		console.log("flags passed: " + flags);
				
		if (this.DevicePlatform == "iOS" || this.DevicePlatform == "Android") {
			
			var SQLquery = "SELECT DISTINCT c.session_id, c.course_id, c.session_title, ce.ceStatusScan, ce.ceStatusEval, c.ce_credits_type, ";
			SQLquery = SQLquery + "e.id AS Evaluated, c.CEcreditsL, c.CEcreditsP ";
			SQLquery = SQLquery + "FROM attendees_ces ce ";
			SQLquery = SQLquery + "INNER JOIN ce_courses_source c ON ce.session_id = c.session_id ";
			SQLquery = SQLquery + "ORDER BY c.course_id";

			console.log("Settings Query: " + SQLquery);

			// Perform query against local SQLite database
			return new Promise(resolve => {
				
				this.sqlite.create({name: 'cvPlanner.db', location: 'default', createFromLocation: 1}).then((db: SQLiteObject) => {

					console.log('Database: Opened DB for Settings query');
					
					this.db = db;
					
					console.log('Database: Set Settings query db variable');
					
					this.db.executeSql(SQLquery, <any>{}).then((data) => {
							console.log('Database: Settings query: ' + JSON.stringify(data));
							if (data.rows.length > 0) {
								console.log('Database: Settings query results exist');
							}
							console.log('Database: Settings query rows: ' + data.rows.length);
							resolve(data);
						}
					)
					.catch(e => console.log('Database: Settings query error: ' + JSON.stringify(e)))
				});
				console.log('Database: Settings query complete');

			});

			
		} else {
			
			// Perform query against server-based MySQL database
			var url = APIURLReference + "action=settings&flags=" + flags + "&AttendeeID=" + AttendeeID;

			return new Promise(resolve => {
				this.httpCall.get(url).subscribe(
					response => {resolve(response.json());
					},
					err => {
						if (err.status == "412") {
							console.log("App and API versions don't match.");
							var emptyJSONArray = {};
							resolve(emptyJSONArray);
						} else {
							console.log(err.status);
							console.log("API Error: ", err);
						}
					}
				);
			});
			
		}
			
    }

	// -----------------------------------
	// 
	// Program Guide Database Functions
	// 
	// -----------------------------------
	public getLecturesByDay(dayID, listingType, AttendeeID) {

		console.log("dayID passed: " + dayID);
		console.log("listingType passed: " + listingType);
		
		var selectedDate = dayID;    

		if (this.DevicePlatform == "iOS" || this.DevicePlatform == "Android") {
			
			// Set up base SQL string
			var SQLquery = "SELECT DISTINCT c.session_id, c.session_title, c.primary_speaker, c.other_speakers, c.session_start_time, c.session_end_time, ";
			SQLquery = SQLquery + "c.room_number AS RoomName, c.cs_credits, c.subject, c.room_capacity, s.itID AS OnAgenda, ";
			SQLquery = SQLquery + "(SELECT COUNT(acID) AS Attendees FROM attendee_courses ac WHERE ac.session_id = c.session_id) AS Attendees, ";
			//SQLquery = SQLquery + "(SELECT COUNT(acID) AS Attendees FROM attendee_courses ac WHERE ac.session_id = c.session_id AND ac.waitlist = 0) AS Attendees, ";
			SQLquery = SQLquery + "(SELECT CASE waitlist WHEN NULL THEN 0 ELSE waitlist END FROM attendee_courses ac2 WHERE ac2.session_id = c.session_id AND ac2.ct_id = '" + AttendeeID + "') AS Waitlist ";
			SQLquery = SQLquery + "FROM courses c ";
			SQLquery = SQLquery + "LEFT OUTER JOIN itinerary s ON s.EventID = c.session_id AND s.AttendeeID = '" + AttendeeID + "' AND s.UpdateType != 'Delete' ";

			//var SQLquery = "SELECT * FROM courses c ";
			
			// Append WHERE clause based on selection
			switch (listingType) {
				case "Lectures":
					SQLquery = SQLquery + "WHERE ce_credits_type = 'Lecture' AND ActiveYN = 'Y' ";
					SQLquery = SQLquery + "AND session_start_time LIKE '" + selectedDate + "%'";
					break;
				case "Participation":
					SQLquery = SQLquery + "WHERE ce_credits_type = 'Participation' AND ActiveYN = 'Y' ";
					SQLquery = SQLquery + "AND session_start_time LIKE '" + selectedDate + "%'";
					break;
				case "Receptions and Events":
					SQLquery = SQLquery + "WHERE ce_credits_type = '' AND ActiveYN = 'Y' ";
					SQLquery = SQLquery + "AND session_start_time LIKE '" + selectedDate + "%' ";
					SQLquery = SQLquery + "AND session_id NOT IN ('S-53928','S-53929','SE-203709','SE-226783','SE-226780','SE-226781','SE-226799') ";
					break;
				case "Exams":
					SQLquery = SQLquery + "WHERE ce_credits_type = '' AND ActiveYN = 'Y' ";
					SQLquery = SQLquery + "AND session_id IN ('S-55009','S-55010','SE-226783','SE-226780','SE-226781') ";
					break;
			}

			// Append sort order
			SQLquery = SQLquery + " ORDER BY c.session_start_time, c.course_id";

			console.log("Program Guide Query: " + SQLquery);

			// Perform query against local SQLite database
			return new Promise(resolve => {
				
				this.sqlite.create({name: 'cvPlanner.db', location: 'default', createFromLocation: 1}).then((db: SQLiteObject) => {

					console.log('Database: Opened DB for Program Guide query');
					
					this.db = db;
					
					console.log('Database: Set Program Guide query db variable');
					
					this.db.executeSql(SQLquery, <any>{}).then((data) => {
						console.log('Database: Program Guide query: ' + JSON.stringify(data));
						console.log('Database: Program Guide query rows: ' + data.rows.length);
						let DatabaseResponse = [];
						if(data.rows.length > 0) {
							for(let i = 0; i < data.rows.length; i++) {
								DatabaseResponse.push({
									session_id: data.rows.item(i).session_id,
									session_title: data.rows.item(i).session_title,
									session_start_time: data.rows.item(i).session_start_time,
									session_end_time: data.rows.item(i).session_end_time,
									primary_speaker: data.rows.item(i).primary_speaker,
									other_speakers: data.rows.item(i).other_speakers,
									cs_credits: data.rows.item(i).cs_credits,
									subject: data.rows.item(i).subject,
									room_capacity: data.rows.item(i).room_capacity,
									OnAgenda: data.rows.item(i).OnAgenda,
									Attendees: data.rows.item(i).Attendees,
									Waitlist: data.rows.item(i).Waitlist,
									RoomName: data.rows.item(i).RoomName
								});
							}
						}
						resolve(DatabaseResponse);
					})
					.catch(e => console.log('Database: Program Guide query error: ' + JSON.stringify(e)))
				});
				console.log('Database: Program Guide query complete');
				
			});

			
		} else {
			
			// Perform query against server-based MySQL database
			var flags = dayID + "|" + listingType;
			var url = APIURLReference + "action=programdays&flags=" + flags + "&AttendeeID=" + AttendeeID;
			console.log('URL: ' + url);
			
			return new Promise(resolve => {
				this.httpCall.get(url).subscribe(
					response => {resolve(response.json());
					},
					err => {
						if (err.status == "412") {
							console.log("App and API versions don't match.");
							var emptyJSONArray = {};
							resolve(emptyJSONArray);
						} else {
							console.log(err.status);
							console.log("API Error: ", err);
						}
					}
				);
			});
			
		}
			
	}

	public getLectureData(flags, AttendeeID) {

		console.log("Database: getLectureData: flags passed: " + flags);
		var SQLquery = "";
		
		if (this.DevicePlatform == "iOS" || this.DevicePlatform == "Android") {
			
			var flagValues = flags.split("|");		// Split concatenated values
			var listingType = flagValues[0];			// Listing Type
			var selectedDate = flagValues[1];    		// Specific date of sessions
			var sortOrder = flagValues[2];    		// Output sort order
			var sessionID = flagValues[3];			// Specific course ID
			var searchParams = flagValues[4];			// Search parameters
			var searchType = flagValues[5];			// Search type
			
			if (listingType == "li") {	// List of sessions
			
				SQLquery = "SELECT DISTINCT c.session_id, c.session_title, c.primary_speaker, c.other_speakers, c.session_start_time, c.session_end_time, ";
				SQLquery = SQLquery + "c.room_number AS RoomName, c.cs_credits, c.subject, c.room_capacity, s.itID AS OnAgenda, ";
				SQLquery = SQLquery + "(SELECT COUNT(acID) AS Attendees FROM attendee_courses ac WHERE ac.session_id = c.session_id) AS Attendees, ";
				SQLquery = SQLquery + "(SELECT CASE waitlist WHEN NULL THEN 0 ELSE waitlist END FROM attendee_courses ac2 WHERE ac2.session_id = c.session_id AND ac2.ct_id = '" + AttendeeID + "') AS Waitlist ";
				SQLquery = SQLquery + "FROM courses c ";
				SQLquery = SQLquery + "LEFT OUTER JOIN itinerary s ON s.EventID = c.session_id AND s.AttendeeID = '" + AttendeeID + "' AND s.UpdateType != 'Delete' ";

				// Append WHERE clause based on selection
				switch (listingType) {
					case "Lectures":
						SQLquery = SQLquery + "WHERE ce_credits_type = 'Lecture' AND ActiveYN = 'Y' ";
						SQLquery = SQLquery + "AND session_start_time LIKE '" + selectedDate + "%' ";
						break;
					case "Participation":
						SQLquery = SQLquery + "WHERE ce_credits_type = 'Participation' AND ActiveYN = 'Y' ";
						SQLquery = SQLquery + "AND session_start_time LIKE '" + selectedDate + "%' ";
						break;
					case "Receptions and Events":
						SQLquery = SQLquery + "WHERE ce_credits_type = '' AND ActiveYN = 'Y' ";
						SQLquery = SQLquery + "AND session_start_time LIKE '" + selectedDate + "%' ";
						SQLquery = SQLquery + "AND session_id NOT IN ('S-53928','S-53929','SE-203709','SE-226783','SE-226780','SE-226781') ";
						break;
					case "Exams":
						SQLquery = SQLquery + "WHERE ce_credits_type = '' AND ActiveYN = 'Y' ";
						SQLquery = SQLquery + "AND session_start_time LIKE '" + selectedDate + "%' ";
						SQLquery = SQLquery + "AND session_id IN ('S-55009','S-55010','SE-226783','SE-226780','SE-226781') ";
						break;
				}

				// Append sort order
				SQLquery = SQLquery + " ORDER BY c.session_start_time, c.course_id";
				
			}

			if (listingType == "li3") {	// All sessions list
				SQLquery = "SELECT DISTINCT c.session_id, c.session_title, c.primary_speaker, c.other_speakers, c.session_start_time, c.session_end_time, ";
				SQLquery = SQLquery + "lr.RoomDisplayName, c.room_capacity, ";
				SQLquery = SQLquery + "(SELECT COUNT(acID) AS Attendees ";
				SQLquery = SQLquery + "  FROM attendee_courses it ";
				SQLquery = SQLquery + "  WHERE it.session_id = c.session_id ";
				SQLquery = SQLquery + "  ) AS Attendees ";
				SQLquery = SQLquery + "FROM courses c ";
				SQLquery = SQLquery + "INNER JOIN lookup_rooms lr ON c.room_number = lr.RoomName ";

				SQLquery = SQLquery + "AND session_start_time LIKE '" + selectedDate + "%' ";
				
				// Append sort order
				SQLquery = SQLquery + " ORDER BY c.session_start_time, c.session_id";

			}

			if (listingType == "sr") {	// Search sessions
			
				// Split search terms by space to create WHERE clause
				var whereClause = 'WHERE (';
				var searchTerms = searchParams.split(" ");
				for (var index = 0; index < searchTerms.length; index++){
					whereClause = whereClause + 'c.SearchField LIKE "%' + searchTerms[index] + '%" AND ';
				}
				// Remove last AND from where clause
				whereClause = whereClause.substring(0, whereClause.length-5);
				whereClause = whereClause + ') AND (';
				
				switch(searchType) {
					case "L":
						whereClause = whereClause + 'c.course_id LIKE "A%" ';
						whereClause = whereClause + 'OR c.course_id LIKE "L%") ';
						break;
					case "P":
						whereClause = whereClause + 'c.course_id LIKE "W%") ';
						break;
					case "OE":
						whereClause = whereClause + "ce_credits_type = '' ";
						whereClause = whereClause + "AND session_id NOT IN ('S-53928','S-53929','SE-143825','SE-143839','SE-156024','SE-168473','SE-226783','SE-226780','SE-226781')) ";
						break;
				}

				// Set up base SQL string
				SQLquery = "SELECT DISTINCT c.session_id, c.session_title, c.primary_speaker, c.other_speakers, c.session_start_time, c.session_end_time, ";
				SQLquery = SQLquery + "c.room_number AS RoomName, c.cs_credits, c.subject ";
				SQLquery = SQLquery + "FROM courses c ";
				SQLquery = SQLquery + whereClause;
				SQLquery = SQLquery + " ORDER BY c.session_start_time, c.course_id";

			}

			if (listingType == "dt") {	// Details of session
			
				// Validate query
				SQLquery = "SELECT DISTINCT c.session_id, c.session_title, c.session_start_time, c.session_end_time, c.speaker_host_emcee, c.corporate_supporter, c.session_recording, ";
				SQLquery = SQLquery + "c.primary_speaker, c.other_speakers, c.room_number AS RoomName, lr.FloorNumber, lr.RoomX, lr.RoomY, c.description, c.course_id, c.ce_credits_type, c.HandoutFilename, ";
				SQLquery = SQLquery + "c.subject, c.[type] AS CourseType, c.[level] AS CourseLevel, c.cs_credits, c.CEcreditsL, c.CEcreditsP, c.room_capacity, s.itID AS OnAgenda, ";
				SQLquery = SQLquery + "(SELECT COUNT(acID) AS Attendees FROM attendee_courses ac WHERE ac.session_id = c.session_id) AS Attendees, ";
				SQLquery = SQLquery + "(SELECT CASE waitlist WHEN NULL THEN 0 ELSE waitlist END FROM attendee_courses ac2 WHERE ac2.session_id = c.session_id AND ac2.ct_id = '" + AttendeeID + "') AS Waitlist ";
				SQLquery = SQLquery + "FROM courses c ";
				SQLquery = SQLquery + "LEFT OUTER JOIN itinerary s ON s.EventID = c.session_id AND s.AttendeeID = " + AttendeeID + " ";
				SQLquery = SQLquery + "LEFT OUTER JOIN lookup_rooms lr ON c.room_number = lr.RoomName ";
				SQLquery = SQLquery + "WHERE c.session_id = '" + sessionID + "' ";

			}
	
			console.log("Lecture Query: " + SQLquery);

			// Perform query against local SQLite database
			return new Promise(resolve => {
				
				this.sqlite.create({name: 'cvPlanner.db', location: 'default', createFromLocation: 1}).then((db: SQLiteObject) => {

					console.log('Database: Opened DB for Lecture query');
					
					this.db = db;
					
					console.log('Database: Set Lecture query db variable');
					
					this.db.executeSql(SQLquery, <any>{}).then((data) => {
						console.log('Database: Speaker query: ' + JSON.stringify(data));
						console.log('Database: Speaker query rows: ' + data.rows.length);
						let DatabaseResponse = [];
						if(data.rows.length > 0) {
							for(let i = 0; i < data.rows.length; i++) {
								if (listingType == "li") {
									DatabaseResponse.push({
										session_id: data.rows.item(i).session_id,
										session_title: data.rows.item(i).session_title,
										session_start_time: data.rows.item(i).session_start_time,
										session_end_time: data.rows.item(i).session_end_time,
										primary_speaker: data.rows.item(i).primary_speaker,
										other_speakers: data.rows.item(i).other_speakers,
										RoomName: data.rows.item(i).RoomName,
										cs_credits: data.rows.item(i).cs_credits,
										subject: data.rows.item(i).subject,
										room_capacity: data.rows.item(i).room_capacity,
										OnAgenda: data.rows.item(i).OnAgenda,
										Attendees: data.rows.item(i).Attendees,
										Waitlist: data.rows.item(i).Waitlist
									});
								}
								if (listingType == "li3") {
									DatabaseResponse.push({
										session_id: data.rows.item(i).session_id,
										session_title: data.rows.item(i).session_title,
										session_start_time: data.rows.item(i).session_start_time,
										session_end_time: data.rows.item(i).session_end_time,
										primary_speaker: data.rows.item(i).primary_speaker,
										other_speakers: data.rows.item(i).other_speakers,
										RoomName: data.rows.item(i).RoomDisplayName,
										room_capacity: data.rows.item(i).room_capacity,
										Attendees: data.rows.item(i).Attendees
									});
								}
								if (listingType == "sr") {
									DatabaseResponse.push({
										session_id: data.rows.item(i).session_id,
										session_title: data.rows.item(i).session_title,
										session_start_time: data.rows.item(i).session_start_time,
										session_end_time: data.rows.item(i).session_end_time,
										primary_speaker: data.rows.item(i).primary_speaker,
										other_speakers: data.rows.item(i).other_speakers,
										RoomName: data.rows.item(i).RoomName,
										cs_credits: data.rows.item(i).cs_credits,
										subject: data.rows.item(i).subject
									});
								}
								if (listingType == "dt") {
									DatabaseResponse.push({
										session_id: data.rows.item(i).session_id,
										session_title: data.rows.item(i).session_title,
										session_start_time: data.rows.item(i).session_start_time,
										session_end_time: data.rows.item(i).session_end_time,
										primary_speaker: data.rows.item(i).primary_speaker,
										other_speakers: data.rows.item(i).other_speakers,
										RoomName: data.rows.item(i).RoomName,
										RoomX: data.rows.item(i).RoomX,
										RoomY: data.rows.item(i).RoomY,
										cs_credits: data.rows.item(i).cs_credits,
										subject: data.rows.item(i).subject,
										room_capacity: data.rows.item(i).room_capacity,
										OnAgenda: data.rows.item(i).OnAgenda,
										Attendees: data.rows.item(i).Attendees,
										Waitlist: data.rows.item(i).Waitlist,
										speaker_host_emcee: data.rows.item(i).speaker_host_emcee,
										corporate_supporter: data.rows.item(i).corporate_supporter,
										session_recording: data.rows.item(i).session_recording,
										description: data.rows.item(i).description,
										course_id: data.rows.item(i).course_id,
										ce_credits_type: data.rows.item(i).ce_credits_type,
										HandoutFilename: data.rows.item(i).HandoutFilename,
										CourseType: data.rows.item(i).CourseType,
										CourseLevel: data.rows.item(i).CourseLevel,
										CEcreditsL: data.rows.item(i).CEcreditsL,
										CEcreditsP: data.rows.item(i).CEcreditsP
									});
								}
							}
						}
						resolve(DatabaseResponse);
					})
					.catch(e => console.log('Database: Lecture query error: ' + JSON.stringify(e)))
				});
				console.log('Database: Lecture query complete');

			});

			
		} else {
			
			// Perform query against server-based MySQL database
			var url = APIURLReference + "action=lecturequery&flags=" + flags + "&AttendeeID=" + AttendeeID;

			return new Promise(resolve => {
				this.httpCall.get(url).subscribe(
					response => {resolve(response.json());
					},
					err => {
						if (err.status == "412") {
							console.log("App and API versions don't match.");
							var emptyJSONArray = {};
							resolve(emptyJSONArray);
						} else {
							console.log(err.status);
							console.log("API Error: ", err);
						}
					}
				);
			});
			
		}
			
    }
	
	// -----------------------------------
	// 
	// Speaker / Educator Database Functions
	// 
	// -----------------------------------
	public getSpeakerData(flags, AttendeeID) {

		console.log("getSpeakerData: flags passed: " + flags);
		var SQLquery = "";
		var SQLquery2 = "";
		var SQLquery3 = "";
		var SQLquery4 = "";
		
		if (this.DevicePlatform == "iOS" || this.DevicePlatform == "Android") {

			var flagValues = flags.split("|");		// Split concatenated values
			var listingType = flagValues[0];		// Listing Type
			var sortOrder = flagValues[1];    		// Output sort order
			var speakerID = flagValues[2];			// Specific speaker ID
			var QueryParam = flagValues[3] || '';	// Course parameters for speaker details
			var courseID = flagValues[4] || '';		// Specific course ID for list of linked speakers

			if (listingType == "li" || listingType == "sr") {	// List of speakers

				// Validate query
				SQLquery = "SELECT DISTINCT s.speakerID, s.LastName, s.FirstName, s.Credentials, s.Bio, s.Courses, s.imageFilename ";
				SQLquery = SQLquery + "FROM courses_speakers s ";
				if (listingType == "sr") {		// If searching, then add where clause criteria
				
					// Split search terms by space to create WHERE clause
					var whereClause = 'WHERE (';
					var whereClause2 = 'WHERE (';
					var whereClause3 = 'WHERE (';
					var whereClause4 = 'WHERE (';
					var searchTerms = QueryParam.split(" ");
					
					for (var i = 0; i < searchTerms.length; i++){
						whereClause = whereClause + 's.SearchField LIKE "%' + searchTerms[i] + '%" AND ';
						whereClause2 = whereClause2 + 'c2.SearchField LIKE "%' + searchTerms[i] + '%" AND ';
						whereClause3 = whereClause3 + 'c3.SearchField LIKE "%' + searchTerms[i] + '%" AND ';
						whereClause4 = whereClause4 + 'c4.SearchField LIKE "%' + searchTerms[i] + '%" AND ';
					}
					// Remove last AND from where clause
					whereClause = whereClause.substring(0, whereClause.length-5);        
					whereClause = whereClause + ') ';

					whereClause2 = whereClause2.substring(0, whereClause2.length-5);        
					whereClause2 = whereClause2 + ') AND (';

					whereClause3 = whereClause3.substring(0, whereClause3.length-5);        
					whereClause3 = whereClause3 + ') AND (';

					whereClause4 = whereClause4.substring(0, whereClause4.length-5);        
					whereClause4 = whereClause4 + ') AND (';

					SQLquery = SQLquery + whereClause ;
					
					
					whereClause2 = whereClause2 + 'c2.course_id LIKE "A%" ';
					whereClause2 = whereClause2 + 'OR c2.course_id LIKE "L%")) ';
					
					whereClause3 = whereClause3 + 'c3.course_id LIKE "W%")) ';
					
					whereClause4 = whereClause4 + "c4.ce_credits_type = '' ";
					whereClause4 = whereClause4 + "AND c4.session_id NOT IN ('S-53928','S-53929','SE-143825','SE-143839','SE-156024','SE-168473','SE-226783','SE-226780','SE-226781'))) ";

					// Set up base SQL string
					SQLquery2 = "SELECT DISTINCT s2.speakerID, s2.LastName, s2.FirstName, s2.Credentials, s2.Bio, s2.Courses, s2.imageFilename ";
					SQLquery2 = SQLquery2 + "FROM courses_speakers s2 ";
					SQLquery2 = SQLquery2 + "INNER JOIN courses_speakers_links csl2 ON csl2.speakerID = s2.speakerID ";
					SQLquery2 = SQLquery2 + "WHERE csl2.session_id IN (";
					SQLquery2 = SQLquery2 + "SELECT DISTINCT c2.session_id ";
					SQLquery2 = SQLquery2 + "FROM courses c2 ";
					SQLquery2 = SQLquery2 + whereClause2;
					
					SQLquery3 = "SELECT DISTINCT s3.speakerID, s3.LastName, s3.FirstName, s3.Credentials, s3.Bio, s3.Courses, s3.imageFilename ";
					SQLquery3 = SQLquery3 + "FROM courses_speakers s3 ";
					SQLquery3 = SQLquery3 + "INNER JOIN courses_speakers_links csl3 ON csl3.speakerID = s3.speakerID ";
					SQLquery3 = SQLquery3 + "WHERE csl3.session_id IN (";
					SQLquery3 = SQLquery3 + "SELECT DISTINCT c3.session_id ";
					SQLquery3 = SQLquery3 + "FROM courses c3 ";
					SQLquery3 = SQLquery3 + whereClause3;
					
					SQLquery4 = "SELECT DISTINCT s4.speakerID, s4.LastName, s4.FirstName, s4.Credentials, s4.Bio, s4.Courses, s4.imageFilename ";
					SQLquery4 = SQLquery4 + "FROM courses_speakers s4 ";
					SQLquery4 = SQLquery4 + "INNER JOIN courses_speakers_links csl4 ON csl4.speakerID = s4.speakerID ";
					SQLquery4 = SQLquery4 + "WHERE csl4.session_id IN (";
					SQLquery4 = SQLquery4 + "SELECT DISTINCT c4.session_id ";
					SQLquery4 = SQLquery4 + "FROM courses c4 ";
					SQLquery4 = SQLquery4 + whereClause4;
				
					// UNION concatenate the queries together
					SQLquery = SQLquery + " UNION ";
					SQLquery = SQLquery + SQLquery2;
					SQLquery = SQLquery + " UNION ";
					SQLquery = SQLquery + SQLquery3;
					SQLquery = SQLquery + " UNION ";
					SQLquery = SQLquery + SQLquery4;
					SQLquery = SQLquery + " ";
					
				}
				
				// Order by clause
				SQLquery = SQLquery + "ORDER BY LastName, FirstName";

			}

			if (listingType == "dt") {	// Details of speaker
			
				// Validate query
				SQLquery = "SELECT DISTINCT s.speakerID, s.LastName, s.FirstName, s.Credentials, s.Bio, s.Courses, s.imageFilename ";
				SQLquery = SQLquery + "FROM courses_speakers s ";
				SQLquery = SQLquery + "WHERE speakerID = " + speakerID + " ";
			
			}

			if (listingType == "cl") {	// Course listing for specific speaker
			
				// Validate query
				SQLquery = "SELECT DISTINCT c.session_id, c.session_title, c.session_start_time, c.session_end_time, c.room_number AS RoomName ";
				SQLquery = SQLquery + "FROM courses c ";
				SQLquery = SQLquery + "WHERE c.course_id IN " + QueryParam + " ";

			}

			if (listingType == "cd") {	// List of speakers for specific course
			
				// Validate query
				SQLquery = "SELECT DISTINCT s.speakerID, s.FirstName, s.LastName, s.Credentials, s.Bio, s.Courses, s.imageFilename ";
				SQLquery = SQLquery + "FROM courses_speakers s ";
				SQLquery = SQLquery + "WHERE s.Courses LIKE '%" + courseID + "%' ";
				SQLquery = SQLquery + "ORDER BY s.LastName, s.FirstName";

			}
	
			console.log("Speaker Query: " + SQLquery);

			// Perform query against local SQLite database
			return new Promise(resolve => {
				
				this.sqlite.create({name: 'cvPlanner.db', location: 'default', createFromLocation: 1}).then((db: SQLiteObject) => {

					console.log('Database: Opened DB for Speaker query');
					
					this.db = db;
					
					console.log('Database: Set Speaker query db variable');
					
					if (listingType == "cl") {
						
						this.db.executeSql(SQLquery, <any>{}).then((data) => {
							console.log('Database: Speaker query: ' + JSON.stringify(data));
							console.log('Database: Speaker query rows: ' + data.rows.length);
							let DatabaseResponse = [];
							if(data.rows.length > 0) {
								for(let i = 0; i < data.rows.length; i++) {
									DatabaseResponse.push({
										session_id: data.rows.item(i).session_id,
										session_title: data.rows.item(i).session_title,
										session_start_time: data.rows.item(i).session_start_time,
										session_end_time: data.rows.item(i).session_end_time,
										RoomName: data.rows.item(i).RoomName
									});
								}
							}
							resolve(DatabaseResponse);
						})
						.catch(e => console.log('Database: Speaker query error: ' + JSON.stringify(e)))
						
					} else {
						
						this.db.executeSql(SQLquery, <any>{}).then((data) => {
							console.log('Database: Speaker query: ' + JSON.stringify(data));
							console.log('Database: Speaker query rows: ' + data.rows.length);
							let DatabaseResponse = [];
							if(data.rows.length > 0) {
								var Biography = '';
								for(let i = 0; i < data.rows.length; i++) {
									Biography = data.rows.item(i).Bio;
									Biography = Biography.replace(/\\/gi, '');
									DatabaseResponse.push({
										speakerID: data.rows.item(i).speakerID,
										FirstName: data.rows.item(i).FirstName,
										LastName: data.rows.item(i).LastName,
										Credentials: data.rows.item(i).Credentials,
										Bio: Biography,
										Courses: data.rows.item(i).Courses,
										imageFilename: data.rows.item(i).imageFilename
									});
								}
							}
							resolve(DatabaseResponse);
						})
						.catch(e => console.log('Database: Speaker query error: ' + JSON.stringify(e)))
						
					}
				});
				console.log('Database: Speaker query complete');

			});

		} else {
			
			// Perform query against server-based MySQL database
			var url = APIURLReference + "action=spkrquery&flags=" + flags + "&AttendeeID=" + AttendeeID;

			return new Promise(resolve => {
				this.httpCall.get(url).subscribe(
					response => {resolve(response.json());
					},
					err => {
						if (err.status == "412") {
							console.log("App and API versions don't match.");
							var emptyJSONArray = {};
							resolve(emptyJSONArray);
						} else {
							console.log(err.status);
							console.log("API Error: ", err);
						}
					}
				);
			});
			
		}
			
    }

	// -----------------------------------
	// 
	// Exhibitor Database Functions
	// 
	// -----------------------------------
	public getExhibitorData(flags) {

		console.log("flags passed: " + flags);
		var SQLquery = "";
				
		if (this.DevicePlatform == "iOS" || this.DevicePlatform == "Android") {
			
			var flagValues = flags.split("|");
			var listingType = flagValues[0];
			var sortOrder = flagValues[1];
			var exhibitorID = flagValues[2];
			var QueryParam = flagValues[3] || '';			// Search parameters for exhibitors

			if (listingType == "li" || listingType == "sr") {	// List of exhibitors
		
				// Validate query
				SQLquery = "SELECT DISTINCT e.ExhibitorID, e.CompanyName, e.AddressLine1, e.AddressLine2, e.City, e.State, e.ZipPostalCode, e.Country, ";
				SQLquery = SQLquery + "e.Website, e.PrimaryOnsiteContactName, e.PrimaryOnsiteContactEmail, e.PrimaryOnsiteContactPhone, ";
				SQLquery = SQLquery + "e.BoothNumber, bm.BoothX, bm.BoothY, e.imageFilename, "; 
				SQLquery = SQLquery + "e.ProductsServices, e.CompanyDescription, ";
				SQLquery = SQLquery + "e.SocialMediaFacebook, e.SocialMediaTwitter, e.SocialMediaGooglePlus, e.SocialMediaYouTube, e.SocialMediaLinkedIn ";
				SQLquery = SQLquery + "FROM exhibitors e ";
				SQLquery = SQLquery + "LEFT OUTER JOIN booth_mapping bm ON bm.BoothNumber = e.BoothNumber ";

				if (listingType == "sr") {		// If searching, then add where clause criteria

					// Split search terms by space to create WHERE clause
					var whereClause = 'WHERE (';
					var searchTerms = QueryParam.split(" ");
					
					for (var i = 0; i < searchTerms.length; i++){
						whereClause = whereClause + 'e.SearchField LIKE "%' + searchTerms[i] + '%" AND ';
					}
					// Remove last AND from where clause
					whereClause = whereClause.substring(0, whereClause.length-5);
					whereClause = whereClause + ') ';

					SQLquery = SQLquery + whereClause;
					SQLquery = SQLquery + " ORDER BY CompanyName";

				} else {
			
					if (sortOrder == "Alpha") {
						SQLquery = SQLquery + " ORDER BY CompanyName";
					} else {
						SQLquery = SQLquery + " ORDER BY BoothNumber";
					}
			
				}

			}
		
			if (listingType == "dt") {	// Exhibitor details
			
				// Validate query
				SQLquery = "SELECT e.ExhibitorID, e.CompanyName, e.AddressLine1, e.AddressLine2, e.City, e.State, e.ZipPostalCode, e.Country,  ";
				SQLquery = SQLquery + "e.Website, e.PrimaryOnsiteContactName, e.PrimaryOnsiteContactEmail, e.PrimaryOnsiteContactPhone, ";
				SQLquery = SQLquery + "e.BoothNumber, bm.BoothX, bm.BoothY, e.imageFilename, ";
				SQLquery = SQLquery + "e.ProductsServices, e.CompanyDescription, ";
				SQLquery = SQLquery + "e.SocialMediaFacebook, e.SocialMediaTwitter, e.SocialMediaGooglePlus, e.SocialMediaYouTube, e.SocialMediaLinkedIn ";
				SQLquery = SQLquery + "FROM exhibitors e ";
				SQLquery = SQLquery + "LEFT OUTER JOIN booth_mapping bm ON bm.BoothNumber = e.BoothNumber ";
				SQLquery = SQLquery + "WHERE e.ExhibitorID = " + exhibitorID;

			}
	
			console.log("Exhibitor Query: " + SQLquery);

			// Perform query against local SQLite database
			return new Promise(resolve => {
				
				this.sqlite.create({name: 'cvPlanner.db', location: 'default', createFromLocation: 1}).then((db: SQLiteObject) => {

					console.log('Database: Opened DB for Exhibitor query');
					
					this.db = db;
					
					console.log('Database: Set Exhibitor query db variable');
					
					this.db.executeSql(SQLquery, <any>{}).then((data) => {
						console.log('Database: Exhibitor query: ' + JSON.stringify(data));
						console.log('Database: Exhibitor query rows: ' + data.rows.length);
						let DatabaseResponse = [];
						if(data.rows.length > 0) {
							for(let i = 0; i < data.rows.length; i++) {
								DatabaseResponse.push({
									ExhibitorID: data.rows.item(i).ExhibitorID,
									CompanyName: data.rows.item(i).CompanyName,
									AddressLine1: data.rows.item(i).AddressLine1,
									AddressLine2: data.rows.item(i).AddressLine2,
									City: data.rows.item(i).City,
									State: data.rows.item(i).State,
									ZipPostalCode: data.rows.item(i).ZipPostalCode,
									Country: data.rows.item(i).Country,
									Website: data.rows.item(i).Website,
									PrimaryOnsiteContactName: data.rows.item(i).PrimaryOnsiteContactName,
									PrimaryOnsiteContactEmail: data.rows.item(i).PrimaryOnsiteContactEmail,
									PrimaryOnsiteContactPhone: data.rows.item(i).PrimaryOnsiteContactPhone,
									BoothNumber: data.rows.item(i).BoothNumber,
									BoothX: data.rows.item(i).BoothX,
									BoothY: data.rows.item(i).BoothY,
									imageFilename: data.rows.item(i).imageFilename,
									ProductsServices: data.rows.item(i).ProductsServices,
									CompanyDescription: data.rows.item(i).CompanyDescription,
									SocialMediaFacebook: data.rows.item(i).SocialMediaFacebook,
									SocialMediaTwitter: data.rows.item(i).SocialMediaTwitter,
									SocialMediaGooglePlus: data.rows.item(i).SocialMediaGooglePlus,
									SocialMediaYouTube: data.rows.item(i).SocialMediaYouTube,
									SocialMediaLinkedIn: data.rows.item(i).SocialMediaLinkedIn
								});
							}
						}
						resolve(DatabaseResponse);
					})
					.catch(e => console.log('Database: Exhibitor query error: ' + JSON.stringify(e)))
				});
				console.log('Database: Exhibitor query complete');

			});

			
		} else {
			
			// Perform query against server-based MySQL database
			var url = APIURLReference + "action=exhquery&flags=" + flags;

			return new Promise(resolve => {
				this.httpCall.get(url).subscribe(
					response => {resolve(response.json());
					},
					err => {
						if (err.status == "412") {
							console.log("App and API versions don't match.");
							var emptyJSONArray = {};
							resolve(emptyJSONArray);
						} else {
							console.log(err.status);
							console.log("API Error: ", err);
						}
					}
				);
			});
			
		}
			
    }

	// -----------------------------------
	// 
	// Agenda Database Functions
	// 
	// -----------------------------------
	public getAgendaData(flags, AttendeeID) {

		console.log("Database: flags passed: " + flags);
		console.log("Database: AttendeeID passed: " + AttendeeID);

		var re = /\'/gi; 

		var flagValues = flags.split("|");
		var listingType = flagValues[0];
		var selectedDay = flagValues[1];
		var EventID = flagValues[2];
		var EventStartTime = flagValues[3];
		var EventEndTime = flagValues[4];
		var EventLocation = flagValues[5];
		//EventLocation = EventLocation.replace(re, "''");
		var EventName = flagValues[6];
		//EventName = EventName.replace(re, "''");
		var EventDate = flagValues[7];
		var AAOID = flagValues[8];
		var LastUpdated = flagValues[9];
		var EventDescription = flagValues[10];
		//EventDescription = EventDescription.replace(re, "''");
		var SQLquery = "";

		
		if (this.DevicePlatform == "iOS" || this.DevicePlatform == "Android") {

			if (LastUpdated == 'NA') {
				var currentdate = new Date();
				var datetime = currentdate.getFullYear() + '-' + ('0' + (currentdate.getMonth()+1)).slice(-2) + '-' + ('0' + currentdate.getDay()).slice(-2) + ' ';
				datetime = datetime	+ ('0' + currentdate.getHours()).slice(-2) + ":" + ('0' + currentdate.getMinutes()).slice(-2) + ":" + ('0' + currentdate.getSeconds()).slice(-2);
				LastUpdated = datetime;
			}
		
			// Official sessions
			if (listingType == "li") {	// List of agenda items
			
				// Validate query
				SQLquery = "SELECT DISTINCT itID, EventID, mtgID, Time_Start AS EventStartTime, Time_End AS EventEndTime, Location AS EventLocation, Description AS EventDescription, SUBJECT AS EventName, Date_Start AS EventDate, '0' AS Attendees, '0' AS Waitlist, '100' AS RoomCapacity ";
				SQLquery = SQLquery + "FROM itinerary WHERE Date_Start = '" + selectedDay + "' AND AttendeeID = '" + AttendeeID + "' ";
				SQLquery = SQLquery + "AND EventID = '0' ";
				SQLquery = SQLquery + "AND UpdateType NOT LIKE 'Delete%' ";
				SQLquery = SQLquery + "UNION ";
				SQLquery = SQLquery + "SELECT DISTINCT '0' AS itID, c.session_id AS EventID, NULL AS mtgID, TIME(session_start_time) AS EventStartTime, TIME(session_end_time) AS EventEndTime, c.room_number AS EventLocation,  ";
				SQLquery = SQLquery + "c.Description AS EventDescription, c.session_title AS EventName, DATE(session_start_time) AS EventDate, ";
				SQLquery = SQLquery + "(SELECT COUNT(acID) AS Attendees FROM attendee_courses ac ";
				SQLquery = SQLquery + " INNER JOIN courses c ON ac.session_id = c.session_id ";
				SQLquery = SQLquery + " WHERE ac.session_id = i.session_id) AS Attendees, ";
				SQLquery = SQLquery + " (SELECT CASE waitlist WHEN NULL THEN 0 ELSE waitlist END FROM attendee_courses ac2 ";
				SQLquery = SQLquery + " INNER JOIN courses c2 ON ac2.session_id = c2.session_id ";
				SQLquery = SQLquery + " WHERE ac2.session_id = c.session_id AND ac2.ct_id = '" + AttendeeID + "') AS Waitlist, ";
				SQLquery = SQLquery + " (SELECT room_capacity FROM courses c3 WHERE c3.session_id = i.session_id) AS RoomCapacity ";
				SQLquery = SQLquery + "FROM attendee_courses i ";
				SQLquery = SQLquery + "INNER JOIN courses c ON i.session_id = c.session_id ";
				SQLquery = SQLquery + "WHERE DATE(session_start_time) = '" + selectedDay + "' AND i.ct_id = '" + AttendeeID + "' ";
				SQLquery = SQLquery + "AND i.session_id != '0' ";
				SQLquery = SQLquery + "AND c.ActiveYN = 'Y' ";
				SQLquery = SQLquery + "ORDER BY EventStartTime, EventID ";

				// Validate query (Version 2 2019-04-17)
				SQLquery = "SELECT DISTINCT itID, EventID, mtgID, Time_Start AS EventStartTime, Time_End AS EventEndTime, Location AS EventLocation, Description AS EventDescription, SUBJECT AS EventName, Date_Start AS EventDate, '0' AS Attendees, '0' AS Waitlist, '100' AS RoomCapacity ";
				SQLquery = SQLquery + "FROM itinerary WHERE Date_Start = '" + selectedDay + "' AND AttendeeID = '" + AttendeeID + "' ";
				SQLquery = SQLquery + "AND EventID = '0' ";
				SQLquery = SQLquery + "AND UpdateType NOT LIKE 'Delete%' ";
				SQLquery = SQLquery + "UNION ";
				SQLquery = SQLquery + "SELECT DISTINCT '0' AS itID, c.session_id AS EventID, NULL AS mtgID, TIME(session_start_time) AS EventStartTime, ";
				SQLquery = SQLquery + "TIME(session_end_time) AS EventEndTime, lr.RoomDisplayname AS EventLocation, ";
				SQLquery = SQLquery + "c.Description AS EventDescription, c.session_title AS EventName, DATE(session_start_time) AS EventDate, ";
				SQLquery = SQLquery + "(SELECT COUNT(acID) AS Attendees FROM attendee_courses ac ";
				SQLquery = SQLquery + "INNER JOIN courses c ON ac.session_id = c.session_id ";
				SQLquery = SQLquery + "WHERE ac.session_id = i.session_id) AS Attendees, ";
				SQLquery = SQLquery + "(SELECT CASE waitlist WHEN NULL THEN 0 ELSE waitlist END FROM attendee_courses ac2 ";
				SQLquery = SQLquery + "INNER JOIN courses c2 ON ac2.session_id = c2.session_id   ";
				SQLquery = SQLquery + "WHERE ac2.session_id = c.session_id AND ac2.ct_id = '" + AttendeeID + "') AS Waitlist, ";
				SQLquery = SQLquery + "(SELECT room_capacity FROM courses c3 ";
				SQLquery = SQLquery + "WHERE c3.session_id = i.session_id) AS RoomCapacity ";
				SQLquery = SQLquery + "FROM attendee_courses i ";
				SQLquery = SQLquery + "INNER JOIN courses c ON i.session_id = c.session_id ";
				SQLquery = SQLquery + "LEFT OUTER JOIN lookup_rooms lr ON lr.RoomName = c.room_number ";
				SQLquery = SQLquery + "WHERE DATE(session_start_time) = '" + selectedDay + "' AND i.ct_id = '" + AttendeeID + "' ";
				SQLquery = SQLquery + "AND i.session_id != '0' ";
				SQLquery = SQLquery + "AND c.ActiveYN = 'Y' ";

				SQLquery = SQLquery + "ORDER BY EventStartTime, EventID ";

			}

			// Official sessions
			if (listingType == "li2") {	// List of agenda items for side menu
			
				// Validate query
				SQLquery = "SELECT DISTINCT itID, EventID, mtgID, Time_Start AS EventStartTime, Time_End AS EventEndTime, Location AS EventLocation, Description AS EventDescription, SUBJECT AS EventName, Date_Start AS EventDate, '0' AS Attendees, '0' AS Waitlist, '100' AS RoomCapacity, LastUpdated ";
				SQLquery = SQLquery + "FROM itinerary WHERE Date_Start >= date('now') AND AttendeeID = '" + AttendeeID + "' ";
				SQLquery = SQLquery + "AND EventID = '0' ";
				SQLquery = SQLquery + "AND UpdateType NOT LIKE 'Delete%' ";
				SQLquery = SQLquery + "UNION ";
				SQLquery = SQLquery + "SELECT DISTINCT '0' AS itID, EventID, mtgID, Time_Start AS EventStartTime, Time_End AS EventEndTime, Location AS EventLocation, Description AS EventDescription, SUBJECT AS EventName, Date_Start AS EventDate, '0' AS Attendees, LastUpdated, ";
				SQLquery = SQLquery + "(SELECT ac.waitlist FROM attendee_courses ac WHERE ac.ct_ID=i.AttendeeID AND ac.session_id=i.EventID) AS Waitlist, '100' AS RoomCapacity ";
				SQLquery = SQLquery + "FROM itinerary i WHERE Date_Start >= date('now') AND AttendeeID = '" + AttendeeID + "' ";
				SQLquery = SQLquery + "AND EventID != '0' ";
				SQLquery = SQLquery + "AND UpdateType NOT LIKE 'Delete%' ";
				SQLquery = SQLquery + "ORDER BY EventDate, EventStartTime, Waitlist, LastUpdated ";
				SQLquery = SQLquery + "LIMIT 10 ";

				// Validate query (Version 2 2019-04-17)
				SQLquery = "SELECT DISTINCT itID, EventID, mtgID, Time_Start AS EventStartTime, Time_End AS EventEndTime, Location AS EventLocation, Description AS EventDescription, SUBJECT AS EventName, Date_Start AS EventDate, '0' AS Attendees, '0' AS Waitlist, '100' AS RoomCapacity, LastUpdated ";
				SQLquery = SQLquery + "FROM itinerary WHERE Date_Start >= date('now') AND AttendeeID = '" + AttendeeID + "' ";
				SQLquery = SQLquery + "AND EventID = '0' ";
				SQLquery = SQLquery + "AND UpdateType NOT LIKE 'Delete%' ";
				SQLquery = SQLquery + "UNION ";
				SQLquery = SQLquery + "SELECT DISTINCT '0' AS itID, c.session_id AS EventID, NULL AS mtgID, TIME(session_start_time) AS EventStartTime, TIME(session_end_time) AS EventEndTime, lr.RoomDisplayname AS EventLocation, c.Description AS EventDescription, c.session_title AS EventName, DATE(session_start_time) AS EventDate, '0' AS Attendees, '' AS LastUpdated, ";
				SQLquery = SQLquery + "(SELECT ac.waitlist FROM attendee_courses ac WHERE ac.ct_ID=i.ct_id AND ac.session_id=i.session_id) AS Waitlist, '100' AS RoomCapacity ";
				SQLquery = SQLquery + "FROM attendee_courses i ";
				SQLquery = SQLquery + "INNER JOIN courses c ON i.session_id = c.session_id ";
				SQLquery = SQLquery + "INNER JOIN lookup_rooms lr ON lr.RoomName = c.room_number ";
				SQLquery = SQLquery + "WHERE DATE(session_start_time) >= date('now') AND i.ct_id = '" + AttendeeID + "' ";
				SQLquery = SQLquery + "AND i.session_id != '0' ";
				SQLquery = SQLquery + "AND c.ActiveYN = 'Y' ";
				SQLquery = SQLquery + "ORDER BY EventDate, EventStartTime, Waitlist, LastUpdated ";
				SQLquery = SQLquery + "LIMIT 10 ";

			}
			
			if (listingType == "ad") {	// Add an agenda item
			
				SQLquery = "SELECT * FROM itinerary WHERE AttendeeID = '" + AttendeeID + "' AND EventID = '" + EventID + "'";

			}
		
			if (listingType == "dl") {	// Remove an agenda item
			
				// Validate query
				SQLquery = "UPDATE itinerary ";
				SQLquery = SQLquery + "SET UpdateType = 'Delete' ";
				SQLquery = SQLquery + "WHERE EventID = '" + EventID + "' ";
				SQLquery = SQLquery + "AND AttendeeID = '" + AttendeeID + "'";

			}

			if (listingType == "up") {	// Update an agenda item
			
				// Validate query
				SQLquery = "SELECT DISTINCT itID, EventID, Time_Start AS EventStartTime, Time_End AS EventEndTime, Location AS EventLocation, Description AS EventDescription, SUBJECT AS EventName, Date_Start AS EventDate ";
				SQLquery = SQLquery + "FROM itinerary WHERE Date_Start = '" + selectedDay + "' AND AttendeeID = '" + AttendeeID + "' ";
				SQLquery = SQLquery + "AND EventID = '0' ";
				SQLquery = SQLquery + "UNION ";
				SQLquery = SQLquery + "SELECT DISTINCT '0' AS itID, EventID, Time_Start AS EventStartTime, Time_End AS EventEndTime, Location AS EventLocation, Description AS EventDescription, SUBJECT AS EventName, Date_Start AS EventDate ";
				SQLquery = SQLquery + "FROM itinerary WHERE Date_Start = '" + selectedDay + "' AND AttendeeID = '" + AttendeeID + "' ";
				SQLquery = SQLquery + "AND EventID != '0' ";
				SQLquery = SQLquery + "ORDER BY EventStartTime";

			}

			// Personal sessions
			if (listingType == "pi") {	// Retrieve personal schedule item
			
				SQLquery = "SELECT DISTINCT itID, mtgID, Time_Start AS EventStartTime, Time_End AS EventEndTime, Location AS EventLocation, Description AS EventDescription, SUBJECT AS EventName, Date_Start AS EventDate ";
				SQLquery = SQLquery + "FROM itinerary ";
				SQLquery = SQLquery + "WHERE AttendeeID = '" + AttendeeID + "' ";
				SQLquery = SQLquery + "AND EventID = '0' ";
				SQLquery = SQLquery + "AND mtgID = " + EventID + " ";
				SQLquery = SQLquery + "AND UpdateType != 'Delete' ";
				SQLquery = SQLquery + "ORDER BY EventStartTime";

			}

			if (listingType == "pd") {	// Delete Personal agenda item
			
				//SQLquery = "SELECT * FROM itinerary WHERE AttendeeID = '" + AttendeeID + "' AND mtgID = " + EventID;
				SQLquery = "UPDATE itinerary ";
				SQLquery = SQLquery + "SET UpdateType = 'Delete' ";
				SQLquery = SQLquery + "WHERE mtgID = '" + EventID + "' ";
				SQLquery = SQLquery + "AND AttendeeID = '" + AttendeeID + "'";
				
			}

			if (listingType == "ps") {	// Save (new/update) Personal agenda item

				SQLquery = "SELECT * FROM itinerary WHERE AttendeeID = '" + AttendeeID + "' AND mtgID = " + EventID;

			}
			
			console.log("Database: Agenda Query: " + SQLquery);

			// Perform query against local SQLite database
			return new Promise(resolve => {
				
				this.sqlite.create({name: 'cvPlanner.db', location: 'default', createFromLocation: 1}).then((db: SQLiteObject) => {
					
					this.db = db;
										
					this.db.executeSql(SQLquery, <any>{}).then((data) => {
						//console.log('Database: Agenda query: ' + JSON.stringify(data));
						console.log('Database: Agenda query rows: ' + data.rows.length);
						var SQLquery2 = "";
						let DatabaseResponse = [];
						if (listingType == "dl") {
							if (data.rowsAffected == "1") {
								DatabaseResponse.push({
									DeleteStatus: "Success",
									DeleteQuery: "",
								});
							} else {
								DatabaseResponse.push({
									DeleteStatus: "Fail",
									DeleteQuery: "",
								});
							}
							resolve(DatabaseResponse);
						}
						if (listingType == "pd") {
							if (data.rowsAffected == "1") {
								DatabaseResponse.push({
									PEStatus: "Success",
									PEQuery: "",
								});
							} else {
								DatabaseResponse.push({
									PEStatus: "Fail",
									PEQuery: "",
								});
							}
							resolve(DatabaseResponse);
						}
						if (listingType == "ad") {
							if(data.rows.length > 0) {
								SQLquery2 = "UPDATE itinerary ";
								SQLquery2 = SQLquery2 + "SET UpdateType = 'Update' ";
								SQLquery2 = SQLquery2 + "WHERE EventID = '" + EventID + "' ";
								SQLquery2 = SQLquery2 + "AND AttendeeID = '" + AttendeeID + "'";
								//console.log('Database: Agenda query2: ' + SQLquery2);
								this.db.executeSql(SQLquery2, <any>{}).then((data2) => {
									//console.log('Database: Agenda query2: ' + JSON.stringify(data2));
									if(data2.rowsAffected > 0) {
										DatabaseResponse.push({
											AddStatus: "Success",
											AddQuery: ""
										});
									} else {
										DatabaseResponse.push({
											AddStatus: "Fail",
											AddQuery: ""
										});
									}
									resolve(DatabaseResponse);
								})
								.catch(e => console.log('Database: Agenda query2 error: ' + JSON.stringify(e)))
							} else {
								SQLquery2 = "INSERT INTO itinerary (AttendeeID, atID, EventID, Time_Start, Time_End, Location, Subject, Date_Start, Date_End, LastUpdated, UpdateType) ";
								SQLquery2 = SQLquery2 + "VALUES ('" + AttendeeID + "', ";
								SQLquery2 = SQLquery2 + "'" + AttendeeID + "', ";
								SQLquery2 = SQLquery2 + "'" + EventID + "', ";
								SQLquery2 = SQLquery2 + "'" + EventStartTime + "', ";
								SQLquery2 = SQLquery2 + "'" + EventEndTime + "', ";
								SQLquery2 = SQLquery2 + "'" + EventLocation + "', ";
								SQLquery2 = SQLquery2 + "'" + EventName + "', ";
								SQLquery2 = SQLquery2 + "'" + EventDate + "', ";
								SQLquery2 = SQLquery2 + "'" + EventDate + "', ";
								SQLquery2 = SQLquery2 + "'" + LastUpdated + "', ";
								SQLquery2 = SQLquery2 + "'Insert')";
								console.log('Database: Agenda query2: ' + SQLquery2);

								this.db.executeSql(SQLquery2, <any>{}).then((data2) => {
									//console.log('Database: Agenda query2: ' + JSON.stringify(data2));
									if(data2.rowsAffected > 0) {
										DatabaseResponse.push({
											AddStatus: "Success",
											AddQuery: ""
										});
									} else {
										DatabaseResponse.push({
											AddStatus: "Fail",
											AddQuery: ""
										});
									}
									resolve(DatabaseResponse);
								})
								.catch(e => console.log('Database: Agenda query2 error: ' + JSON.stringify(e)))
							}
						}
						if (listingType == "ps") {
							if(data.rows.length > 0) {
								SQLquery2 = "UPDATE itinerary ";
								SQLquery2 = SQLquery2 + "SET UpdateType = 'Update', ";
								SQLquery2 = SQLquery2 + "Date_Start = '" + EventDate + "', ";
								SQLquery2 = SQLquery2 + "Date_End = '" + EventDate + "', ";
								SQLquery2 = SQLquery2 + "Time_Start = '" + EventStartTime + "', ";
								SQLquery2 = SQLquery2 + "Time_End = '" + EventEndTime + "', ";
								SQLquery2 = SQLquery2 + "Subject = '" + EventName + "', ";
								SQLquery2 = SQLquery2 + "Location = '" + EventLocation + "', ";
								SQLquery2 = SQLquery2 + "Description = '" + EventDescription + "', ";
								SQLquery2 = SQLquery2 + "LastUpdated = '" + LastUpdated + "' ";
								SQLquery2 = SQLquery2 + "WHERE mtgID = " + EventID + " ";
								SQLquery2 = SQLquery2 + "AND AttendeeID = '" + AttendeeID + "'";
								SQLquery2 = SQLquery2 + "AND AttendeeID = '" + AttendeeID + "'";

								console.log('Personal Agenda Add (Update) SQL: ' + SQLquery2);

								this.db.executeSql(SQLquery2, <any>{}).then((data2) => {
									//console.log('Database: Agenda query2: ' + JSON.stringify(data2));
									console.log('Database: Agenda query rows2: ' + data2.rows.length);
									if(data2.rowsAffected > 0) {
										DatabaseResponse.push({
											PEStatus: "Success",
											PEQuery: ""
										});
									} else {
										DatabaseResponse.push({
											PEStatus: "Fail",
											PEQuery: ""
										});
									}
									resolve(DatabaseResponse);
								})
								.catch(e => console.log('Database: Agenda query2 error: ' + JSON.stringify(e)))
							} else {
								SQLquery2 = "INSERT INTO itinerary (AttendeeID, atID, mtgID, EventID, Time_Start, Time_End, Location, Description, Subject, Date_Start, Date_End, LastUpdated, UpdateType) ";
								SQLquery2 = SQLquery2 + "VALUES ('" + AttendeeID + "', ";
								SQLquery2 = SQLquery2 + "'" + AttendeeID + "', ";
								SQLquery2 = SQLquery2 + "'" + EventID + "', ";
								SQLquery2 = SQLquery2 + "'0', ";
								SQLquery2 = SQLquery2 + "'" + EventStartTime + "', ";
								SQLquery2 = SQLquery2 + "'" + EventEndTime + "', ";
								SQLquery2 = SQLquery2 + "'" + EventLocation + "', ";
								SQLquery2 = SQLquery2 + "'" + EventDescription + "', ";
								SQLquery2 = SQLquery2 + "'" + EventName + "', ";
								SQLquery2 = SQLquery2 + "'" + EventDate + "', ";
								SQLquery2 = SQLquery2 + "'" + EventDate + "', ";
								SQLquery2 = SQLquery2 + "'" + LastUpdated + "', ";
								SQLquery2 = SQLquery2 + "'Insert')";

								console.log('Personal Agenda Add (Insert) SQL: ' + SQLquery2);
								this.db.executeSql(SQLquery2, <any>{}).then((data2) => {
									//console.log('Database: Agenda query2: ' + JSON.stringify(data2));
									console.log('Database: Agenda query rows2: ' + data2.rows.length);
									if(data2.rowsAffected > 0) {
										DatabaseResponse.push({
											PEStatus: "Success",
											PEQuery: ""
										});
									} else {
										DatabaseResponse.push({
											PEStatus: "Fail",
											PEQuery: ""
										});
									}
									resolve(DatabaseResponse);
								})
								.catch(e => console.log('Database: Agenda query2 error: ' + JSON.stringify(e)))
							}
						}
						
						if (listingType == "li" || listingType == "li2" || listingType == "pi") {
							if(data.rows.length > 0) {
								for(let i = 0; i < data.rows.length; i++) {
									DatabaseResponse.push({
										itID: data.rows.item(i).itID,
										EventID: data.rows.item(i).EventID,
										mtgID: data.rows.item(i).mtgID,
										EventStartTime: data.rows.item(i).EventStartTime,
										EventEndTime: data.rows.item(i).EventEndTime,
										EventLocation: data.rows.item(i).EventLocation,
										EventDescription: data.rows.item(i).EventDescription,
										EventName: data.rows.item(i).EventName,
										EventDate: data.rows.item(i).EventDate,
										Attendees: data.rows.item(i).Attendees,
										Waitlist: data.rows.item(i).Waitlist,
										RoomCapacity: data.rows.item(i).RoomCapacity
									});
								}
							}
							resolve(DatabaseResponse);
						}
						
					})
					.catch(e => console.log('Database: Agenda query error: ' + JSON.stringify(e)))
				});
				console.log('Database: Agenda query complete');
			});
			
		} else {
			
			// Perform query against server-based MySQL database
			var url = APIURLReference + "action=agendaquery&flags=" + flags + "&AttendeeID=" + AttendeeID;
			console.log('Database: URL call: ' + url);
			
			return new Promise(resolve => {
				this.httpCall.get(url).subscribe(
					response => {resolve(response.json());
					},
					err => {
						if (err.status == "412") {
							console.log("App and API versions don't match.");
							var emptyJSONArray = {};
							resolve(emptyJSONArray);
						} else {
							console.log(err.status);
							console.log("API Error: ", err);
						}
					}
				);
			});
			
		}
			
	}

	// -----------------------------------
	// 
	// Misc Database Functions
	// 
	// -----------------------------------
	public BlankLocalDatabase() {
		
		// Blank the local SQLite database
		console.log("Blanking the local SQLite database");
		var SQLquery = 'DELETE FROM attendees';
		this.db.executeSql(SQLquery, <any>{}).then(() => 
			console.log('Executed SQL' + SQLquery)
		)
		.catch(e => console.log(JSON.stringify(e)));

		SQLquery = 'DELETE FROM attendee_ces';
		this.db.executeSql(SQLquery, <any>{}).then(() => 
			console.log('Executed SQL' + SQLquery)
		)
		.catch(e => console.log(JSON.stringify(e)));

		SQLquery = 'DELETE FROM itinerary';
		this.db.executeSql(SQLquery, <any>{}).then(() => 
			console.log('Executed SQL' + SQLquery)
		)
		.catch(e => console.log(JSON.stringify(e)));

		SQLquery = 'DELETE FROM notes';
		this.db.executeSql(SQLquery, <any>{}).then(() => 
			console.log('Executed SQL' + SQLquery)
		)
		.catch(e => console.log(JSON.stringify(e)));

		SQLquery = 'DELETE FROM evaluations';
		this.db.executeSql(SQLquery, <any>{}).then(() => 
			console.log('Executed SQL' + SQLquery)
		)
		.catch(e => console.log(JSON.stringify(e)));

		SQLquery = 'DELETE FROM evaluation_conference';
		this.db.executeSql(SQLquery, <any>{}).then(() => 
			console.log('Executed SQL' + SQLquery)
		)
		.catch(e => console.log(JSON.stringify(e)));

		// App tables
		SQLquery = 'DELETE FROM record_deletes';
		this.db.executeSql(SQLquery, <any>{}).then(() => 
			console.log('Executed SQL' + SQLquery)
		)
		.catch(e => console.log(JSON.stringify(e)));

		// Session tables
		SQLquery = 'DELETE FROM courses';
		this.db.executeSql(SQLquery, <any>{}).then(() => 
			console.log('Executed SQL' + SQLquery)
		)
		.catch(e => console.log(JSON.stringify(e)));

		SQLquery = 'DELETE FROM courses_speakers';
		this.db.executeSql(SQLquery, <any>{}).then(() => 
			console.log('Executed SQL' + SQLquery)
		)
		.catch(e => console.log(JSON.stringify(e)));

		// Exhibitor tables
		SQLquery = "DELETE FROM exhibitors";
		this.db.executeSql(SQLquery, <any>{}).then(() => 
			console.log('Executed SQL' + SQLquery)
		)
		.catch(e => console.log(JSON.stringify(e)));
		
	}

	public getSearchData(flags, AttendeeID) {

		console.log("flags passed: " + flags);
		console.log("AttendeeID passed: " + AttendeeID);
		
		var searchTerms = flags || '';
		
		if (this.DevicePlatform == "iOS" || this.DevicePlatform == "Android") {
			
			var SQLquery = "SELECT DISTINCT c.session_id, c.session_title, c.course_id, c.primary_speaker, c.other_speakers, c.session_start_time, c.session_end_time, c.room_number AS RoomName ";
			SQLquery = SQLquery + "FROM courses c ";
			SQLquery = SQLquery + "WHERE course_topics LIKE '%" + searchTerms + "%' ";
			SQLquery = SQLquery + "ORDER BY session_start_time, course_id";

			console.log("Search Query: " + SQLquery);

			// Perform query against local SQLite database
			return new Promise(resolve => {
				
				this.sqlite.create({name: 'cvPlanner.db', location: 'default', createFromLocation: 1}).then((db: SQLiteObject) => {

					console.log('Database: Opened DB for Search query');
					
					this.db = db;
					
					console.log('Database: Set Search query db variable');
					
					this.db.executeSql(SQLquery, <any>{}).then((data) => {
						console.log('Database: Search query: ' + JSON.stringify(data));
						console.log('Database: Search query rows: ' + data.rows.length);
						let DatabaseResponse = [];
						if(data.rows.length > 0) {
							for(let i = 0; i < data.rows.length; i++) {
								DatabaseResponse.push({
									session_id: data.rows.item(i).session_id,
									session_title: data.rows.item(i).session_title,
									course_id: data.rows.item(i).course_id,
									primary_speaker: data.rows.item(i).primary_speaker,
									other_speakers: data.rows.item(i).other_speakers,
									session_start_time: data.rows.item(i).session_start_time,
									session_end_time: data.rows.item(i).session_end_time,
									RoomName: data.rows.item(i).RoomName
								});
							}
						}
						resolve(DatabaseResponse);
					})
					.catch(e => console.log('Database: Search query error: ' + JSON.stringify(e)))
				});
				console.log('Database: Search query complete');

			});

			
		} else {
			
			// Perform query against server-based MySQL database
			var url = APIURLReference + "action=searchquery&flags=" + flags + "&AttendeeID=" + AttendeeID;

			return new Promise(resolve => {
				this.httpCall.get(url).subscribe(
					response => {resolve(response.json());
					},
					err => {
						if (err.status == "412") {
							console.log("App and API versions don't match.");
							var emptyJSONArray = {};
							resolve(emptyJSONArray);
						} else {
							console.log(err.status);
							console.log("API Error: ", err);
						}
					}
				);
			});
			
		}
			
	}

	public getNotesData(flags, AttendeeID) {

		console.log("flags passed: " + flags);
		console.log("AttendeeID passed: " + AttendeeID);

		var flagValues = flags.split("|");
		var selectedDay = flagValues[0];    
		var listingType = flagValues[1];
		var EventID = flagValues[2];    
		var NoteID = flagValues[3];    
		var NoteText = flagValues[4];    
		var LastUpdated = flagValues[5];    
		var SQLquery = "";
		
		if (this.DevicePlatform == "iOS" || this.DevicePlatform == "Android") {
			
			if (listingType == "li") {	// List of notes
			
				// Validate query
				SQLquery = "SELECT DISTINCT c.session_id, c.session_title, c.other_speakers, c.primary_speaker, c.session_start_time, c.session_end_time, c.room_number AS RoomName, n.Note, n.atnID as id ";
				SQLquery = SQLquery + "FROM attendee_notes n ";
				SQLquery = SQLquery + "INNER JOIN courses c ON c.session_id = n.EventID ";
				SQLquery = SQLquery + "WHERE c.session_start_time LIKE '" + selectedDay + "%' ";
				SQLquery = SQLquery + "AND n.AttendeeID = '" + AttendeeID + "'";

			}

			if (listingType == "dt") {	// Specific note
			
				// Validate query
				SQLquery = "SELECT DISTINCT c.session_id, c.session_title, c.other_speakers, c.primary_speaker, c.session_start_time, c.session_end_time, c.room_number AS RoomName, n.Note, n.atnID as id ";
				SQLquery = SQLquery + "FROM courses c ";
				SQLquery = SQLquery + "LEFT OUTER JOIN attendee_notes n ON c.session_id = n.EventID AND n.AttendeeID = '" + AttendeeID + "' ";
				SQLquery = SQLquery + "WHERE c.session_id = '" + EventID + "' ";

			}

			if (listingType == "un") {	// Update specific note
			
				if (LastUpdated == 'NA') {
					LastUpdated = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
				}
				
				// Validate query
				SQLquery = "UPDATE attendee_notes SET Note = '" + NoteText + "', LastUpdated = '" + LastUpdated + "' WHERE atnID = " + NoteID + " ";

			}
	
			if (listingType == "sn") {	// Save new note
		
				if (LastUpdated == 'NA') {
					LastUpdated = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
				}

				// Validate query
				SQLquery = "INSERT INTO attendee_notes(AttendeeID, EventID, Note, LastUpdated, UpdateType) ";
				SQLquery = SQLquery + "VALUES('" + AttendeeID + "','" + EventID + "','" + NoteText + "','" + LastUpdated + "','Insert')";

			}
			
			console.log("Notes Query: " + SQLquery);

			// Perform query against local SQLite database
			return new Promise(resolve => {
				
				this.sqlite.create({name: 'cvPlanner.db', location: 'default', createFromLocation: 1}).then((db: SQLiteObject) => {
					
					this.db = db;
										
					this.db.executeSql(SQLquery, <any>{}).then((data) => {
						console.log('Database: Notes query: ' + JSON.stringify(data));
						console.log('Database: Notes query rows: ' + data.rows.length);
						let DatabaseResponse = [];
						if (listingType == "un" || listingType == "sn") {
							if (data.rowsAffected == "1") {
								DatabaseResponse.push({
									status: "Saved"
								});
							} else {
								DatabaseResponse.push({
									status: "Failed"
								});
							}
						} else {
							if(data.rows.length > 0) {
								for(let i = 0; i < data.rows.length; i++) {
									DatabaseResponse.push({
										id: data.rows.item(i).id,
										session_id: data.rows.item(i).session_id,
										session_title: data.rows.item(i).session_title,
										primary_speaker: data.rows.item(i).primary_speaker,
										other_speakers: data.rows.item(i).other_speakers,
										session_start_time: data.rows.item(i).session_start_time,
										session_end_time: data.rows.item(i).session_end_time,
										RoomName: data.rows.item(i).RoomName,
										Note: data.rows.item(i).Note
									});
								}
							}
						}
						resolve(DatabaseResponse);
					})
					.catch(e => console.log('Database: Notes query error: ' + JSON.stringify(e)))
				});
				console.log('Database: Notes query complete');

			});

			
		} else {
			
			// Perform query against server-based MySQL database
			var url = APIURLReference + "action=notesquery&flags=" + flags + "&AttendeeID=" + AttendeeID;

			return new Promise(resolve => {
				this.httpCall.get(url).subscribe(
					response => {resolve(response.json());
					},
					err => {
						if (err.status == "412") {
							console.log("App and API versions don't match.");
							var emptyJSONArray = {};
							resolve(emptyJSONArray);
						} else {
							console.log(err.status);
							console.log("API Error: ", err);
						}
					}
				);
			});
			
		}
			
	}

	public getinitialData(flags) {

		console.log("Database: getinitialData");
		
		if (this.DevicePlatform == "iOS" || this.DevicePlatform == "Android") {
			
			console.log('Database: Getting initial table data for "' + flags + '"');
			
			// Perform query against server-based MySQL database
			var url = APIURLReference + "action=initialdataquery&flags=" + flags;

			console.log('Database: URL: ' + url);
			
			return new Promise(resolve => {
				this.httpCall.get(url).subscribe(
					response => {resolve(response.json());
					},
					err => {
						if (err.status == "412") {
							console.log("App and API versions don't match.");
							var emptyJSONArray = {};
							resolve(emptyJSONArray);
						} else {
							console.log(err.status);
							console.log("API Error: ", err);
						}
					}
				);
			});

		}			
	}

	public getDatabaseStats(flags, AttendeeID) {

		console.log("flags passed: " + flags);
		console.log("AttendeeID passed: " + AttendeeID);

		var flagValues = flags.split("|");
		var listingType = flagValues[0];
		var listingParameter = flagValues[1];
		var listingValue = flagValues[2];
		var AttendeeProfileTitle = flagValues[3];
		var AttendeeProfileOrganization = flagValues[4];
		
		if (this.DevicePlatform == "iOS" || this.DevicePlatform == "Android") {
			
			if (listingType == "pw") {	// Password change

				// Perform query against server-based MySQL database
				var url = APIURLReference + "action=statsquery&flags=" + flags + "&AttendeeID=" + AttendeeID;

				return new Promise(resolve => {
					this.httpCall.get(url).subscribe(
						response => {resolve(response.json());
						},
						err => {
							if (err.status == "412") {
								console.log("App and API versions don't match.");
								var emptyJSONArray = {};
								resolve(emptyJSONArray);
							} else {
								console.log(err.status);
								console.log("API Error: ", err);
							}
						}
					);
				});
				
			}

			if (listingType == "st") {	// List of record counts

				var SQLquery = "";
				SQLquery = SQLquery + "SELECT COUNT(session_id) AS Records, 'Courses' AS DatabaseTable ";
				SQLquery = SQLquery + "FROM courses ";
				SQLquery = SQLquery + "UNION ";
				SQLquery = SQLquery + "SELECT COUNT(speakerID) AS Records, 'Speakers' AS DatabaseTable ";
				SQLquery = SQLquery + "FROM courses_speakers ";
				SQLquery = SQLquery + "UNION ";
				SQLquery = SQLquery + "SELECT COUNT(ExhibitorID) AS Records, 'Exhibitors' AS DatabaseTable ";
				SQLquery = SQLquery + "FROM exhibitors ";
				SQLquery = SQLquery + "UNION ";
				
				if (AttendeeID == '' || AttendeeID === null) {

					SQLquery = SQLquery + "SELECT 'N/A' AS Records, 'CEs' AS DatabaseTable ";
					SQLquery = SQLquery + "UNION ";
					SQLquery = SQLquery + "SELECT 'N/A' AS Records, 'Notes' AS DatabaseTable ";
					SQLquery = SQLquery + "UNION ";
					SQLquery = SQLquery + "SELECT 'N/A' AS Records, 'Agenda' AS DatabaseTable ";
			
				} else {

					SQLquery = SQLquery + "SELECT COUNT(session_id) AS Records, 'CEs' AS DatabaseTable ";
					SQLquery = SQLquery + "FROM attendee_ces ";
					SQLquery = SQLquery + "WHERE AttendeeID = '" + AttendeeID + "' ";
					SQLquery = SQLquery + "UNION ";
					SQLquery = SQLquery + "SELECT COUNT(EventID) AS Records, 'Notes' AS DatabaseTable ";
					SQLquery = SQLquery + "FROM attendee_notes ";
					SQLquery = SQLquery + "WHERE AttendeeID = '" + AttendeeID + "' ";
					SQLquery = SQLquery + "UNION ";
					SQLquery = SQLquery + "SELECT COUNT(itID) AS Records, 'Agenda' AS DatabaseTable ";
					SQLquery = SQLquery + "FROM itinerary ";
					SQLquery = SQLquery + "WHERE AttendeeID = '" + AttendeeID + "'  AND UpdateType != 'Delete' ";
				
				}
				
				// Perform query against local SQLite database
				return new Promise(resolve => {
					
					this.sqlite.create({name: 'cvPlanner.db', location: 'default', createFromLocation: 1}).then((db: SQLiteObject) => {

						console.log('Database: Opened DB for Stats query');
						
						this.db = null;
						this.db = db;
						
						console.log('Database: Set Stats query db variable');
						
						this.db.executeSql(SQLquery, <any>{}).then((data) => {
							//console.log('Database: Stats query: ' + JSON.stringify(data));
							console.log('Database: Stats query rows: ' + data.rows.length);
							let DatabaseResponse = [];
							if(data.rows.length > 0) {
								for(let i = 0; i < data.rows.length; i++) {
									DatabaseResponse.push({
										Records: data.rows.item(i).Records,
										DatabaseTable: data.rows.item(i).DatabaseTable
									});
								}
							}
							resolve(DatabaseResponse);
						})
						.catch(e => console.log('Database: Stats query error: ' + JSON.stringify(e)))
					});
					console.log('Database: Stats query complete');

				});
			}
			
			if (listingType == "lb") {	// Leaderboard stats

				// Perform query against server-based MySQL database
				var url = APIURLReference + "action=statsquery&flags=" + flags + "&AttendeeID=" + AttendeeID;
				console.log(url);
				
				return new Promise(resolve => {
					this.httpCall.get(url).subscribe(
						response => {resolve(response.json());
						},
						err => {
							if (err.status == "412") {
								console.log("App and API versions don't match.");
								var emptyJSONArray = {};
								resolve(emptyJSONArray);
							} else {
								console.log(err.status);
								console.log("API Error: ", err);
							}
						}
					);
				});
				
				/*
				var SQLquery = "";
				SQLquery = "SELECT a.ct_id, a.last_name, a.first_name, ";
				SQLquery = SQLquery + "(SELECT COUNT(af.afID) AS Postings ";
				SQLquery = SQLquery + "FROM activities_feed af ";
				SQLquery = SQLquery + "WHERE af.AttendeeID = a.ct_id) + ";
				SQLquery = SQLquery + "(SELECT COUNT(afc.afID) AS Comments ";
				SQLquery = SQLquery + "FROM activities_feed_comments afc ";
				SQLquery = SQLquery + "WHERE afc.AttendeeID = a.ct_id) AS PostingsComments ";
				SQLquery = SQLquery + "FROM attendees a ";
				SQLquery = SQLquery + "WHERE a.ActiveYN = 'Y' AND (SELECT COUNT(af.afID) AS Postings ";
				SQLquery = SQLquery + "FROM activities_feed af ";
				SQLquery = SQLquery + "WHERE af.AttendeeID = a.ct_id) + ";
				SQLquery = SQLquery + "(SELECT COUNT(afc.afID) AS Comments ";
				SQLquery = SQLquery + "FROM activities_feed_comments afc ";
				SQLquery = SQLquery + "WHERE afc.AttendeeID = a.ct_id) > 0 ";
				SQLquery = SQLquery + "ORDER BY (SELECT COUNT(af.afID) AS Postings ";
				SQLquery = SQLquery + "FROM activities_feed af ";
				SQLquery = SQLquery + "WHERE af.AttendeeID = a.ct_id) + ";
				SQLquery = SQLquery + "(SELECT COUNT(afc.afID) AS Comments ";
				SQLquery = SQLquery + "FROM activities_feed_comments afc ";
				SQLquery = SQLquery + "WHERE afc.AttendeeID = a.ct_id) DESC ";
				SQLquery = SQLquery + "LIMIT 10 ";

				// Perform query against local SQLite database
				return new Promise(resolve => {
					
					this.sqlite.create({name: 'cvPlanner.db', location: 'default', createFromLocation: 1}).then((db: SQLiteObject) => {

						console.log('Database: Opened DB for Leaderboard query');
						
						this.db = db;
						
						console.log('Database: Set Leaderboard query db variable');
						
						this.db.executeSql(SQLquery, <any>{}).then((data) => {
							//console.log('Database: Leaderboard query: ' + JSON.stringify(data));
							console.log('Database: Leaderboard query rows: ' + data.rows.length);
							let DatabaseResponse = [];
							if(data.rows.length > 0) {
								for(let i = 0; i < data.rows.length; i++) {
									DatabaseResponse.push({
										AttendeeID: data.rows.item(i).ct_id,
										LastName: data.rows.item(i).last_name,
										FirstName: data.rows.item(i).first_name,
										PostingsComments: data.rows.item(i).PostingsComments
									});
								}
							}
							resolve(DatabaseResponse);
						})
						.catch(e => console.log('Database: Leaderboard query error: ' + JSON.stringify(e)))
					});
					console.log('Database: Leaderboard query complete');

				});
				*/
			}

			if (listingType == "pr") {	// Attendee Profile
			
				console.log('Attendee Listing: ' + AttendeeListing);

				if (AttendeeListing == 'Online') {
					
					// Perform query against server-based MySQL database
					var url = APIURLReference + "action=statsquery&flags=" + flags + "&AttendeeID=" + AttendeeID;
					console.log(url);
					
					return new Promise(resolve => {
						this.httpCall.get(url).subscribe(
							response => {resolve(response.json());
							},
							err => {
								if (err.status == "412") {
									console.log("App and API versions don't match.");
									var emptyJSONArray = {};
									resolve(emptyJSONArray);
								} else {
									console.log(err.status);
									console.log("API Error: ", err);
								}
							}
						);
					});

				} else {
					
					var SQLquery = "";
					//SQLquery = "SELECT * FROM attendees ";
					//SQLquery = SQLquery + "WHERE ct_id = '" + AttendeeID + "'";

					SQLquery = "SELECT a.*, ";
					SQLquery = SQLquery + "COALESCE(ab.abID,0) AS Bookmarked ";
					SQLquery = SQLquery + "FROM attendees a ";
					SQLquery = SQLquery + "LEFT OUTER JOIN attendee_bookmarks ab ";
					SQLquery = SQLquery + "   ON ab.AttendeeID = '" + listingParameter + "' ";
					SQLquery = SQLquery + "   AND ab.BookmarkID = a.AttendeeID ";
					SQLquery = SQLquery + "   AND ab.BookmarkType = 'Attendees' ";
					SQLquery = SQLquery + "   AND ab.UpdateType != 'Delete' ";
					SQLquery = SQLquery + "WHERE a.AttendeeID = '" + AttendeeID + "' ";

					// Perform query against local SQLite database
					return new Promise(resolve => {
						
						this.sqlite.create({name: 'cvPlanner.db', location: 'default', createFromLocation: 1}).then((db: SQLiteObject) => {

							console.log('Database: Opened DB for Profile query');
							
							this.db = db;
							
							console.log('Database: Set Profile query db variable');
							
							this.db.executeSql(SQLquery, <any>{}).then((data) => {
								//console.log('Database: Profile query: ' + JSON.stringify(data));
								console.log('Database: Profile query rows: ' + data.rows.length);
								let DatabaseResponse = [];
								if(data.rows.length > 0) {
									for(let i = 0; i < data.rows.length; i++) {
										DatabaseResponse.push({
											AttendeeID: data.rows.item(i).AttendeeID,
											LastName: data.rows.item(i).LastName,
											FirstName: data.rows.item(i).FirstName,
											Title: data.rows.item(i).Title,
											Company: data.rows.item(i).Company,
											smTwitter: data.rows.item(i).smTwitter,
											showTwitter: data.rows.item(i).showTwitter,
											smFacebook: data.rows.item(i).smFacebook,
											showFacebook: data.rows.item(i).showFacebook,
											smLinkedIn: data.rows.item(i).smLinkedIn,
											showLinkedIn: data.rows.item(i).showLinkedIn,
											smInstagram: data.rows.item(i).smInstagram,
											showInstagram: data.rows.item(i).showInstagram,
											smPinterest: data.rows.item(i).smPinterest,
											showPinterest: data.rows.item(i).showPinterest,
											Bookmarked: data.rows.item(i).Bookmarked
										});
									}
								}
								resolve(DatabaseResponse);
							})
							.catch(e => console.log('Database: Profile query error: ' + JSON.stringify(e)))
						});
						console.log('Database: Profile query complete');

					});
				}
			}

			if (listingType == "pg") {	// Get Attendee Social Media URL

				console.log('Attendee Listing: ' + AttendeeListing);

				if (AttendeeListing == 'Online') {

					// Perform query against server-based MySQL database
					var url = APIURLReference + "action=statsquery&flags=" + flags + "&AttendeeID=" + AttendeeID;
					console.log(url);
					
					return new Promise(resolve => {
						this.httpCall.get(url).subscribe(
							response => {resolve(response.json());
							},
							err => {
								if (err.status == "412") {
									console.log("App and API versions don't match.");
									var emptyJSONArray = {};
									resolve(emptyJSONArray);
								} else {
									console.log(err.status);
									console.log("API Error: ", err);
								}
							}
						);
					});

				} else {
					
					var SQLquery = "";
					SQLquery = "SELECT * FROM attendees ";
					SQLquery = SQLquery + "WHERE AttendeeID = '" + AttendeeID + "'";

					// Perform query against local SQLite database
					return new Promise(resolve => {
						
						this.sqlite.create({name: 'cvPlanner.db', location: 'default', createFromLocation: 1}).then((db: SQLiteObject) => {

							console.log('Database: Opened DB for Profile query');
							
							this.db = db;
							
							console.log('Database: Set Profile query db variable');
							
							this.db.executeSql(SQLquery, <any>{}).then((data) => {
								//console.log('Database: Profile query: ' + JSON.stringify(data));
								console.log('Database: Profile query rows: ' + data.rows.length);
								let DatabaseResponse = [];
								if(data.rows.length > 0) {
									var smURL = "";
									switch(listingParameter) {
										case "statusTwitter":
											smURL = data.rows.item(0).smTwitter;
											break;
										case "statusFacebook":
											smURL = data.rows.item(0).smFacebook;
											break;
										case "statusLinkedIn":
											smURL = data.rows.item(0).smLinkedIn;
											break;
										case "statusInstagram":
											smURL = data.rows.item(0).smInstagram;
											break;
										case "statusPinterest":
											smURL = data.rows.item(0).smPinterest;
											break;
									}		

									DatabaseResponse.push({
										smURL: smURL,
									});
								}
								resolve(DatabaseResponse);
							})
							.catch(e => console.log('Database: Profile query error: ' + JSON.stringify(e)))
						});
						console.log('Database: Profile query complete');

					});
				
				}
			}

			if (listingType == "pu") {	// Update Attendee Social Media URL

				console.log('Attendee Listing: ' + AttendeeListing);

				if (AttendeeListing == 'Online') {

					// Perform query against server-based MySQL database
					var url = APIURLReference + "action=statsquery&flags=" + flags + "&AttendeeID=" + AttendeeID;
					console.log(url);
					
					return new Promise(resolve => {
						this.httpCall.get(url).subscribe(
							response => {resolve(response.json());
							},
							err => {
								if (err.status == "412") {
									console.log("App and API versions don't match.");
									var emptyJSONArray = {};
									resolve(emptyJSONArray);
								} else {
									console.log(err.status);
									console.log("API Error: ", err);
								}
							}
						);
					});
				
				} else {
				
					var SQLquery = "";
					SQLquery = "UPDATE attendees ";
					
					switch(listingParameter) {
						case "statusTwitter":
							SQLquery = SQLquery + "SET smTwitter = '" + listingValue + "', ";
							SQLquery = SQLquery + "showTwitter = 'Y' ";
							break;
						case "statusFacebook":
							SQLquery = SQLquery + "SET smFacebook = '" + listingValue + "', ";
							SQLquery = SQLquery + "showFacebook = 'Y' ";
							break;
						case "statusLinkedIn":
							SQLquery = SQLquery + "SET smLinkedIn = '" + listingValue + "', ";
							SQLquery = SQLquery + "showLinkedIn = 'Y' ";
							break;
						case "statusInstagram":
							SQLquery = SQLquery + "SET smInstagram = '" + listingValue + "', ";
							SQLquery = SQLquery + "showInstagram = 'Y' ";
							break;
						case "statusPinterest":
							SQLquery = SQLquery + "SET smPinterest = '" + listingValue + "', ";
							SQLquery = SQLquery + "showPinterest = 'Y' ";
							break;
					}
					
					SQLquery = SQLquery + "WHERE AttendeeID = '" + AttendeeID + "'";

					// Perform query against local SQLite database
					return new Promise(resolve => {
						
						this.sqlite.create({name: 'cvPlanner.db', location: 'default', createFromLocation: 1}).then((db: SQLiteObject) => {

							console.log('Database: Opened DB for Profile query');
							
							this.db = db;
							
							console.log('Database: Set Profile query db variable');
							
							this.db.executeSql(SQLquery, <any>{}).then((data) => {
								//console.log('Database: Profile query: ' + JSON.stringify(data));
								console.log('Database: Profile query rows: ' + data.rows.length);
								let DatabaseResponse = [];
								if(data.rowsAffected > 0) {
									DatabaseResponse.push({
										Status: "Success",
										Query: ""
									});
								} else {
									DatabaseResponse.push({
										Status: "Fail",
										Query: ""
									});
								}
								resolve(DatabaseResponse);
							})
							
							.catch(e => console.log('Database: Profile query error: ' + JSON.stringify(e)))
						});
						console.log('Database: Profile query complete');

					});
				}
			}

			if (listingType == "pd") {	// Remove Attendee Social Media URL

				console.log('Attendee Listing: ' + AttendeeListing);

				if (AttendeeListing == 'Online') {

					// Perform query against server-based MySQL database
					var url = APIURLReference + "action=statsquery&flags=" + flags + "&AttendeeID=" + AttendeeID;
					console.log(url);
					
					return new Promise(resolve => {
						this.httpCall.get(url).subscribe(
							response => {resolve(response.json());
							},
							err => {
								if (err.status == "412") {
									console.log("App and API versions don't match.");
									var emptyJSONArray = {};
									resolve(emptyJSONArray);
								} else {
									console.log(err.status);
									console.log("API Error: ", err);
								}
							}
						);
					});
				
				} else {
				
					var SQLquery = "";
					SQLquery = "UPDATE attendees ";
					
					switch(listingParameter) {
						case "statusTwitter":
							SQLquery = SQLquery + "SET smTwitter = '', ";
							SQLquery = SQLquery + "showTwitter = 'N' ";
							break;
						case "statusFacebook":
							SQLquery = SQLquery + "SET smFacebook = '', ";
							SQLquery = SQLquery + "showFacebook = 'N' ";
							break;
						case "statusLinkedIn":
							SQLquery = SQLquery + "SET smLinkedIn = '', ";
							SQLquery = SQLquery + "showLinkedIn = 'N' ";
							break;
						case "statusInstagram":
							SQLquery = SQLquery + "SET smInstagram = '', ";
							SQLquery = SQLquery + "showInstagram = 'N' ";
							break;
						case "statusPinterest":
							SQLquery = SQLquery + "SET smPinterest = '', ";
							SQLquery = SQLquery + "showPinterest = 'N' ";
							break;
					}
					
					SQLquery = SQLquery + "WHERE AttendeeID = '" + AttendeeID + "'";

					// Perform query against local SQLite database
					return new Promise(resolve => {
						
						this.sqlite.create({name: 'cvPlanner.db', location: 'default', createFromLocation: 1}).then((db: SQLiteObject) => {

							console.log('Database: Opened DB for Profile query');
							
							this.db = db;
							
							console.log('Database: Set Profile query db variable');
							
							this.db.executeSql(SQLquery, <any>{}).then((data) => {
								//console.log('Database: Profile query: ' + JSON.stringify(data));
								console.log('Database: Profile query rows: ' + data.rows.length);
								let DatabaseResponse = [];
								if(data.rowsAffected > 0) {
									DatabaseResponse.push({
										Status: "Success",
										Query: ""
									});
								} else {
									DatabaseResponse.push({
										Status: "Fail",
										Query: ""
									});
								}
								resolve(DatabaseResponse);
							})
							
							.catch(e => console.log('Database: Profile query error: ' + JSON.stringify(e)))
						});
						console.log('Database: Profile query complete');

					});
				}
			}

			if (listingType == "ps") {	// Save Profile updates

				console.log('Attendee Listing: ' + AttendeeListing);

				if (AttendeeListing == 'Online') {

					// Perform query against server-based MySQL database
					var url = APIURLReference + "action=statsquery&flags=" + flags + "&AttendeeID=" + AttendeeID;
					console.log(url);
					
					return new Promise(resolve => {
						this.httpCall.get(url).subscribe(
							response => {resolve(response.json());
							},
							err => {
								if (err.status == "412") {
									console.log("App and API versions don't match.");
									var emptyJSONArray = {};
									resolve(emptyJSONArray);
								} else {
									console.log(err.status);
									console.log("API Error: ", err);
								}
							}
						);
					});
				
				} else {
				
					var SQLquery = "";
					SQLquery = "UPDATE attendees ";
					SQLquery = SQLquery + "SET Title = '" + AttendeeProfileTitle + "', ";
					SQLquery = SQLquery + "Company = '" + AttendeeProfileOrganization + "' ";
					
					SQLquery = SQLquery + "WHERE AttendeeID = '" + AttendeeID + "'";

					// Perform query against local SQLite database
					return new Promise(resolve => {
						
						this.sqlite.create({name: 'cvPlanner.db', location: 'default', createFromLocation: 1}).then((db: SQLiteObject) => {

							console.log('Database: Opened DB for Profile query');
							
							this.db = db;
							
							console.log('Database: Set Profile query db variable');
							
							this.db.executeSql(SQLquery, <any>{}).then((data) => {
								//console.log('Database: Profile query: ' + JSON.stringify(data));
								console.log('Database: Profile query rows: ' + data.rows.length);
								let DatabaseResponse = [];
								if(data.rowsAffected > 0) {
									DatabaseResponse.push({
										Status: "Success",
										Query: ""
									});
								} else {
									DatabaseResponse.push({
										Status: "Fail",
										Query: ""
									});
								}
								resolve(DatabaseResponse);
							})
							
							.catch(e => console.log('Database: Profile query error: ' + JSON.stringify(e)))
						});
						console.log('Database: Profile query complete');

					});
				}
			}
			
			if (listingType == "cn") { // Check Network
				
				console.log('DB: Connection Check');
				
				var url = APIURLReference + "action=statsquery&flags=" + flags + "&AttendeeID=" + AttendeeID;
				var emptyJSONArray = {};

				return new Promise(resolve => {
					this.httpCall.get(url).timeout(3000).subscribe(
						response => {
							console.log('DB: Connection check response: ' + JSON.stringify(response.json()));
							resolve(response.json());
						},
						err => {
							console.log('DB: Connection check error: ' + err);
							if (err.status == "412") {
								console.log("App and API versions don't match.");
								resolve(emptyJSONArray);
							} else {
								console.log("DB: Connection Check Error: ", err);
								var errorArray = [];
								errorArray.push({
									Status: 'Timeout has occurred'
								});
								resolve(errorArray);
							}
						}
					);
				});
			}
			
			if (listingType == "rw") { // Session Star Reviews
			
				SQLquery = "SELECT * FROM attendee_session_ratings ";
				SQLquery = SQLquery + "WHERE session_id = '" + listingParameter + "' ";
				SQLquery = SQLquery + "AND AttendeeID = '" + AttendeeID + "'";
				
				// Perform query against local SQLite database
				return new Promise(resolve => {
					
					this.sqlite.create({name: 'cvPlanner.db', location: 'default', createFromLocation: 1}).then((db: SQLiteObject) => {

						console.log('Database: Opened DB for Create Bookmark query');
						
						this.db = db;
						
						console.log('Database: Set Create Bookmark query db variable');
						
						this.db.executeSql(SQLquery, <any>{}).then((data) => {
							console.log('Database: Session Star Reviews query: ' + JSON.stringify(data));
							console.log('Database: Session Star Reviews query rows: ' + data.rows.length);
							var SQLquery2 = "";
							let DatabaseResponse = [];
							console.log('Database: listingParameter: ' + listingParameter);
							console.log('Database: listingValue: ' + listingValue);
							if(data.rows.length > 0) {
								SQLquery2 = "UPDATE attendee_session_ratings ";
								SQLquery2 = SQLquery2 + "SET asrRating = '" + listingValue + "' ";
								SQLquery2 = SQLquery2 + "WHERE AttendeeID = '" + AttendeeID + "' ";
								SQLquery2 = SQLquery2 + "AND session_id = '" + listingParameter + "' ";
								console.log('Database: Session Star Reviews query2: ' + SQLquery2);
								this.db.executeSql(SQLquery2, <any>{}).then((data2) => {
									console.log('Database: Session Star Reviews query2: ' + JSON.stringify(data2));
									if(data2.rowsAffected > 0) {
										DatabaseResponse.push({
											Status: "Saved",
											Query: ""
										});
									} else {
										DatabaseResponse.push({
											Status: "Failed",
											Query: ""
										});
									}
									resolve(DatabaseResponse);
								})
								.catch(e => console.log('Database: Session Star Reviews query2 error: ' + JSON.stringify(e)))
							} else {
								var CurrentDateTime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
								SQLquery2 = "INSERT INTO attendee_session_ratings(AttendeeID, session_id, asrRating, DateAdded, UpdateType) ";
								SQLquery2 = SQLquery2 + "VALUES('" + AttendeeID + "','" + listingParameter + "','" + listingValue + "','" + CurrentDateTime + "','Insert')";
								console.log('Database: Session Star Reviews query2: ' + SQLquery2);

								this.db.executeSql(SQLquery2, <any>{}).then((data2) => {
									console.log('Database: Session Star Reviews query2: ' + JSON.stringify(data2));
									if(data2.rowsAffected > 0) {
										DatabaseResponse.push({
											Status: "Saved",
											Query: ""
										});
									} else {
										DatabaseResponse.push({
											Status: "Failed",
											Query: ""
										});
									}
									resolve(DatabaseResponse);
								})
								.catch(e => console.log('Database: Session Star Reviews query2 error: ' + JSON.stringify(e)))
							}
										
						})
						.catch(e => console.log('Database: Session Star Reviews query error: ' + JSON.stringify(e)))
					});
					console.log('Database: Session Star Reviews query complete');

				});
				
			}

		} else {
			
			// Perform query against server-based MySQL database
			var url = APIURLReference + "action=statsquery&flags=" + flags + "&AttendeeID=" + AttendeeID;

			return new Promise(resolve => {
				this.httpCall.get(url).subscribe(
					response => {resolve(response.json());
					},
					err => {
						if (err.status == "412") {
							console.log("App and API versions don't match.");
							var emptyJSONArray = {};
							resolve(emptyJSONArray);
						} else {
							console.log(err.status);
							console.log("API Error: ", err);
						}
					}
				);
			});
			
		}
			
	}
	
	// -----------------------------------
	// 
	// Help Database Functions
	// 
	// -----------------------------------
	public sendHelpData(flags, AttendeeID) {

		console.log("sendHelpData: flags passed: " + flags);
		var SQLquery = "";
		
		if (this.DevicePlatform == "iOS" || this.DevicePlatform == "Android") {
			
			console.log('sendHelpData: Send data to SQLite');
			var flagValues = flags.split("|");		// Split concatenated values
			var listingType = flagValues[0];		// Listing Type
			var SenderName = flagValues[1];			// Sender's Name
			var SenderEmail = flagValues[2];    	// Sender's Email
			var SenderPhone = flagValues[3];    	// Sender's Phone
			var SenderComments = flagValues[4];		// Sender's Comments

			SQLquery = "INSERT INTO help_contact_form (SenderName, SenderEmail, SenderPhone, SenderComments) ";
			SQLquery = SQLquery + "VALUES ('" + SenderName + "', ";
			SQLquery = SQLquery + "'" + SenderEmail + "', ";
			SQLquery = SQLquery + "'" + SenderPhone + "', ";
			SQLquery = SQLquery + "'" + SenderComments + "' ";
			SQLquery = SQLquery + ") ";

			console.log("sendHelpData Members Query: " + SQLquery);

			// Perform query against local SQLite database
			return new Promise(resolve => {
				
				this.sqlite.create({name: 'cvPlanner.db', location: 'default', createFromLocation: 1}).then((db: SQLiteObject) => {

					console.log('Database: Opened DB for sendHelpData query');
					
					this.db = db;
					let DatabaseResponse = [];
					
					console.log('Database: Set sendHelpData query db variable');
					
					this.db.executeSql(SQLquery, <any>{}).then((data) => {
						if (data.rowsAffected == "1") {
							DatabaseResponse.push({
								hcfStatus: "Success"
							});
						} else {
							DatabaseResponse.push({
								hcfStatus: "Fail"
							});
						}
						resolve(DatabaseResponse);
					})
					.catch(e => console.log('Database: sendHelpData query error: ' + JSON.stringify(e)))
				});
				console.log('Database: sendHelpData query complete');

			});

			
		} else {
			
			console.log('sendHelpData: Push data to MySQL');

			// Perform query against server-based MySQL database
			var url = APIURLReference + "action=hlpquery&flags=" + flags + "&AttendeeID=" + AttendeeID;
			console.log(url);
			
			return new Promise(resolve => {
				this.httpCall.get(url).subscribe(
					response => {
						console.log("Database: sendHelpData data: " + JSON.stringify(response.json()));
						resolve(response.json());
					},
					err => {
						if (err.status == "412") {
							console.log("App and API versions don't match.");
							var emptyJSONArray = {};
							resolve(emptyJSONArray);
						} else {
							console.log(err.status);
							console.log("API Error: ", err);
						}
					}
				);
			});
		}	
    }

}