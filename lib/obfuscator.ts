function randomName(length = 8): string {
  const chars = "IlO01lLoO0IlO01lL";
  let name = "_";
  for (let i = 0; i < length; i++) {
    name += chars[Math.floor(Math.random() * chars.length)];
  }
  return name;
}

function xorEncrypt(str: string, key: string): string {
  let result = "";
  for (let i = 0; i < str.length; i++) {
    result += String.fromCharCode(
      str.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }
  return btoa(result);
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const RESERVED = new Set([
  "and", "break", "do", "else", "elseif", "end", "false", "for",
  "function", "goto", "if", "in", "local", "nil", "not", "or",
  "repeat", "return", "then", "true", "until", "while",
  "_G", "_ENV", "self",
  "print", "warn", "error", "type", "typeof", "tostring", "tonumber",
  "pairs", "ipairs", "next", "select", "unpack", "rawget", "rawset",
  "setmetatable", "getmetatable", "require", "pcall", "xpcall",
  "string", "table", "math", "os", "io", "coroutine", "debug",
  "game", "workspace", "script", "shared", "Player", "Players",
  "Instance", "CFrame", "Vector3", "Vector2", "Color3", "UDim2",
  "Enum", "task", "wait", "spawn", "delay", "tick", "time",
  "loadstring", "load", "dofile", "assert",
]);

export interface ObfuscatorOptions {
  renameVariables: boolean;
  encryptStrings: boolean;
  obfuscateNumbers: boolean;
  insertJunk: boolean;
  wrapIIFE: boolean;
  controlFlow: boolean;
  vmEncode: boolean;
}

export const DEFAULT_OPTIONS: ObfuscatorOptions = {
  renameVariables: true,
  encryptStrings: true,
  obfuscateNumbers: true,
  insertJunk: true,
  wrapIIFE: true,
  controlFlow: true,
  vmEncode: false,
};

function splitForLua(encoded: string, chunkSize: number): string {
  const parts: string[] = [];
  for (let i = 0; i < encoded.length; i += chunkSize) {
    parts.push(encoded.slice(i, i + chunkSize));
  }
  return parts.map((p) => `"${p}"`).join("..");
}

import { vmEncode } from "./vmobfuscator";

export function obfuscate(
  code: string,
  options: ObfuscatorOptions = DEFAULT_OPTIONS
): string {
  if (options.vmEncode) {
    return vmEncode(code);
  }

  const lines = code.split("\n").filter((l) => l.trim());
  if (lines.length === 0) return "--[[ empty input ]]";

  const varMap = new Map<string, string>();
  let varCounter = 0;
  const localVarPattern = /local\s+(\w+)/g;
  let match: RegExpExecArray | null;
  while ((match = localVarPattern.exec(code)) !== null) {
    const name = match[1];
    if (!RESERVED.has(name) && !varMap.has(name)) {
      varMap.set(name, randomName(10 + (varCounter % 5)));
      varCounter++;
    }
  }

  function renameVars(src: string): string {
    let result = src;
    for (const [orig, obf] of Array.from(varMap)) {
      const regex = new RegExp(`(?<![\\w])${orig}(?![\\w])`, "g");
      result = result.replace(regex, obf);
    }
    return result;
  }

  function encryptStringsInLine(line: string): string {
    if (line.trim().startsWith("--")) return line;
    return line.replace(
      /(["'])((?:(?!\1|\\).|\\.)*?)\1/g,
      (_match, quote: string, content: string) => {
        if (content.length < 2) return _match;
        const key = randomName(6);
        const encrypted = xorEncrypt(content, key);
        const encodedLua = splitForLua(encrypted, 60);
        return `(function(...) local k,q="${key}",${encodedLua} local r="" for i=1,#q do r=r..string.char(q:byte(i)~=k:byte((i-1)%#k+1)) end return r end)()`;
      }
    );
  }

  const encKey = randomName(12);
  const decryptFn = options.encryptStrings
    ? `local ${encKey}=function(s,k) local r="" for i=1,#s do r=r..string.char(s:byte(i)~=k:byte((i-1)%#k+1)) end return r end `
    : "";

  const obfuscatedParts: string[] = [];

  for (const rawLine of lines) {
    let line = rawLine;
    if (line.trim() === "" || line.trim().startsWith("--")) continue;

    if (options.renameVariables) {
      line = renameVars(line);
    }

    if (options.encryptStrings) {
      line = encryptStringsInLine(line);
    }

    if (options.obfuscateNumbers) {
      line = line.replace(/\b(\d+\.?\d*)\b/g, (m, num: string) => {
        const n = parseFloat(num);
        if (n > 9999 || !isFinite(n)) return m;
        const a = Math.floor(Math.random() * 50 + 2);
        const b = a * n;
        return `(${b}/${a})`;
      });
    }

    if (options.insertJunk && Math.random() > 0.85) {
      const jv = randomName(6);
      const jr1 = Math.floor(Math.random() * 9999 + 1);
      const jr2 = Math.floor(Math.random() * 9999 + 1);
      line = `${line} ::${randomName(8)}:: local ${jv}=${jr1}+${jr2}`;
    }

    if (options.controlFlow && Math.random() > 0.7) {
      const cv = randomName(6);
      const jCond = `(function() local ${cv}=math.random(1,10) return ${cv}>5 end)()`;
      line = `if ${jCond} then ${line} end`;
    }

    obfuscatedParts.push(line);
  }

  let output = obfuscatedParts.join("\n");

  if (options.encryptStrings) {
    output = `${decryptFn}${output}`;
  }

  if (options.wrapIIFE) {
    const envVar = randomName(6);
    const loader = randomName(8);
    output = [
      `local ${envVar}=_ENV or _G`,
      `return (function(${envVar},...)`,
      `  local ${loader}=loadstring or load`,
      `  return ${loader}([[${output}]])()`,
      ` end)(_ENV or _G)`,
    ].join("\n");
  }

  return `--[[ Obfuscated by Dark Alliance Obfuscator ]]\n${output}`;
}
