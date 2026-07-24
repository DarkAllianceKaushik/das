import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <div className="relative z-10 mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-3xl font-bold">Privacy Policy</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-alliance-muted">
        <p>Dark Alliance Script Store (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy.</p>
        <h2 className="font-display text-lg font-bold text-white">Information We Collect</h2>
        <p>We collect minimal information necessary to operate the store. This may include anonymous usage data via browser localStorage for features like favorites and view tracking. No personal data is sent to our servers.</p>
        <h2 className="font-display text-lg font-bold text-white">How We Use Data</h2>
        <p>Local-only data (favorites, view counts, reports) stays in your browser and is never transmitted to us. External script searches query ScriptBlox and RScripts APIs directly from your browser.</p>
        <h2 className="font-display text-lg font-bold text-white">Third-Party Services</h2>
        <p>Our site uses Vercel for hosting. Their privacy policy applies to network-level data. We do not use analytics trackers, cookies for tracking, or third-party advertising.</p>
        <h2 className="font-display text-lg font-bold text-white">Contact</h2>
        <p>For questions, join our Discord server.</p>
        <p className="text-xs text-alliance-muted/60">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
}
