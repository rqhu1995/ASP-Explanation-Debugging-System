package cn.seu.kse.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ResultInfo {
    @JsonProperty("status")
    private Integer status;
    @JsonProperty("data")
    private Object data;

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }
}
