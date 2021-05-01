package cn.seu.kse.service;

import cn.seu.kse.dto.ASPRule;
import cn.seu.kse.dto.Literal;
import cn.seu.kse.repository.ASPRuleRepository;
import cn.seu.kse.repository.LiteralRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

@CrossOrigin
@Service
public class ASPLiteralServiceImpl implements ASPLiteralService {
  @Autowired LiteralRepository literalRepository;
  @Autowired
  ASPRuleRepository ruleRepository;

  @Override
  public int saveLiteral(String literal, boolean ground) {
    if (literalRepository.findByLit(literal).size() != 0) {
      return literalRepository.findByLit(literal).get(0).getId();
    } else {
      Literal litToSave = new Literal();
      litToSave.setLit(literal);
      litToSave.setGround(ground);
      literalRepository.save(litToSave);
      return litToSave.getId();
    }
  }

  @Override
  public Literal findByLiteral(String literal) {
    if (literalRepository.findByLit(literal).size() != 0) {
      return literalRepository.findByLit(literal).get(0);
    } else {
      return null;
    }
  }

  @Override
  public HashSet<String> findNonGround() {
    return literalRepository.findNonGroundLiterals();
  }

  @Override
  public List<String> findAllUnderivable() {
    List<Literal> literals = literalRepository.findAll();
    List<ASPRule> rules = ruleRepository.findAll();
    List<String> underivableLiterals = new ArrayList<>();
    for (Literal literal : literals) {
      boolean derivable = false;
      for (ASPRule rule : rules) {
        if(Arrays.asList(rule.getHeadID().split(",")).contains(String.valueOf(literal.getId()))){
          derivable = true;
          break;
        }
      }
      if(derivable) {
        break;
      } else {
        underivableLiterals.add(literal.getLit());
      }
    }
    return underivableLiterals;
  }
}
