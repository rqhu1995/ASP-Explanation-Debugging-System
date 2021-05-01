package cn.seu.kse.graph;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class Node {
    String nodeID;

    public Node() {
    }

    public String getNodeID() {
        return nodeID;
    }

    public void setNodeID(String nodeID) {
        this.nodeID = nodeID;
    }
}
