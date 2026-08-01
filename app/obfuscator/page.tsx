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
  Upload,
  Globe,
} from "lucide-react";
import { Button, Card, Chip, TextArea } from "@heroui/react";
import { ScrollReveal } from "@/components/ScrollReveal";

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
    options: { ...DEFAULT_OPTIONS, insertJunk: true, controlFlow: true, vmEncode: true },
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
  const [pastebinLoading, setPastebinLoading] = useState(false);
  const [pastebinUrl, setPastebinUrl] = useState("");
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

  const handlePastebin = useCallback(async () => {
    if (!output) return;
    setPastebinLoading(true);
    setPastebinUrl("");
    try {
      const formData = new FormData();
      formData.append("api_option", "paste");
      formData.append("api_dev_key", "hX4fyCb_elE5jUt-bqHXy3hBSA_HCPzh");
      formData.append("api_paste_code", output);
      formData.append("api_paste_name", `obfuscated_${Date.now()}`);
      formData.append("api_paste_private", "1");
      const res = await fetch("https://pastebin.com/api/api_post.php", { method: "POST", body: formData });
      const url = await res.text();
      if (url.startsWith("https://pastebin.com/")) setPastebinUrl(url);
    } catch { /* ignore */ } finally { setPastebinLoading(false); }
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
    <div className="relative z-10">
      <section className="relative overflow-hidden border-b border-alliance-border/40 pb-16 pt-20 sm:pb-20 sm:pt-28">
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 flex animate-fade-in justify-center">
              <Chip
                variant="soft"
                color="accent"
                className="border border-alliance-red/30 bg-alliance-red/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-alliance-red-bright"
              >
                <Skull className="size-3" />
                Lua Obfuscator
              </Chip>
            </div>
            <h1 className="animate-fade-in font-display text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl md:text-8xl">
              <span className="text-white">Dark Alliance</span>
              <br />
              <span className="bg-gradient-to-r from-alliance-red-bright via-alliance-red to-alliance-crimson bg-clip-text text-transparent">
                Obfuscator
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl animate-fade-in text-base leading-relaxed text-alliance-muted sm:text-lg">
              Luraph-level Lua obfuscation. Paste your script and protect it from
              reverse engineering.
            </p>
          </div>
        </div>
        <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-alliance-red/30 to-transparent" />
      </section>

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16">
      <ScrollReveal delay={1}>
        <div className="mb-8">
          <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-widest text-alliance-muted">
            Presets
          </h2>
          <div className="flex flex-wrap gap-3">
            {PRESETS.map((p) => (
              <Button
                key={p.name}
                onPress={() => handlePreset(p.name, p.options)}
                variant={activePreset === p.name ? "primary" : "outline"}
                size="sm"
                className={`text-sm font-semibold ${
                  activePreset === p.name
                    ? ""
                    : "border-alliance-border bg-alliance-dark text-alliance-muted hover:border-alliance-red/50 hover:text-white"
                }`}
              >
                {p.name}
              </Button>
            ))}
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={2}>
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
            <Button
              key={key}
              onPress={() => !disabled && toggleOption(key)}
              variant={options[key] ? "primary" : "outline"}
              isDisabled={disabled}
              size="sm"
              className={`text-xs font-semibold ${
                disabled
                  ? "border-alliance-border/30 bg-alliance-darker/50 text-alliance-muted/30 opacity-50"
                  : options[key]
                    ? ""
                    : "border-alliance-border bg-alliance-dark text-alliance-muted hover:border-alliance-red/50 hover:text-white"
              }`}
            >
              {options[key] ? "ON" : "OFF"} — {label}
            </Button>
          );
        })}
        </div>
      </ScrollReveal>

      <ScrollReveal delay={3}>
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <p className="mb-1.5 inline-flex items-center gap-2 text-sm font-semibold text-alliance-muted">
              <Terminal className="size-4" />
              Input (Lua/Luau)
            </p>
            <TextArea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={SAMPLE}
              variant="primary"
              className="h-80 resize-y font-mono text-xs leading-relaxed"
              spellCheck={false}
            />
            <div className="mt-3 flex items-center gap-3">
              <Button onPress={handleObfuscate}>
                <Skull className="h-4 w-4" />
                Obfuscate
              </Button>
              <Button
                variant="secondary"
                onPress={() => setInput(SAMPLE)}
                size="sm"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Load Sample
              </Button>
            </div>
          </div>

          <div>
            <p className="mb-1.5 inline-flex items-center gap-2 text-sm font-semibold text-alliance-muted">
              <Shield className="size-4" />
              Output
            </p>
            <div className="relative">
              <TextArea
                ref={outputRef}
                value={output}
                readOnly
                placeholder="Obfuscated code will appear here..."
                variant="primary"
                className="h-80 resize-y font-mono text-xs leading-relaxed"
                spellCheck={false}
              />
              {output && (
                <Button
                  variant="ghost"
                  size="sm"
                  isIconOnly
                  onPress={handleCopy}
                  className="absolute right-3 top-3"
                  aria-label="Copy output"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
            {output && (
              <p className="mt-2 text-right text-xs text-alliance-muted">
                {output.length.toLocaleString()} chars
              </p>
            )}
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={4}>
        <Card className="mx-auto mt-12 max-w-3xl border border-alliance-border bg-alliance-card/80">
          <Card.Content className="p-6 text-sm text-alliance-muted">
            <h3 className="mb-2 font-display text-xs font-bold uppercase tracking-widest text-alliance-red-bright">
              ⚠ Disclaimer
            </h3>
            <p>
              This obfuscator is provided for educational purposes and protecting
              your own scripts. Do not use it to distribute malware, steal
              intellectual property, or violate any terms of service. The Dark
              Alliance team is not responsible for misuse.
            </p>
          </Card.Content>
        </Card>
      </ScrollReveal>
    </div>
    </div>
  );
}
