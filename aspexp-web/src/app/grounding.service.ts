import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GroundingService {
  private groundedCode: any;
  private answerSet: any;


  constructor() { }

  setGroundedCode(code) {
    this.groundedCode = code;
  }
  getGroundedCode() {
    return this.groundedCode;
  }

  setAnswerSet(answerSet) {
    this.answerSet = answerSet;
  }

  getAnswerSet() {
    return this.answerSet;
  }
}
