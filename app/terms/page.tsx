import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  return (
    <div className="relative z-10 mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-3xl font-bold">Terms of Service</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-alliance-muted">
        <p>By using Dark Alliance Script Store, you agree to these terms.</p>
        <h2 className="font-display text-lg font-bold text-white">Educational Purpose</h2>
        <p>All scripts provided on this site are for <strong>educational purposes only</strong>. You are responsible for how you use them. Dark Alliance does not endorse unauthorized use of scripts in games.</p>
        <h2 className="font-display text-lg font-bold text-white">No Warranty</h2>
        <p>Scripts are provided &quot;as is&quot; without warranty. We are not responsible for any damages or issues arising from script usage.</p>
        <h2 className="font-display text-lg font-bold text-white">User Conduct</h2>
        <p>You agree not to misuse the site, submit false reports, or attempt to bypass admin controls.</p>
        <h2 className="font-display text-lg font-bold text-white">Changes</h2>
        <p>We may update these terms at any time. Continued use constitutes acceptance of changes.</p>
        <p className="text-xs text-alliance-muted/60">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
}
