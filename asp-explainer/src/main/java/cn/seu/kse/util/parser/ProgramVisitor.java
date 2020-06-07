package cn.seu.kse.util.parser;

import cn.seu.kse.dto.ASPRule;
import cn.seu.kse.dto.Literal;
import cn.seu.kse.service.ASPLiteralService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

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
    aspRule.setPosBodyIDList(this.positiveBodySet.toString().replace("[","").replace("]", ""));
    aspRule.setNegBodyIDList(this.negativeBodySet.toString().replace("[","").replace("]", ""));
    return aspRule;
  }

  @Override
  public Object visitHead(ASPParser.HeadContext ctx) {
    Literal head = new Literal();
    head.setLit(ctx.getText());
    aspLiteralService.saveLiteral(head);
    aspRule.setHeadID(String.valueOf(head.getId()));
    return super.visitHead(ctx);
  }

  @Override
  public Object visitBody(ASPParser.BodyContext ctx) {
    String body;
    Literal bodyLiteral = new Literal();
    if (ctx != null) {
      for (ASPParser.Extended_literalContext lext : ctx.extended_literal()) {
        if (lext.default_literal() != null) {
          body = lext.default_literal().literal().getText();
          bodyLiteral.setLit(body);
          aspLiteralService.saveLiteral(bodyLiteral);
          this.negativeBodySet.add(String.valueOf(bodyLiteral.getId()));
        } else {
          body = lext.literal().getText();
          bodyLiteral.setLit(body);
          aspLiteralService.saveLiteral(bodyLiteral);
          this.positiveBodySet.add(String.valueOf(bodyLiteral.getId()));
        }
      }
    }
    return super.visitBody(ctx);
  }
}
