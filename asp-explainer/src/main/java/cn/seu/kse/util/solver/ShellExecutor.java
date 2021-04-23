package cn.seu.kse.util.solver;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public final class ShellExecutor {
  private static final String NEWLINE = System.getProperty("line.separator");

  public static String callShell(String command) throws IOException {
    ProcessBuilder builder = null;
    if (System.getProperty("os.name").contains("Windows")) {
      builder = new ProcessBuilder("cmd", "/c", command).redirectErrorStream(true);
    }
    else{
      builder = new ProcessBuilder("zsh", "-c", command).redirectErrorStream(true);
    }
    Process process = builder.start(); // may throw IOException
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
