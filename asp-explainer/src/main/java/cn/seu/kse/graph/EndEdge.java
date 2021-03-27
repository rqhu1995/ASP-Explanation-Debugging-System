package cn.seu.kse.graph;

public class EndEdge {
  Node startNode;
  SinkNode endNode;
  String edgeLabel;

  public EndEdge(Node startNode, SinkNode endNode) {
    this.startNode = startNode;
    this.endNode = endNode;
    if(endNode.sinkType.equals("T")) {
      this.edgeLabel = "+";
    } else {
      this.edgeLabel = "-";
    }
  }

  public Node getStartNode() {
    return startNode;
  }

  public void setStartNode(Node startNode) {
    this.startNode = startNode;
  }

  public SinkNode getEndNode() {
    return endNode;
  }

  public void setEndNode(SinkNode endNode) {
    this.endNode = endNode;
  }

  public String getEdgeLabel() {
    return edgeLabel;
  }

  public void setEdgeLabel(String edgeLabel) {
    this.edgeLabel = edgeLabel;
  }
}
