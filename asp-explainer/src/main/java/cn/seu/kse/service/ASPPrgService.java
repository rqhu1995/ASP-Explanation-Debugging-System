package cn.seu.kse.service;

import cn.seu.kse.dto.ASPRule;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.HashSet;

@CrossOrigin
public interface ASPPrgService {
  HashSet<ASPRule> programParser(String aspProgram);
  public void saveRule(ASPRule aspRule);
}
