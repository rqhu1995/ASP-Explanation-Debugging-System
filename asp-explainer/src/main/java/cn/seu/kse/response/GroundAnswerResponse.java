package cn.seu.kse.response;

import java.util.ArrayList;
import java.util.HashSet;

public class GroundAnswerResponse {
    boolean satisfiable;

    public String getGroundCode() {
        return groundCode;
    }

    HashSet<ArrayList<String>> answerSet;
    String groundCode;
    public boolean isSatisfiable() {
        return satisfiable;
    }

    public void setSatisfiable(boolean satisfiable) {
        this.satisfiable = satisfiable;
    }

    public HashSet<ArrayList<String>> getAnswerSet() {
        return answerSet;
    }

    public void setAnswerSet(HashSet<ArrayList<String>> answerSet) {
        this.answerSet = answerSet;
    }

    public void setGroundCode(String groundCode) {
        this.groundCode = groundCode;
    }

    public void addAnswerSet(ArrayList<String> answerSet) {
        if (this.answerSet == null) {
            this.answerSet = new HashSet<java.util.ArrayList<String>>();
        }
        this.answerSet.add(answerSet);
    }
}
