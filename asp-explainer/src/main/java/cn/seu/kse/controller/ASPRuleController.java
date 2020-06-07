package cn.seu.kse.controller;


import cn.seu.kse.dto.ASPRule;
import cn.seu.kse.repository.ASPRuleRepository;
import cn.seu.kse.repository.LiteralRepository;
import cn.seu.kse.response.ResultInfo;
import cn.seu.kse.service.ASPPrgService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@CrossOrigin
@RestController
public class ASPRuleController {
  @Autowired
  ASPRuleRepository aspRuleRepository;
  @Autowired
  LiteralRepository literalRepository;
  @Autowired
  ASPPrgService aspPrgService;

  @PostMapping("/parseprogram")
  @ResponseBody
  public ResultInfo programStoring(@RequestBody String aspCode) {
    ResultInfo result = new ResultInfo();
    result.setData(aspCode);
    result.setStatus(1);
    ArrayList<ASPRule> aspProgram = aspPrgService.programParser(aspCode);
    for (ASPRule aspRule : aspProgram) {
      aspRuleRepository.save(aspRule);
    }
    return result;
  }
}
