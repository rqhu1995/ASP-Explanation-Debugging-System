package cn.seu.kse.graph;

import java.util.Objects;

public class EndEdge {
  Node startNode;
  SinkNode endNode;
  String edgeLabel;

  public EndEdge() {
  }

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

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    EndEdge endEdge = (EndEdge) o;
    return Objects.equals(startNode, endEdge.startNode) && Objects.equals(endNode, endEdge.endNode) && Objects.equals(edgeLabel, endEdge.edgeLabel);
  }

  @Override
  public int hashCode() {
    return Objects.hash(startNode, endNode, edgeLabel);
  }
}
