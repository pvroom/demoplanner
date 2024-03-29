// Components, functions, plugins
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, NgModule } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Localstorage } from '../../providers/localstorage/localstorage';
import { Database } from './../../providers/database/database';

// Pages
import { AttendeesPage } from '../attendees/attendees';
//import { ConversationsPage } from '../conversations/conversations';
//import { ConversationsPage } from '../conversations/conversations';
import { ProfilePage } from '../profile/profile';
import { NotificationsPage } from '../notifications/notifications';
import { ActivityPage } from '../activity/activity';
import { SocialPage } from '../social/social';

@Component({
  selector: 'page-networking',
  templateUrl: 'networking.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class NetworkingPage {

	public NewMessagesCounter: string;
	public NewMessagesIndicator = false;
	
	constructor(public navCtrl: NavController, 
				public navParams: NavParams, 
				private nav: NavController,
				private databaseprovider: Database,
				private alertCtrl: AlertController, 
				private cd: ChangeDetectorRef,
				private localstorage: Localstorage) {

	}

	ionViewDidEnter() {
		console.log('ionViewDidEnter: NetworkingPage');
		var DCArrayString = this.localstorage.getLocalValue('DirectChatMonitoringString');

		console.log('DCArrayString: ' + DCArrayString);
		if (DCArrayString !== null) {
			var data2 = JSON.parse(DCArrayString);
			if (data2['length'] > 0) {
				console.log('data2, NewMessages: ' + data2[0].NewMessages);
				this.NewMessagesCounter = data2[0].NewMessages;
				if (data2[0].NewMessages == "0") {
					this.NewMessagesIndicator = false;
				} else {
					this.NewMessagesIndicator = true;
				}
			} else {
				this.NewMessagesIndicator = false;
			}
		} else {
			this.NewMessagesIndicator = true;
		}
		this.cd.markForCheck();
	}
	
    NavigateTo(page) {

		if (page == 'Conversations' || page =='ActivityFeed') {
			
			var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
			var flags = "cn";

			this.databaseprovider.getDatabaseStats(flags, AttendeeID).then(data => {
				
				if (data[0].Status == "Connected") {
					
					switch(page) {
						case "Conversations":
							// Navigate to Conversations page
							this.navCtrl.push('ConversationsPage', {}, {animate: true, direction: 'forward'});
							break;
						case "ActivityFeed":
							// Navigate to Activity Feed page
							this.localstorage.setLocalValue('ActivityFeedID', '0');
							this.navCtrl.push(ActivityPage, {}, {animate: true, direction: 'forward'});
							break;
						case "Attendees":
							// Navigate to Activity Feed page
							this.navCtrl.push(AttendeesPage, {}, {animate: true, direction: 'forward'});
							break;
						case "MyProfile":
							// Navigate to Activity Feed page
							this.navCtrl.push(ProfilePage, {}, {animate: true, direction: 'forward'});
							break;
					}
				
				} else {

					let alert = this.alertCtrl.create({
						title: 'Internet Error',
						subTitle: 'You need to have Internet access in order to use that feature.',
						cssClass: 'alert-danger',
						buttons: ['OK']
					});
					
					alert.present();
				
				}
				
			});
			
		} else {
			
			switch(page) {
				case "Attendees":
					// Navigate to Attendees page
					this.navCtrl.push(AttendeesPage, {}, {animate: true, direction: 'forward'});
					break;
				case "Conversations":
					// Navigate to Conversations page
					this.navCtrl.push('ConversationsPage', {}, {animate: true, direction: 'forward'});
					break;
				case "MyProfile":
					// Navigate to Profile page
					this.navCtrl.push(ProfilePage, {}, {animate: true, direction: 'forward'});
					break;
				case "Notifications":
					// Navigate to Notifications page
					this.navCtrl.push(NotificationsPage, {}, {animate: true, direction: 'forward'});
					break;
				case "SocialMedia":
					// Navigate to Social Media page
					this.navCtrl.push(SocialPage, {}, {animate: true, direction: 'forward'});
					break;
				case "ActivityFeed":
					// Navigate to Activity Feed page
					this.localstorage.setLocalValue('ActivityFeedID', '0');
					this.navCtrl.push(ActivityPage, {}, {animate: true, direction: 'forward'});
					break;
			}
			
		}
    }

}
