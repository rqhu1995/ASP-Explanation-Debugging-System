package cn.seu.kse.service;

import cn.seu.kse.dto.ASPRule;
import cn.seu.kse.repository.ASPRuleRepository;
import cn.seu.kse.repository.LiteralRepository;
import cn.seu.kse.util.parser.ASPLexer;
import cn.seu.kse.util.parser.ASPParser;
import cn.seu.kse.util.parser.ProgramVisitor;
import org.antlr.v4.runtime.CharStream;
import org.antlr.v4.runtime.CharStreams;
import org.antlr.v4.runtime.CommonTokenStream;
import org.antlr.v4.runtime.tree.ParseTree;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.HashSet;

@CrossOrigin
@Service
public class ASPPrgServiceImpl implements ASPPrgService {

  @Autowired
  ASPLiteralService aspLiteralService;

  @Autowired
  LiteralRepository literalRepository;

  @Autowired
  ASPRuleRepository aspRuleRepository;

  @Override
  public HashSet<ASPRule> programParser(String aspProgram) {
    HashSet<ASPRule> programRules = new HashSet<>();
    String[] rules = aspProgram.split("\n");
    for (String rule : rules ) {
      ASPRule aspRule = nonGroundRuleParser(rule);
      programRules.add(aspRule);
    }
    return programRules;
  }

  private ASPRule nonGroundRuleParser(String rule) {
    CharStream input = CharStreams.fromString(rule);
    ASPLexer lexer = new ASPLexer(input);
    CommonTokenStream token = new CommonTokenStream(lexer);
    ASPParser parser = new ASPParser(token);
    ParseTree tree = parser.hard_rule();
    ProgramVisitor programVisitor = new ProgramVisitor(aspLiteralService);
    programVisitor.visit(tree);
    return programVisitor.getAspRule();
  }


  @Override
  public void saveRule(ASPRule aspRule) {
    if(!aspRuleRepository.findAll().contains(aspRule)) {
      aspRuleRepository.save(aspRule);
    }
  }
}
