// Components, functions, plugins
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, NgModule } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import { Database } from './../../providers/database/database';
import { Localstorage } from './../../providers/localstorage/localstorage';

declare var formatTime: any;
declare var dateFormat: any;

@IonicPage()
@Component({
  selector: 'page-evaluationworkshop',
  templateUrl: 'evaluationworkshop.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class EvaluationWorkshop {
	
	// Eval header variables
	public DisplayEventName: string;
	public DisplayEventTimeDateLocation: string;
	
	// Eval question variables
	public CEEvaluationQ11: string;
	public CEEvaluationQ12: string;
	public CEEvaluationQ21: string;
	public CEEvaluationQ22: string;
	public CEEvaluationQ23: string;
	public CEEvaluationQ24: string;
	public CEEvaluationQ25: string;
	public CEEvaluationQ26: string;
	public CEEvaluationQ31: string;
	public CEEvaluationQ32: string;
	public CEEvaluationQ33: string;
	public CEEvaluationQ41: string;
	
	constructor(public navCtrl: NavController, 
				public navParams: NavParams, 
				private nav: NavController,
				public cd: ChangeDetectorRef,
				private storage: Storage,
				public loadingCtrl: LoadingController,
				private alertCtrl: AlertController,
				private databaseprovider: Database,
				private localstorage: Localstorage) {

	}

	mcqAnswer(value){
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

			if (data['length']>0) {
				
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
			cssClass: 'alert-danger',
			buttons: ['Ok']
		});

		// Alert for failed save
		let failalert = this.alertCtrl.create({
			title: 'Evaluation Entry',
			subTitle: 'Unable to save your evaluation at this time - please try again in a little bit.',
			cssClass: 'alert-danger',
			buttons: ['Ok']
		});

		// Alert for required fields
		let requiredalert = this.alertCtrl.create({
			title: 'Evaluation Entry',
			subTitle: 'All questions in blocks 1, 2 and 3 are required to be completed before saving.',
			cssClass: 'alert-danger',
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

        } else {

            // Get last update performed by this app
			var ThisSync2 = new Date().toUTCString();
			var ThisSync = dateFormat(ThisSync2, "UTC:yyyy-mm-dd' 'HH:MM:ss");

			flags = "es|" + EventID + "|Workshop|" + Q11 + "|" + Q12 + "|" + Q21 + "|" + Q22 + "|" + Q23 + "|" + Q24 + "|" + Q25 + "|" + Q26 + "|" + Q31 + "|" + Q32 + "|" + Q33 + "|" + Q41 + "|" + ThisSync;
			console.log('Save Evaluation (Workshop) flags: ' + flags);
			
			this.databaseprovider.getEvaluationData(flags, AttendeeID).then(data => {
				
				console.log("getEvaluationData: " + JSON.stringify(data));

				if (data['length']>0) {
					
					if (data[0].EVStatus == "Success") {
						// Saved
						saving.dismiss();
						savealert.present();
						this.navCtrl.pop();
					} else {
						// Not saved
						console.log("Query: " + data[0].EVQuery);
						saving.dismiss();
						failalert.present();
					}
					
				} else {
					
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

}