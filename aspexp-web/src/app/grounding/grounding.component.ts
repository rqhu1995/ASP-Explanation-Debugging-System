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
  answerSetBox: any;

  constructor(private groundCode: GroundingService) {
  }

  ngOnInit() {
    console.log(this.groundCode.getGroundedCode());
    this.groundCodeBox = this.groundCode.getGroundedCode().split(".").join(".\n\n");
    if(this.groundCode.getAnswerSet() == undefined){
      this.answerSetBox = "不一致";
    }else {
      this.answerSetBox = this.groundCode.getAnswerSet();
    }

  }

}
