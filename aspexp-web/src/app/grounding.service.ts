import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GroundingService {
  private groundedCode: any;

  constructor() { }

  setGroundedCode(code) {
    this.groundedCode = code;
  }
  getGroundedCode() {
    return this.groundedCode;
  }
}
