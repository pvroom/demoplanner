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
		qp.set('acy','2019');
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
    public DBCallQuery(SQLSelectQuery, SQLInsertQuery, SQLUpdateQuery, SQLDeleteQuery) {
		
		console.log('DBCall: ' + SQLSelectQuery);
		
		return new Promise(resolve => {
			this.sqlite.create({name: 'cvPlanner.db', location: 'default'}).then((db: SQLiteObject) => {
				
				this.db = db;
				this.db.executeSql(SQLSelectQuery, <any>{}).then((dataS) => {
					console.log('DBCallQuery Return: ' + JSON.stringify(dataS));
					if (dataS.rows.length > 0) {
						if (SQLUpdateQuery.length == 0) {
							resolve(SQLDeleteQuery);
						} else {
							//console.log('DBCallQuery: ' + SQLUpdateQuery);
							resolve(SQLUpdateQuery);
						}
					} else {
						if (SQLInsertQuery.length == 0) {
							resolve(SQLDeleteQuery);
						} else {
							//console.log('DBCallQuery: ' + SQLInsertQuery);
							resolve(SQLInsertQuery);
						}
					}
				})
				.catch(e => console.log('Sync DBCallQuery: Error executing (' + SQLSelectQuery + ') base record: ' + JSON.stringify(e)))
			});
		});
		
	}

    public DBCallQuery2(SQLQuery) {
		
		console.log('DBCallQuery2: ' + SQLQuery);
		
		return new Promise(resolve => {
			if (SQLQuery != '') {
				this.sqlite.create({name: 'cvPlanner.db', location: 'default'}).then((db: SQLiteObject) => {
					
					this.db = db;
					this.db.executeSql(SQLQuery, <any>{}).then((dataS) => {
						resolve(SQLQuery);
					})
					.catch(e => console.log('Sync DBCallQuery2: Error executing (' + SQLQuery + ') base record: ' + JSON.stringify(e)))
					
				});
			} else {
				resolve(SQLQuery);
			}
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
							SQLQuerySelect = data[i].SQLSelect;
							SQLQueryInsert = data[i].SQLInsert;
							SQLQueryUpdate = data[i].SQLUpdate;
							SQLQueryDelete = data[i].SQLDelete;							

							// Execute the custom SQL query to insert or update a record in the local database
							this.DBCallQuery(SQLQuerySelect, SQLQueryInsert, SQLQueryUpdate, SQLQueryDelete).then(DBCallOutput => {
								console.log('DBCallOutput: ' + DBCallOutput);
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