package cn.seu.kse.service;

import cn.seu.kse.dto.Literal;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.HashSet;
import java.util.List;

@CrossOrigin
public interface ASPLiteralService {
  int saveLiteral(String literal, boolean ground);
  Literal findByLiteral(String literal);
  HashSet<String> findNonGround();
}
