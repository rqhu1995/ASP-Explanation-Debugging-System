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
    HashSet<ASPRule> aspProgram = aspPrgService.programParser(aspCode);
    for (ASPRule aspRule : aspProgram) {
      aspPrgService.saveRule(aspRule);
    }
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
