import fs from "node:fs";
import path from "node:path";

const source = process.argv[2] || "academy-platform-contract.json";
const target = process.argv[3] || "_site/academy-platform-contract.json";
const contract = JSON.parse(fs.readFileSync(source, "utf8"));

contract.buildTimestamp = new Date().toISOString();
contract.buildCommit = process.env.GITHUB_SHA || process.env.BUILD_SOURCEVERSION || "local";
contract.buildRunId = process.env.GITHUB_RUN_ID || "local";

fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, JSON.stringify(contract, null, 2) + "\n");
console.log(`Stamped platform contract -> ${target}`);
