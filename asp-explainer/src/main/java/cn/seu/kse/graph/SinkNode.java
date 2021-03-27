package cn.seu.kse.graph;

import java.util.Objects;

public class SinkNode extends Node {

  String sinkType;
  String id;

  public SinkNode(String sinkType) {
    this.sinkType = sinkType;
    this.id = "s-" + sinkType;
  }


  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    SinkNode sinkNode = (SinkNode) o;
    return Objects.equals(sinkType, sinkNode.sinkType);
  }

  @Override
  public int hashCode() {
    return Objects.hash(sinkType);
  }


  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getSinkType() {
    return sinkType;
  }

  public void setSinkType(String sinkType) {
    this.sinkType = sinkType;
  }
}
