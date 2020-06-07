package cn.seu.kse.dto;

import javax.persistence.*;

@Entity(name = "aspRule")
public class ASPRule {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "rule_id")
    private int id;

    @Column(name = "head")
    private String headID;
    @Column(name = "pb_list")
    private String posBodyIDList;
    @Column(name = "nb_list")
    private String negBodyIDList;
    @Column(name = "nonblock_list")
    private String nonblockIDList;
    @Column(name = "ground")
    private boolean groundFlag;

    public ASPRule() {
    }

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

    public ASPRule(String headIDList, String posBodyIDList, String negBodyIDList, String nonblockIDList, boolean groundFlag) {
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
}
