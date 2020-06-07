package cn.seu.kse.service;

import cn.seu.kse.dto.Literal;
import cn.seu.kse.repository.LiteralRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.sql.SQLIntegrityConstraintViolationException;

@CrossOrigin
@Service
public class ASPLiteralServiceImpl implements ASPLiteralService {
  @Autowired
  LiteralRepository literalRepository;

  @Override
  public void saveLiteral(Literal literal) {
    if (literalRepository.findByLit(literal.getLit()) == null ||
            literalRepository.findByLit(literal.getLit()).size() == 0) {
      literalRepository.save(literal);
    }
  }
}
