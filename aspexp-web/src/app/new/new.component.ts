import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as ace from 'ace-builds';
import 'ace-builds/src-noconflict/ext-beautify';
import 'ace-builds/src-noconflict/ext-language_tools';
import {CodeSendService} from '../code-send.service';
import {GroundingService} from "../grounding.service";
import {Router} from "@angular/router";

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
  startGrounding: boolean;
  selected: any;
  explanationCode: String;
  d3Data: any = {nodes:[],relationships:[]}
  allChecked = false;
  indeterminate = true;
  checkOptionsOne = [];
  literals = [];
  selectable_literals = new Set();
  selectedLiterals: string[][] = [];
  allTrueSelected: boolean = false;
  needBinding = false;
  constructor(private codeSender: CodeSendService, private ground: GroundingService, private router: Router) {
    this.outputBox = "";
    this.checkOptionsOne = [];
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
      maxLines: Infinity,
    };
    this.selected = 0;
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
  solveGraphLitNodes(node, name){
    //console.log(node);
    for(let i = 0 ; i < node.length ; i++){
      this.d3Data.nodes[this.d3Data.nodes.length++] = {"id": node[i].nodeID, "labels": [name], "properties":{"used": "false", "literal": node[i].literal}};
    }
    //console.log(this.d3Data);
  }
  solveGraphRuleNodes(node, name){
    //console.log(node.length);
    for(let i = 0 ; i < node.length ; i++){
      this.d3Data.nodes[this.d3Data.nodes.length++] = {"id": node[i].ruleID, "labels": [name], "properties":{"used": "false", "ruleContent":node[i].ruleContent}};
    }
    //console.log(this.d3Data);
  }
  solveGraphSinkNodes(node,name){
   // console.log(name);
   // console.log(node);
    for(let i = 0 ; i < node.length ; i++){
      this.d3Data.nodes[this.d3Data.nodes.length++] = {"id": node[i].id, "labels": [name], "properties":{"used": "false", "sinkType": node[i].sinkType}};
    }
    //console.log(this.d3Data);
  }
  solveGraphApplicableEdges(edge, name){
   // console.log(name);
   // console.log(edge);
    for(let i = 0 ; i < edge.length ; i++){
        this.d3Data.relationships[this.d3Data.relationships.length++] = {"id": i+1000, "type": name , "startNode": edge[i].startNode.nodeID,"endNode": edge[i].endNode.ruleID,"properties":{"used": "false", "startNode":edge[i].startNode, "endNode": edge[i].endNode, "applicable": edge[i].applicable},"source": edge[i].startNode.nodeID, "target":edge[i].endNode.ruleID, "linknum": 1  };
    }
   // console.log(this.d3Data);
  }
  solveGraphDependencyEdges(edge, name){
   // console.log(name);
    //console.log(edge);
    for(let i = 0 ; i < edge.length ; i++){
      this.d3Data.relationships[this.d3Data.relationships.length++] = {"id": i+2000, "type": name , "startNode": edge[i].startNode.ruleID,"endNode": edge[i].endNode.nodeID,"properties":{"used": "false", "startNode":edge[i].startNode, "endNode": edge[i].endNode, "dependency": edge[i].dependency},"source": edge[i].startNode.ruleID, "target":edge[i].endNode.nodeID, "linknum": 1  };
    }
    //console.log(this.d3Data);
  }
  solveGraphEndEdges(edge, name){
    //console.log(name);
    //console.log(edge);
    for(let i = 0 ; i < edge.length ; i++){
      this.d3Data.relationships[this.d3Data.relationships.length++] = {"id": i + 3000, "type": name , "startNode": edge[i].startNode.nodeID,"endNode": edge[i].endNode.id,"properties":{"used": "false", "startNode":edge[i].startNode, "endNode": edge[i].endNode, "edgeLabel": edge[i].edgeLabel},"source": edge[i].startNode.nodeID, "target":edge[i].endNode.id, "linknum": 1  };
    }
    //console.log(this.d3Data);
  }
  selectAnswerSetAndAssumption() {
    this.answerSetList = [];
    this.explanationCode = "http://localhost:8888/findexplanation?answerSetRequest=";
    console.log(this.answerSet);
    for (const answerSetElement of this.answerSet) {
      this.answerSetList.push(answerSetElement);
    }
    this.startExplanation = true;
    console.log(this.answerSet[this.selected].length);
    for(let i = 0 ; i < this.answerSet[this.selected].length ; i++){
      this.explanationCode += (this.answerSet[this.selected][i].lit+".");
    }
    console.log(this.explanationCode);
    this.codeSender.getExplanation(this.explanationCode).subscribe(
      res => {
        console.log(res);
          this.solveGraphLitNodes(res.data.graphLitNodes,"graphLitNodes");
          this.solveGraphRuleNodes(res.data.graphRuleNodes, "graphRuleNodes");
          this.solveGraphSinkNodes(res.data.graphSinkNodes, "graphSinkNodes");
          //this.solveGraphSinkNodes(res.data.top, "top");
          //this.solveGraphSinkNodes(res.data.btm, "btm");
          //this.solveGraphSinkNodes(res.data.asm, "asm");
          //this.solveGraphSinkNodes(res.data.ue, "ue");
          this.solveGraphApplicableEdges(res.data.graphApplicableEdges, "graphApplicableEdges");
          this.solveGraphDependencyEdges(res.data.graphDependencyEdges,"graphDependencyEdges");
          this.solveGraphEndEdges(res.data.graphEndEdges,"graphEndEdges");
        console.log(JSON.stringify(this.d3Data));
      }
    )

    //return this.d3Data;

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

        // window.open("http://localhost:4200/grounding", "_blank");
        this.router.navigateByUrl('/grounding');
      }
    );
  }
}
