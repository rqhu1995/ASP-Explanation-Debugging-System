package cn.seu.kse.graph;

import cn.seu.kse.dto.Literal;

import java.util.Objects;

public class LitNode extends Node{
  private String literal;
  private String nodeID;



  public LitNode(Literal literal) {
    this.literal = literal.getLit();
    this.nodeID = "l-" + literal.getId();
  }

  public String getLiteral() {
    return literal;
  }

  public void setLiteral(String literal) {
    this.literal = literal;
  }

  public String getNodeID() {
    return nodeID;
  }

  public void setNodeID(String nodeID) {
    this.nodeID = "l-" + nodeID;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    LitNode litNode = (LitNode) o;
    return Objects.equals(literal, litNode.literal);
  }



  @Override
  public int hashCode() {
    return Objects.hash(literal);
  }
}
