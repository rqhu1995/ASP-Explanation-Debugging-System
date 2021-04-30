package cn.seu.kse.graph;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.Objects;

public class ApplicableEdge {

  private boolean isApplicable;
  LitNode startNode;
  RuleNode endNode;

  public ApplicableEdge() {
  }

  public boolean isApplicable() {
    return isApplicable;
  }

  public LitNode getStartNode() {
    return startNode;
  }

  public void setStartNode(LitNode startNode) {
    this.startNode = startNode;
  }

  public RuleNode getEndNode() {
    return endNode;
  }

  public void setEndNode(RuleNode endNode) {
    this.endNode = endNode;
  }

  public ApplicableEdge(LitNode startNode, RuleNode endNode, boolean applicable) {
    this.startNode = startNode;
    this.endNode = endNode;
    this.isApplicable = applicable;
  }

  public void setApplicable(boolean applicable) {
    isApplicable = applicable;
  }

  public boolean getApplicable() {
    return this.isApplicable;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    if (!super.equals(o)) return false;
    ApplicableEdge that = (ApplicableEdge) o;
    return Objects.equals(startNode, that.startNode) && Objects.equals(endNode, that.endNode);
  }

  @Override
  public int hashCode() {
    return Objects.hash(super.hashCode(), startNode, endNode);
  }
}
