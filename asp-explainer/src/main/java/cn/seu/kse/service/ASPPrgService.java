package cn.seu.kse.service;

import cn.seu.kse.dto.ASPRule;
import cn.seu.kse.response.AnswerSetResponse;
import cn.seu.kse.response.GroundAnswerResponse;
import cn.seu.kse.response.GroundingResponse;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.io.IOException;
import java.util.HashSet;

@CrossOrigin
public interface ASPPrgService {
  HashSet<ASPRule> programParser(String aspProgram);

  void saveRule(ASPRule aspRule);

  HashSet<HashSet<String>> solveAndGetAnswerSet(String aspCode) throws IOException;

  GroundAnswerResponse solveAndGetGrounding(String aspCode) throws  IOException;

  HashSet<String > solveAndGetWellFounded(String aspCode) throws  IOException;
  void clearAll();
}
