package cn.seu.kse.util.solver;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public final class ShellExecutor {
  private static final String NEWLINE = System.getProperty("line.separator");

  public static String callShell(String command) throws IOException {
    ProcessBuilder builder =
        new ProcessBuilder("/bin/bash", "-c", command).redirectErrorStream(true);
    Process process = builder.start(); // may throw IOException
    /* 此Process对象表示的子进程的退出值。 按照惯例，值0表示正常终止。
    // 调用此方法保证同步调用
    int waitFor = 0;
    try {
      waitFor = process.waitFor();
    } catch (InterruptedException e) {
      e.printStackTrace();
    }
    return waitFor >= 0; */

    StringBuilder result = new StringBuilder(80);
    try (BufferedReader in = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
      while (true) {
        String line = in.readLine();
        if (line == null) break;
        result.append(line).append(NEWLINE);
      }
    }
    return result.toString();
  }

  private ShellExecutor() {}
}
