package cn.seu.kse.controller;

import cn.seu.kse.dto.ASPRule;
import cn.seu.kse.dto.Literal;
import cn.seu.kse.graph.*;
import cn.seu.kse.repository.ASPRuleRepository;
import cn.seu.kse.repository.LiteralRepository;
import cn.seu.kse.response.GroundAnswerResponse;
import cn.seu.kse.response.GroundingResponse;
import cn.seu.kse.response.ResultInfo;
import cn.seu.kse.service.ASPLiteralService;
import cn.seu.kse.service.ASPPrgService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Paths;
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
    ObjectMapper mapper = new ObjectMapper();
    ResultInfo result = new ResultInfo();
    HashSet<ArrayList<String>> answerSet = new HashSet<>();
    HashSet<?> originalAnswerSetResponse =
        mapper.readValue(Paths.get("answerset.json").toFile(), HashSet.class);
    for (Object ans : originalAnswerSetResponse) {
      answerSet.add((ArrayList<String>) ans);
    }
    // 获取绑定
    HashMap<String, HashSet<String>> bind = groundingResponse.getPreBind();
    String aspCode = groundingResponse.getAspCode();

    //    aspCode = aspCode.replace("\"", "\\\"");
    String[] codeByLine = aspCode.split("\n");
    StringBuilder aspCodeWithoutComment = new StringBuilder();
    for (String code : codeByLine) {
      if (!code.startsWith("%")
          && code.length() > 0
          && !code.equals(System.getProperty("line.separator"))) {
        aspCodeWithoutComment.append(code).append(System.getProperty("line.separator"));
      }
    }
    // System.out.println(aspCode);
    String aspCodeTemp = aspCodeWithoutComment.toString();
    //  aspCode =
    //     aspCodeWithoutComment
    //          .toString()
    //          .replace(System.getProperty("line.separator"), " ");

    //    aspCodeTemp = aspCodeTemp.substring(0, aspCodeTemp.length());
    String[] aspCodeTempString = aspCodeTemp.split("\\." + System.getProperty("line.separator"));
    HashSet<String> LiteralVar = new HashSet<String>();
    for (String s : aspCodeTempString) {
      if (s.startsWith("var(")) LiteralVar.add(s);
    }
    ArrayList<String> ansArray = new ArrayList<String>();
    // System.out.println("aspCodeTemp");
    // System.out.println(aspCodeTemp);
    while (aspCodeTemp.endsWith(System.getProperty("line.separator"))) {
      aspCodeTemp = aspCodeTemp.substring(0, aspCodeTemp.length() - 1);
    }
    HashSet<ASPRule> aspRules = aspPrgService.programParser(aspCodeTemp);
    for (ASPRule aspRule : aspRules) {
      if (aspRule.getConstant() == "") continue;
      String[] constant = aspRule.getConstant().split(",");
      for (String s : constant) {
        LiteralVar.add("var(" + s + ").");
      }
    }
    HashSet<Integer> LiteralIdArray = new HashSet<Integer>();
    for (ASPRule aspRule : aspRules) {
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
            if (s1.contains("(true)")) {
              is_ok = true;
              break;
            }
          }
          if (is_ok) continue;
          String existVariable = "";
          if (s.equals("works_at(X,Y)")) {
            blp.append(",parent(X,PARENTS)");
            blp.append(",var(Y)");
          } else {
            for (String s1 : bindSet) {
              blp.append(",").append(s1);
              existVariable += s1.substring(s1.indexOf("("), s1.indexOf(")"));
            }
            for (String s1 : var) {
              s1 = s1.trim();
              if (existVariable.contains(s1)) continue;
              blp.append(",var(").append(s1).append(")");
            }
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
        StringBuilder bln = new StringBuilder("bln(" + commonHead + ":-" + s);
        String existVariable = s.substring(s.indexOf("("), s.indexOf(")"));
        for (String s1 : var) {
          s1 = s1.trim();
          if (existVariable.contains(s1)) continue;
          bln.append(",var(").append(s1).append(")");
        }
        ansArray.add(bln + ".");
      }
      if (!bodyAll.toString().equals(" ") && bodyAll.length() > 0) {
        ansArray.add(bodyAll + ".");
      }
    }
    StringBuilder AspProgram = new StringBuilder();
    for (String s : ansArray) {
      // System.out.println(s);
      AspProgram.append(s);
    }
    String[] aspCodeArray = aspCodeTemp.split("\\." + System.getProperty("line.separator"));
    for (String s : aspCodeArray) {
      if (!s.contains(":-") && !s.equals(" ") && s.length() >0) {
        System.out.println("s"+s);
        if(!s.endsWith("."))
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
    System.out.println("ASPProgram");
    System.out.println(AspProgram.toString());
    GroundAnswerResponse answerSetResponse =
        aspPrgService.solveAndGetGrounding(AspProgram.toString());
    answerSetResponse.setAnswerSet(answerSet);
    for (Integer integer : LiteralIdArray) {
      literalRepository.deleteById(integer);
    }
    for (String s : LiteralVar) {
      List<Literal> literThroughLit = literalRepository.findByLit(s);
      for (Literal literal : literThroughLit) {
        //  System.out.println(literal.getId());
        literalRepository.deleteById(literal.getId());
      }
    }
    result.setStatus(1);
    result.setData(answerSetResponse);
    return result;
    // System.out.println(groundingResponse.getAspCode());
    // System.out.println(groundingResponse.getPreBind().get("bid(M,P,N)"));
    //    System.out.println(preBind);

  }

  @PostMapping("/debugging")
  @ResponseBody
  public ResultInfo programDebugging(@RequestBody String aspCode) throws IOException {
    ResultInfo result = new ResultInfo();
    HashSet<String> wellFounded = aspPrgService.solveAndGetWellFounded(aspCode);
    HashSet<HashSet<String>> answerSetResponse = aspPrgService.solveAndGetAnswerSet(aspCode);
    String aspCodeReplace = aspCode.replace(":-", "::").replace("-", "fei").replace("::", ":-");
    HashSet<HashSet<String>> answerSetResponseReplace =
        aspPrgService.solveAndGetAnswerSet(aspCodeReplace);
    HashSet<String> wellFoundedReplace = aspPrgService.solveAndGetWellFounded(aspCodeReplace);
    HashSet<ASPRule> aspRules = aspPrgService.programParser(aspCodeReplace);
    HashSet<String> Candidate = new HashSet<>();
    HashSet<String> NAF = new HashSet<>();
    HashSet<String> ansReturn = new HashSet<>();
    for (ASPRule aspRule : aspRules) {
      String[] HeadID = aspRule.getHeadID().split(",");
      for (String s : HeadID) {
        s = s.trim();
        if (s.equals("")) continue;
        LitNode literThroughID =
            new LitNode(
                Objects.requireNonNull(
                    literalRepository.findById(Integer.parseInt(s)).orElse(null)));
        if (aspRule.getNegBodyIDList().length() != 0) {
          Candidate.add(literThroughID.getLiteral());
        }
        if (literThroughID.getLiteral().startsWith("fei")) {
          NAF.add(literThroughID.getLiteral().substring(3));
        }
      }
    }
    // System.out.println(Candidate);
    // System.out.println(NAF);
    if (wellFounded == null) {
      // result.setStatus(0);
      boolean flag = false;
      if (flag) {

      } else {
        for (String s : Candidate) {
          if (s.startsWith("fei")) {
            ansReturn.add(s.replace("fei", "-"));
            ansReturn.add(s.substring(3));
          } else if (NAF.contains(s)) {
            ansReturn.add(s);
            ansReturn.add("-" + s);
          }
        }
      }
    } else {
      if (answerSetResponseReplace == null) {

      } else {

        for (String s : Candidate) {
          for (HashSet<String> strings : answerSetResponseReplace) {
            if (strings.contains(s)) {
              if (s.startsWith("fei") && strings.contains(s.substring(3))) {
                ansReturn.add(s.replace("fei", "-"));
                ansReturn.add(s.substring(3));
              }
              if ((!s.startsWith("fei")) && strings.contains("fei" + s)) {
                ansReturn.add(s);
                ansReturn.add("-" + s);
              }
            }
          }
        }
      }
    }
    result.setStatus(1);
    result.setData(ansReturn);
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
    aspPrgService.clearAll();
    ResultInfo result = new ResultInfo();
    StringBuilder aspCodeWithoutComment = new StringBuilder();
    String[] codeByLine = aspCode.split(System.getProperty("line.separator"));
    for (String code : codeByLine) {
      if (!code.startsWith("%") && code.length() > 0) {
        aspCodeWithoutComment.append(code).append(System.getProperty("line.separator"));
      }
    }
    HashSet<ASPRule> aspRules = aspPrgService.programParser(aspCodeWithoutComment.toString());
    for (ASPRule aspRule : aspRules) {
      aspPrgService.saveRule(aspRule);
    }
    HashSet<HashSet<String>> answerSetResponse =
        aspPrgService.solveAndGetAnswerSet(aspCodeWithoutComment.toString());
    if (answerSetResponse == null) {
      result.setStatus(0);
    } else {
      result.setStatus(1);
      result.setData(answerSetResponse);
    }
    ObjectMapper mapper = new ObjectMapper();
    mapper.writeValue(Paths.get("answerset.json").toFile(), answerSetResponse);
    return result;
  }

  @GetMapping("/getAnswerSet")
  @ResponseBody
  public ResultInfo getAnswerSet() throws IOException {
    ResultInfo result = new ResultInfo();
    ObjectMapper mapper = new ObjectMapper();
    HashSet<?> answerSetResponse =
        mapper.readValue(Paths.get("answerset.json").toFile(), HashSet.class);
    //    System.out.println(answerSetResponse);
    result.setData(answerSetResponse);
    result.setStatus(1);
    return result;
  }

  @GetMapping("/getEU")
  @ResponseBody
  public ResultInfo getEU() throws IOException {
    ResultInfo result = new ResultInfo();
    ObjectMapper mapper = new ObjectMapper();
    ARGraph eUResponse = mapper.readValue(Paths.get("EU.json").toFile(), ARGraph.class);
    System.out.println(eUResponse);
    result.setData(eUResponse);
    result.setStatus(1);
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
  public ResultInfo constructExplanation(@RequestParam HashSet<String> answerSetRequest)
      throws IOException {
    HashSet<String> answerSet = new HashSet<>();
    for (String asRequest : answerSetRequest) {
      answerSet.add(asRequest.replace("\"", ""));
    }
    ResultInfo result = new ResultInfo();
    ARGraph explanationUniverse = new ARGraph();
    // all rule nodes with parent and children atoms/endnode
    List<String> underivable = aspLiteralService.findAllUnderivable();
    HashSet<String> ansLitID = new HashSet<>();
    for (String ans : answerSet) {
      ansLitID.add(String.valueOf(literalRepository.findByLit(ans).get(0).getId()));
    }
    for (ASPRule aspRule : aspRuleRepository.findAll()) {
      RuleNode ruleNode = new RuleNode(aspRule);
      boolean applicable = false;
      explanationUniverse.setGraphRuleNodes(ruleNode);
      HashSet<String> posSet =
          new HashSet<>((Arrays.asList(aspRule.getPosBodyIDList().split(","))));
      HashSet<String> negSet =
          new HashSet<>((Arrays.asList(aspRule.getNegBodyIDList().split(","))));
      System.out.println("======");
      System.out.println(ruleNode.getRuleContent().toString());
      System.out.println(ansLitID);
      System.out.println(posSet);
      System.out.println(negSet);
      System.out.println(ansLitID.containsAll(posSet));
      System.out.println(Collections.disjoint(ansLitID,negSet));
      System.out.println("======");
      if ((ansLitID.containsAll(posSet) || posSet.size() == 0)
          && (Collections.disjoint(ansLitID, negSet))) {
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
          LitNode factLitNode =
              new LitNode(
                  Objects.requireNonNull(
                      literalRepository
                          .findById(Integer.parseInt(rNode.getRuleContent().getHeadID()))
                          .orElse(null)));
          EndEdge topEndEdge = new EndEdge(factLitNode, explanationUniverse.getTop());
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
    //    ObjectMapper mapper = new ObjectMapper();
    //    mapper.writeValue(Paths.get("EU.json").toFile(), explanationUniverse);
    return result;
  }

  @GetMapping("/asm")
  @ResponseBody
  public ResultInfo constructAsm(
      @RequestParam String aspCode, @RequestParam HashSet<String> answerSetRequest)
      throws IOException {
    HashSet<String> MSet = new HashSet<>();
    for (String asRequest : answerSetRequest) {
      MSet.add(asRequest.replace("\"", ""));
    }
    // System.out.println(MSet);
    // System.out.println(aspCode);
    ResultInfo result = new ResultInfo();
    HashSet<ASPRule> aspRules = aspPrgService.programParser(aspCode);
    HashSet<String> NantSet = new HashSet<>();
    HashSet<String> AllSet = new HashSet<>();
    for (ASPRule aspRule : aspRules) {
      // System.out.println(aspRule.getHeadID());
      if (aspRule.getNegBodyIDList() != null) {
        String[] negStringId = aspRule.getNegBodyIDList().split(",");
        for (String s : negStringId) {
          LitNode Lit =
              new LitNode(
                  Objects.requireNonNull(
                      literalRepository
                          .findById(Integer.parseInt(aspRule.getHeadID()))
                          .orElse(null)));
          NantSet.add(Lit.getLiteral());
          AllSet.add(Lit.getLiteral());
        }
      }
      if (aspRule.getHeadID() != null) {
        String[] negStringId = aspRule.getHeadID().split(",");
        for (String s : negStringId) {
          LitNode Lit =
              new LitNode(
                  Objects.requireNonNull(
                      literalRepository
                          .findById(Integer.parseInt(aspRule.getHeadID()))
                          .orElse(null)));
          AllSet.add(Lit.getLiteral());
        }
      }
      if (aspRule.getPosBodyIDList() != null) {
        String[] negStringId = aspRule.getPosBodyIDList().split(",");
        for (String s : negStringId) {
          LitNode Lit =
              new LitNode(
                  Objects.requireNonNull(
                      literalRepository
                          .findById(Integer.parseInt(aspRule.getHeadID()))
                          .orElse(null)));
          AllSet.add(Lit.getLiteral());
        }
      }
    }
    // HashSet<String> WfTrue = aspPrgService.solveAndGetWellFounded(aspCode);
    HashSet<String> WfUndefined = aspPrgService.solveAndGetWellFoundedUndefined(aspCode);
    // System.out.println(WfTrue);
    // System.out.println(WfUndefined);
    HashSet<HashSet<String>> subSet = getSubSet(AllSet);
    HashSet<HashSet<String>> ans = null;
    for (HashSet<String> U : subSet) {
      if (SetContainSet(NantSet, U)) {
        //  System.out.println(U);
        HashSet<String> t = new HashSet<>();
        t.addAll(U);
        t.retainAll(MSet);
        // System.out.println(t.size());
        if (t.size() == 0) {
          if (SetContainSet(WfUndefined, U)) {
            String aspCodeNew = getNRCode(aspCode, U);
            // System.out.println(U);
            // System.out.println(aspCodeNew);
            HashSet<String> WFTrue = aspPrgService.solveAndGetWellFounded(aspCodeNew);
            boolean flag = true;
            if (WFTrue.size() == MSet.size()) {
              for (String s : WFTrue) {
                if (!MSet.contains(s)) {
                  flag = false;
                  break;
                }
              }
              if (flag) {
                if (ans == null) {
                  ans = new HashSet<>();
                }
                ans.add(U);
              }
            }
          }
        }
      }
    }
    for (HashSet<String> an : ans) {
      System.out.println(an);
    }
    result.setData(ans);
    return result;
  }

  private String getNRCode(String aspCode, HashSet<String> u) {
    String ans = "";
    // System.out.println(u);
    String[] codeArray = aspCode.split("\n");
    for (String s : codeArray) {
      if (s.length() == 0) {
        continue;
      }
      if (s.contains(":-")) {
        String Head = s.substring(0, s.indexOf(":"));
        Head = Head.trim();
        // System.out.println(Head+"12345");
        // System.out.println(u.contains(Head));
        if (!u.contains(Head)) {
          ans += s;
        }
      } else {
        s = s.replace(".", "");
        s = s.trim();
        if (!u.contains(s)) {
          ans += (s + ".\n");
        }
      }
    }
    return ans;
  }

  private boolean SetContainSet(HashSet<String> nantSet, HashSet<String> u) {
    for (String s : u) {
      if (!nantSet.contains(s)) {
        return false;
      }
    }
    return true;
  }

  private void ueCycleDetection(
      HashSet<ApplicableEdge> candidateApEdge, HashSet<DependencyEdge> candidateDepEdge) {}

  private static HashSet<HashSet<String>> getSubSet(HashSet<String> list) {
    if (null == list || list.isEmpty()) {
      return new HashSet<>();
    }

    HashSet<HashSet<String>> result = new HashSet<>();
    for (int i = 0, size = (int) Math.pow(2, list.size()); i < size; i++) {
      HashSet<String> subSet = new HashSet<>();
      int index = i;
      List<String> listNew = new ArrayList<String>(list);
      for (int j = 0; j < listNew.size(); j++) {
        if ((index & 1) == 1) {
          subSet.add(listNew.get(j));
        }
        index >>= 1;
      }
      result.add(subSet);
    }
    return result;
  }
}
