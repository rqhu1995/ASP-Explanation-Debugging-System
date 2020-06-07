package cn.seu.kse.repository;

import cn.seu.kse.dto.ASPRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ASPRuleRepository extends JpaRepository<ASPRule, Integer> {
  //    List<ASPRule> findByProgramContaining(ASPRule aspRule);
}
