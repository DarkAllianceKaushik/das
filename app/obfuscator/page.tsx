"use client";

import { useState, useCallback, useRef } from "react";
import { obfuscate, DEFAULT_OPTIONS } from "@/lib/obfuscator";
import type { ObfuscatorOptions } from "@/lib/obfuscator";
import {
  Shield,
  Copy,
  Check,
  Skull,
  RefreshCw,
  Terminal,
} from "lucide-react";

const PRESETS = [
  {
    name: "Max Protection",
    options: { ...DEFAULT_OPTIONS, insertJunk: true, controlFlow: true, vmEncode: false },
  },
  {
    name: "Light",
    options: {
      renameVariables: true,
      encryptStrings: false,
      obfuscateNumbers: false,
      insertJunk: false,
      wrapIIFE: true,
      controlFlow: false,
      vmEncode: false,
    },
  },
  {
    name: "Full (Luraph-like)",
    options: { ...DEFAULT_OPTIONS, insertJunk: true, controlFlow: true, vmEncode: false },
  },
  {
    name: "VM Encoded",
    options: {
      renameVariables: false,
      encryptStrings: false,
      obfuscateNumbers: false,
      insertJunk: false,
      wrapIIFE: false,
      controlFlow: false,
      vmEncode: true,
    },
  },
];

const SAMPLE = `local player = game.Players.LocalPlayer
local character = player.Character or player.CharacterAdded:Wait()
local humanoid = character:WaitForChild("Humanoid")

print("Hello from " .. player.Name)

humanoid.Died:Connect(function()
    warn("Player died!")
end)`;

export default function ObfuscatorPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState<ObfuscatorOptions>({
    ...DEFAULT_OPTIONS,
  });
  const [activePreset, setActivePreset] = useState("Full (Luraph-like)");
  const outputRef = useRef<HTMLTextAreaElement>(null);

  const handleObfuscate = useCallback(() => {
    if (!input.trim()) return;
    try {
      const result = obfuscate(input, options);
      setOutput(result);
    } catch {
      setOutput("--[[ Error: obfuscation failed. Check your code. ]]");
    }
  }, [input, options]);

  const handleCopy = useCallback(async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const handlePreset = useCallback((name: string, opts: ObfuscatorOptions) => {
    setActivePreset(name);
    setOptions({ ...opts });
  }, []);

  const toggleOption = useCallback((key: keyof ObfuscatorOptions) => {
    setOptions((prev) => {
      if (key === "vmEncode") {
        const on = !prev.vmEncode;
        if (on) {
          return {
            renameVariables: false,
            encryptStrings: false,
            obfuscateNumbers: false,
            insertJunk: false,
            wrapIIFE: false,
            controlFlow: false,
            vmEncode: true,
          };
        }
        return { ...DEFAULT_OPTIONS, vmEncode: false };
      }
      if (prev.vmEncode) return prev;
      return { ...prev, [key]: !prev[key] };
    });
    setActivePreset("");
  }, []);

  return (
    <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <section className="mb-10 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-alliance-red/30 bg-alliance-red/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-alliance-red-bright">
          <Skull className="h-3.5 w-3.5" />
          Lua Obfuscator
        </div>
        <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          <span className="text-white">Dark Alliance</span>
          <br />
          <span className="bg-gradient-to-r from-alliance-red-bright via-alliance-red to-alliance-crimson bg-clip-text text-transparent">
            Obfuscator
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-alliance-muted sm:text-lg">
          Luraph-level Lua obfuscation. Paste your script and protect it from
          reverse engineering.
        </p>
      </section>

      <div className="mb-8">
        <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-widest text-alliance-muted">
          Presets
        </h2>
        <div className="flex flex-wrap gap-3">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => handlePreset(p.name, p.options)}
              className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                activePreset === p.name
                  ? "border-alliance-red bg-alliance-red/20 text-alliance-red-bright"
                  : "border-alliance-border bg-alliance-dark text-alliance-muted hover:border-alliance-red/50 hover:text-white"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {(
          [
            ["renameVariables", "Rename Vars"],
            ["encryptStrings", "Encrypt Strings"],
            ["obfuscateNumbers", "Obfuscate Numbers"],
            ["insertJunk", "Insert Junk"],
            ["wrapIIFE", "Wrap IIFE"],
            ["controlFlow", "Control Flow"],
            ["vmEncode", "VM Encoder"],
          ] as [keyof ObfuscatorOptions, string][]
        ).map(([key, label]) => {
          const disabled = options.vmEncode && key !== "vmEncode";
          return (
            <button
              key={key}
              onClick={() => !disabled && toggleOption(key)}
              className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                disabled
                  ? "border-alliance-border/30 bg-alliance-darker/50 text-alliance-muted/30 cursor-not-allowed"
                  : options[key]
                  ? "border-alliance-red bg-alliance-red/20 text-alliance-red-bright"
                  : "border-alliance-border bg-alliance-dark text-alliance-muted hover:border-alliance-red/50 hover:text-white"
              }`}
            >
              {options[key] ? "ON" : "OFF"} — {label}
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <label className="label-field flex items-center gap-2">
            <Terminal className="h-4 w-4" />
            Input (Lua/Luau)
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={SAMPLE}
            className="input-field h-80 resize-y font-mono text-xs leading-relaxed"
            spellCheck={false}
          />
          <div className="mt-3 flex items-center gap-3">
            <button onClick={handleObfuscate} className="btn-primary">
              <Skull className="h-4 w-4" />
              Obfuscate
            </button>
            <button
              onClick={() => setInput(SAMPLE)}
              className="btn-secondary text-xs"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Load Sample
            </button>
          </div>
        </div>

        <div>
          <label className="label-field flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Output
          </label>
          <div className="relative">
            <textarea
              ref={outputRef}
              value={output}
              readOnly
              placeholder="Obfuscated code will appear here..."
              className="input-field h-80 resize-y font-mono text-xs leading-relaxed"
              spellCheck={false}
            />
            {output && (
              <button
                onClick={handleCopy}
                className="absolute right-3 top-3 rounded-md border border-alliance-border bg-alliance-darker p-2 text-alliance-muted transition hover:border-alliance-red/50 hover:text-white"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-emerald-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            )}
          </div>
          {output && (
            <p className="mt-2 text-right text-xs text-alliance-muted">
              {output.length.toLocaleString()} chars
            </p>
          )}
        </div>
      </div>

      <div className="card-surface mx-auto mt-12 max-w-3xl p-6 text-sm text-alliance-muted">
        <h3 className="mb-2 font-display text-xs font-bold uppercase tracking-widest text-alliance-red-bright">
          ⚠ Disclaimer
        </h3>
        <p>
          This obfuscator is provided for educational purposes and protecting
          your own scripts. Do not use it to distribute malware, steal
          intellectual property, or violate any terms of service. The Dark
          Alliance team is not responsible for misuse.
        </p>
      </div>
    </div>
  );
}
