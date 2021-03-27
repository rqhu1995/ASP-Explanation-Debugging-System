package cn.seu.kse.service;

import cn.seu.kse.dto.Literal;
import cn.seu.kse.repository.LiteralRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin
@Service
public class ASPLiteralServiceImpl implements ASPLiteralService {
  @Autowired LiteralRepository literalRepository;

  @Override
  public int saveLiteral(String literal) {
    if (literalRepository.findByLit(literal).size() != 0) {
      return literalRepository.findByLit(literal).get(0).getId();
    } else {
      Literal litToSave = new Literal();
      litToSave.setLit(literal);
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
}
