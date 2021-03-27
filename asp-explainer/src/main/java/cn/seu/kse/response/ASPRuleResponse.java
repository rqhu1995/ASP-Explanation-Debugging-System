package cn.seu.kse.response;

import java.util.HashSet;

public class ASPRuleResponse {
    String head;
    HashSet<String> positiveBody = new HashSet<>();
    HashSet<String> negativeBody = new HashSet<>();
}
