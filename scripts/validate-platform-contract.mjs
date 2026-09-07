import fs from "node:fs";

const contractPath = process.argv[2] || "academy-platform-contract.json";
const contract = JSON.parse(fs.readFileSync(contractPath, "utf8"));

const required = [
  "schemaVersion", "property", "runtimeClass", "canonicalHost", "shellVersion",
  "themeVersion", "identityMode", "analyticsVersion", "cspMode",
  "deploymentWorkflowGeneration", "buildTimestamp"
];
for (const key of required) {
  if (contract[key] === undefined || contract[key] === null || contract[key] === "") {
    throw new Error(`Platform contract is missing required field: ${key}`);
  }
}

if (contract.schemaVersion !== 1) throw new Error("Unsupported platform contract schemaVersion");
if (!/^www\.skunkworksacademy\.com$/i.test(contract.canonicalHost)) {
  throw new Error(`Unsupported canonical host for www: ${contract.canonicalHost}`);
}
if (!Number.isFinite(Date.parse(contract.buildTimestamp))) {
  throw new Error("buildTimestamp must be an ISO-8601 timestamp");
}

const shellSource = fs.readFileSync("assets/academy-navigation.js", "utf8");
const shellMatch = shellSource.match(/var VERSION = "([^"]+)";/);
if (!shellMatch) throw new Error("Unable to resolve shell VERSION from assets/academy-navigation.js");

const themeSource = fs.readFileSync("assets/academy-brand-theme.css", "utf8");
const themeMatch = themeSource.match(/--swa-theme-contract-version:\s*"([^"]+)"/);
if (!themeMatch) throw new Error("Unable to resolve theme contract version");

if (contract.shellVersion !== shellMatch[1]) {
  throw new Error(`Contract shellVersion ${contract.shellVersion} != runtime ${shellMatch[1]}`);
}
if (contract.themeVersion !== themeMatch[1]) {
  throw new Error(`Contract themeVersion ${contract.themeVersion} != runtime ${themeMatch[1]}`);
}

const supported = {
  "static-pages-composite": {
    identityModes: new Set(["public-anonymous"]),
    cspModes: new Set(["not-enforced-github-pages", "edge-enforced"]),
    deploymentGenerations: new Set(["academy-pages-v2"])
  }
};

const policy = supported[contract.runtimeClass];
if (!policy) throw new Error(`Unsupported runtimeClass: ${contract.runtimeClass}`);
if (!policy.identityModes.has(contract.identityMode)) {
  throw new Error(`Unsupported identityMode ${contract.identityMode} for ${contract.runtimeClass}`);
}
if (!policy.cspModes.has(contract.cspMode)) {
  throw new Error(`Unsupported cspMode ${contract.cspMode} for ${contract.runtimeClass}`);
}
if (!policy.deploymentGenerations.has(contract.deploymentWorkflowGeneration)) {
  throw new Error(`Unsupported deployment generation: ${contract.deploymentWorkflowGeneration}`);
}

console.log("Academy platform contract validated:", {
  property: contract.property,
  shellVersion: contract.shellVersion,
  themeVersion: contract.themeVersion,
  identityMode: contract.identityMode,
  cspMode: contract.cspMode,
  deploymentWorkflowGeneration: contract.deploymentWorkflowGeneration
});
