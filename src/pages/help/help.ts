// Components, functions, plugins
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, NgModule } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Database } from "../../providers/database/database";
import { Localstorage } from '../../providers/localstorage/localstorage';
import { Synchronization } from "../../providers/synchronization/synchronization";
import { Observable } from 'rxjs/Rx';
//import { CallNumber } from '@ionic-native/call-number';

// Pages
import { HomePage } from '../home/home';

declare var formatTime: any;
declare var dateFormat: any;

@Component({
  selector: 'page-help',
  templateUrl: 'help.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class HelpPage {

	public hcfSenderName: string;
	public hcfSenderEmail: string;
	public hcfSenderPhone: string;
	public hcfSenderComments: string;
	
	// Diagnostics
	public DeviceType: string;
	public ClientMemberID: string;
	public flID: string;
	public FlyinBanner: string;
	public LSync: string;
	public PushID: string;

	constructor(public navCtrl: NavController, 
				public loadingCtrl: LoadingController,
				public alertCtrl: AlertController,
				private storage: Storage,
				private databaseprovider: Database,
				private cd: ChangeDetectorRef,
				//private callNumber: CallNumber,
				private localstorage: Localstorage) {
				
	}

	ngOnInit() {
	
		// Load diagnostic values
		var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
		var DevPlatform = this.localstorage.getLocalValue('DevicePlatform');
		
		this.cd.markForCheck();
		
	}
	
	sendEmail() {
		
		// Saving progress
		let saving = this.loadingCtrl.create({
			spinner: 'crescent',
			content: 'Sending...'
		});

		// Alert for successful save
		let savealert = this.alertCtrl.create({
			title: 'Help Screen',
			subTitle: 'Your help note has been sent successfully',
			cssClass: 'alert-danger',
			buttons: ['Ok']
		});

		// Alert for failed save
		let failalert = this.alertCtrl.create({
			title: 'Help Screen',
			subTitle: 'Unable to send your note at this time - please try again in a little bit.',
			cssClass: 'alert-danger',
			buttons: ['Ok']
		});

		// Alert for required fields
		let requiredalert = this.alertCtrl.create({
			title: 'Help Screen',
			subTitle: 'All fields except Phone are required to be completed before sending.',
			cssClass: 'alert-danger',
			buttons: ['Ok']
		});

		// Show saving progress
		saving.present();

		var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
		var LoginName = this.localstorage.getLocalValue('LoginFullName');
		var DevPlatform = this.localstorage.getLocalValue('DevicePlatform');
		
		var flags = "";
		
        // Validation checks
        var ValidationPass = true;

		// Diagnostics
		console.log('hcfSenderName :' + this.hcfSenderName);
		console.log('hcfSenderEmail :' + this.hcfSenderEmail);
		console.log('hcfSenderPhone :' + this.hcfSenderPhone);
		console.log('hcfSenderComments :' + this.hcfSenderComments);
		
        if (this.hcfSenderName == null || this.hcfSenderName == "" || this.hcfSenderName == undefined) {
            ValidationPass = false;
        }
        if (this.hcfSenderEmail == null || this.hcfSenderEmail == "" || this.hcfSenderEmail == undefined) {
            ValidationPass = false;
        }
        //if (this.hcfSenderPhone == null || this.hcfSenderPhone == "" || this.hcfSenderPhone == undefined) {
        //    ValidationPass = false;
        //}
        if (this.hcfSenderComments == null || this.hcfSenderComments == "" || this.hcfSenderComments == undefined) {
            ValidationPass = false;
        }

        if (ValidationPass == false) {
			
			saving.dismiss();
			requiredalert.present();

        } else {
			
			if (this.hcfSenderPhone == undefined) {
				this.hcfSenderPhone = "";
			}
			
			flags = "cf|" + this.hcfSenderName;
			flags = flags + "|" + this.hcfSenderEmail;
			flags = flags + "|" + this.hcfSenderPhone;
			flags = flags + "|" + this.hcfSenderComments;
			
			this.databaseprovider.sendHelpData(flags, AttendeeID).then(data => {
				if (data['length']>0) {
					
					if (data[0].hcfStatus == "Success") {
						// Saved
						saving.dismiss();
						savealert.present();
						this.navCtrl.setRoot(HomePage);
					} else {
						// Not saved
						saving.dismiss();
						failalert.present();
					}
					
				} else {
					
					// Not saved
					saving.dismiss();
					failalert.present();
					
				}
			}).catch(function () {
				console.log("Help: Promise Rejected");
			});
			
		}
		
	}

    navToEmail(EmailAddress) {
        if (EmailAddress === undefined) {
            // Do nothing
        } else {
            // Initiate mail program
			window.open('mailto:' + EmailAddress + '?subject=Demo Planner Support', '_system', 'location=yes');
        }

    };
	
	callPhone3(phoneNumber) {
        console.log("Dialer version 3");
		
		var DevicePlatform = this.localstorage.getLocalValue('DevicePlatform');
		
		if (DevicePlatform!='Browser') {
			if ((phoneNumber === undefined) || (phoneNumber == '')) {
				console.log('No phone number defined');
				// Do nothing
			} else {

				// Remove characters from phone number string and format accordingly
				phoneNumber = phoneNumber.replace('(', '');
				phoneNumber = phoneNumber.replace(')', '');
				phoneNumber = phoneNumber.replace(' ', '-');
				
				console.log('Help, Dialer: corrected tel:' + phoneNumber);
				
				window.open(`tel:${phoneNumber}`, '_system');
  
			}
		}
    }
	
}

