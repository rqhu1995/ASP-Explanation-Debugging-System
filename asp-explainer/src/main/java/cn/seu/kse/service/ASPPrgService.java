package cn.seu.kse.service;

import cn.seu.kse.dto.ASPRule;
import cn.seu.kse.response.AnswerSetResponse;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.io.IOException;
import java.util.HashSet;

@CrossOrigin
public interface ASPPrgService {
  HashSet<ASPRule> programParser(String aspProgram);

  void saveRule(ASPRule aspRule);

  AnswerSetResponse solveAndGetAnswerSet(String aspCode) throws IOException;

  void clearAll();
}
