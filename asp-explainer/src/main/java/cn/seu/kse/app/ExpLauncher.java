package cn.seu.kse.app;

import cn.seu.kse.util.parser.ProgramVisitor;
import cn.seu.kse.util.springbeans.SpringUtil;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import java.util.Arrays;

@SpringBootApplication
@Import(SpringUtil.class)
@ComponentScan({"cn","cn.seu.kse.service","cn.seu.kse.util.parser"})
@EntityScan("cn.seu.kse.dto")
@EnableJpaRepositories("cn.seu.kse.repository")
public class ExpLauncher {
    public static void main(String[] args) {
        SpringApplication.run(ExpLauncher.class, args);
    }
}
