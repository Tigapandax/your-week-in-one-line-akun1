import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// "Your Week in One Line" (u-boge-your-week-in-one-line-d1c14ced):
// one line, at most 100 characters, that sums up the week.
// The sealed scorer reads /output/entry.txt — printing to stdout alone scores Valid 0.
const MAX_CHARS = 100;

const raw = readFileSync(new URL("./one-line.txt", import.meta.url), "utf8");
const line = raw.replace(/\n$/, "");

const failures: string[] = [];
if (line.length === 0) failures.push("empty line");
if ([...line].length > MAX_CHARS) failures.push(`too long: ${[...line].length}/${MAX_CHARS} characters`);
if (line !== line.trim()) failures.push("leading or trailing whitespace");
if (line.includes("\r")) failures.push("carriage return found");
if (line.includes("\n")) failures.push("more than one line");
if (/\s{2,}/.test(line)) failures.push("double space inside the line");
if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(line)) failures.push("control character inside the line");
const quotes = (line.match(/"/g) || []).length;
if (quotes % 2 !== 0) failures.push("unbalanced double quotes");
if (!/\s/.test(line)) failures.push("a joke needs more than one word");
if (!/[.!?]["']?$/.test(line)) failures.push("must end with terminal punctuation");

if (failures.length > 0) {
  for (const f of failures) console.error(`FAIL: ${f}`);
  process.exit(1);
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "entry.txt"), line + "\n");

console.log(line);
console.log(`OK: ${[...line].length}/${MAX_CHARS} characters, single line, wrote ${join(outputDir, "entry.txt")}.`);
