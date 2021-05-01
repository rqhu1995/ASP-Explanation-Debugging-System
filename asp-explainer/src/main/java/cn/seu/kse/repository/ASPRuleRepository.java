package cn.seu.kse.repository;

import cn.seu.kse.dto.ASPRule;
import cn.seu.kse.dto.Literal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ASPRuleRepository extends JpaRepository<ASPRule, Integer> {
//    @Query(value = "select lit.lit from literals lit where lit.id not in (" +
//            "select r.id from aspRule r)")


    @Query(value = "select r.headID from aspRule r where r.posBodyIDList is null and r.negBodyIDList is null")
    List<Literal> findAllFacts();

}
