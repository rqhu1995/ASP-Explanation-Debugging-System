import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import * as ace from 'ace-builds';
import 'ace-builds/src-noconflict/ext-beautify';
import 'ace-builds/src-noconflict/ext-language_tools';
import {CodeSendService} from '../code-send.service';
import {Aspprogram} from '../object/aspprogram';

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

  outputBox: String;
  answerSet: any;
  answerSetList: any = [];
  startExplanation: boolean = false;
  selectedAnswerSet: any;
  selected: any;

  constructor(private codeSender: CodeSendService) {
    this.outputBox = "";
  }

  ngOnInit() {
    ace.require('ace/ext/language_tools');
    const element = this.codeEditorElmRef.nativeElement;
    const editorOptions: Partial<ace.Ace.EditorOptions> = {
      highlightActiveLine: true,
      minLines: 10,
      maxLines: Infinity,
    };

    this.codeEditor = ace.edit(element, editorOptions);
    this.codeEditor.setTheme(THEME);
    this.codeEditor.getSession().setMode(LANG);
    this.codeEditor.setShowFoldWidgets(true); // for the scope fold feature
  }

  getCodeAndSolve() {
    console.log(this.codeSender == undefined);
    const codes = this.codeEditor.getValue().toString();
    this.codeSender.sendCode(codes).subscribe(
      res => {
        console.log(res);
        this.answerSet = res.data.answerSet;
        this.outputBox = "";
        if (!res.data.satisfiable) {
          this.outputBox = "Inconsistent Program!\n";
        } else {
          this.outputBox += "Answer Sets Solved by CLINGO: \n\n";
          for (const answerSetElement of res.data.answerSet) {
            const index : number = res.data.answerSet.indexOf(answerSetElement) + 1;
            this.outputBox += "Answer " + index + ": \n";
            for (const ans of answerSetElement) {
              this.outputBox += ans.lit + " ";
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

  selectAnswerSetAndAssumption() {
    this.answerSetList = [];
    this.selected = 0;
    for (const answerSetElement of this.answerSet) {
      this.answerSetList.push(answerSetElement);
    }
    this.startExplanation = true;

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
}
