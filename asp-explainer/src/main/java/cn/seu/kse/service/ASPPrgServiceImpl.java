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
  @Autowired ASPPrgService aspPrgService;
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
  public AnswerSetResponse solveAndGetGrounding(String aspCode) throws  IOException{
    String answerString =
            ShellExecutor.callShell(
                    "echo "
                            + aspCode.replace("\n", " ")
                            + " | clingo 0");
    System.out.println("echo "
            + aspCode.replace("\n", " ")
            + " | clingo 0");
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
          /*
          String parseString = "";
          for (String ansLit : singleAnswer) {
            if (ansLit.startsWith("ap") || ansLit.startsWith("blp") || ansLit.startsWith("bln")) {
                continue;
            }
            else{
              if(aspLiteralService.findByLiteral(ansLit) == null){
                parseString += (ansLit + '.' + '\n' );
              }
            }
          }
          //System.out.println(111);
          if(parseString.length() > 0 && parseString.charAt(parseString.length()-1) == '\n'){
            parseString = parseString.substring(0,Math.max(0,parseString.length()-1));
          }
          aspPrgService.programParser(parseString);
*/
          for (String ansLit : singleAnswer) {
            if(ansLit.startsWith("ap")||ansLit.startsWith("blp")||ansLit.startsWith("bln")){
              //System.out.println(ansLit+";;;;");
              int headS = ansLit.indexOf("d(") + 2;
              int headN = ansLit.indexOf("))",headS) + 1;
              String headString = ansLit.substring(headS,headN);
              //System.out.println(headString);
              String []head = headString.split("\\),");
              StringBuilder aspString = new StringBuilder(); boolean flag = false;
              for (String s : head) {
                if(s.charAt(s.length()-1) != ')') s += ')';
                if(aspLiteralService.findByLiteral(s)== null ) {
                  if(s.length() == 0) continue;
                  String temp = s + ".";
                  aspPrgService.programParser(temp);
                }
               Literal litFound = aspLiteralService.findByLiteral(s);
                //System.out.println(litFound.getLit());
                if(flag) aspString.append(",").append(s);
                else{
                  flag = true; aspString.append(s);
                }
                answerSet.add(litFound);
              }
              aspString.append(":-");
              flag = false;
              int pS = ansLit.indexOf("p",headN),pN = 0;
              if(ansLit.charAt(pS + 1) == '('){
                pN = ansLit.indexOf(")),n", pS);
                String posString = ansLit.substring(pS+2, pN+1);
                //System.out.println(posString);
                String []pos = posString.split("\\),");
                for (String po : pos) {
                  if(po.charAt(po.length()-1) != ')') po += ')';
                  if(aspLiteralService.findByLiteral(po)== null ) {
                    if(po.length() == 0) continue;
                    String temp = po + ".";
                    aspPrgService.programParser(temp);
                  }
                  Literal litFound = aspLiteralService.findByLiteral(po);
                  //System.out.println(litFound.getLit());
                  if(flag) aspString.append(",").append(po);
                  else{
                    flag = true; aspString.append(po);
                  }
                  answerSet.add(litFound);
                }
              }
              int nS = ansLit.indexOf("n", pN);
             // System.out.println(nS);
              if(ansLit.charAt(nS+1) == '('){
                int nN = ansLit.indexOf("))",nS);
                String negString = ansLit.substring(nS+2,nN+1);
               // System.out.println(negString);
                String []neg = negString.split("\\),");
                for (String s : neg) {
                  if(s.charAt(s.length()-1) != ')') s += ')';
                 // System.out.println(s);
                  if(aspLiteralService.findByLiteral(s)== null ) {
                    if(s.length() == 0) continue;
                    String temp = s + ".";
                    aspPrgService.programParser(temp);
                  }
                  Literal litFound = aspLiteralService.findByLiteral(s);
                  if(flag) aspString.append(",").append(s);
                  else{
                    flag = true; aspString.append(s);
                  }
                  //System.out.println(litFound.getLit());
                  answerSet.add(litFound);
                }

                }
              aspString.append(".");
              System.out.println(aspString);
              HashSet<ASPRule> aspRules = aspPrgService.programParser(aspString.toString());
              for (ASPRule aspRule : aspRules) {
                aspPrgService.saveRule(aspRule);
              }
            }
            else{
              Literal litFound = aspLiteralService.findByLiteral(ansLit);
              answerSet.add(litFound);
            }
          }
          System.out.println("123");
          for (Literal literal : answerSet) {
            System.out.println(literal.getId());
          }
          System.out.println("123");
          answerSetResponse.addAnswerSet(answerSet);
          meetAnswerFlag = false;
        }
        if (line.startsWith("Answer: ")) {
          meetAnswerFlag = true;
        }
      }
    }
    System.out.println(answerSetResponse.getAnswerSet());
    return answerSetResponse;
  }

  @Override
  public AnswerSetResponse solveAndGetAnswerSet(String aspCode) throws IOException {
   // System.out.println("123333333");
    String answerString =
        ShellExecutor.callShell(
            "echo "
                + aspCode.replace("\n", " ")
                + " | clingo 0");
//    System.out.println(
//            "echo "
//                + aspCode.replace(System.getProperty("\n"), " ")
//                + " | clingo 0");
    //System.out.print(2334);
    //System.out.println(answerString.length());
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
    System.out.println(answerSetResponse.getAnswerSet());
    return answerSetResponse;
  }

  @Override
  public void clearAll() {
    aspRuleRepository.deleteAll();
    literalRepository.deleteAll();
  }
}
