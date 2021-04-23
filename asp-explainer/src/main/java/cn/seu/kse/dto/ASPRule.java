package cn.seu.kse.dto;

import javax.persistence.*;
import java.util.Arrays;
import java.util.Objects;

@Entity(name = "aspRule")
public class ASPRule {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "rule_id")
  private int id;

  @Column(name = "head")
  private String headID;

  @Column(name = "pb_list")
  private String posBodyIDList;

  public void setVar(String var) {
    this.var = var;
  }

  public String getVar() {
    return var;
  }

  @Column(name = "nb_list")
  private String negBodyIDList;

  @Column(name = "nonblock_list")
  private String nonblockIDList;

  @Column(name = "ground")
  private boolean groundFlag;

  @Column(name = "var")
  private String var;

  public String getConstant() {
    return constant;
  }

  public void setConstant(String constant) {
    this.constant = constant;
  }

  @Column(name = "constant")
  private String constant;

  public ASPRule() {}

  public String getNonblockIDList() {
    return nonblockIDList;
  }

  public void setNonblockIDList(String nonblockIDList) {
    this.nonblockIDList = nonblockIDList;
  }

  public boolean isGroundFlag() {
    return groundFlag;
  }

  public void setGroundFlag(boolean groundFlag) {
    this.groundFlag = groundFlag;
  }

  public boolean dependency(String litID) {
    return Arrays.asList(this.posBodyIDList.split(",")).contains(litID);
  }

  public ASPRule(
      String headIDList,
      String posBodyIDList,
      String negBodyIDList,
      String nonblockIDList,
      boolean groundFlag) {
    this.headID = headIDList;
    this.posBodyIDList = posBodyIDList;
    this.negBodyIDList = negBodyIDList;
    this.nonblockIDList = nonblockIDList;
    this.groundFlag = groundFlag;
  }

  public int getId() {
    return id;
  }

  public void setId(int id) {
    this.id = id;
  }

  public String getHeadID() {
    return headID;
  }

  public void setHeadID(String headIDList) {
    this.headID = headIDList;
  }

  public String getPosBodyIDList() {
    return posBodyIDList;
  }

  public void setPosBodyIDList(String posBodyIDList) {
    this.posBodyIDList = posBodyIDList;
  }

  public String getNegBodyIDList() {
    return negBodyIDList;
  }

  public void setNegBodyIDList(String negBodyList) {
    this.negBodyIDList = negBodyList;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    ASPRule aspRule = (ASPRule) o;
    return headID.equals(aspRule.headID)
        && posBodyIDList.equals(aspRule.posBodyIDList)
        && negBodyIDList.equals(aspRule.negBodyIDList);
  }

  @Override
  public int hashCode() {
    return Objects.hash(headID, posBodyIDList, negBodyIDList);
  }

  public boolean isFact() {
    return this.getPosBodyIDList() == null
            &&
            this.getNegBodyIDList() == null
            &&
            this.getHeadID() != null;
  }

}
