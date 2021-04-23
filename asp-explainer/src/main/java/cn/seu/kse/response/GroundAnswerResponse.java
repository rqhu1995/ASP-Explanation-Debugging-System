package cn.seu.kse.response;

import cn.seu.kse.dto.Literal;

import java.util.HashSet;

public class GroundAnswerResponse {
    boolean satisfiable;

    public String getGroundCode() {
        return groundCode;
    }

    HashSet<HashSet<Literal>> answerSet;
    String groundCode;
    public boolean isSatisfiable() {
        return satisfiable;
    }

    public void setSatisfiable(boolean satisfiable) {
        this.satisfiable = satisfiable;
    }

    public HashSet<HashSet<Literal>> getAnswerSet() {
        return answerSet;
    }

    public void setAnswerSet(HashSet<HashSet<Literal>> answerSet) {
        this.answerSet = answerSet;
    }

    public void setGroundCode(String groundCode) {
        this.groundCode = groundCode;
    }

    public void addAnswerSet(HashSet<Literal> answerSet) {
        if (this.answerSet == null) {
            this.answerSet = new HashSet<>();
        }
        this.answerSet.add(answerSet);
    }
}
