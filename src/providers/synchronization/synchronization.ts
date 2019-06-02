// Components, functions, plugins
import { Injectable } from '@angular/core';
import { Platform, AlertController, Events } from 'ionic-angular';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';
import { Localstorage } from '../../providers/localstorage/localstorage';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import 'rxjs/add/operator/catch';

// Global URL and conference year reference used for all AJAX-to-MySQL calls
var SyncURLReference: string = "https://demoplanner.convergence-us.com/cvPlanner.php?acy=2019&";

@Injectable()
export class Synchronization {

	private db: SQLiteObject;

    public constructor(public platform: Platform, 
						public httpCall: Http,
						public alertCtrl: AlertController,
						public events: Events,
						private sqlite: SQLite,
						private localstorage: Localstorage) {
        
    }


	// -----------------------------------
	// Push Notification
	// 
	// Sends token, logged in user, device type to database
	// -----------------------------------
    SendPushRecord(ptokenID, pattendeeID, pUserName, pDeviceType, pSyncType) {

		console.log("PushSync Begin Token ID = " + ptokenID + ", Attendee ID = " + pattendeeID + ", User Name = " + pUserName + ", Device Type = " + pDeviceType + ", Sync Type = " + pSyncType)

		let qp = new URLSearchParams();
		
		qp.set('action', 'push');
		qp.set('TokenID', ptokenID);
		qp.set('AttendeeID', pattendeeID);
		qp.set('UserName', pUserName);
		qp.set('DeviceType', pDeviceType);
		qp.set('SyncType', pSyncType);
		qp.set('acy','2018');
		let options = new RequestOptions({ params: qp });
		
		return new Promise(resolve => {
			this.httpCall.get(SyncURLReference, options).subscribe(
				response => {
					console.log("PushSync Success Data returned: " + JSON.stringify(response));
					resolve(response.json());
				},
				err => {
					console.log("PushSync Error Data returned: " + JSON.stringify(err) + " Status: " + err);
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

	// -----------------------------------
	// Messaging: Direct Chat Monitoring
	// 
	// Get new message indicators for time period specified
	// 
	// -----------------------------------
    public DirectChatMonitor(LastSync, ThisSync) {

		var flags = "ck|0|0|0|" + LastSync + "|" + ThisSync;
		var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
		
		// Perform query against server-based MySQL database
		var url = SyncURLReference + "action=msgquery&flags=" + flags + "&AttendeeID=" + AttendeeID;
		//console.log('Sync, Direct Chat Monitoring: ' + url);
		
		return new Promise(resolve => {
			this.httpCall.get(url).subscribe(
				data3 => {
					let data = [];
					//console.log('Sync, Direct Chat Monitoring: ' + JSON.stringify(data3.json()));
					data = data3.json();
					//console.log('Sync, Direct Chat Monitoring: Records: ' + data['length']);
					resolve(data);
				},
				err => {
					console.log("PushSync Error Data returned: " + JSON.stringify(err) + " Status: " + err);
					if (err.status == "412") {
						console.log("App and API versions don't match.");
						var emptyJSONArray = {};
						resolve(emptyJSONArray);
					} else {
						console.log(err.status);
						console.log("API Error: ", err);
					}
				}
			)
		});
	}

	// -----------------------------------
	// Database call for M2S
	// -----------------------------------
    public DBCallQuery(SQLSelectQuery, SQLInsertQuery, SQLUpdateQuery, SQLQueryDelete) {
		
		//console.log('DBCall: ' + SQLSelectQuery);
		
		return new Promise(resolve => {
			this.sqlite.create({name: 'cvPlanner.db', location: 'default'}).then((db: SQLiteObject) => {
				
				this.db = db;
				if (SQLQueryDelete != 'NO') {
					this.db.executeSql(SQLQueryDelete, <any>{}).then((dataS) => {
						console.log('DBCall Return: ' + JSON.stringify(dataS));
						resolve(SQLInsertQuery);
					})
					.catch(e => console.log('Sync DBCall: Error selecting (' + SQLSelectQuery + ') base record: ' + JSON.stringify(e)))
				} else {
					this.db.executeSql(SQLSelectQuery, <any>{}).then((dataS) => {
						console.log('DBCall Return: ' + JSON.stringify(dataS));
						if (dataS.rows.length > 0) {
							//console.log('DBCall: ' + SQLUpdateQuery);
							resolve(SQLUpdateQuery);
						} else {
							//console.log('DBCall: ' + SQLInsertQuery);
							resolve(SQLInsertQuery);
						}
					})
					.catch(e => console.log('Sync DBCall: Error selecting (' + SQLSelectQuery + ') base record: ' + JSON.stringify(e)))
				}
			});
		});
		
	}

    public DBCallQuery2(SQLQuery) {
		
		//console.log('DBCall2: ' + SQLQuery);
		
		return new Promise(resolve => {
			this.sqlite.create({name: 'cvPlanner.db', location: 'default'}).then((db: SQLiteObject) => {
				
				this.db = db;
				this.db.executeSql(SQLQuery, <any>{}).then((dataS) => {
					resolve(SQLQuery);
				})
				.catch(e => console.log('Sync DBCall2: Error selecting (' + SQLQuery + ') base record: ' + JSON.stringify(e)))
				
			});
		});
		
	}

	// -----------------------------------
	// Database call for S2M
	// -----------------------------------
    public DBGetData(QueryType, SQLQuery) {
		
		console.log('DBGetData: ' + SQLQuery);
		
		return new Promise(resolve => {
			this.sqlite.create({name: 'cvPlanner.db', location: 'default'}).then((db: SQLiteObject) => {
				
				this.db = db;
				let DatabaseResponse = [];
				this.db.executeSql(SQLQuery, <any>{}).then((dataS) => {
					console.log('DBGetData: Response: ' + JSON.stringify(dataS));
					if (dataS.rows.length > 0) {
						if (QueryType == "itinerary") {
							for(let i = 0; i < dataS.rows.length; i++) {
								DatabaseResponse.push({
									mtgID: dataS.rows.item(i).mtgID,
									Date_Start: dataS.rows.item(i).Date_Start,
									Date_End: dataS.rows.item(i).Date_End,
									Time_Start: dataS.rows.item(i).Time_Start,
									Time_End: dataS.rows.item(i).Time_End,
									Subject: dataS.rows.item(i).Subject,
									Location: dataS.rows.item(i).Location,
									Description: dataS.rows.item(i).Description,
									atID: dataS.rows.item(i).atID,
									AttendeeID: dataS.rows.item(i).AttendeeID,
									EventID: dataS.rows.item(i).EventID,
									LastUpdated: dataS.rows.item(i).LastUpdated,
									UpdateType: dataS.rows.item(i).UpdateType
								});
							}
						}
						if (QueryType == "evaluations") {
							for(let i = 0; i < dataS.rows.length; i++) {
								DatabaseResponse.push({
									AttendeeID: dataS.rows.item(i).AttendeeID,
									session_id: dataS.rows.item(i).session_id,
									evaluationType: dataS.rows.item(i).evaluationType,
									Q11: dataS.rows.item(i).Q11,
									Q12: dataS.rows.item(i).Q12,
									Q21: dataS.rows.item(i).Q21,
									Q22: dataS.rows.item(i).Q22,
									Q23: dataS.rows.item(i).Q23,
									Q24: dataS.rows.item(i).Q24,
									Q25: dataS.rows.item(i).Q25,
									Q26: dataS.rows.item(i).Q26,
									Q31: dataS.rows.item(i).Q31,
									Q32: dataS.rows.item(i).Q32,
									Q33: dataS.rows.item(i).Q33,
									Q41: dataS.rows.item(i).Q41,
									LastUpdated: dataS.rows.item(i).LastUpdated,
									UpdateType: dataS.rows.item(i).UpdateType
								});
							}
						}
						if (QueryType == "evaluation_conference") {
							for(let i = 0; i < dataS.rows.length; i++) {
								DatabaseResponse.push({
									AttendeeID: dataS.rows.item(i).AttendeeID,
									session_id: dataS.rows.item(i).session_id,
									evaluationType: dataS.rows.item(i).evaluationType,
									Q1: dataS.rows.item(i).Q1,
									Q2: dataS.rows.item(i).Q2,
									Q3: dataS.rows.item(i).Q3,
									Q4: dataS.rows.item(i).Q4,
									Q5: dataS.rows.item(i).Q5,
									Q5C: dataS.rows.item(i).Q5C,
									Q6: dataS.rows.item(i).Q6,
									Q7: dataS.rows.item(i).Q7,
									Q7C: dataS.rows.item(i).Q7C,
									Q8: dataS.rows.item(i).Q8,
									Q9: dataS.rows.item(i).Q9,
									Q10: dataS.rows.item(i).Q10,
									Q10C: dataS.rows.item(i).Q10C,
									Q11: dataS.rows.item(i).Q11,
									Q11C: dataS.rows.item(i).Q11C,
									LastUpdated: dataS.rows.item(i).LastUpdated,
									UpdateType: dataS.rows.item(i).UpdateType
								});
							}
						}
						if (QueryType == "attendee_notes") {
							for(let i = 0; i < dataS.rows.length; i++) {
								DatabaseResponse.push({
									AttendeeID: dataS.rows.item(i).AttendeeID,
									EventID: dataS.rows.item(i).EventID,
									Note: dataS.rows.item(i).Note,
									LastUpdated: dataS.rows.item(i).LastUpdated,
									UpdateType: dataS.rows.item(i).UpdateType
								});
							}
						}
						if (QueryType == "activities_feed") {
							for(let i = 0; i < dataS.rows.length; i++) {
								DatabaseResponse.push({
									AttendeeID: dataS.rows.item(i).AttendeeID,
									afDateTime: dataS.rows.item(i).afDateTime,
									afChatCounter: dataS.rows.item(i).afChatCounter,
									afLikesCounter: dataS.rows.item(i).afLikesCounter,
									afMessage: dataS.rows.item(i).afMessage,
									afImageAttachment: dataS.rows.item(i).afImageAttachment,
									DateAdded: dataS.rows.item(i).DateAdded,
									UpdateType: dataS.rows.item(i).UpdateType
								});
							}
						}
						if (QueryType == "activities_feed_comments") {
							for(let i = 0; i < dataS.rows.length; i++) {
								DatabaseResponse.push({
									afID: dataS.rows.item(i).afID,
									AttendeeID: dataS.rows.item(i).AttendeeID,
									afcComment: dataS.rows.item(i).afcComment,
									afcDateAdded: dataS.rows.item(i).afcDateAdded,
									afcUpdateType: dataS.rows.item(i).afcUpdateType
								});
							}
						}
						if (QueryType == "attendee_bookmarks") {
							for(let i = 0; i < dataS.rows.length; i++) {
								DatabaseResponse.push({
									AttendeeID: dataS.rows.item(i).AttendeeID,
									BookmarkType: dataS.rows.item(i).BookmarkType,
									BookmarkID: dataS.rows.item(i).BookmarkID,
									DateAdded: dataS.rows.item(i).DateAdded,
									UpdateType: dataS.rows.item(i).UpdateType
								});
							}
						}
						if (QueryType == "help_contact_form") {
							for(let i = 0; i < dataS.rows.length; i++) {
								DatabaseResponse.push({
									SenderName: dataS.rows.item(i).SenderName,
									SenderEmail: dataS.rows.item(i).SenderEmail,
									SenderPhone: dataS.rows.item(i).SenderPhone,
									SenderComments: dataS.rows.item(i).SenderComments
								});
							}
						}
						resolve(DatabaseResponse);
					} else {
						resolve(DatabaseResponse);
					}
				})
				.catch(e => console.log('Sync DBGetData: Error selecting (' + SQLQuery + ') base record: ' + JSON.stringify(e)))
			});
		});
		
	}
	
	// -----------------------------------
	// Database Sync
	// 
	// Updated records: MySQL to SQLite
	// 
	// -----------------------------------
    public DBSyncUpdateM2S(LastSync, ThisSync) {

		var flags = "UpdateM2S|" + LastSync + "|" + ThisSync;
		var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
		
		// Perform query against server-based MySQL database
		var url = SyncURLReference + "action=sync&flags=" + flags + "&AttendeeID=" + AttendeeID;
		console.log('Sync UpdateM2S: ' + url);
		
		return new Promise(resolve => {
			this.httpCall.get(url).subscribe(
				data3 => {
					let data = [];
					console.log('Sync NewM2S: ' + JSON.stringify(data3.json()));
					data = data3.json();
					console.log('Sync UpdateM2S: Records: ' + data['length']);
						
					if (data['length']>0) {
						// Parse records and insert into SQLite DB
						var SQLQuerySelect = "";
						var SQLQueryInsert = "";
						var SQLQueryUpdate = "";
						var SQLQueryDelete = "";
						var DBCallOutput = "";
						var DBCallOutput2 = "";
						
						for (var i = 0; i < data['length']; i++) {
							SQLQuerySelect = "";
							SQLQueryInsert = "";
							SQLQueryUpdate = "";
							SQLQueryDelete = "";
							//console.log('Sync UpdateM2S: Creating query for: ' + data[i].TableName);
							
							// Determine query to use based on table name
							switch(data[i].TableName) {
								case "courses":
									SQLQuerySelect = "SELECT * FROM courses WHERE session_id = '" + data[i].session_id + "'";
									
									SQLQueryInsert = "INSERT INTO courses(";
									SQLQueryInsert = SQLQueryInsert + "session_id, session_title, description, ";
									SQLQueryInsert = SQLQueryInsert + "session_start_time, session_end_time, primary_speaker, ";
									SQLQueryInsert = SQLQueryInsert + "other_speakers, course_id, subject, ";
									SQLQueryInsert = SQLQueryInsert + "cs_credits, ce_credits_type, room_number, ";
									SQLQueryInsert = SQLQueryInsert + "verification_code, nadl_verification, type, ";
									SQLQueryInsert = SQLQueryInsert + "level, speaker_host_emcee, room_capacity, ";
									SQLQueryInsert = SQLQueryInsert + "course_topics, ActiveYN, corporate_supporter, ";
									SQLQueryInsert = SQLQueryInsert + "session_recording, HandoutFilename, CEcreditsL, ";
									SQLQueryInsert = SQLQueryInsert + "CEcreditsP, SearchField) ";
									SQLQueryInsert = SQLQueryInsert + "VALUES('" + data[i].session_id + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].session_title + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].description + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].session_start_time + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].session_end_time + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].primary_speaker + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].other_speakers + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].course_id + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].subject + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].cs_credits + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].ce_credits_type + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].room_number + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].verification_code + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].nadl_verification + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].type + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].level + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].speaker_host_emcee + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].room_capacity + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].course_topics + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].ActiveYN + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].corporate_supporter + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].session_recording + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].HandoutFilename + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].CEcreditsL + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].CEcreditsP + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].SearchField + "')";

									SQLQueryUpdate = "UPDATE courses ";
									SQLQueryUpdate = SQLQueryUpdate + "SET session_title = '" + data[i].session_title + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "description = '" + data[i].description + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "session_start_time = '" + data[i].session_start_time + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "session_end_time = '" + data[i].session_end_time + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "primary_speaker = '" + data[i].primary_speaker + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "other_speakers = '" + data[i].other_speakers + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "course_id = '" + data[i].course_id + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "subject = '" + data[i].subject + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "cs_credits = '" + data[i].cs_credits + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "ce_credits_type = '" + data[i].ce_credits_type + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "room_number = '" + data[i].room_number + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "verification_code = '" + data[i].verification_code + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "type = '" + data[i].type + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "level = '" + data[i].level + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "speaker_host_emcee = '" + data[i].speaker_host_emcee + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "room_capacity = '" + data[i].room_capacity + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "course_topics = '" + data[i].course_topics + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "ActiveYN = '" + data[i].ActiveYN + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "corporate_supporter = '" + data[i].corporate_supporter + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "session_recording = '" + data[i].session_recording + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "HandoutFilename = '" + data[i].HandoutFilename + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "CEcreditsL = '" + data[i].CEcreditsL + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "CEcreditsP = '" + data[i].CEcreditsP + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "SearchField = '" + data[i].SearchField + "' ";
									SQLQueryUpdate = SQLQueryUpdate + "WHERE session_id = '" + data[i].session_id + "' ";
									
									SQLQueryDelete = "NO";
									break;
								case "itinerary":
									SQLQuerySelect = "SELECT * FROM itinerary ";
									SQLQuerySelect = SQLQuerySelect + "WHERE AttendeeID = '" + data[i].AttendeeID + "' ";
									SQLQuerySelect = SQLQuerySelect + "AND mtgID = '" + data[i].mtgID + "' ";
									SQLQuerySelect = SQLQuerySelect + "AND EventID = '" + data[i].EventID + "' ";

									SQLQueryInsert = "INSERT INTO itinerary(";
									SQLQueryInsert = SQLQueryInsert + "mtgID, Date_Start, ";
									SQLQueryInsert = SQLQueryInsert + "Date_End, Time_Start, Time_End, ";
									SQLQueryInsert = SQLQueryInsert + "Subject, Location, Description, ";
									SQLQueryInsert = SQLQueryInsert + "atID, AttendeeID, EventID, ";
									SQLQueryInsert = SQLQueryInsert + "LastUpdated, UpdateType) ";
									SQLQueryInsert = SQLQueryInsert + "VALUES('" + data[i].mtgID + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].Date_Start + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].Date_End + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].Time_Start + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].Time_End + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].Subject + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].Location + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].Description + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].atID + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].AttendeeID + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].EventID + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].LastUpdated + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].UpdateType + "')";

									SQLQueryUpdate = "UPDATE itinerary ";
									SQLQueryUpdate = SQLQueryUpdate + "SET Date_Start = '" + data[i].Date_Start + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "Date_End = '" + data[i].Date_End + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "Time_Start = '" + data[i].Time_Start + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "Time_End = '" + data[i].Time_End + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "Subject = '" + data[i].Subject + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "Location = '" + data[i].Location + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "Description = '" + data[i].Description + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "LastUpdated = '" + data[i].LastUpdated + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "UpdateType = '" + data[i].UpdateType + "' ";
									SQLQueryUpdate = SQLQueryUpdate + "WHERE AttendeeID = '" + data[i].AttendeeID + "' ";
									SQLQueryUpdate = SQLQueryUpdate + "AND mtgID = '" + data[i].mtgID + "' ";
									SQLQueryUpdate = SQLQueryUpdate + "AND EventID = '" + data[i].EventID + "' ";
									
									SQLQueryDelete = "NO";
									break;
								case "attendee_ces":
									SQLQuerySelect = "SELECT * FROM attendee_ces ";
									SQLQuerySelect = SQLQuerySelect + "WHERE AttendeeID = '" + data[i].AttendeeID + "' ";
									SQLQuerySelect = SQLQuerySelect + "AND session_id = '" + data[i].session_id + "' ";

									SQLQueryInsert = "INSERT INTO attendee_ces(";
									SQLQueryInsert = SQLQueryInsert + "AttendeeID, session_id, course_id, ";
									SQLQueryInsert = SQLQueryInsert + "scannedYN, evalID, DateAdded, LastUpdated, ceNotes, ";
									SQLQueryInsert = SQLQueryInsert + "UpdateType) ";
									SQLQueryInsert = SQLQueryInsert + "VALUES('" + data[i].AttendeeID + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].session_id + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].course_id + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].scannedYN + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].evalID + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].DateAdded + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].LastUpdated + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].ceNotes + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].UpdateType + "')";

									SQLQueryUpdate = "UPDATE attendee_ces ";
									SQLQueryUpdate = SQLQueryUpdate + "SET AttendeeID = '" + data[i].AttendeeID + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "session_id = '" + data[i].session_id + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "course_id = '" + data[i].course_id + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "scannedYN = '" + data[i].scannedYN + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "evalID = '" + data[i].evalID + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "DateAdded = '" + data[i].DateAdded + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "LastUpdated = '" + data[i].LastUpdated + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "ceNotes = '" + data[i].ceNotes + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "UpdateType = '" + data[i].UpdateType + "' ";
									SQLQueryUpdate = SQLQueryUpdate + "WHERE AttendeeID = '" + data[i].AttendeeID + "' ";
									SQLQueryUpdate = SQLQueryUpdate + "AND session_id = '" + data[i].session_id + "' ";
									
									SQLQueryDelete = "DELETE FROM attendee_ces ";
									SQLQueryDelete = SQLQueryDelete + "WHERE AttendeeID = '" + data[i].AttendeeID + "' ";
									SQLQueryDelete = SQLQueryDelete + "AND session_id = '" + data[i].session_id + "' ";

									break;
								case "courses_speakers":
									SQLQuerySelect = "SELECT * FROM courses_speakers WHERE speakerID = '" + data[i].speakerID + "'";

									SQLQueryInsert = "INSERT INTO courses_speakers(";
									SQLQueryInsert = SQLQueryInsert + "speakerID, FullName, FirstName, LastName, ";
									SQLQueryInsert = SQLQueryInsert + "Credentials, Bio, Title, Company, Courses, imageFilename, email, ";
									SQLQueryInsert = SQLQueryInsert + "Website, SearchField, ActiveYN) ";
									SQLQueryInsert = SQLQueryInsert + "VALUES(" + data[i].speakerID + ", ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].FullName + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].FirstName + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].LastName + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].Credentials + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].Bio + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].Title + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].Company + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].Courses + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].imageFilename + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].email + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].Website + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].SearchField + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].ActiveYN + "')";

									SQLQueryUpdate = "UPDATE courses_speakers ";
									SQLQueryUpdate = SQLQueryUpdate + "SET FullName = '" + data[i].FullName + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "FirstName = '" + data[i].FirstName + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "LastName = '" + data[i].LastName + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "Credentials = '" + data[i].Credentials + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "Bio = '" + data[i].Bio + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "Title = '" + data[i].Title + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "Company = '" + data[i].Company + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "Courses = '" + data[i].Courses + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "imageFilename = '" + data[i].imageFilename + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "email = '" + data[i].email + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "Website = '" + data[i].SearchField + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "SearchField = '" + data[i].SearchField + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "ActiveYN = '" + data[i].SearchField + "' ";
									SQLQueryUpdate = SQLQueryUpdate + "WHERE speakerID = '" + data[i].speakerID + "' ";
									
									SQLQueryDelete = "DELETE FROM courses_speakers ";
									SQLQueryDelete = SQLQueryDelete + "WHERE speakerID = '" + data[i].speakerID + "' ";

									break;
								case "exhibitors":
									SQLQuerySelect = "SELECT * FROM exhibitors WHERE ExhibitorID = " + data[i].ExhibitorID;

									SQLQueryInsert = "INSERT INTO exhibitors(";
									SQLQueryInsert = SQLQueryInsert + "ExhibitorID, ClientExhibitorID, CompanyName, ";
									SQLQueryInsert = SQLQueryInsert + "AddressLine1, AddressLine2, City, ";
									SQLQueryInsert = SQLQueryInsert + "State, ZipPostalCode, Country, ";
									SQLQueryInsert = SQLQueryInsert + "Website, PrimaryOnsiteContactName, PrimaryOnsiteContactEmail, ";
									SQLQueryInsert = SQLQueryInsert + "PrimaryOnsiteContactPhone, BoothNumber, ProductsServices, ";
									SQLQueryInsert = SQLQueryInsert + "CompanyDescription, SearchField, SocialMediaFacebook, ";
									SQLQueryInsert = SQLQueryInsert + "SocialMediaTwitter, SocialMediaGooglePlus, SocialMediaYouTube, ";
									SQLQueryInsert = SQLQueryInsert + "SocialMediaLinkedIn) ";
									SQLQueryInsert = SQLQueryInsert + "VALUES(" + data[i].ExhibitorID + ", ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].ClientExhibitorID + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].CompanyName + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].AddressLine1 + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].AddressLine2 + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].City + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].State + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].ZipPostalCode + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].Country + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].Website + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].PrimaryOnsiteContactName + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].PrimaryOnsiteContactEmail + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].PrimaryOnsiteContactPhone + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].BoothNumber + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].ProductsServices + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].CompanyDescription + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].SearchField + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].SocialMediaFacebook + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].SocialMediaTwitter + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].SocialMediaGooglePlus + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].SocialMediaYouTube + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].SocialMediaLinkedIn + "')";
									
									SQLQueryUpdate = "UPDATE exhibitors ";
									SQLQueryUpdate = SQLQueryUpdate + "SET CompanyName = '" + data[i].CompanyName + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "AddressLine1 = '" + data[i].AddressLine1 + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "AddressLine2 = '" + data[i].AddressLine2 + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "City = '" + data[i].City + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "State = '" + data[i].State + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "ZipPostalCode = '" + data[i].ZipPostalCode + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "Country = '" + data[i].Country + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "Website = '" + data[i].Website + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "PrimaryOnsiteContactName = '" + data[i].PrimaryOnsiteContactName + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "PrimaryOnsiteContactEmail = '" + data[i].PrimaryOnsiteContactEmail + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "PrimaryOnsiteContactPhone = '" + data[i].PrimaryOnsiteContactPhone + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "BoothNumber = '" + data[i].BoothNumber + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "ProductsServices = '" + data[i].ProductsServices + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "CompanyDescription = '" + data[i].CompanyDescription + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "SearchField = '" + data[i].SearchField + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "SocialMediaFacebook = '" + data[i].SocialMediaFacebook + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "SocialMediaTwitter = '" + data[i].SocialMediaTwitter + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "SocialMediaGooglePlus = '" + data[i].SocialMediaGooglePlus + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "SocialMediaYouTube = '" + data[i].SocialMediaYouTube + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "SocialMediaLinkedIn = '" + data[i].SocialMediaLinkedIn + "' ";
									SQLQueryUpdate = SQLQueryUpdate + "WHERE ExhibitorID = " + data[i].ExhibitorID + " ";

									SQLQueryDelete = "NO";
									break;
								case "attendee_courses":
									SQLQuerySelect = "SELECT * FROM attendee_courses ";
									SQLQuerySelect = SQLQuerySelect + "WHERE acID = " + data[i].acID + " ";

									SQLQueryInsert = "INSERT INTO attendee_courses(";
									SQLQueryInsert = SQLQueryInsert + "acID, ct_id, bt_imis_id, st_imis_id, ";
									SQLQueryInsert = SQLQueryInsert + "quantity, subevent_id, session_id, waitlist, test) ";
									SQLQueryInsert = SQLQueryInsert + "VALUES(" + data[i].acID + ", ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].ct_id + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].bt_imis_id + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].st_imis_id + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].quantity + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].subevent_id + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].session_id + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].waitlist + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].test + "')";

									SQLQueryUpdate = "UPDATE attendee_courses ";
									SQLQueryUpdate = SQLQueryUpdate + "SET bt_imis_id = '" + data[i].bt_imis_id + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "st_imis_id = '" + data[i].st_imis_id + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "quantity = '" + data[i].quantity + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "subevent_id = '" + data[i].subevent_id + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "session_id = '" + data[i].session_id + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "waitlist = '" + data[i].waitlist + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "test = '" + data[i].test + "' ";
									SQLQueryUpdate = SQLQueryUpdate + "WHERE acID = " + data[i].acID + " ";

									SQLQueryDelete = "NO";
									//console.log('Sync, attendee_courses, SELECT: ' + SQLQuerySelect);
									//console.log('Sync, attendee_courses, INSERT: ' + SQLQueryInsert);
									//console.log('Sync, attendee_courses, UPDATE: ' + SQLQueryUpdate);
									break;
								case "attendee_notes":
									SQLQuerySelect = "SELECT * FROM attendee_notes ";
									SQLQuerySelect = SQLQuerySelect + "WHERE AttendeeID = '" + data[i].AttendeeID + "' ";
									SQLQuerySelect = SQLQuerySelect + "AND EventID = '" + data[i].session_id + "' ";

									SQLQueryInsert = "INSERT INTO attendee_notes(";
									SQLQueryInsert = SQLQueryInsert + "AttendeeID, EventID, Note, ";
									SQLQueryInsert = SQLQueryInsert + "LastUpdated, UpdateType) ";
									SQLQueryInsert = SQLQueryInsert + "VALUES('" + data[i].AttendeeID + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].EventID + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].Note + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].LastUpdated + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].UpdateType + "')";

									SQLQueryUpdate = "UPDATE attendee_notes ";
									SQLQueryUpdate = SQLQueryUpdate + "SET Note = '" + data[i].Date_Start + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "LastUpdated = '" + data[i].Date_End + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "UpdateType = '" + data[i].Time_Start + "' ";
									SQLQueryUpdate = SQLQueryUpdate + "WHERE AttendeeID = '" + data[i].AttendeeID + "' ";
									SQLQueryUpdate = SQLQueryUpdate + "AND EventID = '" + data[i].EventID + "' ";

									SQLQueryDelete = "NO";
									break;
								case "lookup_rooms":
									SQLQuerySelect = "SELECT * FROM lookup_rooms ";
									SQLQuerySelect = SQLQuerySelect + "WHERE lrID = '" + data[i].lrID + "' ";

									SQLQueryInsert = "INSERT INTO lookup_rooms(";
									SQLQueryInsert = SQLQueryInsert + "lrID, RoomName, RoomDisplayName, ";
									SQLQueryInsert = SQLQueryInsert + "FloorNumber, BuildingName, RoomX, RoomY, ActiveYN, DateAdded) ";
									SQLQueryInsert = SQLQueryInsert + "VALUES('" + data[i].lrID + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].RoomName + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].RoomDisplayName + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].FloorNumber + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].BuildingName + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].RoomX + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].RoomY + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].ActiveYN + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].DateAdded + "')";

									SQLQueryUpdate = "UPDATE lookup_rooms ";
									SQLQueryUpdate = SQLQueryUpdate + "SET RoomName = '" + data[i].RoomName + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "RoomDisplayName = '" + data[i].RoomDisplayName + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "FloorNumber = '" + data[i].FloorNumber + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "BuildingName = '" + data[i].BuildingName + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "RoomX = '" + data[i].RoomX + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "RoomY = '" + data[i].RoomY + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "ActiveYN = '" + data[i].ActiveYN + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "DateAdded = '" + data[i].DateAdded + "' ";
									SQLQueryUpdate = SQLQueryUpdate + "WHERE lrID = '" + data[i].lrID + "' ";

									SQLQueryDelete = "NO";
									break;
								case "evaluations":
									SQLQuerySelect = "SELECT * FROM evaluations WHERE AttendeeID = '" + data[i].AttendeeID + "' AND evaluationType = '" + data[i].evaluationType + "' AND session_id = '" + data[i].session_id + "'";

									SQLQueryInsert = "INSERT INTO evaluations(";
									SQLQueryInsert = SQLQueryInsert + "AttendeeID, evalID, session_id, evaluationType, ";
									SQLQueryInsert = SQLQueryInsert + "Q11, Q12, Q21, Q22, Q23, Q24, Q25, Q26, ";
									SQLQueryInsert = SQLQueryInsert + "Q31, Q32, Q33, Q41) ";
									SQLQueryInsert = SQLQueryInsert + "VALUES(" + data[i].AttendeeID + ", ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].evalID + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].session_id + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].evaluationType + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].Q11 + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].Q12 + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].Q21 + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].Q22 + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].Q23 + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].Q24 + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].Q25 + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].Q26 + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].Q31 + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].Q32 + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].Q33 + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].Q41 + "')";

									SQLQueryUpdate = "UPDATE evaluations ";
									SQLQueryUpdate = SQLQueryUpdate + "SET Q11 = '" + data[i].Q11 + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "Q12 = '" + data[i].Q12 + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "Q21 = '" + data[i].Q21 + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "Q22 = '" + data[i].Q22 + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "Q23 = '" + data[i].Q23 + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "Q24 = '" + data[i].Q24 + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "Q25 = '" + data[i].Q25 + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "Q26 = '" + data[i].Q26 + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "Q31 = '" + data[i].Q31 + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "Q32 = '" + data[i].Q32 + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "Q33 = '" + data[i].Q33 + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "Q41 = '" + data[i].Q41 + "' ";
									SQLQueryUpdate = SQLQueryUpdate + "WHERE AttendeeID = '" + data[i].AttendeeID + "' ";
									SQLQueryUpdate = SQLQueryUpdate + "AND session_id = '" + data[i].session_id + "' ";
									SQLQueryUpdate = SQLQueryUpdate + "AND evaluationType = '" + data[i].evaluationType + "' ";
									
									SQLQueryDelete = "NO";

									break;
								case "activities_feed":
									SQLQuerySelect = "SELECT afID FROM activities_feed ";
									SQLQuerySelect = SQLQuerySelect + "WHERE afID = '" + data[i].afID + "' ";

									SQLQueryInsert = "INSERT INTO activities_feed(";
									SQLQueryInsert = SQLQueryInsert + "afID, AttendeeID, afDateTime, afChatCounter, ";
									SQLQueryInsert = SQLQueryInsert + "afLikesCounter, afMessage, afImageAttachment, DateAdded, UpdateType) ";
									SQLQueryInsert = SQLQueryInsert + "VALUES('" + data[i].afID + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].AttendeeID + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].afDateTime + "', ";
									SQLQueryInsert = SQLQueryInsert + " " + data[i].afChatCounter + ", ";
									SQLQueryInsert = SQLQueryInsert + " " + data[i].afLikesCounter + ", ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].afMessage.replace(/'/g, "''") + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].afImageAttachment + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].DateAdded + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].UpdateType + "')";

									SQLQueryUpdate = "UPDATE activities_feed ";
									SQLQueryUpdate = SQLQueryUpdate + "SET afChatCounter = " + data[i].afChatCounter + ", ";
									SQLQueryUpdate = SQLQueryUpdate + "afLikesCounter = " + data[i].afLikesCounter + ", ";
									SQLQueryUpdate = SQLQueryUpdate + "afMessage = '" + data[i].afMessage.replace(/'/g, "''") + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "afImageAttachment = '" + data[i].afImageAttachment + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "DateAdded = '" + data[i].DateAdded + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "UpdateType = '" + data[i].UpdateType + "' ";
									SQLQueryUpdate = SQLQueryUpdate + "WHERE afID = '" + data[i].afID + "' ";

									SQLQueryDelete = "NO";
									break;
								case "attendees":
									SQLQuerySelect = "SELECT AttendeeID FROM attendees ";
									SQLQuerySelect = SQLQuerySelect + "WHERE AttendeeID = '" + data[i].AttendeeID + "' ";

									SQLQueryInsert = "INSERT INTO attendees(";
									SQLQueryInsert = SQLQueryInsert + "AttendeeID, FirstName, LastName, Title, ";
									SQLQueryInsert = SQLQueryInsert + "Company, ActiveYN, City, State, Country, avatarFilename, badge, SearchField, ";
									SQLQueryInsert = SQLQueryInsert + "smTwitter, showTwitter, smFaceBook, showFacebook, ";
									SQLQueryInsert = SQLQueryInsert + "smLinkedIn, showLinkedIn, smInstagram, showInstagram, smPinterest, showPinterest) ";
									SQLQueryInsert = SQLQueryInsert + "VALUES('" + data[i].AttendeeID + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].FirstName + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].LastName + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].Title + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].Company + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].ActiveYN + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].City + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].State + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].Country + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].avatarFilename + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].badge + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].SearchField + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].smTwitter + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].showTwitter + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].smFaceBook + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].showFacebook + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].smLinkedIn + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].showLinkedIn + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].smInstagram + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].showInstagram + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].smPinterest + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].showPinterest + "')";

									SQLQueryUpdate = "UPDATE attendees ";
									SQLQueryUpdate = SQLQueryUpdate + "SET FirstName = '" + data[i].FirstName + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "LastName = '" + data[i].LastName + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "Title = '" + data[i].Title + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "Company = '" + data[i].Company + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "ActiveYN = '" + data[i].ActiveYN + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "City = '" + data[i].City + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "State = '" + data[i].State + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "Country = '" + data[i].Country + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "avatarFilename = '" + data[i].avatarFilename + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "badge = '" + data[i].badge + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "SearchField = '" + data[i].SearchField + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "smTwitter = '" + data[i].smTwitter + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "showTwitter = '" + data[i].showTwitter + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "smFaceBook = '" + data[i].smFaceBook + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "showFacebook = '" + data[i].showFacebook + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "smLinkedIn = '" + data[i].smLinkedIn + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "showLinkedIn = '" + data[i].showLinkedIn + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "smInstagram = '" + data[i].smInstagram + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "showInstagram = '" + data[i].showInstagram + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "smPinterest = '" + data[i].smPinterest + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "showPinterest = '" + data[i].showPinterest + "' ";
									SQLQueryUpdate = SQLQueryUpdate + "WHERE AttendeeID = '" + data[i].AttendeeID + "' ";

									SQLQueryDelete = "NO";
									break;
								case "notifications":
									SQLQuerySelect = "SELECT * FROM attendee_push_notifications ";
									SQLQuerySelect = SQLQuerySelect + "WHERE pushTitle = '" + data[i].pushTitle + "' ";
									SQLQuerySelect = SQLQuerySelect + "AND pushMessage = '" + data[i].pushMessage + "' ";
									//SQLQuerySelect = SQLQuerySelect + "AND pushDateTimeReceived = '" + data[i].pushDateTimeReceived + "' ";

									SQLQueryInsert = "INSERT INTO attendee_push_notifications(";
									SQLQueryInsert = SQLQueryInsert + "pnID, pushTitle, pushMessage, pushDateTimeReceived) ";
									SQLQueryInsert = SQLQueryInsert + "VALUES('" + data[i].pnID + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].pushTitle + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].pushMessage + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].pushDateTimeReceived + "')";

									SQLQueryUpdate = "NO";

									SQLQueryDelete = "NO";

									console.log('DB, Notifications, SQLQuerySelect: ' + SQLQuerySelect + ', SQLQueryInsert: ' + SQLQueryInsert);

									break;
								case "attendee_bookmarks":
									SQLQuerySelect = "SELECT * FROM attendee_bookmarks ";
									SQLQuerySelect = SQLQuerySelect + "WHERE AttendeeID = '" + data[i].AttendeeID + "' ";
									SQLQuerySelect = SQLQuerySelect + "AND BookmarkType = '" + data[i].BookmarkType + "' ";
									SQLQuerySelect = SQLQuerySelect + "AND BookmarkID = '" + data[i].BookmarkID + "' ";

									SQLQueryInsert = "INSERT INTO attendee_bookmarks(";
									SQLQueryInsert = SQLQueryInsert + "abID, AttendeeID, BookmarkType, BookmarkID, ";
									SQLQueryInsert = SQLQueryInsert + "DateAdded, UpdateType) ";
									SQLQueryInsert = SQLQueryInsert + "VALUES(" + data[i].abID + ", ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].AttendeeID + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].BookmarkType + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].BookmarkID + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].DateAdded + "', ";
									SQLQueryInsert = SQLQueryInsert + "'" + data[i].UpdateType + "')";

									SQLQueryUpdate = "UPDATE attendee_bookmarks ";
									SQLQueryUpdate = SQLQueryUpdate + "SET BookmarkType = '" + data[i].BookmarkType + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "BookmarkID = '" + data[i].BookmarkID + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "DateAdded = '" + data[i].DateAdded + "', ";
									SQLQueryUpdate = SQLQueryUpdate + "UpdateType = '" + data[i].UpdateType + "' ";
									SQLQueryUpdate = SQLQueryUpdate + "WHERE AttendeeID = '" + data[i].AttendeeID + "' ";
									SQLQueryUpdate = SQLQueryUpdate + "AND BookmarkType = '" + data[i].BookmarkType + "' ";
									SQLQueryUpdate = SQLQueryUpdate + "AND BookmarkID = '" + data[i].BookmarkID + "' ";

									SQLQueryDelete = "DELETE FROM attendee_bookmarks ";
									SQLQueryDelete = SQLQueryDelete + "WHERE AttendeeID = '" + data[i].AttendeeID + "' ";
									SQLQueryDelete = SQLQueryDelete + "AND BookmarkType = '" + data[i].BookmarkType + "' ";
									SQLQueryDelete = SQLQueryDelete + "AND BookmarkID = '" + data[i].BookmarkID + "' ";
									break;
								case "duplicateexhibitors":
									SQLQuerySelect = "SELECT COUNT(*) FROM exhibitors";
									SQLQueryInsert = "SELECT COUNT(*) FROM exhibitors";
									SQLQueryUpdate = "DELETE FROM exhibitors WHERE rowid NOT IN (SELECT max(rowid) FROM exhibitors GROUP BY ExhibitorID)";
									SQLQueryDelete = "NO";
									break;
								case "duplicatecourses":
									SQLQuerySelect = "SELECT COUNT(*) FROM courses";
									SQLQueryInsert = "SELECT COUNT(*) FROM courses";
									SQLQueryUpdate = "DELETE FROM courses WHERE rowid NOT IN (SELECT max(rowid) FROM courses GROUP BY session_id)";
									SQLQueryDelete = "NO";
									break;
								case "duplicatespeakers":
									SQLQuerySelect = "SELECT COUNT(*) FROM courses_speakers";
									SQLQueryInsert = "SELECT COUNT(*) FROM courses_speakers";
									SQLQueryUpdate = "DELETE FROM courses_speakers WHERE rowid NOT IN (SELECT max(rowid) FROM courses_speakers GROUP BY speakerID)";
									SQLQueryDelete = "NO";
									break;
								case "duplicateces":
									SQLQuerySelect = "SELECT COUNT(*) FROM attendee_ces";
									SQLQueryInsert = "SELECT COUNT(*) FROM attendee_ces";
									SQLQueryUpdate = "DELETE FROM attendee_ces WHERE rowid NOT IN (SELECT max(rowid) FROM attendee_ces GROUP BY AttendeeID, session_id)";
									SQLQueryDelete = "NO";
									break;
								case "duplicateattendeecourses":
									SQLQuerySelect = "SELECT COUNT(*) FROM attendee_courses";
									SQLQueryInsert = "SELECT COUNT(*) FROM attendee_courses";
									SQLQueryUpdate = "DELETE FROM attendee_courses WHERE rowid NOT IN (SELECT max(rowid) FROM attendee_courses GROUP BY ct_id, session_id)";
									SQLQueryDelete = "NO";
									break;
							}
					

							// Execute the custom SQL query to insert or update a record in the local database
							this.DBCallQuery(SQLQuerySelect, SQLQueryInsert, SQLQueryUpdate, SQLQueryDelete).then(DBCallOutput => {
								console.log('DBCallOutput: ' + DBCallOutput);
								//console.log('DBCallQuery output: ' + DBCallOutput);
								this.DBCallQuery2(DBCallOutput);
							})
						}
							
					}
					
					
					// Done
					if (data['length']>0) {
						// Send event notice to update left hand menu
						this.events.publish('user:Status', 'Sync Update');
						// Send event notice to update CE Tracker list
						//this.events.publish('sync:Status', 'Sync Update');
					}
					resolve("Done");
				},
				err => {
					if (err.status == "412") {
						console.log("App and API versions don't match.");
						resolve("Error");
					} else {
						console.log(err.status);
						console.log("API Error: ", JSON.stringify(err));
					}
				}
			);
		});

	}

	// -----------------------------------
	// Database Sync
	// 
	// Updated records: SQLite to MySQL
	// 
	// -----------------------------------
    public DBSyncUpdateS2M(LastSync, ThisSync) {

		var flags = "UpdateS2M|" + LastSync + "|" + ThisSync;
		var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
		var SQLQuery = "";
		var QueryType = "";
		// Get changed records in SQLite
			
		// Sync Itinerary
		SQLQuery = "SELECT * FROM itinerary ";
		SQLQuery = SQLQuery + "WHERE AttendeeID = '" + AttendeeID + "' ";
		SQLQuery = SQLQuery + "AND LastUpdated BETWEEN '" + LastSync + "' AND '" + ThisSync + "'";
		QueryType = "itinerary";
		
		console.log('Sync UpdateS2M: Starting sync');
		return new Promise(resolve => {
			console.log('Sync UpdateS2M: Itinerary query: ' + SQLQuery);
			this.DBGetData(QueryType, SQLQuery).then(data => {
				if (data['length']>0) {
					for (var i = 0; i < data['length']; i++) {
						
						flags = "UpdateS2M|" + LastSync + "|" + ThisSync;
						flags = flags + "|itinerary";
						flags = flags + "|" + data[i].mtgID;
						flags = flags + "|" + data[i].Date_Start;
						flags = flags + "|" + data[i].Date_End;
						flags = flags + "|" + data[i].Time_Start;
						flags = flags + "|" + data[i].Time_End;
						flags = flags + "|" + data[i].Subject;
						flags = flags + "|" + data[i].Location;
						flags = flags + "|" + data[i].Description;
						flags = flags + "|" + data[i].atID;
						flags = flags + "|" + data[i].AttendeeID;
						flags = flags + "|" + data[i].EventID;
						flags = flags + "|" + data[i].LastUpdated;
						flags = flags + "|" + data[i].UpdateType;
						
						var url = SyncURLReference + "action=sync&flags=" + flags + "&AttendeeID=" + AttendeeID;
						
						//return new Promise(resolve => {
							console.log('Sync UpdateS2M: Itinerary URL: ' + url);
							this.httpCall.get(url).subscribe(data3 => {
								console.log('Sync UpdateS2M: Response: ' + JSON.stringify(data3));
								//resolve("Done");
							},
							err => {
								console.log('Sync UpdateS2M: Response: ' + JSON.stringify(err));
								//resolve("Error");
							});
						//});
						
					}
				}
			});

			// Sync Evaluations (lectures/workshops)
			SQLQuery = "SELECT session_id, evaluationType, Q11, Q12, Q21, Q22, Q23, Q24, Q25, Q26, Q31, Q32, Q33, Q41, LastUpdated, UpdateType FROM evaluations ";
			SQLQuery = SQLQuery + "WHERE AttendeeID = '" + AttendeeID + "' ";
			//SQLQuery = SQLQuery + "AND LastUpdated BETWEEN '" + LastSync + "' AND '" + ThisSync + "'";
			QueryType = "evaluations";
		
			console.log('Sync UpdateS2M: Evaluations (lectures/workshops) query: ' + SQLQuery);
			this.DBGetData(QueryType, SQLQuery).then(data => {
				if (data['length']>0) {
					for (var i = 0; i < data['length']; i++) {
						
						flags = "UpdateS2M|" + LastSync + "|" + ThisSync;
						flags = flags + "|evaluations";
						flags = flags + "|" + data[i].AttendeeID;
						flags = flags + "|" + data[i].session_id;
						flags = flags + "|" + data[i].evaluationType;
						flags = flags + "|" + data[i].Q11;
						flags = flags + "|" + data[i].Q12;
						flags = flags + "|" + data[i].Q21;
						flags = flags + "|" + data[i].Q22;
						flags = flags + "|" + data[i].Q23;
						flags = flags + "|" + data[i].Q24;
						flags = flags + "|" + data[i].Q25;
						flags = flags + "|" + data[i].Q26;
						flags = flags + "|" + data[i].Q31;
						flags = flags + "|" + data[i].Q32;
						flags = flags + "|" + data[i].Q33;
						flags = flags + "|" + data[i].Q41;
						flags = flags + "|" + data[i].LastUpdated;
						flags = flags + "|" + data[i].UpdateType;
						
						var url = SyncURLReference + "action=sync&flags=" + flags + "&AttendeeID=" + AttendeeID;
						
						//return new Promise(resolve => {
							console.log('Sync UpdateS2M: Evaluations (lectures/workshops) URL: ' + url);
							this.httpCall.get(url).subscribe(data3 => {
								console.log('Sync UpdateS2M: Response: ' + JSON.stringify(data3));
								//resolve("Done");
							},
							err => {
								console.log('Sync UpdateS2M: Response: ' + JSON.stringify(err));
								//resolve("Error");
							});
						//});
						
					}
				}
			});
			
			// Sync Evaluations (conference)
			SQLQuery = "SELECT * FROM evaluation_conference ";
			SQLQuery = SQLQuery + "WHERE AttendeeID = '" + AttendeeID + "' ";
			//SQLQuery = SQLQuery + "AND LastUpdated BETWEEN '" + LastSync + "' AND '" + ThisSync + "'";
			QueryType = "evaluation_conference";
		
			console.log('Sync UpdateS2M: Evaluations (conference) query: ' + SQLQuery);
			this.DBGetData(QueryType, SQLQuery).then(data => {
				if (data['length']>0) {
					for (var i = 0; i < data['length']; i++) {
						
						flags = "UpdateS2M|" + LastSync + "|" + ThisSync;
						flags = flags + "|evaluation_conference";
						flags = flags + "|" + data[i].AttendeeID;
						flags = flags + "|" + data[i].session_id;
						flags = flags + "|" + data[i].evaluationType;
						flags = flags + "|" + data[i].Q1;
						flags = flags + "|" + data[i].Q2;
						flags = flags + "|" + data[i].Q3;
						flags = flags + "|" + data[i].Q4;
						flags = flags + "|" + data[i].Q5;
						flags = flags + "|" + data[i].Q5C;
						flags = flags + "|" + data[i].Q6;
						flags = flags + "|" + data[i].Q7;
						flags = flags + "|" + data[i].Q7C;
						flags = flags + "|" + data[i].Q8;
						flags = flags + "|" + data[i].Q9;
						flags = flags + "|" + data[i].Q10;
						flags = flags + "|" + data[i].Q10C;
						flags = flags + "|" + data[i].Q11;
						flags = flags + "|" + data[i].Q11C;
						flags = flags + "|" + data[i].LastUpdated;
						flags = flags + "|" + data[i].UpdateType;
						
						var url = SyncURLReference + "action=sync&flags=" + flags + "&AttendeeID=" + AttendeeID;
						
						//return new Promise(resolve => {
							console.log('Sync UpdateS2M: Evaluations (conference) URL: ' + url);
							this.httpCall.get(url).subscribe(data3 => {
								console.log('Sync UpdateS2M: Response: ' + JSON.stringify(data3));
								//resolve("Done");
							},
							err => {
								console.log('Sync UpdateS2M: Response: ' + JSON.stringify(err));
								//resolve("Error");
							});
						//});
						
					}
				}
			});

			// Sync Notes
			SQLQuery = "SELECT * FROM attendee_notes ";
			SQLQuery = SQLQuery + "WHERE AttendeeID = '" + AttendeeID + "' ";
			SQLQuery = SQLQuery + "AND LastUpdated BETWEEN '" + LastSync + "' AND '" + ThisSync + "'";
			QueryType = "attendee_notes";
		
			console.log('Sync UpdateS2M: Notes query: ' + SQLQuery);
			this.DBGetData(QueryType, SQLQuery).then(data => {
				if (data['length']>0) {
					for (var i = 0; i < data['length']; i++) {
						
						flags = "UpdateS2M|" + LastSync + "|" + ThisSync;
						flags = flags + "|attendee_notes";
						flags = flags + "|" + data[i].AttendeeID;
						flags = flags + "|" + data[i].EventID;
						flags = flags + "|" + data[i].Note;
						flags = flags + "|" + data[i].LastUpdated;
						flags = flags + "|" + data[i].UpdateType;
						
						var url = SyncURLReference + "action=sync&flags=" + flags + "&AttendeeID=" + AttendeeID;
						
						//return new Promise(resolve => {
							console.log('Sync UpdateS2M: Notes URL: ' + url);
							this.httpCall.get(url).subscribe(data3 => {
								console.log('Sync UpdateS2M: Response: ' + JSON.stringify(data3));
								//resolve("Done");
							},
							err => {
								console.log('Sync UpdateS2M: Response: ' + JSON.stringify(err));
								//resolve("Error");
							});
						//});
						
					}
				}
			});
		});	
		// Done
		//resolve("Done");
				
	}
	
}