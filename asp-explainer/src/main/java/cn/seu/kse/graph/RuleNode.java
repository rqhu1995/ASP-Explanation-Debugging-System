package cn.seu.kse.graph;

import cn.seu.kse.dto.ASPRule;

import java.util.Objects;

public class RuleNode extends Node{
  private String ruleID;
  private ASPRule ruleContent;


  public RuleNode(ASPRule ruleContent) {
    this.ruleID = "r-" + ruleContent.getId();
    this.ruleContent = ruleContent;
  }

  public String getRuleID() {
    return ruleID;
  }

  public void setRuleID(String ruleID) {
    this.ruleID = ruleID;
  }

  public ASPRule getRuleContent() {
    return ruleContent;
  }

  public void setRuleContent(ASPRule ruleContent) {
    this.ruleContent = ruleContent;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    RuleNode ruleNode = (RuleNode) o;
    return Objects.equals(ruleContent, ruleNode.ruleContent);
  }

  @Override
  public int hashCode() {
    return Objects.hash(ruleID, ruleContent);
  }
}
