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
import {NzCheckboxModule, NzGridModule, NzRadioModule, NzSelectModule, NzTableModule} from "ng-zorro-antd";
import {FormsModule} from "@angular/forms";
import {SafePipe} from "./safe.pipe";

@NgModule({
  declarations: [
    AppComponent,
    NewComponent,
    GroundingComponent,
    SafePipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NzRadioModule,
    FormsModule,
    NzCheckboxModule,
    NzTableModule,
    NzSelectModule,
    NzGridModule
  ],
  providers: [CodeSendService, Aspprogram],
  bootstrap: [AppComponent]

})
export class AppModule { }
