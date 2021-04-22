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
  explanationCode: String;
  d3Data: any = {nodes:[],relationships:[]}
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
    this.explanationCode = "http://localhost:8080/findexplanation?answerSetRequest=";
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
