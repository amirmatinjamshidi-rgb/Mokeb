#!/usr/bin/env node
/**
 * msg-filter for git filter-branch: drop Cursor co-author trailer.
 */
import { createInterface } from "readline";

const lines = [];
const rl = createInterface({ input: process.stdin });

rl.on("line", (line) => {
  if (!line.includes("Co-authored-by: Cursor")) {
    lines.push(line);
  }
});

rl.on("close", () => {
  let out = lines.join("\n");
  // trim trailing blank lines left after removing co-author
  out = out.replace(/\n+$/, "\n");
  process.stdout.write(out);
});
