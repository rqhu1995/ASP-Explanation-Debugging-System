import {Component, OnInit} from '@angular/core';
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
    this.groundCodeBox = this.groundCode.getGroundedCode().split(".").join(".\n\n");
    this.answerSetBox = this.groundCode.getAnswerSet();
  }

}
