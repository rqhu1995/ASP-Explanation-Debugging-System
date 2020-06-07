package cn.seu.kse.dto;

import javax.persistence.*;

@Entity(name = "literals")
public class Literal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lit_id")
    private int id;
    @Column(name = "lit")
    private String lit;

    public Literal() {
    }

    public Literal(int id, String lit) {
        this.id = id;
        this.lit = lit;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getLit() {
        return lit;
    }

    public void setLit(String lit) {
        this.lit = lit;
    }
}
