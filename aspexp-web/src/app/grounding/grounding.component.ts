import {Component, OnInit} from '@angular/core';
import {GroundingService} from "../grounding.service";
import {CodeSendService} from "../code-send.service";

@Component({
  selector: 'app-grounding',
  templateUrl: './grounding.component.html',
  styleUrls: ['./grounding.component.css']
})
export class GroundingComponent implements OnInit {
  groundCodeBox: any;
  answerSetBox: any;
  d3Data: any = {nodes:[],relationships:[]}
  answerSet: any;
  answerSetList: any = [];
  explanationCode: String;
  selected = 0;
  constructor(private groundCode: GroundingService, private codeSender: CodeSendService) {
  }

  ngOnInit() {
    console.log(this.groundCode.getGroundedCode());
    this.groundCodeBox = this.groundCode.getGroundedCode().split(".").join(".\n\n");
    this.answerSetBox = this.groundCode.getAnswerSet();
    if(this.groundCode.getAnswerSet() == undefined){
      this.answerSetBox = "不一致";
    }else {
      this.answerSetBox = this.groundCode.getAnswerSet();
    }
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
    this.explanationCode = "http://localhost:8888/findexplanation?answerSetRequest=";
    this.codeSender.getAnswerSet().subscribe(
      res => {
        this.answerSet = res.data;
        console.log(this.answerSet);
        console.log(this.answerSet);
        for (const answerSetElement of this.answerSet) {
          this.answerSetList.push(answerSetElement);
        }
        // this.startExplanation = true;
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
      });


    //return this.d3Data;

  }

}
