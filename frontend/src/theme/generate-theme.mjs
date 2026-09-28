/**
 * generate-theme.mjs
 *
 * One script, two jobs, run in sequence:
 *   1. Adds a "Dark" mode to the Semantic collection (derived from "Light"
 *      via a hand-curated mapping — see DARK_MAP below).
 *   2. Generates CSS variable files (one per collection) plus a theme.css
 *      that imports them all and registers every token under Tailwind's
 *      @theme namespace (--color-*, --spacing-*, --radius-*).
 *
 * Plain JS, runs directly — no build step, no tsx/ts-node, no @types/node:
 *   node scripts/generate-theme.mjs [input.json] [outDir] [--write-json]
 *
 * Defaults: looks for ./figma-export.json in the current directory and
 * writes generated CSS into ./src/theme (the conventional Angular
 * location for global-style partials). Both can be overridden
 * positionally:
 *
 *   node scripts/generate-theme.mjs                          # figma-export.json -> src/theme
 *   node scripts/generate-theme.mjs other-export.json         # other-export.json -> src/theme
 *   node scripts/generate-theme.mjs figma-export.json src/theme --write-json
 *
 * The .mjs extension is deliberate: it makes this file ESM regardless of
 * whether your package.json sets "type": "module" (Angular's generated
 * package.json doesn't), so `import` works with zero project config.
 *
 * Recommended project placement: scripts/generate-theme.mjs — see the
 * Angular integration notes at the bottom for what else needs wiring up
 * (angular.json, npm script, the data-theme attribute contract with
 * ThemeService).
 *
 * --write-json also saves the updated export (with Dark mode added) back
 * to <outDir>/figma-export.json, so you have a record of exactly what was
 * generated. Omit it if you'd rather keep Dark mode in-memory-only for
 * this run and treat Figma as the eventual source of truth once a
 * designer authors Dark mode there directly (see note at bottom).
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";

// ---------- Step 1: Dark mode derivation ----------

// Dotted semantic path -> dark-mode alias reference.
// Hand-curated (not a mechanical scale inversion) to avoid harsh
// pure-black backgrounds and mistoned status colors. Convention:
//   - light-tint backgrounds (amber.50)  -> dark-tint backgrounds (amber.900)
//   - dark text-on-light (green.800)     -> light text-on-dark (green.200)
//   - interactive colors shift 1-2 steps lighter for visibility on dark
// Update this whenever a new semantic token is added in Figma; the script
// throws on any unmapped token rather than silently omitting it.
const DARK_MAP = {
  "bg.primary": "{neutral.900}",
  "bg.secondary": "{neutral.800}",
  "bg.tertiary": "{neutral.700}",
  "bg.inverse": "{neutral.white}",

  "surface.default": "{neutral.800}",
  "surface.raised": "{neutral.700}",
  "surface.overlay": "{neutral.900}",

  "text.primary": "{neutral.50}",
  "text.secondary": "{neutral.300}",
  "text.tertiary": "{neutral.500}",
  "text.inverse": "{neutral.900}",
  "text.link": "{indigo.400}",

  "border.default": "{neutral.700}",
  "border.subtle": "{neutral.800}",
  "border.strong": "{neutral.600}",
  "border.focus": "{indigo.400}",

  "accent.default": "{indigo.500}",
  "accent.hover": "{indigo.400}",
  "accent.subtle": "{indigo.900}",
  "accent.text": "{indigo.300}",

  "escrow.bg": "{amber.900}",
  "escrow.border": "{amber.700}",
  "escrow.text": "{amber.200}",
  "escrow.icon": "{amber.400}",

  "success.bg": "{green.900}",
  "success.border": "{green.700}",
  "success.text": "{green.200}",
  "success.icon": "{green.400}",

  "danger.bg": "{red.900}",
  "danger.border": "{red.700}",
  "danger.text": "{red.200}",
  "danger.icon": "{red.400}",

  "info.bg": "{blue.900}",
  "info.border": "{blue.700}",
  "info.text": "{blue.200}",
  "info.icon": "{blue.400}",
};

/**
 * Recursively clones a token group, replacing every leaf's $value with its
 * dark-mode counterpart from DARK_MAP. Throws if a token has no mapping.
 * @param {object} group
 * @param {string[]} [prefix]
 * @returns {object}
 */
function cloneWithDarkValues(group, prefix = []) {
  const out = {};
  for (const [key, value] of Object.entries(group)) {
    const path = [...prefix, key];
    const dotted = path.join(".");
    if (value && typeof value === "object" && "$value" in value) {
      const darkValue = DARK_MAP[dotted];
      if (!darkValue) {
        throw new Error(
          `No dark-mode mapping defined for token "${dotted}". ` +
            `Add an entry to DARK_MAP before regenerating.`
        );
      }
      out[key] = { ...value, $value: darkValue };
    } else if (value && typeof value === "object") {
      out[key] = cloneWithDarkValues(value, path);
    }
  }
  return out;
}

/**
 * Mutates `raw` in place, adding a "Dark" mode to the Semantic collection.
 * @param {Array<object>} raw
 */
function addDarkMode(raw) {
  const semanticEntry = raw.find((e) => "Semantic" in e);
  if (!semanticEntry) {
    throw new Error("No Semantic collection found in the provided export.");
  }

  const lightMode = semanticEntry.Semantic.modes.Light;
  if (!lightMode) {
    throw new Error('Semantic collection has no "Light" mode to derive Dark from.');
  }

  if (semanticEntry.Semantic.modes.Dark) {
    console.warn('A "Dark" mode already exists in the input and will be overwritten.');
  }

  semanticEntry.Semantic.modes.Dark = cloneWithDarkValues(lightMode);
}

// ---------- Step 1.5: rename tokens whose names collide with Tailwind's utility prefix ----------

// Tailwind builds class names as {property-prefix}-{registered-color-name}.
// When a semantic token's own name is literally "bg", "text", or "border",
// the resulting class doubles the word: bg.primary -> --bg-primary ->
// class "bg-bg-primary". This happens two different ways in this token
// set, needing two different fixes:
//
//   - As a TOP-LEVEL GROUP (e.g. "bg" holding primary/secondary/tertiary/
//     inverse — page-level roles): renamed to a word that doesn't repeat
//     the utility prefix. "bg" -> "page" (it's specifically page-canvas
//     background, distinct from the "surface" group used for elevated
//     cards), "text" -> "content", "border" -> "outline".
//
//   - As a LEAF inside a status group (e.g. "success.bg", "escrow.text" —
//     a single color value, not a further role group): renamed to a
//     different synonym appropriate at that scope. "bg" -> "surface"
//     (the background fill for that status block), "text" -> "foreground",
//     "border" -> "outline".
//
// Applied after addDarkMode() specifically so DARK_MAP stays keyed to the
// original, un-renamed dotted paths ("bg.primary", "success.text", etc.) —
// renaming is purely a class-naming ergonomics concern and shouldn't be
// entangled with which color a token resolves to.

const GROUP_RENAME = { bg: "page", text: "content", border: "outline" };
const LEAF_RENAME = { bg: "surface", text: "foreground", border: "outline" };

function isLeaf(value) {
  return value && typeof value === "object" && "$value" in value;
}

function renameCollidingKeys(node) {
  const out = {};
  for (const [key, value] of Object.entries(node)) {
    if (isLeaf(value)) {
      out[LEAF_RENAME[key] ?? key] = value;
    } else {
      out[GROUP_RENAME[key] ?? key] = renameCollidingKeys(value);
    }
  }
  return out;
}

/**
 * Mutates `raw` in place, renaming colliding keys in every mode of the
 * Semantic collection.
 * @param {Array<object>} raw
 */
function renameSemanticCollisions(raw) {
  const semanticEntry = raw.find((e) => "Semantic" in e);
  if (!semanticEntry) return;

  for (const modeName of Object.keys(semanticEntry.Semantic.modes)) {
    semanticEntry.Semantic.modes[modeName] = renameCollidingKeys(
      semanticEntry.Semantic.modes[modeName]
    );
  }
}

// ---------- Step 2: CSS generation ----------

function toKebab(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

function isAlias(value) {
  return typeof value === "string" && /^\{.+\}$/.test(value);
}

function aliasToVarName(aliasValue) {
  const inner = aliasValue.slice(1, -1);
  return inner.split(".").map(toKebab).join("-");
}

/**
 * @param {object} group
 * @param {string[]} [prefix]
 * @returns {Array<{path: string[], token: object}>}
 */
function flatten(group, prefix = []) {
  const out = [];
  for (const [key, value] of Object.entries(group)) {
    const path = [...prefix, toKebab(key)];
    if (value && typeof value === "object" && "$value" in value) {
      out.push({ path, token: value });
    } else if (value && typeof value === "object") {
      out.push(...flatten(value, path));
    }
  }
  return out;
}

function cssValue(token) {
  const { $type, $value } = token;
  if (isAlias($value)) {
    return `var(--${aliasToVarName($value)})`;
  }
  if ($type === "color") {
    return String($value);
  }
  if ($type === "float") {
    return `${$value}px`;
  }
  console.warn(`Unsupported token $type "${$type}" — writing raw value as-is.`);
  return String($value);
}

// The Semantic collection is the one collection whose modes represent a
// user-toggleable theme (Light/Dark) rather than a static design axis.
// Its selector deliberately uses `data-theme`, matching the attribute
// ThemeService sets on <html> (document.documentElement.setAttribute
// ('data-theme', mode)) and what the index.html flash-prevention script
// reads on first paint. If you rename the attribute in ThemeService,
// update SEMANTIC_ATTRIBUTE to match — the two must agree, or toggling
// the theme will silently do nothing.
const SEMANTIC_ATTRIBUTE = "theme";

function modeSelector(collectionName, modeName) {
  const attribute =
    collectionName === "Semantic" ? SEMANTIC_ATTRIBUTE : toKebab(collectionName);
  return `[data-${attribute}="${toKebab(modeName)}"]`;
}

function writeVarBlock(lines, flat) {
  for (const { path, token } of flat) {
    lines.push(`  --${path.join("-")}: ${cssValue(token)};`);
  }
}

/**
 * @param {Array<object>} raw
 * @param {string} outDir
 */
function generateCss(raw, outDir) {
  const collections = {};
  for (const entry of raw) {
    const [name, collection] = Object.entries(entry)[0];
    collections[name] = collection;
  }

  mkdirSync(outDir, { recursive: true });

  const allFlatTokens = [];

  for (const [collectionName, collection] of Object.entries(collections)) {
    const modeNames = Object.keys(collection.modes);
    const lines = [];

    modeNames.forEach((modeName, i) => {
      const flat = flatten(collection.modes[modeName]);
      flat.forEach((f) => allFlatTokens.push({ collectionName, modeName, ...f }));

      if (i === 0) {
        lines.push(`:root {`);
        writeVarBlock(lines, flat);
        lines.push(`}`);
      } else {
        lines.push("", `${modeSelector(collectionName, modeName)} {`);
        writeVarBlock(lines, flat);
        lines.push(`}`);
      }
    });

    const filename = `${toKebab(collectionName)}.css`;
    writeFileSync(`${outDir}/${filename}`, lines.join("\n") + "\n");
    console.log(`wrote ${filename} (${modeNames.length} mode${modeNames.length > 1 ? "s" : ""})`);
  }

  const themeLines = [`@import "tailwindcss";`];
  for (const c of Object.keys(collections)) {
    themeLines.push(`@import "./${toKebab(c)}.css";`);
  }
  themeLines.push("", `@theme {`);

  const seen = new Set();
  for (const t of allFlatTokens) {
    const cssVar = t.path.join("-");
    if (seen.has(cssVar)) continue;
    seen.add(cssVar);

    if (t.token.$type === "color") {
      themeLines.push(`  --color-${cssVar}: var(--${cssVar});`);
    } else if (t.token.$type === "float") {
      if (cssVar.startsWith("space-")) {
        themeLines.push(`  --spacing-${cssVar.replace(/^space-/, "")}: var(--${cssVar});`);
      } else if (cssVar.startsWith("radius-")) {
        themeLines.push(`  --radius-${cssVar.replace(/^radius-/, "")}: var(--${cssVar});`);
      } else {
        themeLines.push(`  --${cssVar}: var(--${cssVar});`);
      }
    }
  }
  themeLines.push(`}`);
  writeFileSync(`${outDir}/theme.css`, themeLines.join("\n") + "\n");
  console.log("wrote theme.css");
}

// ---------- CLI entry ----------

const DEFAULT_INPUT = "figma-export.json";
const DEFAULT_OUT_DIR = ".";
const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));

/**
 * Resolves the input path against the current working directory first
 * (the normal case: you ran `node scripts/generate-theme.mjs` from your
 * project root). If that misses, falls back to resolving next to the
 * script itself, since `node path/to/script.mjs` from a different cwd is
 * an easy mistake to make and shouldn't require memorizing where you
 * stood when you typed the command.
 */
function resolveInputPath(inputArg) {
  const cwdPath = resolve(process.cwd(), inputArg);
  if (existsSync(cwdPath)) return cwdPath;

  const scriptRelativePath = join(SCRIPT_DIR, inputArg);
  if (existsSync(scriptRelativePath)) return scriptRelativePath;

  return null; // caller reports both attempted paths
}

function main() {
  const positional = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
  const flags = process.argv.slice(2).filter((arg) => arg.startsWith("--"));

  const inputArg = positional[0] ?? DEFAULT_INPUT;
  const outDirArg = positional[1] ?? DEFAULT_OUT_DIR;
  const writeJson = flags.includes("--write-json");

  const resolvedInput = resolveInputPath(inputArg);
  if (!resolvedInput) {
    console.error(
      `Could not find "${inputArg}".\n` +
        `  Looked in current directory: ${resolve(process.cwd(), inputArg)}\n` +
        `  Looked next to the script:   ${join(SCRIPT_DIR, inputArg)}\n` +
        `Export your Figma tokens and save the file as "${DEFAULT_INPUT}" in one of those ` +
        `locations, or pass an explicit path: node generate-theme.mjs <path-to-export.json>`
    );
    process.exit(1);
  }

  let raw;
  try {
    raw = JSON.parse(readFileSync(resolvedInput, "utf-8"));
  } catch (err) {
    if (err instanceof SyntaxError) {
      console.error(`"${resolvedInput}" was found but is not valid JSON: ${err.message}`);
      process.exit(1);
    }
    throw err;
  }

  addDarkMode(raw);
  renameSemanticCollisions(raw);

  if (writeJson) {
    mkdirSync(outDirArg, { recursive: true });
    writeFileSync(`${outDirArg}/figma-export.json`, JSON.stringify(raw, null, 2) + "\n");
    console.log(`wrote ${outDirArg}/figma-export.json (with Dark mode added)`);
  }

  generateCss(raw, outDirArg);
}

main();

// ---------- Angular integration notes ----------
//
// This script only generates CSS files. Two more steps make it part of a
// working Angular app — one-time project config, not per-run generation:
//
// 1. Add an npm script and run it explicitly, not as part of `ng build`:
//      "scripts": { "theme:generate": "node scripts/generate-theme.mjs figma-export.json src/theme --write-json" }
//    Keeping it manual (rather than a prebuild hook) is deliberate for a
//    learning project — you want to see when tokens changed and re-run
//    on purpose, not have it silently regenerate on every build.
//
// 2. Point Angular at the generated theme.css in angular.json:
//      "styles": ["src/theme/theme.css"]
//    theme.css already contains `@import "tailwindcss"` plus the imports
//    of every collection partial, so it replaces a hand-written
//    styles.css entirely rather than sitting alongside one.
//
// Being plain JS, this file needs no tsconfig changes and no @types/node —
// `node` runs it as-is, which is the whole point of this version over the
// TypeScript one.
//
// This script is also a bridge, not a permanent pipeline step. Once a
// designer authors an actual "Dark" mode in Figma (reviewing the
// DARK_MAP choices above for contrast and brand accuracy), delete
// addDarkMode() entirely and just run generateCss() against the real
// export — a hand-maintained mapping table drifting from what's on the
// design canvas is exactly the token-naming-parity drift risk flagged
// earlier for this pipeline.
