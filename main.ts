import * as datetime from "https://deno.land/std@0.224.0/datetime/mod.ts";
import * as path from "https://deno.land/std@0.224.0/path/mod.ts";

if (import.meta.main) {
  setupExitHandler();

  const cwd = await Deno.permissions.request({ name: "read", path: "." });
  if (cwd.state !== "granted") {
    Deno.exit(1);
  }

  const dir = Deno.cwd();
  const watcher = Deno.watchFs(dir);

  console.clear();
  console.log(`Watching current directory...`);
  console.log("Press Ctrl-C to stop");
  console.log();

  for await (const event of watcher) {
    const time = datetime.format(new Date(), "HH:mm:ss.SSS");

    event.paths.forEach((filePath) => {
      const fileName = path.relative(dir, filePath);
      const updateColor = colorMod(event.kind);
      console.log(`[${time}] %c${event.kind}`, updateColor, fileName);
    });
  }
}

function setupExitHandler() {
  Deno.addSignalListener("SIGINT", () => {
    Deno.exit();
  });
}

function colorMod(kind: Deno.FsEvent["kind"]) {
  switch (kind) {
    case "create":
      return "color: green";
    case "remove":
      return "color: red";
    case "modify":
      return "color: blue";
    default:
      return "";
  }
}
