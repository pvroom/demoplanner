// Components, functions, plugins
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, NgModule } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Database } from './../../providers/database/database';
import { Localstorage } from './../../providers/localstorage/localstorage';
import { LeafletDirective } from '@asymmetrik/ngx-leaflet/dist';

import * as L from "leaflet";

@IonicPage()
@Component({
  selector: 'page-exhibitordetails',
  templateUrl: 'exhibitordetails.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ExhibitorDetailsPage {

	// Exhibitor Details
	public ExhibitorCompanyName: string;
	public ExhibitorAddressLine1: string;
	public ExhibitorDisplayCityState: string;
	public ExhibitorZipPostalCode: string;
	public ExhibitorBoothNumber: string;
	public ExhibitorCompanyLogoFilename: string;
	public ExhibitorPrimaryOnsiteContactEmailURL: string;
	public ExhibitorPrimaryOnsiteContactPhone: string;
	public ExhibitorPrimaryOnsiteContactEmailDisplay: string;
	public ExhibitorPrimaryOnsiteContactName: string;
	public ExhibitorWebsite: string;
	public ExhibitorCompanyDescription: string;
	public exDetails: string;
	
	
	// Contact Buttons
	public btnEmail: string;
	public btnWebsite: string;
	public btnCall: string;

	// Sopcial Media Icons
	public visSocialMediaFacebookVisible = false;
	public visSocialMediaTwitterVisible = false;
	public visSocialMediaLinkedInVisible = false;
	public visSocialMediaYouTubeVisible = false;
	public visSocialMediaRSSVisible = false;
	public visSocialMediaGooglePlusVisible = false;
	public visSocialMediaHeader = false;
	public ExhibitorSocialMediaFacebook: string;
	public ExhibitorSocialMediaTwitter: string;
	public ExhibitorSocialMediaLinkedIn: string;
	public ExhibitorSocialMediaYouTube: string;
	public ExhibitorSocialMediaRSS: string;
	public ExhibitorSocialMediaGooglePlus: string;

	// Leaflet mapping variables
	myMap: any;
	
	constructor(public navCtrl: NavController, 
				public navParams: NavParams,
				private storage: Storage,
				private databaseprovider: Database,
				private cd: ChangeDetectorRef,
				public loadingCtrl: LoadingController,
				private localstorage: Localstorage) {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ExhibitorDetailsPage');
	}

	ngOnInit() {

		// Load initial data set here
		//let loading = this.loadingCtrl.create({
		//	spinner: 'crescent',
		//	content: 'Please wait...'
		//});

		//loading.present();

		// Blank and show loading info
		this.cd.markForCheck();

		
		// Temporary use variables
		var flags = "dt|Alpha|" + this.navParams.get('ExhibitorID');
        var DisplayName = "";
        var DisplayCityState = "";
		var DevicePlatform = this.localstorage.getLocalValue('DevicePlatform');

		// Get the data
		this.databaseprovider.getExhibitorData(flags).then(data => {
			
			console.log("getExhibitorData: " + JSON.stringify(data));

			if (data['length']>0) {
				console.log('ExhibitorDetails: Line 99');
                if (data[0].Country != "United States" && data[0].Country != "" && data[0].Country != null) {
                    DisplayCityState = data[0].City + ", " + data[0].Country;
                } else {
                    DisplayCityState = data[0].City + ", " + data[0].State + "  " + data[0].ZipPostalCode;
                }
				console.log('ExhibitorDetails: Line 105');
                this.ExhibitorCompanyName = data[0].CompanyName;
                this.ExhibitorAddressLine1 = data[0].AddressLine1;
                this.ExhibitorDisplayCityState = DisplayCityState;
                this.ExhibitorZipPostalCode = data[0].ZipPostalCode;
                this.ExhibitorBoothNumber = "Booth: " + data[0].BoothNumber;

				console.log('ExhibitorDetails: Line 112');
                this.ExhibitorCompanyLogoFilename = "https://aacdmobile.convergence-us.com/AdminGateway/2019/images/ExhibitorLogos/" + data[0].imageFilename;

				console.log('ExhibitorDetails: Line 115');
                this.btnEmail = "primary";
                this.btnWebsite = "primary";
                this.btnCall = "primary";

                // Button bar
				console.log('Primary contact email button');
                if ((data[0].PrimaryOnsiteContactEmail == "") || (data[0].PrimaryOnsiteContactEmail == null) || (data[0].PrimaryOnsiteContactEmail === undefined)) {
                    this.btnEmail = "light";
					console.log('Button btnEmail greyed out');
                } else {
                    this.ExhibitorPrimaryOnsiteContactEmailURL = data[0].PrimaryOnsiteContactEmail;
                }

				console.log('Primary contact website button');
                if ((data[0].Website == "") || (data[0].Website == null) || (data[0].Website === undefined)) {
                    this.btnWebsite = "light";
					console.log('Button btnWebsite greyed out');
                } else {
                    this.ExhibitorWebsite = data[0].Website;
                }

				console.log('Primary contact phone button');
				if (DevicePlatform=='Browser') {
						this.btnCall = "light";
						console.log('Button btnCall greyed out');
				} else {
					if ((data[0].PrimaryOnsiteContactPhone == "") || (data[0].PrimaryOnsiteContactPhone == null) || (data[0].PrimaryOnsiteContactPhone === undefined)) {
						this.btnCall = "light";
						console.log('Button btnCall greyed out');
					} else {
						this.ExhibitorPrimaryOnsiteContactPhone = data[0].PrimaryOnsiteContactPhone;
						console.log('Primary contact');
					}
				}
				
                // Primary contact
				console.log('Primary contact name');
                this.ExhibitorPrimaryOnsiteContactName = data[0].PrimaryOnsiteContactName;
                this.ExhibitorPrimaryOnsiteContactEmailDisplay = data[0].PrimaryOnsiteContactEmail;
                if (data[0].PrimaryOnsiteContactPhone != null) {
                    if ((data[0].PrimaryOnsiteContactPhone.length > 0) && (data[0].PrimaryOnsiteContactPhone != "") && (typeof data[0].PrimaryOnsiteContactPhone !== "undefined")) {
                        this.ExhibitorPrimaryOnsiteContactPhone = data[0].PrimaryOnsiteContactPhone;
                    } else {
                        this.ExhibitorPrimaryOnsiteContactPhone = "";
                    }
                } else {
                    this.ExhibitorPrimaryOnsiteContactPhone = "";
                }

                // Company Details
				console.log('Company Details');
                if ((data[0].CompanyDescription == "") || (data[0].CompanyDescription == null) || (data[0].CompanyDescription === undefined)) {
                    this.ExhibitorCompanyDescription = "Not available";
                    this.exDetails = "Not available";
                } else {
                    this.ExhibitorCompanyDescription = data[0].CompanyDescription;
                    this.exDetails = data[0].CompanyDescription;
                }

                // Social media tags
				console.log('Social media tags');
                var SocialMediaCheck = 0;
                this.visSocialMediaFacebookVisible = false;
                this.visSocialMediaTwitterVisible = false;
                this.visSocialMediaLinkedInVisible = false;
                this.visSocialMediaYouTubeVisible = false;
                this.visSocialMediaRSSVisible = false;
                this.visSocialMediaGooglePlusVisible = false;
                this.visSocialMediaHeader = false;

                //  Visual status
				console.log('Visual status');
                if (data[0].SocialMediaFacebook != null) {
                    if ((data[0].SocialMediaFacebook.length > 0) && (data[0].SocialMediaFacebook != "") && (data[0].SocialMediaFacebook !== undefined)) {
                        this.visSocialMediaFacebookVisible = true;
                        SocialMediaCheck = 1;
                    }
                }
                if (data[0].SocialMediaTwitter != null) {
                    if ((data[0].SocialMediaTwitter.length > 0) && (data[0].SocialMediaTwitter != "") && (data[0].SocialMediaTwitter !== undefined)) {
                        this.visSocialMediaTwitterVisible = true;
                        SocialMediaCheck = 1;
                    }
                }
                if (data[0].SocialMediaLinkedIn != null) {
                    if ((data[0].SocialMediaLinkedIn.length > 0) && (data[0].SocialMediaLinkedIn != "") && (data[0].SocialMediaLinkedIn !== undefined)) {
                        this.visSocialMediaLinkedInVisible = true;
                        SocialMediaCheck = 1;
                    }
                }
                if (data[0].SocialMediaYouTube != null) {
                    if ((data[0].SocialMediaYouTube.length > 0) && (data[0].SocialMediaYouTube != "") && (data[0].SocialMediaYouTube !== undefined)) {
                        this.visSocialMediaYouTubeVisible = true;
                        SocialMediaCheck = 1;
                    }
                }
                if (data[0].SocialMediaRSS != null) {
                    if ((data[0].SocialMediaRSS.length > 0) && (data[0].SocialMediaRSS != "") && (data[0].SocialMediaRSS !== undefined)) {
                        this.visSocialMediaRSSVisible = true;
                        SocialMediaCheck = 1;
                    }
                }
                if (data[0].SocialMediaGooglePlus != null) {
                    if ((data[0].SocialMediaGooglePlus.length > 0) && (data[0].SocialMediaGooglePlus != "") && (data[0].SocialMediaGooglePlus !== undefined)) {
                        this.visSocialMediaGooglePlusVisible = true;
                        SocialMediaCheck = 1;
                    }
                }
                if (SocialMediaCheck == 1) {
                    this.visSocialMediaHeader = true;
                }

                // Social Media Links
				console.log('Social Media Links');
                this.ExhibitorSocialMediaFacebook = data[0].SocialMediaFacebook;
                this.ExhibitorSocialMediaTwitter = data[0].SocialMediaTwitter;
                this.ExhibitorSocialMediaLinkedIn = data[0].SocialMediaLinkedIn;
                this.ExhibitorSocialMediaYouTube = data[0].SocialMediaYouTube;
                this.ExhibitorSocialMediaRSS = data[0].SocialMediaRSSVisible;
                this.ExhibitorSocialMediaGooglePlus = data[0].SocialMediaGooglePlus;

                // Booth mapping
				console.log('Booth mapping');
                var y = 0;
                var x = 0;
                var ExhibitorName = "";

                if (data[0].BoothY != null) {
                    y = data[0].BoothY;
                    x = data[0].BoothX;
                }
                ExhibitorName = data[0].CompanyName;

				console.log("Booth mapping (x,y): " + x + ", " + y);
				
                if ((x === undefined) || (y === undefined)) {
                    // Show empty map
					console.log('Show empty map');
                    this.myMap = L.map('map2', {
                        crs: L.CRS.Simple,
                        minZoom: -2,
                        maxZoom: 2,
                        zoomControl: true
                    });

                    var bounds = L.latLngBounds([0, 0], [2000, 1000]);    // Normally 1000, 1000; stretched to 2000,1000 for AACD 2017
                    var image = L.imageOverlay('assets/img/Floorplan2019.png', bounds, {
                        attribution: 'Convergence'
                    }).addTo(this.myMap);

                    this.myMap.fitBounds(bounds);
					this.myMap.setMaxBounds(bounds);

                } else {

                    // Simple coordinate system mapping
					console.log('Simple coordinate system mapping');
                    this.myMap = L.map('map2', {
                        crs: L.CRS.Simple,
                        minZoom: -2,
                        maxZoom: 2,
                        zoomControl: true
                    });

                    var bounds = L.latLngBounds([0, 0], [1500, 2000]);    // Normally 1000, 1000; stretched to 2000,1000 for AACD 2017

                    var image = L.imageOverlay('assets/img/Floorplan2019.png', bounds, {
                        attribution: 'Convergence'
                    }).addTo(this.myMap);

                    this.myMap.fitBounds(bounds);
					this.myMap.setMaxBounds(bounds);

                    var Exhibitor = L.latLng([y, x]);

                    L.marker(Exhibitor).addTo(this.myMap)
                        .bindPopup(ExhibitorName)
                        .openPopup();

                    this.myMap.setView([y, x], 1);

                }
				
			} else {
				
                // No data to show

			}

			this.cd.markForCheck();

			//loading.dismiss();
			
		}).catch(function () {
			console.log("Promise Rejected");
		});
		
	}

    navToWebsite(WebsiteURL) {

        if (WebsiteURL === undefined) {
            // Do nothing
        } else {
            // Initiate web browser
            if ((WebsiteURL.substring(0, 7) != "http://") && (WebsiteURL.substring(0, 8) != "https://")) {
                WebsiteURL = "http://" + WebsiteURL;
            }
			
			console.log('Exhibitor Details: Navigating to: ' + WebsiteURL);
            window.open(WebsiteURL, '_system');
        }

    };

    navToEmail(EmailAddress) {
        if (EmailAddress === undefined) {
            // Do nothing
        } else {
            // Initiate mail program
            window.open('mailto:' + EmailAddress + '?subject=AACD San Diego','target=_blank');
        }

    };

	callPhone2(phoneNumber) {
        console.log("Dialer version 2");
		var DevicePlatform = this.localstorage.getLocalValue('DevicePlatform');
		
		if (DevicePlatform!='Browser') {
			if ((phoneNumber === undefined) || (phoneNumber == '')) {
				console.log('No phone number defined');
				// Do nothing
			} else {
				// remove all other characters from phone number string
				// phoneNumber = phoneNumber.replace(/-/g, '');
				phoneNumber = phoneNumber.replace('(', '');
				phoneNumber = phoneNumber.replace(')', '');
				phoneNumber = phoneNumber.replace(' ', '-');

				console.log('Dialer: tel:' + phoneNumber);

				window.open(`tel:${phoneNumber}`, '_system');
				
				//window['plugins'].CallNumber.callNumber(function onSuccess(result){
				//	console.log("Dialer Success:" + JSON.stringify(result));
				//},
				//function onError(result) {
				//	console.log("Dialer Error:" + JSON.stringify(result));
				//}, phoneNumber, false);

			}
		}
    }

}
