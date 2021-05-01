package cn.seu.kse.graph;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.Objects;

public class DependencyEdge {

  boolean dependency;
  RuleNode startNode;

  public DependencyEdge() {
  }

  LitNode endNode;

  public void setDependency(boolean dependency) {
    this.dependency = dependency;
  }

  public RuleNode getStartNode() {
    return startNode;
  }

  public void setStartNode(RuleNode startNode) {
    this.startNode = startNode;
  }

  public LitNode getEndNode() {
    return endNode;
  }

  public void setEndNode(LitNode endNode) {
    this.endNode = endNode;
  }

  public DependencyEdge(RuleNode startNode, LitNode endNode, boolean dependency) {
    this.startNode = startNode;
    this.endNode = endNode;
    this.dependency = dependency;
  }

  public boolean isDependency() {
    return dependency;
  }


  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    if (!super.equals(o)) return false;
    DependencyEdge that = (DependencyEdge) o;
    return Objects.equals(startNode, that.startNode) &&
            Objects.equals(endNode, that.endNode);
  }

  @Override
  public int hashCode() {
    return Objects.hash(super.hashCode(), startNode, endNode);
  }
}
