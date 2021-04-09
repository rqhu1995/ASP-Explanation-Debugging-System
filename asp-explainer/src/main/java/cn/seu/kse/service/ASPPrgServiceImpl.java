package cn.seu.kse.service;

import cn.seu.kse.dto.ASPRule;
import cn.seu.kse.dto.Literal;
import cn.seu.kse.repository.ASPRuleRepository;
import cn.seu.kse.repository.LiteralRepository;
import cn.seu.kse.response.AnswerSetResponse;
import cn.seu.kse.util.parser.ASPLexer;
import cn.seu.kse.util.parser.ASPParser;
import cn.seu.kse.util.parser.ProgramVisitor;
import cn.seu.kse.util.solver.ShellExecutor;
import org.antlr.v4.runtime.CharStream;
import org.antlr.v4.runtime.CharStreams;
import org.antlr.v4.runtime.CommonTokenStream;
import org.antlr.v4.runtime.tree.ParseTree;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.io.IOException;
import java.util.HashSet;

@CrossOrigin
@Service
public class ASPPrgServiceImpl implements ASPPrgService {

  @Autowired ASPLiteralService aspLiteralService;

  @Autowired LiteralRepository literalRepository;

  @Autowired ASPRuleRepository aspRuleRepository;

  @Override
  public HashSet<ASPRule> programParser(String aspProgram) {
    HashSet<ASPRule> programRules = new HashSet<>();
    String[] rules = aspProgram.split("\n");
    for (String rule : rules) {
      if (rule.startsWith("%")) {
        continue;
      }
      ASPRule aspRule = nonGroundRuleParser(rule);
/*      if(aspRule.getPosBodyIDList().length() == 0) {
        aspRule.setPosBodyIDList(null);
      }
      if(aspRule.getNegBodyIDList().length() == 0) {
        aspRule.setNegBodyIDList(null);
      }*/
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
    if (!aspRuleRepository.findAll().contains(aspRule)) {
      aspRuleRepository.save(aspRule);
    }
  }

  @Override
  public AnswerSetResponse solveAndGetAnswerSet(String aspCode) throws IOException {
    String answerString =
        ShellExecutor.callShell(
            "echo "
                + aspCode.replace("\n", " ")
                + " | clingo 0");
//    System.out.println(
//            "echo "
//                + aspCode.replace(System.getProperty("\n"), " ")
//                + " | clingo 0");
    System.out.println("String + " + answerString);
    AnswerSetResponse answerSetResponse = new AnswerSetResponse();
    if (answerString.contains("UNSAT")) {
      answerSetResponse.setSatisfiable(false);
      answerSetResponse.setAnswerSet(null);
    } else {
      answerSetResponse.setSatisfiable(true);
      String[] outputList = answerString.split(System.getProperty("line.separator"));
      boolean meetAnswerFlag = false;
      for (String line : outputList) {
        if (meetAnswerFlag) {
          HashSet<Literal> answerSet = new HashSet<>();
          String[] singleAnswer = line.split(" ");
          if (line.equals("\n")) {
            answerSet.add(new Literal());
          }
          for (String ansLit : singleAnswer) {
            Literal litFound = aspLiteralService.findByLiteral(ansLit);
            answerSet.add(litFound);
          }
          answerSetResponse.addAnswerSet(answerSet);
          meetAnswerFlag = false;
        }
        if (line.startsWith("Answer: ")) {
          meetAnswerFlag = true;
        }
      }
    }
    return answerSetResponse;
  }

  @Override
  public void clearAll() {
    aspRuleRepository.deleteAll();
    literalRepository.deleteAll();
  }
}
