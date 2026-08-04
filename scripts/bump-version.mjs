/**
 * Bump the project version (semver MAJOR.MINOR.PATCH) in package.json.
 * The Footer reads the version from package.json at build time, so this is
 * the single source of truth — no other file needs to be updated.
 *
 * Usage: node scripts/bump-version.mjs <patch|minor|major>
 *   patch → 0.1.0 → 0.1.1   (bug fixes only)
 *   minor → 0.1.0 → 0.2.0   (new features, backward compatible)
 *   major → 0.1.0 → 1.0.0   (breaking changes / first stable release)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PKG_PATH = path.join(__dirname, "..", "package.json");

const type = process.argv[2];
if (!["patch", "minor", "major"].includes(type)) {
  console.error("Usage: node scripts/bump-version.mjs <patch|minor|major>");
  process.exit(1);
}

const pkg = JSON.parse(fs.readFileSync(PKG_PATH, "utf-8"));
const [major, minor, patch] = (pkg.version || "0.0.0").split(".").map((n) => parseInt(n, 10) || 0);

let next;
if (type === "major") next = `${major + 1}.0.0`;
else if (type === "minor") next = `${major}.${minor + 1}.0`;
else next = `${major}.${minor}.${patch + 1}`;

pkg.version = next;
fs.writeFileSync(PKG_PATH, JSON.stringify(pkg, null, 2) + "\n", "utf-8");
console.log(`Bumped ${type}: v${major}.${minor}.${patch} → v${next}`);
