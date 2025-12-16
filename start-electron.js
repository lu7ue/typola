import { spawn } from "child_process";
import waitOn from "wait-on";

waitOn({ resources: ["http://localhost:5173"] }, (err) => {
  if (err) {
    console.error("Vite did not start in time:", err);
    process.exit(1);
  }

  console.log("Vite ready, starting Electron...");

  const cmd =
    process.platform === "win32"
      ? "node_modules\\.bin\\electron.cmd"
      : "node_modules/.bin/electron";

  const proc = spawn(cmd, ["."], { stdio: "inherit", shell: true });

  proc.on("close", (code) => process.exit(code));
});
