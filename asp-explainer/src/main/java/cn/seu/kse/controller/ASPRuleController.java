package cn.seu.kse.controller;

import cn.seu.kse.dto.ASPRule;
import cn.seu.kse.dto.Literal;
import cn.seu.kse.graph.*;
import cn.seu.kse.repository.ASPRuleRepository;
import cn.seu.kse.repository.LiteralRepository;
import cn.seu.kse.response.AnswerSetResponse;
import cn.seu.kse.response.ResultInfo;
import cn.seu.kse.service.ASPLiteralService;
import cn.seu.kse.service.ASPPrgService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.*;

@CrossOrigin
@RestController
public class ASPRuleController {
  @Autowired ASPRuleRepository aspRuleRepository;
  @Autowired LiteralRepository literalRepository;
  @Autowired ASPPrgService aspPrgService;
  @Autowired ASPLiteralService aspLiteralService;

  @GetMapping("/grounding")
  @ResponseBody
  public ResultInfo grounding(@RequestParam String aspCode,@RequestParam ArrayList<String> atom,@RequestParam String preBind) throws IOException {
    ResultInfo result = new ResultInfo();
    //获取绑定
    HashMap bind = new HashMap<String,String>();
    if(preBind.length()!=0) {
      String[] prebindString = preBind.split("\\),");
      for (String t : prebindString) {
        String[] temp = t.split(":");
        if (temp[1].charAt(temp[1].length() - 1) != ')') temp[1] += ")";
        bind.put(temp[0], temp[1]);
      }
    }
    //bind.put("penguin(X)","bird(X)");
    //System.out.println(aspCode.replace(".",".\n").substring(0,aspCode.length()-1));
    String aspCodeTemp = aspCode.replace(".",".\n");
    aspCodeTemp = aspCodeTemp.substring(0,aspCodeTemp.length()-1);
   // System.out.println(aspCodeTemp);
    ArrayList<String>ansArray = new ArrayList<String>();
    HashSet<ASPRule> aspRules = aspPrgService.programParser(aspCodeTemp);
    for (ASPRule aspRule : aspRules) {
      //System.out.println(aspRule.getVar());
      if(aspRule.getVar() == "") continue;
      aspPrgService.saveRule(aspRule);
      String[] HeadID = aspRule.getHeadID().split(",");
      ArrayList<String> posBody = new ArrayList<String>();
      ArrayList<String> negBody = new ArrayList<String>();
      String commonHead = "head(";
      for (String s : HeadID) {
        s = s.trim();
        if(s == "") continue;
          LitNode literThroughID = new LitNode(
                  Objects.requireNonNull(
                          literalRepository.findById(Integer.parseInt(s)).orElse(null)));
          //System.out.println(literThroughID.getLiteral());
          if(commonHead.charAt(commonHead.length()-1)=='(')
            commonHead += literThroughID.getLiteral();
          else
            commonHead += (","+literThroughID.getLiteral());
      }
      commonHead += "),p(";
      String[] posBodyID  = aspRule.getPosBodyIDList().split(",");
      for (String s : posBodyID) {
        s = s.trim();
        if(s == "") continue;

          LitNode literThroughID = new LitNode(
                  Objects.requireNonNull(
                          literalRepository.findById(Integer.parseInt(s)).orElse(null)));
          //System.out.println(literThroughID.getLiteral());
          posBody.add(literThroughID.getLiteral());
          if(commonHead.charAt(commonHead.length()-1)=='(')
            commonHead += literThroughID.getLiteral();
          else
            commonHead += (","+literThroughID.getLiteral());
      }
      commonHead += "),n(";
      String[] negBodyID = aspRule.getNegBodyIDList().split(",");
      for (String s : negBodyID) {
        s= s.trim();
        if(s == "") continue;
        LitNode literThroughID = new LitNode(
                Objects.requireNonNull(
                        literalRepository.findById(Integer.parseInt(s)).orElse(null)));
        //System.out.println(literThroughID.getLiteral());
        negBody.add(literThroughID.getLiteral());
        if(commonHead.charAt(commonHead.length()-1)=='(')
          commonHead += literThroughID.getLiteral();
        else
          commonHead += (","+literThroughID.getLiteral());
      }
      commonHead += "))";
      boolean flag = false;
      String bodyAll = "ap(" + commonHead + ":-";
      for (String s : posBody) {
          if(flag)
            bodyAll += ("," + s);
          else {
            bodyAll += s;
            flag = true;
          }
          String[] var = aspRule.getVar().split(",");
          String blp = "blp(" + commonHead + ":-" + "not " + s;

          if(bind.containsKey(s)) {
              if(bind.get(s).equals("(true)")) continue;
              blp += ("," + bind.get(s));
          }
          else{
              for (String s1 : var) {
                  blp += (",var(" + s1 + ")");
              }
          }
          ansArray.add(blp + ".");
      }
      for (String s : negBody) {
        if(flag)
          bodyAll += (", not " + s);
        else {
          bodyAll += ("not " + s);
          flag = true;
        }
        String[] var = aspRule.getVar().split(",");
        String bln = "bln(" + commonHead + ":-"  + s;

        if(bind.containsKey(s)) {
          if(bind.get(s).equals("(true)")) continue;
          bln += ("," + bind.get(s));
        }
        else{
          for (String s1 : var) {
            bln += (",var(" + s1 + ")");
          }
        }
        ansArray.add(bln + ".");
      }
      ansArray.add(bodyAll+".");
    }
    String AspProgram = "";
    for(String s:ansArray){
      AspProgram+=s;
    }
    System.out.println(AspProgram);
    AspProgram+=aspCode;
    //AspProgram+="#show ap/3.";
    //AspProgram+="#show blp/3.";
    //AspProgram+="#show bln/3.";
    AnswerSetResponse answerSetResponse = aspPrgService.solveAndGetGrounding(AspProgram);
   //HashSet<HashSet<Literal> > = answerSetResponse.getAnswerSet();

    /*HashSet<String> aspProgram = new HashSet<String>();
    for(String retval: aspCode.split("\\.")){
      aspProgram.add(retval);
    }

    String temp = "";
    for(String rule : aspProgram){
       if(rule.contains(":-")){
            String []splitArray = rule.split(":-");
            String []headArray = splitArray[0].split("\\),");
            String []bodyArray = splitArray[1].split("\\),");
            HashSet<String> posArray = new HashSet<String>();
            HashSet<String> negArray = new HashSet<String>();
             String headString = "",posString="",negString = "";
            for(String t:bodyArray){
              t = t.trim();
           //   System.out.println(t);
              if(t.charAt(t.length()-1)!=')') t+=')';
              if(t.contains("not")){
                negString+=(t.substring(t.indexOf(' ')+1)+',');
                negArray.add(t.substring(t.indexOf(' ')+1));
              }
              else{
                posArray.add(t);
                posString+=(t+',');
              }
            }
            for(String t:headArray){
              headString += (t+',');
            }
         headString = headString.substring(0,Math.max(headString.length()-1,0));
         posString = posString.substring(0,Math.max(posString.length()-1,0));
         negString = negString.substring(0,Math.max(negString.length()-1,0));
         //System.out.println("ap(head("+headString+"),p("+posString+"),n("+negString+")):-"+rule.substring(rule.indexOf('-')+1));
         ansArray.add("ap(head("+headString+"),p("+posString+"),n("+negString+")):-"+rule.substring(rule.indexOf('-')+1)+".");
         for(String pos : posArray){
           if(bind.containsKey(pos)) {
             if(bind.get(pos).equals("(true)")) continue;
             else ansArray.add("blp(head(" + headString + "),p(" + posString + "),n(" + negString + ")):-" + "not " + pos + "," + bind.get(pos) + ".");
           }
           else
             ansArray.add("blp(head("+headString+"),p("+posString+"),n("+negString+")):-"+"not "+pos+",var(X)"+".");
         }
         for(String pos : negArray){
             ansArray.add("bln(head("+headString+"),p("+posString+"),n("+negString+")):-"+pos+".");
         }
         //System.out.println(ansArray);
       }
    }
    for(String t:ansArray){
      temp+=t;
    }
    temp+=aspCode;
    temp+="#show ap/3.";
    temp+="#show blp/3.";
    temp+="#show bln/3.";
    //result.setStatus(1);
    AnswerSetResponse answerSetResponse = aspPrgService.solveAndGetAnswerSet(temp);
    String ansCode = "ap(head(fly(tux)),p(bird(tux)),n(neg_fly(tux))) ap(head(neg_fly(tweety)),p(penguin(tweety)),n) bln(head(fly(tweety)),p(bird(tweety)),n(neg_fly(tweety))) blp(head(neg_fly(tux)),p(penguin(tux)),n)";
    String[] ansRule  = ansCode.split(" ");
    String answerAsp = "";
    for(String t: ansRule){
      String tempString = "";
      int index1= t.indexOf("head("),index2 = t.indexOf("))");
      tempString = t.substring(index1+5,index2+1)+":-";
      int indexStartP = t.indexOf("p",index2);
      if(t.charAt(indexStartP+1)  =='('){
        int indexEndP = t.indexOf("))",indexStartP);
        tempString += t.substring(indexStartP+2,indexEndP+1);
        int indexStartN = t.indexOf("n",indexEndP);
        if(t.charAt(indexStartN+1) =='('){
          int indexEndN = t.length()-2;
          tempString += (","+t.substring(indexStartN+2,indexEndN));
        }
      }
      else{
        int indexStartN = t.indexOf("n",indexStartP);
        if(t.charAt(indexStartN+1) =='('){
          int indexEndN = t.length()-2;
          tempString += (t.substring(indexStartN+2,indexEndN));
        }
      }
      tempString+=".";
      answerAsp+=tempString;
    }
    */
    result.setStatus(1);
    result.setData(answerSetResponse);
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
    System.out.println(aspRules.size());
    for (ASPRule aspRule : aspRules) {

      aspPrgService.saveRule(aspRule);
    }
    System.out.println(aspCode);
    AnswerSetResponse answerSetResponse = aspPrgService.solveAndGetAnswerSet(aspCode);
    result.setStatus(1);
    result.setData(answerSetResponse);
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
   * @param answerSetRequest
   * @return
   */
  @GetMapping("/findexplanation")
  @ResponseBody
  public ResultInfo constructExplanation(@RequestParam HashSet<String> answerSetRequest) {
    HashSet<String> answerSet = new HashSet<>();
    for (String asRequest : answerSetRequest) {
      System.out.println(asRequest);
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
      System.out.println("Ans:" + answerSet.toString());
      System.out.println(
          "pos:" + posSet.toString() + (answerSet.containsAll(posSet) || posSet.size() == 0));
      System.out.println("neg:" + negSet.toString() + Collections.disjoint(answerSet, negSet));
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
      if(!answerSet.contains(graphDependencyEdge.getEndNode().getLiteral())){
        candidateDepEdge.add(graphDependencyEdge);
      }
    }

    for (ApplicableEdge graphApplicableEdge : explanationUniverse.getGraphApplicableEdges()) {
      if(!answerSet.contains(graphApplicableEdge.getStartNode().getLiteral())){
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

  private void ueCycleDetection(HashSet<ApplicableEdge> candidateApEdge, HashSet<DependencyEdge> candidateDepEdge) {

  }
}
