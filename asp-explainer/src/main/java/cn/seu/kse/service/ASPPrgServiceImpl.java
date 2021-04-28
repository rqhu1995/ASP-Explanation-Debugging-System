package cn.seu.kse.service;

import cn.seu.kse.dto.ASPRule;
import cn.seu.kse.dto.Literal;
import cn.seu.kse.repository.ASPRuleRepository;
import cn.seu.kse.repository.LiteralRepository;
import cn.seu.kse.response.GroundAnswerResponse;
import cn.seu.kse.response.GroundingResponse;
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
import java.util.Arrays;
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
  public GroundAnswerResponse solveAndGetGrounding(String aspCode) throws  IOException{
    System.out.println("aspCode:\n"+aspCode);
    String answerString;
    if (System.getProperty("os.name").contains("Windows")) {
      answerString =
          ShellExecutor.callShell("echo " + aspCode.replace("\n", " ") + " | clingo 0");
    }else{
      answerString =
              ShellExecutor.callShell("echo \"" + aspCode.replace("\n", " ") + "\" | clingo 0");
      System.out.println(answerString);
    }
    GroundAnswerResponse answerSetResponse = new GroundAnswerResponse();
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
          String GroundCode = "";
          String[] singleAnswer = line.split(" ");
          if (line.equals("\n")) {
            answerSet.add(new Literal());
          }
          for (String ansLit : singleAnswer) {
            if(ansLit.startsWith("ap")||ansLit.startsWith("blp")||ansLit.startsWith("bln")){
              int headS = ansLit.indexOf("d(") + 2;
              int headN = ansLit.indexOf("))",headS) + 1;
              String headString = ansLit.substring(headS,headN);
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

                if(flag) {
                  aspString.append(",").append(s);
                }
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
                String []pos = posString.split("\\),");
                for (String po : pos) {
                  if(po.charAt(po.length()-1) != ')') po += ')';
                  if(aspLiteralService.findByLiteral(po)== null ) {
                    if(po.length() == 0) continue;
                    String temp = po + ".";
                    aspPrgService.programParser(temp);
                  }
                  Literal litFound = aspLiteralService.findByLiteral(po);
                  if(flag) aspString.append(",").append(po);
                  else{
                    flag = true; aspString.append(po);
                  }
                  answerSet.add(litFound);
                }
              }
              int nS = ansLit.indexOf("n", pN);
              if(ansLit.charAt(nS+1) == '('){
                int nN = ansLit.indexOf("))",nS);
                String negString = ansLit.substring(nS+2,nN+1);
                String []neg = negString.split("\\),");
                for (String s : neg) {
                  if(s.charAt(s.length()-1) != ')') s += ')';
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
                  answerSet.add(litFound);
                }

                }
              aspString.append(".");
              GroundCode += aspString.toString();

              answerSetResponse.setGroundCode(GroundCode);
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
          //answerSetResponse.addAnswerSet(answerSet);
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
  public HashSet<HashSet<String>> solveAndGetAnswerSet(String aspCode) throws IOException {
    String answerString;
    if (System.getProperty("os.name").contains("Windows")) {
      answerString =
              ShellExecutor.callShell("echo " + aspCode.replace("\n", " ") + " | clingo 0");
    }else{
      answerString =
              ShellExecutor.callShell("echo \"" + aspCode.replace("\n", " ") + "\" | clingo 0");
      System.out.println(answerString);
    }

    HashSet<HashSet<String>> answerSets = new HashSet<>();
    if (answerString.contains("UNSAT")) {
      return null;
    } else {
      String[] outputList = answerString.split(System.getProperty("line.separator"));
      boolean meetAnswerFlag = false;
      for (String line : outputList) {
        if (meetAnswerFlag) {
          HashSet<String> answerSet = new HashSet<>();
          String[] singleAnswer = line.split(" ");
          if (line.equals("\n")) {
            answerSet.add("");
          }
          answerSet.addAll(Arrays.asList(singleAnswer));
          answerSets.add(answerSet);
          meetAnswerFlag = false;
        }
        if (line.startsWith("Answer: ")) {
          meetAnswerFlag = true;
        }
      }
    }
    return answerSets;
  }

  @Override
  public void clearAll() {
    aspRuleRepository.deleteAll();
    literalRepository.deleteAll();
  }
}
