import { Component, OnInit } from '@angular/core';
import {CodeSendService} from "../code-send.service";
import {GroundingService} from "../grounding.service";

@Component({
  selector: 'app-grounding',
  templateUrl: './grounding.component.html',
  styleUrls: ['./grounding.component.css']
})
export class GroundingComponent implements OnInit {
  groundCodeBox: any;

  constructor(private groundCode: GroundingService) {
    this.groundCodeBox = groundCode.getGroundedCode();
  }

  ngOnInit() {
  }

}
