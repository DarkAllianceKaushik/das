"use client";

import { useMemo } from "react";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

const LUA_KEYWORDS = new Set([
  "and", "break", "do", "else", "elseif", "end", "false", "for", "function",
  "goto", "if", "in", "local", "nil", "not", "or", "repeat", "return",
  "then", "true", "until", "while",
]);

const LUA_BUILTINS = new Set([
  "print", "require", "loadstring", "load", "dofile", "pcall", "xpcall",
  "tostring", "tonumber", "type", "ipairs", "pairs", "next", "select",
  "unpack", "rawget", "rawset", "rawequal", "setmetatable", "getmetatable",
  "error", "assert", "collectgarbage", "newproxy",
]);

function tokenize(line: string): { text: string; type: string }[] {
  const tokens: { text: string; type: string }[] = [];
  const re = /(--\[{0,1}[\s\S]*?(?:\]\]|$)|--[^\n]*|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\[{2}(?:[\s\S]*?)\]{2}|0[xX][\da-fA-F]+(?:\.[\da-fA-F]*)?[pP][+-]?\d+|0[xX][\da-fA-F]+(?:\.[\da-fA-F]*)?|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|[A-Za-z_]\w*|\.\.\.|\.\.|[+\-*/%^#<>=~]|[{}().,;:\[\]]|\S)/g;
  let m;
  while ((m = re.exec(line)) !== null) {
    const word = m[0];
    if (word.startsWith("--")) {
      tokens.push({ text: word, type: "comment" });
    } else if ((word.startsWith("\"") && word.endsWith("\"")) || (word.startsWith("'") && word.endsWith("'"))) {
      tokens.push({ text: word, type: "string" });
    } else if (word.startsWith("[") && word.endsWith("]")) {
      tokens.push({ text: word, type: "string" });
    } else if (/^\d/.test(word) || (word.startsWith("0x") || word.startsWith("0X"))) {
      tokens.push({ text: word, type: "number" });
    } else if (LUA_KEYWORDS.has(word)) {
      tokens.push({ text: word, type: "keyword" });
    } else if (LUA_BUILTINS.has(word)) {
      tokens.push({ text: word, type: "builtin" });
    } else {
      tokens.push({ text: word, type: "plain" });
    }
  }
  if (tokens.length === 0) tokens.push({ text: line, type: "plain" });
  return tokens;
}

interface Props {
  code: string;
  title?: string;
  className?: string;
}

export function ScriptPreview({ code, title, className = "" }: Props) {
  const [copied, setCopied] = useState(false);
  const lines = useMemo(() => code.split("\n"), [code]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`card-glass overflow-hidden ${className}`}>
      <div className="flex items-center justify-between border-b border-glass-border/60 bg-glass-darker/80 px-4 py-2.5">
        <span className="font-display text-xs font-bold uppercase tracking-wider text-glass-muted">
          {title || "Script Preview"}
        </span>
        <button onClick={handleCopy} className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs text-glass-muted transition hover:bg-glass-dark hover:text-white">
          {copied ? <Check className="h-3.5 w-3.5 text-amber-400" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div className="overflow-x-auto">
        <pre className="min-w-0 p-4 text-sm leading-relaxed">
          <code>
            {lines.map((line, i) => (
              <div key={i} className="whitespace-pre-wrap">
                <span className="mr-4 inline-block w-8 select-none text-right text-xs text-glass-muted/30">{i + 1}</span>
                {tokenize(line).map((t, j) => {
                  let cls = "text-gray-200";
                  if (t.type === "keyword") cls = "text-violet-400";
                  else if (t.type === "builtin") cls = "text-sky-400";
                  else if (t.type === "string") cls = "text-amber-400";
                  else if (t.type === "number") cls = "text-amber-400";
                  else if (t.type === "comment") cls = "text-glass-muted/50 italic";
                  return <span key={j} className={cls}>{t.text}</span>;
                })}
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
