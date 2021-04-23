package cn.seu.kse.response;

import java.util.HashMap;
import java.util.HashSet;

public class GroundingResponse {
    String aspCode;
    HashMap<String, HashSet<String>> preBind;

    public String getAspCode() {
        return aspCode;
    }

    public void setAspCode(String aspCode) {
        this.aspCode = aspCode;
    }

    public HashMap<String, HashSet<String>> getPreBind() {
        return preBind;
    }

    public void setPreBind(HashMap<String, HashSet<String>> preBind) {
        this.preBind = preBind;
    }
}
