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
  ASPRule aspRule = new ASPRule();

  public ASPRule getAspRule() {
    aspRule.setPosBodyIDList(this.positiveBodySet.toString().replace("[", "").replace("]", ""));
    aspRule.setNegBodyIDList(this.negativeBodySet.toString().replace("[", "").replace("]", ""));
    return aspRule;
  }

  @Override
  public Object visitHead(ASPParser.HeadContext ctx) {
    //    Literal head = new Literal();
    String headLit = ctx.getText();
    int headID = aspLiteralService.saveLiteral(headLit);
    if (headID != -1) {
      aspRule.setHeadID(String.valueOf(headID));
    }
    return super.visitHead(ctx);
  }

  @Override
  public Object visitBody(ASPParser.BodyContext ctx) {
    String body;
    if (ctx != null) {
      for (ASPParser.Extended_literalContext lext : ctx.extended_literal()) {
        if (lext.default_literal() != null) {
          body = lext.default_literal().literal().getText();
          int savedLiteral = aspLiteralService.saveLiteral(body);
          if (savedLiteral != -1) {
            this.negativeBodySet.add(String.valueOf(savedLiteral));
          }
        } else {
          body = lext.literal().getText();
          int savedLiteral = aspLiteralService.saveLiteral(body);
          if (savedLiteral != -1) {
            this.positiveBodySet.add(String.valueOf(savedLiteral));
          }
          aspLiteralService.saveLiteral(body);
        }
      }
    }
    return super.visitBody(ctx);
  }
}
