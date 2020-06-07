package cn.seu.kse.repository;

import cn.seu.kse.dto.Literal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LiteralRepository extends JpaRepository<Literal, Integer> {
    List<Literal> findByLit(String lit);
}
