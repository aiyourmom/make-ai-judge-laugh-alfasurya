import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The joke: standup's daily "no blockers" lie, counted out loud (214 days),
// then flipped in the last clause — the whole project is the blocker.
const JOKE =
  "I told standup 'no blockers' for 214 straight days, which is technically true if you don't count the entire project.";

function failGate(message: string): never {
  throw new Error("gate failed: " + message);
}

function checkEntry(text: string): void {
  const checks: Array<[string, boolean]> = [
    ["length 1-200", text.length >= 1 && text.length <= 200],
    ["single line", !text.includes("\n")],
    ["not only whitespace", text.trim().length > 0],
    ["no surrounding space", text === text.trim()],
  ];
  for (const [name, ok] of checks) {
    if (!ok) failGate(name);
  }
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
checkEntry(JOKE);
const target = join(outDir, "entry.txt");
writeFileSync(target, JOKE, "utf8");
// Round-trip guard: the file the grader reads must be byte-identical to the joke.
const written = readFileSync(target, "utf8");
if (written !== JOKE) failGate("written file differs from joke");
console.log(`saved ${JOKE.length} characters to ${target}`);
