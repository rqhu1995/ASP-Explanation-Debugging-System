package cn.seu.kse.service;

import cn.seu.kse.dto.Literal;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.sql.SQLIntegrityConstraintViolationException;

@CrossOrigin
public interface ASPLiteralService {
    void saveLiteral(Literal literal);
}
