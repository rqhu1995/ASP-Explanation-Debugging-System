package cn.seu.kse.service;

import cn.seu.kse.dto.Literal;
import org.springframework.data.jpa.repository.Query;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin
public interface ASPLiteralService {
  int saveLiteral(String literal);

  Literal findByLiteral(String literal);
}
