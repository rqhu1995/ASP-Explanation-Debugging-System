package cn.seu.kse.graph;

import cn.seu.kse.dto.ASPRule;

import java.util.HashMap;
import java.util.HashSet;

public class ARGraph {
  private HashSet<LitNode> graphLitNodes = new HashSet<>();
  private HashSet<RuleNode> graphRuleNodes = new HashSet<>();
  private HashSet<SinkNode> graphSinkNodes = new HashSet<>();
  private HashSet<ApplicableEdge> graphApplicableEdges = new HashSet<>();
  private HashSet<DependencyEdge> graphDependencyEdges = new HashSet<>();
  private HashSet<EndEdge> graphEndEdges = new HashSet<>();
  private SinkNode top = new SinkNode("T");
  private SinkNode btm = new SinkNode("F");
  private SinkNode asm = new SinkNode("asm");
  private SinkNode ue = new SinkNode("ue");

  public ARGraph() {
    this.graphSinkNodes.add(top);
    this.graphSinkNodes.add(btm);
    this.graphSinkNodes.add(asm);
    this.graphSinkNodes.add(ue);
  }

  public SinkNode getTop() {
    return top;
  }

  public SinkNode getBtm() {
    return btm;
  }

  public SinkNode getAsm() {
    return asm;
  }

  public SinkNode getUe() {
    return ue;
  }

  public void setGraphEndEdges(EndEdge graphEndEdge) {
    if (this.graphEndEdges == null) {
      this.graphEndEdges = new HashSet<EndEdge>();
    }
    this.graphEndEdges.add(graphEndEdge);
  }

  public LitNode getGraphLitNodes(String literal) {
    for (LitNode lNode : graphLitNodes) {
      if (lNode.getLiteral().equals(literal)) {
        return lNode;
      }
    }
    return null;
  }

  public HashSet<SinkNode> getGraphSinkNodes() {
    return graphSinkNodes;
  }

  public void setGraphSinkNodes(HashSet<SinkNode> graphSinkNodes) {
    this.graphSinkNodes = graphSinkNodes;
  }

  public void setGraphApplicableEdges(HashSet<ApplicableEdge> graphApplicableEdges) {
    this.graphApplicableEdges = graphApplicableEdges;
  }

  public void setGraphDependencyEdges(HashSet<DependencyEdge> graphDependencyEdges) {
    this.graphDependencyEdges = graphDependencyEdges;
  }

  public void setGraphEndEdges(HashSet<EndEdge> graphEndEdges) {
    this.graphEndEdges = graphEndEdges;
  }

  public void setTop(SinkNode top) {
    this.top = top;
  }

  public void setBtm(SinkNode btm) {
    this.btm = btm;
  }

  public void setAsm(SinkNode asm) {
    this.asm = asm;
  }

  public void setUe(SinkNode ue) {
    this.ue = ue;
  }

  public HashSet<LitNode> getGraphLitNodes() {
    return this.graphLitNodes;
  }

  public void setGraphLitNodes(HashSet<LitNode> graphLitNodes) {
    this.graphLitNodes = graphLitNodes;
  }

  public void setGraphLitNodes(LitNode lNode) {
    if (this.graphLitNodes == null) {
      this.graphLitNodes = new HashSet<LitNode>();
    }
    this.graphLitNodes.add(lNode);
  }

  public RuleNode getGraphRuleNodes(ASPRule rule) {
    for (RuleNode rNode : graphRuleNodes) {
      if (rNode.getRuleContent().equals(rule)) {
        return rNode;
      }
    }
    return null;
  }

  public HashSet<RuleNode> getGraphRuleNodes() {
    return this.graphRuleNodes;
  }

  public void setGraphRuleNodes(HashSet<RuleNode> graphRuleNodes) {
    this.graphRuleNodes = graphRuleNodes;
  }

  public void setGraphRuleNodes(RuleNode rNode) {
    if (this.graphRuleNodes == null) {
      this.graphRuleNodes = new HashSet<RuleNode>();
    }
    this.graphRuleNodes.add(rNode);
  }

  public SinkNode getGraphSinkNode(String sinkType) {
    for (SinkNode sinkNode : graphSinkNodes) {
      if (sinkNode.sinkType.equals(sinkType)) return sinkNode;
    }
    return null;
  }

  public HashSet<ApplicableEdge> getGraphApplicableEdges() {
    return graphApplicableEdges;
  }


  public void setGraphApplicableEdges(ApplicableEdge graphApplicableEdge) {
    if (this.graphApplicableEdges == null) {
      this.graphApplicableEdges = new HashSet<>();
    }
    this.graphApplicableEdges.add(graphApplicableEdge);
  }

  public HashSet<DependencyEdge> getGraphDependencyEdges() {
    return graphDependencyEdges;
  }

  public void setGraphDependencyEdges(DependencyEdge graphDependencyEdge) {
    if (this.graphDependencyEdges == null) {
      this.graphDependencyEdges = new HashSet<>();
    }
    this.graphDependencyEdges.add(graphDependencyEdge);
  }

  public int edgeSize() {
    return this.graphApplicableEdges.size() + this.graphDependencyEdges.size();
  }

  public HashSet<EndEdge> getGraphEndEdges() {
    return graphEndEdges;
  }
}
