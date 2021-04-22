package cn.seu.kse.repository;

import cn.seu.kse.dto.Literal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.HashSet;
import java.util.List;

@Repository
public interface LiteralRepository extends JpaRepository<Literal, Integer> {
  List<Literal> findByLit(String lit);
  @Query("select lit from literals where ground = false")
  HashSet<String> findNonGroundLiterals();
}
