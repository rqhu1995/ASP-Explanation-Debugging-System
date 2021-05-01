import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as ace from 'ace-builds';
import 'ace-builds/src-noconflict/ext-beautify';
import 'ace-builds/src-noconflict/ext-language_tools';
import {CodeSendService} from '../code-send.service';
import {GroundingService} from "../grounding.service";
import {Router} from "@angular/router";
import {DomSanitizer} from '@angular/platform-browser';

const THEME = 'ace/theme/textmate';
const LANG = 'ace/mode/gringo';
const CDN = 'https://cdn.jsdelivr.net/npm/ace-builds/src-noconflict';
ace.config.set('basePath', CDN);
ace.config.set('modePath', '/assets');
ace.config.set('themePath', '/assets');

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css'],
})


export class NewComponent implements OnInit {
  @ViewChild('codeEditor', {static: true}) codeEditorElmRef: ElementRef;
  private codeEditor: ace.Ace.Editor;
  iframe;
  outputBox: String;
  answerSet: any;
  answerSetList: any = [];
  startExplanation: boolean = false;
  selectedAnswerSet: any;
  startGrounding: boolean;
  selected: any;
  allChecked = false;
  indeterminate = true;
  checkOptionsOne = [];
  literals = [];
  selectable_literals = new Set();
  selectedLiterals: string[][] = [];
  allTrueSelected: boolean = false;
  needBinding = false;


  constructor(private codeSender: CodeSendService,
              private ground: GroundingService,
              private router: Router,
              private domSanitizer: DomSanitizer) {
    this.outputBox = "";
    this.checkOptionsOne = [];
    this.iframe = 'http://localhost:8080';
  }
  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      this.needBinding = true;
      this.checkOptionsOne = this.checkOptionsOne.map(item => {
        return {
          ...item,
          checked: true
        };
      });
    } else {
      this.needBinding = false;
      this.checkOptionsOne = this.checkOptionsOne.map(item => {
        return {
          ...item,
          checked: false
        };
      });
    }
    this.selectable_literals = new Set();
    for (const checkOptionsOneElement of this.checkOptionsOne) {
      if(checkOptionsOneElement.checked){
        this.selectable_literals.add(checkOptionsOneElement.value);
      }
    }
  }

  updateSingleChecked(): void {
    if (this.checkOptionsOne.every(item => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
      this.needBinding = false;
    } else if (this.checkOptionsOne.every(item => item.checked)) {
      this.allChecked = true;
      this.indeterminate = false;
      this.needBinding = true;
    } else {
      this.indeterminate = true;
      this.needBinding = true;
    }
    this.selectable_literals = new Set();
    for (const checkOptionsOneElement of this.checkOptionsOne) {
      if(checkOptionsOneElement.checked){
        this.selectable_literals.add(checkOptionsOneElement.value);
      }
    }
  }


  ngOnInit() {
    ace.require('ace/ext/language_tools');
    const element = this.codeEditorElmRef.nativeElement;
    const editorOptions: Partial<ace.Ace.EditorOptions> = {
      highlightActiveLine: true,
      minLines: 10,
      maxLines: 10,
      fontSize: 15,
      autoScrollEditorIntoView: true
    };
    this.selected = 0;
    this.codeEditor = ace.edit(element, editorOptions);
    this.codeEditor.setTheme(THEME);
    // this.codeEditor.resize(true);
    // this.codeEditor.scrollToLine(50, true, true, function () {});
    // this.codeEditor.gotoLine(50, 0, true);
    this.codeEditor.getSession().setMode(LANG);
    this.codeEditor.setShowFoldWidgets(true); // for the scope fold feature
  }

  getCodeAndSolve() {
    console.log(this.codeSender == undefined);
    const codes = this.codeEditor.getValue().toString();
    this.codeSender.sendCode(codes).subscribe(
      res => {
        console.log(res);
        this.outputBox = "";
        if (res.status !== 1) {
          this.outputBox = "Inconsistent Program!\n";
        } else {
          this.answerSet = res.data.answerSet;
          this.outputBox += "Answer Sets Solved by CLINGO: \n\n";
          for (const answerSetElement of res.data) {
            const index : number = res.data.indexOf(answerSetElement) + 1;
            this.outputBox += "Answer " + index + ": \n";
            for (const ans of answerSetElement) {
              this.outputBox += ans + " ";
            }
            this.outputBox += "\n\n";
          }
          this.outputBox += "Solving Completed!";
        }
      }
    )
  }

  clearAll() {
    this.codeSender.clearAll().subscribe(
      res => {
        if (res.status === 1) {
          window.alert("All records cleared!");
        } else {
          window.alert("Failed to clear all records, try again!");
        }
        window.location.reload();
      }
    )

  }


  interactiveGrounding(){
    this.startGrounding = true;
    this.codeSender.getLiteral().subscribe(
      res => {
        console.log(res);
        this.answerSet = res.data.answerSet;
        for (const lit of res.data) {
          this.checkOptionsOne.push({ label: lit, value: lit, checked: false });
          this.literals.push(lit);
          this.selectedLiterals.push([]);
        }
      }
    )
  }

  answerSetDisplay(ans: any) {
    let str: String = '{'
    for (const ansLiteral of ans) {
      str += ansLiteral.lit + ",";
    }
    if(str.endsWith(","))
      str = str.substring(0, str.length - 1);
    str += "}";
    return str;
  }
  isNotSelected(value: string, index): boolean {
    return this.selectedLiterals[index].indexOf(value) === -1;
  }

  goBinding() {
    this.allTrueSelected = true;
  }

  submitBinding() {
    let preBind = {};
    for (let i =0; i < this.selectedLiterals.length; i++) {
      preBind[this.literals[i]] = [];
      if(this.selectable_literals.has(this.literals[i])) {
        preBind[this.literals[i]].push(this.literals[i].split('(')[0] + "(true)");
        continue;
      }
      for (let j = 0; j < this.selectedLiterals[i].length; j++) {
        preBind[this.literals[i]].push(this.selectedLiterals[i][j]);
      }
    }
    const codes = this.codeEditor.getValue().toString();
    console.log({code: codes, preBind: preBind});
    this.codeSender.grounding({aspCode: codes, preBind: preBind}).subscribe(
      res => {
        console.log(res);
        this.ground.setGroundedCode(res.data.groundCode);
        this.ground.setAnswerSet(res.data.answerSet);
        console.log(this.ground.getAnswerSet())
        // window.open("http://localhost:4200/grounding", "_blank");
        this.router.navigateByUrl('/grounding');
      }
    );
  }
}
