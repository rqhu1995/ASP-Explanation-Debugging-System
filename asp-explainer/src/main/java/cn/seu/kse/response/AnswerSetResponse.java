package cn.seu.kse.response;

import cn.seu.kse.dto.Literal;

import java.util.HashSet;

public class AnswerSetResponse {
  boolean satisfiable;
  HashSet<HashSet<Literal>> answerSet;

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

  public void addAnswerSet(HashSet<Literal> answerSet) {
   // for (Literal literal : answerSet) {
   //   System.out.println(literal.getLit());
  //  }
    if (this.answerSet == null) {
      this.answerSet = new HashSet<>();
    }
    this.answerSet.add(answerSet);
  }
}
