// Components, functions, plugins
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, NgModule } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import { Database } from './../../providers/database/database';
import { Localstorage } from './../../providers/localstorage/localstorage';
import { NgZone } from '@angular/core';

// Pages
import { HomePage } from '../home/home';

@Component({
  selector: 'page-evaluationconference',
  templateUrl: 'evaluationconference.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class EvaluationConference {
		
	// Eval question variables
	public eventSurveyQ1 = "";
	public eventSurveyQ1C = "";
	public eventSurveyQ2 = "";
	public eventSurveyQ2C = "";
	public eventSurveyQ3 = "";
	public eventSurveyQ3C = "";
	public eventSurveyQ4 = "";
	public eventSurveyQ4C = "";
	public eventSurveyQ5 = "";
	public eventSurveyQ6 = "";
	public eventSurveyQ6C = "";
	public eventSurveyQ7 = "";
	public eventSurveyQ7C = "";
	public eventSurveyQ8 = "";
	public eventSurveyQ8C = "";
	public eventSurveyQ9 = "";
	public eventSurveyQ10 = "";
	public eventSurveyQ10C = "";
	public eventSurveyQ11 = "";
	public eventSurveyQ11C = "";
	public eventSurveyQ12 = "";
	public eventSurveyQ13 = "";
	

	constructor(public navCtrl: NavController, 
				public navParams: NavParams, 
				private nav: NavController,
				private storage: Storage,
				public cd: ChangeDetectorRef,
				public zone: NgZone,
				public loadingCtrl: LoadingController,
				private alertCtrl: AlertController, 
				private databaseprovider: Database,
				private localstorage: Localstorage) {
				
	}

	mcqAnswer(value){
	   console.log(value);
	}

	ionViewDidLoad() {

		console.log('ionViewDidLoad: EvaluationConference');
		//this.LoadData();

	}

	ionViewDidEnter() {
		console.log('ionViewDidEnter: EvaluationConference');
		
		// Load / refresh data when coming to this page
		//this.LoadData();
	}
	
    ngOnInit() {
		
		this.cd.markForCheck();
		var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
		var EventID = "0";

		var flags;
		
		flags = "ec|" + EventID + "|Conference|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0";
		
		flags = "ec|" + EventID + "|Conference|";
		flags = flags + "0|0|";
		flags = flags + "0|0|";
		flags = flags + "0|0|";
		flags = flags + "0|0|";
		flags = flags + "0|";
		flags = flags + "0|0|";
		flags = flags + "0|0|";
		flags = flags + "0|0|";
		flags = flags + "0|";
		flags = flags + "0|0|";
		flags = flags + "0|0|";
		flags = flags + "0|";
		flags = flags + "0|";

		
		this.databaseprovider.getEvaluationData(flags, AttendeeID).then(data => {
			
			console.log("getEvaluationData: " + JSON.stringify(data));

			if (data['length']>0) {
				
				console.log('Using previously saved answers');
												
				this.eventSurveyQ1 = data[0].Q1;
				this.eventSurveyQ1C = data[0].Q1C;
				this.eventSurveyQ2 = data[0].Q2;
				this.eventSurveyQ2C = data[0].Q2C;
				this.eventSurveyQ3 = data[0].Q3;
				this.eventSurveyQ3C = data[0].Q3C;
				this.eventSurveyQ4 = data[0].Q4;
				this.eventSurveyQ4C = data[0].Q4C;
				this.eventSurveyQ5 = data[0].Q5;
				this.eventSurveyQ6 = data[0].Q6;
				this.eventSurveyQ6C = data[0].Q6C;
				this.eventSurveyQ7 = data[0].Q7;
				this.eventSurveyQ7C = data[0].Q7C;
				this.eventSurveyQ8 = data[0].Q8;
				this.eventSurveyQ8C = data[0].Q8C;
				this.eventSurveyQ9 = data[0].Q9;
				this.eventSurveyQ10 = data[0].Q10;
				this.eventSurveyQ10C = data[0].Q10C;
				this.eventSurveyQ11 = data[0].Q11;
				this.eventSurveyQ11C = data[0].Q11C;
				this.eventSurveyQ12 = data[0].Q12;
				this.eventSurveyQ13 = data[0].Q13;

			}
			
			this.cd.markForCheck();
			this.mcqAnswer(900);
			
		}).catch(function () {
			console.log("Promise Rejected");
		});

	}
	
	
	SubmitEvaluation() {
		
        console.log('Save evaluation (Conference)...');

		// Saving progress
		let saving = this.loadingCtrl.create({
			spinner: 'crescent',
			content: 'Saving...'
		});

		// Alert for successful save
		let savealert = this.alertCtrl.create({
			title: 'Evaluation',
			subTitle: 'Evaluation has been saved.',
			buttons: ['Ok']
		});

		// Alert for failed save
		let failalert = this.alertCtrl.create({
			title: 'Evaluation Entry',
			subTitle: 'Unable to save your evaluation at this time - please try again in a little bit.',
			buttons: ['Ok']
		});

		// Alert for required fields
		let requiredalert = this.alertCtrl.create({
			title: 'Evaluation Entry',
			subTitle: 'All questions are required to be completed before saving.',
			buttons: ['Ok']
		});
		let requiredalert2 = this.alertCtrl.create({
			title: 'Evaluation Entry',
			subTitle: 'All questions are required to be completed before saving.  Some questions, when selecting No or Other, require an additional comment to be entered.',
			buttons: ['Ok']
		});

		// Show saving progress
		saving.present();

		var Q1 = this.eventSurveyQ1;
		var Q1C = this.eventSurveyQ1C || '';
		var Q2 = this.eventSurveyQ2;
		var Q2C = this.eventSurveyQ2C || '';
		var Q3 = this.eventSurveyQ3;
		var Q3C = this.eventSurveyQ3C || '';
		var Q4 = this.eventSurveyQ4;
		var Q4C = this.eventSurveyQ4C || '';
		var Q5 = this.eventSurveyQ5 || '';
		var Q6 = this.eventSurveyQ6;
		var Q6C = this.eventSurveyQ6C || '';
		var Q7 = this.eventSurveyQ7;
		var Q7C = this.eventSurveyQ7C || '';
		var Q8 = this.eventSurveyQ8;
		var Q8C = this.eventSurveyQ8C || '';
		var Q9 = this.eventSurveyQ9 || '';
		var Q10 = this.eventSurveyQ10;
		var Q10C = this.eventSurveyQ10C || '';
		var Q11 = this.eventSurveyQ11;
		var Q11C = this.eventSurveyQ11C || '';
		var Q12 = this.eventSurveyQ12 || '';
		var Q13 = this.eventSurveyQ13 || '';

		var EventID = "0";
		var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
		var flags;

        // Validation checks
        var ValidationPass = true;
		var ValidationReason = "";

        if (this.eventSurveyQ1 == null || this.eventSurveyQ1 == "") {
            ValidationPass = false;
        }
		if (this.eventSurveyQ1 == "Other") {
			if (this.eventSurveyQ1C == null || this.eventSurveyQ1C == "") {
				ValidationPass = false;
				ValidationReason = "No";
			}
		}

        if (this.eventSurveyQ2 == null || this.eventSurveyQ2 == "") {
            ValidationPass = false;
        }
		if (this.eventSurveyQ2 == "Other") {
			if (this.eventSurveyQ2C == null || this.eventSurveyQ2C == "") {
				ValidationPass = false;
				ValidationReason = "No";
			}
		}

        if (this.eventSurveyQ3 == null || this.eventSurveyQ3 == "") {
            ValidationPass = false;
        }
		if (this.eventSurveyQ3 == "No") {
			if (this.eventSurveyQ3C == null || this.eventSurveyQ3C == "") {
				ValidationPass = false;
				ValidationReason = "No";
			}
		}

        if (this.eventSurveyQ4 == null || this.eventSurveyQ4 == "") {
            ValidationPass = false;
        }
		if (this.eventSurveyQ4 == "Other") {
			if (this.eventSurveyQ4C == null || this.eventSurveyQ4C == "") {
				ValidationPass = false;
				ValidationReason = "No";
			}
		}

        if (this.eventSurveyQ5 == null || this.eventSurveyQ5 == "") {
            ValidationPass = false;
        }

        if (this.eventSurveyQ6 == null || this.eventSurveyQ6 == "") {
            ValidationPass = false;
        }
		if (this.eventSurveyQ6C == null || this.eventSurveyQ6C == "") {
			ValidationPass = false;
			ValidationReason = "No";
		}

		if (this.eventSurveyQ7 == null || this.eventSurveyQ7 == "") {
            ValidationPass = false;
        }
		if (this.eventSurveyQ7C == null || this.eventSurveyQ7C == "") {
			ValidationPass = false;
			ValidationReason = "No";
		}

        if (this.eventSurveyQ8 == null || this.eventSurveyQ8 == "") {
            ValidationPass = false;
        }
		if (this.eventSurveyQ8 == "No") {
			if (this.eventSurveyQ8C == null || this.eventSurveyQ8C == "") {
				ValidationPass = false;
				ValidationReason = "No";
			}
		}

        if (this.eventSurveyQ9 == null || this.eventSurveyQ9 == "") {
            ValidationPass = false;
        }

        if (this.eventSurveyQ10 == null || this.eventSurveyQ10 == "") {
            ValidationPass = false;
        }
		if (this.eventSurveyQ10 == "No") {
			if (this.eventSurveyQ10C == null || this.eventSurveyQ10C == "") {
				ValidationPass = false;
				ValidationReason = "No";
			}
		}
        
		if (this.eventSurveyQ11 == null || this.eventSurveyQ11 == "") {
            ValidationPass = false;
        }
		if (this.eventSurveyQ11 == "No") {
			if (this.eventSurveyQ11C == null || this.eventSurveyQ11C == "") {
				ValidationPass = false;
				ValidationReason = "No";
			}
		}
		
        if (this.eventSurveyQ12 == null || this.eventSurveyQ12 == "") {
            ValidationPass = false;
        }

        if (this.eventSurveyQ13 == null || this.eventSurveyQ13 == "") {
            ValidationPass = false;
        }

		
        if (ValidationPass == false) {
			
			saving.dismiss();
			if (ValidationReason == "") {
				requiredalert.present();
			} else {
				requiredalert2.present();
			}

        } else {

            // Get last update performed by this app
            var LastUpdateDate = this.localstorage.getLocalValue("LastUpdateDate");
            if (LastUpdateDate == null) {
                // If never, then set variable and localStorage item to NA
				LastUpdateDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
                this.localstorage.setLocalValue("LastUpdateDate", LastUpdateDate);
            }

			flags = "es|" + EventID + "|Conference|";
			flags = flags + Q1 + "|" + Q1C + "|";
			flags = flags + Q2 + "|" + Q2C + "|";
			flags = flags + Q3 + "|" + Q3C + "|";
			flags = flags + Q4 + "|" + Q4C + "|";
			flags = flags + Q5 + "|";// + Q5C + "|";
			flags = flags + Q6 + "|" + Q6C + "|";
			flags = flags + Q7 + "|" + Q7C + "|";
			flags = flags + Q8 + "|" + Q8C + "|";
			flags = flags + Q9 + "|";// + Q9C + "|";
			flags = flags + Q10 + "|" + Q10C + "|";
			flags = flags + Q11 + "|" + Q11C + "|";
			flags = flags + Q12 + "|";// + Q12C + "|";
			flags = flags + Q13 + "|";// + Q13C + "|";

			flags = flags + LastUpdateDate;

			//+ Q2 + "|" + Q3 + "|" + Q4 + "|" + Q5 + "|" + Q5C + "|" + Q6 + "|" + Q7 + "|" + Q7C + "|" + Q8 + "|" + Q9;
			//flags = flags + "|" + Q10 + "|" + Q10C + "|" + Q11 + "|" + Q11C + "|" + LastUpdateDate;
			console.log('Save Evaluation (Conference) flags: ' + flags);
			
			this.databaseprovider.getEvaluationData(flags, AttendeeID).then(data => {
				
				console.log("getEvaluationData: " + JSON.stringify(data));

				if (data['length']>0) {
					
					if (data[0].EVStatus == "Success") {
						// Saved
						saving.dismiss();
						savealert.present();
						this.navCtrl.setRoot(HomePage, {}, {animate: true, direction: 'forward'});
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
				console.log("Conference Evaluation Save Promise Rejected");
			});

        }
		
	}

}