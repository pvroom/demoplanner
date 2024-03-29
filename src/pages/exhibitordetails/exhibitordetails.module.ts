// Components, functions, plugins
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Database } from '../providers/database/database';
import { Localstorage } from '../providers/localstorage/localstorage';


// Pages
import { ExhibitorDetailsPage } from './exhibitordetails';

@NgModule({
  declarations: [ExhibitorDetailsPage],
  imports: [
	FormsModule,
	IonicPageModule.forChild(ExhibitorDetailsPage)
	],
  exports: [ExhibitorDetailsPage]

  })

  export class ExhibitorDetailsPageModule {}


