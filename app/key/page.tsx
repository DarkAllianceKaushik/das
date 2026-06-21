"use client";

import { useState, useCallback } from "react";
import { addKey, revokeKey, getKeys, validateKey } from "@/lib/key-system";
import { Shield, Copy, Check, Trash2, Plus, Key, ExternalLink } from "lucide-react";

export default function KeySystemPage() {
  const [keys, setKeys] = useState(getKeys());
  const [validationInput, setValidationInput] = useState("");
  const [validationResult, setValidationResult] = useState<boolean | null>(null);
  const [copiedId, setCopiedId] = useState("");

  const handleGenerate = useCallback(() => {
    const newKey = addKey();
    setKeys(getKeys());
    setCopiedId(newKey.id);
    navigator.clipboard.writeText(newKey.key);
    setTimeout(() => setCopiedId(""), 2000);
  }, []);

  const handleRevoke = useCallback((id: string) => {
    revokeKey(id);
    setKeys(getKeys());
  }, []);

  const handleCopy = useCallback((key: string) => {
    navigator.clipboard.writeText(key);
  }, []);

  const handleValidate = useCallback(() => {
    setValidationResult(validateKey(validationInput));
  }, [validationInput]);

  const activeKeys = keys.filter(k => k.active);
  const expiredKeys = keys.filter(k => !k.active);

  return (
    <div className="relative z-10 mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <section className="mb-10 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-alliance-red/30 bg-alliance-red/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-alliance-red-bright">
          <Shield className="h-3.5 w-3.5" /> License System
        </div>
        <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          <span className="text-white">Dark Alliance</span>
          <br />
          <span className="bg-gradient-to-r from-alliance-red-bright via-alliance-red to-alliance-crimson bg-clip-text text-transparent">
            Key System
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-alliance-muted sm:text-lg">
          Generate and manage license keys for script access.
        </p>
      </section>

      <div className="card-surface mb-8 p-6">
        <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-widest text-alliance-muted">Validate a Key</h2>
        <div className="flex gap-3">
          <input
            value={validationInput}
            onChange={e => setValidationInput(e.target.value)}
            placeholder="Enter key (e.g. ABCD-EFGH-IJKL-MNOP)"
            className="input-field flex-1 font-mono text-sm uppercase"
            maxLength={19}
          />
          <button onClick={handleValidate} className="btn-primary">
            <Key className="h-4 w-4" /> Validate
          </button>
        </div>
        {validationResult !== null && (
          <p className={`mt-3 text-sm font-semibold ${validationResult ? "text-emerald-400" : "text-red-400"}`}>
            {validationResult ? "✓ Key is valid and active" : "✗ Invalid, expired, or revoked key"}
          </p>
        )}
      </div>

      <div className="mb-8 flex items-center justify-between">
        <h2 className="font-display text-sm font-bold uppercase tracking-widest text-alliance-muted">
          Your Keys ({activeKeys.length})
        </h2>
        <button onClick={handleGenerate} className="btn-primary">
          <Plus className="h-4 w-4" /> Generate Key
        </button>
      </div>

      {keys.length === 0 ? (
        <div className="card-surface flex flex-col items-center justify-center py-16 text-center">
          <Key className="h-12 w-12 text-alliance-muted/40" />
          <p className="mt-4 font-display text-lg text-alliance-muted">No keys yet</p>
          <p className="mt-1 text-sm text-alliance-muted/70">Generate your first key above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activeKeys.map(k => (
            <div key={k.id} className="card-surface flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-emerald-400" />
                <code className="rounded bg-alliance-darker px-3 py-1.5 font-mono text-sm text-alliance-red-bright">
                  {k.key}
                </code>
              </div>
              <div className="flex items-center gap-3 text-xs text-alliance-muted">
                <span>Exp: {new Date(k.expiresAt).toLocaleDateString()}</span>
                <button onClick={() => { handleCopy(k.key); setCopiedId(k.id); setTimeout(() => setCopiedId(""), 1500); }} className="rounded p-1.5 text-alliance-muted transition hover:bg-alliance-dark hover:text-white">
                  {copiedId === k.id ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </button>
                <button onClick={() => handleRevoke(k.id)} className="rounded p-1.5 text-alliance-muted transition hover:bg-red-950/40 hover:text-red-400">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {expiredKeys.length > 0 && (
            <>
              <h3 className="mt-6 font-display text-xs font-bold uppercase tracking-widest text-alliance-muted/50">
                Revoked / Expired ({expiredKeys.length})
              </h3>
              {expiredKeys.map(k => (
                <div key={k.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-alliance-border/30 bg-alliance-card/40 p-4 opacity-50">
                  <code className="rounded bg-alliance-darker px-3 py-1.5 font-mono text-sm text-alliance-muted line-through">
                    {k.key}
                  </code>
                  <span className="text-xs text-alliance-muted">Revoked</span>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
