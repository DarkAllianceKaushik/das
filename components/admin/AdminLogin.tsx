"use client";

import { useState } from "react";
import { Lock, LogIn } from "lucide-react";
import { Button, Card, Input, Label } from "@heroui/react";

interface AdminLoginProps {
  onSuccess: () => void;
}

export function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      onSuccess();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <Card className="border border-alliance-border bg-alliance-card/80 shadow-glow">
        <Card.Content className="p-8">
          <div className="mb-6 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-alliance-red/20 ring-1 ring-alliance-red/50">
              <Lock className="h-7 w-7 text-alliance-red-bright" />
            </div>
          </div>
          <div className="text-center">
            <h2 className="font-display text-xl font-bold text-white">Admin Login</h2>
            <p className="mt-1 text-sm text-alliance-muted">
              Owner access only. Manage scripts and categories.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                variant="primary"
                fullWidth
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="primary"
                fullWidth
                required
              />
            </div>

            {error && (
              <p className="rounded-lg bg-rose-950/50 px-3 py-2 text-sm text-rose-300 ring-1 ring-rose-900/50">
                {error}
              </p>
            )}

            <Button type="submit" isDisabled={loading} fullWidth>
              <LogIn className="h-4 w-4" />
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Card.Content>
      </Card>
    </div>
  );
}
