import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  @ViewChild('codeEditor', { static: true }) codeEditorElmRef: ElementRef;
  private codeEditor: ace.Ace.Editor;

  constructor(private codeSender: CodeSendService) {}

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

  getCode() {
    console.log(this.codeSender == undefined);
    const codes = this.codeEditor.getValue().toString();
    // const aspprg: Aspprogram = {programContent: codes}
    this.codeSender.sendCode(codes).subscribe(
      res => {
        console.log(res);
      }
    );
  }
}
