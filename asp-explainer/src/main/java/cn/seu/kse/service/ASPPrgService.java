package cn.seu.kse.service;

import cn.seu.kse.dto.ASPRule;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.ArrayList;

@CrossOrigin
public interface ASPPrgService {
  ArrayList<ASPRule> programParser(String aspProgram);
}
