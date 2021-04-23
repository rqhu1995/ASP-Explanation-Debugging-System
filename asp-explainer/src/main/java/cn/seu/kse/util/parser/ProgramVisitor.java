package cn.seu.kse.util.parser;

import cn.seu.kse.dto.ASPRule;
import cn.seu.kse.service.ASPLiteralService;

import java.util.HashSet;

public class ProgramVisitor extends ASPBaseVisitor {

  public ProgramVisitor(ASPLiteralService aspLiteralService) {
    this.aspLiteralService = aspLiteralService;
  }

  ASPLiteralService aspLiteralService;

  HashSet<String> positiveBodySet = new HashSet<>();
  HashSet<String> negativeBodySet = new HashSet<>();
  HashSet<String> varSet = new HashSet<>();
  HashSet<String> constantSet = new HashSet<>();

  ASPRule aspRule = new ASPRule();

  public ASPRule getAspRule() {
    aspRule.setPosBodyIDList(this.positiveBodySet.toString().replace("[", "").replace("]", "").replace(" ", ""));
    aspRule.setVar(this.varSet.toString().replace("[", "").replace("]", "").replace(" ", ""));
    aspRule.setNegBodyIDList(this.negativeBodySet.toString().replace("[", "").replace("]", "").replace(" ", ""));
    aspRule.setConstant(this.constantSet.toString().replace("[", "").replace("]", "").replace(" ", ""));
    return aspRule;
  }

  @Override
  public Object visitTerm(ASPParser.TermContext ctx) {
    if(ctx.CONSTANT() != null)
    {
      constantSet.add(ctx.CONSTANT().getText());
    }
    if(ctx.VAR() != null)
    varSet.add(ctx.VAR().getText());
    return super.visitTerm(ctx);
  }

  @Override
  public Object visitHead(ASPParser.HeadContext ctx) {
    //    Literal head = new Literal();
    String headLit = ctx.getText();
    boolean ground = true;
    for (ASPParser.TermContext term: ctx.literal(0).atom().term()){
      if(term.VAR() != null){
        ground = false;
      }
    }
    int headID = aspLiteralService.saveLiteral(headLit, ground);
    if (headID != -1) {
      aspRule.setHeadID(String.valueOf(headID));
    }
    return super.visitHead(ctx);
  }

  @Override
  public Object visitBody(ASPParser.BodyContext ctx) {
    String body;
    if (ctx != null) {
      boolean ground = true;
      for (ASPParser.Extended_literalContext lext : ctx.extended_literal()) {
        if (lext.default_literal() != null) {
          body = lext.default_literal().literal().getText();
          for (ASPParser.TermContext term: lext.default_literal().literal().atom().term()){
            if(term.VAR() != null){
              ground = false;
            }
          }
          int savedLiteral = aspLiteralService.saveLiteral(body,ground);
          if (savedLiteral != -1) {
            this.negativeBodySet.add(String.valueOf(savedLiteral));
          }
        } else {
          body = lext.literal().getText();
          ground = true;
          for (ASPParser.TermContext term: lext.literal().atom().term()){
            if(term.VAR() != null){
              ground = false;
            }
          }
          int savedLiteral = aspLiteralService.saveLiteral(body, ground);
          if (savedLiteral != -1) {
            this.positiveBodySet.add(String.valueOf(savedLiteral));
          }
          aspLiteralService.saveLiteral(body, ground);
        }
      }
    }
    return super.visitBody(ctx);
  }
}
