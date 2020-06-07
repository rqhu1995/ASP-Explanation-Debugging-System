package cn.seu.kse.service;

import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin
public interface ASPLiteralService {
    int saveLiteral(String literal);
}
