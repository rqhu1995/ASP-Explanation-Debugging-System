package cn.seu.kse.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ASPProgram {
    @JsonProperty("programContent")
    String programContent;

    public ASPProgram() {
    }

    public ASPProgram(String programContent) {
        this.programContent = programContent;
    }

    public String getProgramContent() {
        return programContent;
    }

    public void setProgramContent(String programContent) {
        this.programContent = programContent;
    }
}
