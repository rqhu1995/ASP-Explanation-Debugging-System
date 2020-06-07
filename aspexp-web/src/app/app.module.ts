import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { NewComponent } from './new/new.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {CodeSendService} from './code-send.service';
import {Aspprogram} from './object/aspprogram';
import { GroundingComponent } from './grounding/grounding.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    NewComponent,
    GroundingComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [CodeSendService, Aspprogram],
  bootstrap: [AppComponent]

})
export class AppModule { }
