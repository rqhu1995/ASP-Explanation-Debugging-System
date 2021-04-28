package cn.seu.kse.controller;

import cn.seu.kse.dto.ASPRule;
import cn.seu.kse.dto.Literal;
import cn.seu.kse.graph.*;
import cn.seu.kse.repository.ASPRuleRepository;
import cn.seu.kse.repository.LiteralRepository;
import cn.seu.kse.response.AnswerSetResponse;
import cn.seu.kse.response.GroundAnswerResponse;
import cn.seu.kse.response.GroundingResponse;
import cn.seu.kse.response.ResultInfo;
import cn.seu.kse.service.ASPLiteralService;
import cn.seu.kse.service.ASPPrgService;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.persistence.criteria.CriteriaBuilder;
import java.io.IOException;
import java.util.*;

@CrossOrigin
@RestController
public class ASPRuleController {
  @Autowired ASPRuleRepository aspRuleRepository;
  @Autowired LiteralRepository literalRepository;
  @Autowired ASPPrgService aspPrgService;
  @Autowired ASPLiteralService aspLiteralService;

  @PostMapping("/grounding")
  @ResponseBody
  public ResultInfo grounding(@RequestBody GroundingResponse groundingResponse)
//          , @RequestBody  HashMap<String, HashSet<String>> preBind)
      throws IOException {
     aspPrgService.clearAll();
    ResultInfo result = new ResultInfo();
        HashSet<HashSet<String>> originalAnswerSetResponse = aspPrgService.solveAndGetAnswerSet(groundingResponse.getAspCode());
    // 获取绑定
    HashMap<String, HashSet<String>> bind = groundingResponse.getPreBind();
    String aspCode = groundingResponse.getAspCode().replace(System.getProperty("line.separator")," ");

    String aspCodeTemp = aspCode.replace(".", ".\n");
    aspCodeTemp = aspCodeTemp.substring(0, aspCodeTemp.length() - 1);
    String[] aspCodeTempString = aspCode.split("\\.");
    HashSet<String> LiteralVar = new HashSet<String>();
    for (String s : aspCodeTempString) {
      if (s.startsWith("var(")) LiteralVar.add(s);
    }
    ArrayList<String> ansArray = new ArrayList<String>();
    HashSet<ASPRule> aspRules = aspPrgService.programParser(aspCodeTemp);
        for (ASPRule aspRule : aspRules) {
          if(aspRule.getConstant() == "") continue;
           String[] constant = aspRule.getConstant().split(",");
          for (String s : constant) {
            LiteralVar.add("var(" + s + ").");
          }

        }
    HashSet<Integer> LiteralIdArray = new HashSet<Integer>();
    for (ASPRule aspRule : aspRules) {
      System.out.println("负体部" + aspRule.getNegBodyIDList());
      if (aspRule.getVar().equals("")) continue;
      String[] HeadID = aspRule.getHeadID().split(",");
      ArrayList<String> posBody = new ArrayList<String>();
      ArrayList<String> negBody = new ArrayList<String>();
      StringBuilder commonHead = new StringBuilder("head(");
      for (String s : HeadID) {
        s = s.trim();
        if (s.equals("")) continue;
        LitNode literThroughID =
            new LitNode(
                Objects.requireNonNull(
                    literalRepository.findById(Integer.parseInt(s)).orElse(null)));
        LiteralIdArray.add(Integer.parseInt(s));
        if (commonHead.charAt(commonHead.length() - 1) == '(')
          commonHead.append(literThroughID.getLiteral());
        else commonHead.append(",").append(literThroughID.getLiteral());
      }
      commonHead.append("),p(");
      String[] posBodyID = aspRule.getPosBodyIDList().split(",");
      for (String s : posBodyID) {
        s = s.trim();
        if (s.equals("")) continue;
        LitNode literThroughID =
            new LitNode(
                Objects.requireNonNull(
                    literalRepository.findById(Integer.parseInt(s)).orElse(null)));
        LiteralIdArray.add(Integer.parseInt(s));
        posBody.add(literThroughID.getLiteral());
        if (commonHead.charAt(commonHead.length() - 1) == '(')
          commonHead.append(literThroughID.getLiteral());
        else commonHead.append(",").append(literThroughID.getLiteral());
      }
      commonHead.append("),n(");
      String[] negBodyID = aspRule.getNegBodyIDList().split(",");
      for (String s : negBodyID) {
        s = s.trim();
        if (s.equals("")) continue;
        LitNode literThroughID =
            new LitNode(
                Objects.requireNonNull(
                    literalRepository.findById(Integer.parseInt(s)).orElse(null)));
        LiteralIdArray.add(Integer.parseInt(s));
        negBody.add(literThroughID.getLiteral());
        if (commonHead.charAt(commonHead.length() - 1) == '(')
          commonHead.append(literThroughID.getLiteral());
        else commonHead.append(",").append(literThroughID.getLiteral());
      }
      commonHead.append("))");
      boolean flag = false;
      StringBuilder bodyAll = new StringBuilder("ap(" + commonHead + ":-");
      for (String s : posBody) {
        if (flag) bodyAll.append(",").append(s);
        else {
          bodyAll.append(s);
          flag = true;
        }
        String[] var = aspRule.getVar().split(",");
        StringBuilder blp = new StringBuilder("blp(" + commonHead + ":-" + "not " + s);

        if (bind.containsKey(s)) {
          HashSet<String> bindSet = bind.get(s);
          boolean is_ok = false;
          for (String s1 : bindSet) {
            if(s1.contains("(true)")){
              is_ok = true; break;
            }
          }
          if(is_ok) continue;
          String existVariable = "";
          for (String s1 : bindSet) {
            blp.append(",").append(s1);
            existVariable += s1.substring(s1.indexOf("("), s1.indexOf(")"));
          }
          for (String s1 : var) {
            s1 = s1.trim();
            if(existVariable.contains(s1)) continue;
            blp.append(",var(").append(s1).append(")");
          }
        } else {
          for (String s1 : var) {
            s1 = s1.trim();
            blp.append(",var(").append(s1).append(")");
          }
        }
        ansArray.add(blp + ".");
      }
      for (String s : negBody) {
        if (flag) bodyAll.append(", not ").append(s);
        else {
          bodyAll.append("not ").append(s);
          flag = true;
        }
        String[] var = aspRule.getVar().split(",");
        System.out.println("!!!!!!!!");
        System.out.println(Arrays.toString(var));
        StringBuilder bln = new StringBuilder("bln(" + commonHead + ":-" + s);
        String existVariable = s.substring(s.indexOf("("), s.indexOf(")"));
        System.out.println(existVariable);
        for (String s1 : var) {
          s1 = s1.trim();
          if(existVariable.contains(s1)) continue;
          bln.append(",var(").append(s1).append(")");
        }
        ansArray.add(bln + ".");
      }
      ansArray.add(bodyAll + ".");
    }
    StringBuilder AspProgram = new StringBuilder();
    for (String s : ansArray) {
      AspProgram.append(s);
    }
    String[] aspCodeArray = aspCode.split("\\.");
    for (String s : aspCodeArray) {
      if (!s.contains(":-") && !s.equals( " ")) {
        //System.out.println("s"+s);
        s += ".";
        AspProgram.append(s);
      }
    }
        for (String s : LiteralVar) {
          AspProgram.append(s);
        }
        /*
        for (HashSet<String> strings : originalAnswerSetResponse) {
          for (String string : strings) {
            if(string.startsWith("var(")){
              System.out.println(string);
              List<Literal> literThroughLit = literalRepository.findByLit(string);
              for (Literal literal : literThroughLit) {
                literalRepository.deleteById(literal.getId());
              }
              strings.remove(string);
            }
          }
        }

         */
        System.out.println(AspProgram.toString());
    GroundAnswerResponse answerSetResponse = aspPrgService.solveAndGetGrounding(AspProgram.toString());
    answerSetResponse.setAnswerSet(originalAnswerSetResponse);
    for (Integer integer : LiteralIdArray) {
      literalRepository.deleteById(integer);
    }
    for (String s : LiteralVar) {
      List<Literal> literThroughLit = literalRepository.findByLit(s);
      for (Literal literal : literThroughLit) {
        System.out.println(literal.getId());
        literalRepository.deleteById(literal.getId());
      }
    }
    result.setStatus(1);
    result.setData(answerSetResponse);
    return result;
    //System.out.println(groundingResponse.getAspCode());
   // System.out.println(groundingResponse.getPreBind().get("bid(M,P,N)"));
//    System.out.println(preBind);

  }
  @PostMapping("/debugging")
  @ResponseBody
  public ResultInfo programDebugging (@RequestBody String aspCode) throws IOException {
    ResultInfo result = new ResultInfo();
    //HashSet<ASPRule> aspRules = aspPrgService.programParser(aspCode);
    HashSet<String> wellFounded= aspPrgService.solveAndGetWellFounded(aspCode);
    HashSet<HashSet<String>> answerSetResponse = aspPrgService.solveAndGetAnswerSet(aspCode);
    if (wellFounded == null) {
      //result.setStatus(0);
      if(answerSetResponse == null){

      }
      else{

      }
    } else {
      //result.setStatus(1);
      result.setData(answerSetResponse);
    }
    return result;
  }
  /**
   * 获取ASP程序，解析存放每条rule和每个lit
   *
   * @param aspCode -- asp程序字符串
   * @return result -- {@link ResultInfo}
   */
  @PostMapping("/parseprogram")
  @ResponseBody
  public ResultInfo programStoring(@RequestBody String aspCode) throws IOException {
    ResultInfo result = new ResultInfo();
    HashSet<ASPRule> aspRules = aspPrgService.programParser(aspCode);
    for (ASPRule aspRule : aspRules) {
      aspPrgService.saveRule(aspRule);
    }
    HashSet<HashSet<String>> answerSetResponse = aspPrgService.solveAndGetAnswerSet(aspCode);
    if (answerSetResponse == null) {
      result.setStatus(0);
    } else {
      result.setStatus(1);
      result.setData(answerSetResponse);
    }
    return result;
  }

  @GetMapping("/getLiterals")
  @ResponseBody
  public ResultInfo getAllNonGroundLiterals() {
    ResultInfo result = new ResultInfo();
    HashSet<String> nonGrdLits = aspLiteralService.findNonGround();
    result.setData(nonGrdLits);
    result.setStatus(1);
    return result;
  }

  @GetMapping("/clearall")
  @ResponseBody
  public ResultInfo clearAll() {
    ResultInfo result = new ResultInfo();
    aspPrgService.clearAll();
    result.setStatus(1);
    return result;
  }

  /**
   * construction of {@link ARGraph explanation_universe}
   *
   * @param answerSetRequest
   * @return
   */
  @GetMapping("/findexplanation")
  @ResponseBody
  public ResultInfo constructExplanation(@RequestParam HashSet<String> answerSetRequest) {
    HashSet<String> answerSet = new HashSet<>();
    for (String asRequest : answerSetRequest) {
      answerSet.add(asRequest.replace("\"", ""));
    }
    ResultInfo result = new ResultInfo();
    ARGraph explanationUniverse = new ARGraph();
    // all rule nodes with parent and children atoms/endnode
    List<String> underivable = aspRuleRepository.findAllUnderivable();
    for (ASPRule aspRule : aspRuleRepository.findAll()) {
      RuleNode ruleNode = new RuleNode(aspRule);
      boolean applicable = false;
      explanationUniverse.setGraphRuleNodes(ruleNode);
      HashSet<String> posSet =
          new HashSet<>((Arrays.asList(aspRule.getPosBodyIDList().split(","))));
      HashSet<String> negSet =
          new HashSet<>((Arrays.asList(aspRule.getNegBodyIDList().split(","))));
      if ((answerSet.containsAll(posSet) || posSet.size() == 0)
          && (Collections.disjoint(answerSet, negSet))) {
        applicable = true;
      }
      LitNode headLit =
          new LitNode(
              Objects.requireNonNull(
                  literalRepository.findById(Integer.parseInt(aspRule.getHeadID())).orElse(null)));
      ApplicableEdge applicableEdge = new ApplicableEdge(headLit, ruleNode, applicable);
      explanationUniverse.setGraphLitNodes(headLit);
      explanationUniverse.setGraphApplicableEdges(applicableEdge);
      if (aspRule.getPosBodyIDList().length() != 0) {
        for (String posLitId : aspRule.getPosBodyIDList().split(",")) {
          LitNode pBodyNode =
              new LitNode(
                  Objects.requireNonNull(
                      literalRepository.findById(Integer.parseInt(posLitId)).orElse(null)));
          DependencyEdge dependencyEdge = new DependencyEdge(ruleNode, pBodyNode, true);
          explanationUniverse.setGraphLitNodes(pBodyNode);
          explanationUniverse.setGraphDependencyEdges(dependencyEdge);
        }
      }

      if (aspRule.getNegBodyIDList().length() != 0) {
        for (String negLitId : aspRule.getNegBodyIDList().split(",")) {
          LitNode nBodyNode =
              new LitNode(
                  Objects.requireNonNull(
                      literalRepository.findById(Integer.parseInt(negLitId)).orElse(null)));
          DependencyEdge dependencyEdge = new DependencyEdge(ruleNode, nBodyNode, false);
          explanationUniverse.setGraphLitNodes(nBodyNode);
          explanationUniverse.setGraphDependencyEdges(dependencyEdge);
        }
      }
      for (RuleNode rNode : explanationUniverse.getGraphRuleNodes()) {
        if (rNode.getRuleContent().isFact()) {
          EndEdge topEndEdge = new EndEdge(rNode, explanationUniverse.getTop());
          explanationUniverse.setGraphEndEdges(topEndEdge);
        }
      }

      for (LitNode lNode : explanationUniverse.getGraphLitNodes()) {
        if (underivable.contains(lNode.getLiteral())) {
          EndEdge btmEndEdge = new EndEdge(lNode, explanationUniverse.getBtm());
          explanationUniverse.setGraphEndEdges(btmEndEdge);
        }
      }
    }

    // ue环
    HashSet<ApplicableEdge> candidateApEdge = new HashSet<>();
    HashSet<DependencyEdge> candidateDepEdge = new HashSet<>();
    for (DependencyEdge graphDependencyEdge : explanationUniverse.getGraphDependencyEdges()) {
      if (!answerSet.contains(graphDependencyEdge.getEndNode().getLiteral())) {
        candidateDepEdge.add(graphDependencyEdge);
      }
    }

    for (ApplicableEdge graphApplicableEdge : explanationUniverse.getGraphApplicableEdges()) {
      if (!answerSet.contains(graphApplicableEdge.getStartNode().getLiteral())) {
        candidateApEdge.add(graphApplicableEdge);
      }
    }

    ueCycleDetection(candidateApEdge, candidateDepEdge);

    // asm集合交互

    for (Literal lit : literalRepository.findAll()) {
      LitNode litNode = new LitNode(lit);
      explanationUniverse.setGraphLitNodes(litNode);
    }
    result.setData(explanationUniverse);
    return result;
  }

  private void ueCycleDetection(
      HashSet<ApplicableEdge> candidateApEdge, HashSet<DependencyEdge> candidateDepEdge) {}
}
