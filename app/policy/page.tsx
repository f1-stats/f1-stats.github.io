import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | F1 Stats",
  description: "Privacy policy for F1 Stats.",
};

export default function PolicyPage() {
  return (
    <main className="page policy">
      <div className="eyebrow">LEGAL</div>
      <h1>Privacy Policy</h1>
      <p className="lead">Last updated: September 25, 2026</p>
      <h2>Information collection</h2>
      <p>
        F1 Stats does not require an account and does not intentionally collect
        names, email addresses, or other personal information. The calculators
        run in your browser and do not send their inputs to this site.
      </p>
      <h2>Data sources</h2>
      <p>
        Race, driver, and constructor data is sourced from the Jolpica F1 API.
        This site is an independent statistics resource and is not affiliated
        with Formula 1, its teams, or its drivers.
      </p>
      <h2>Hosting and technical data</h2>
      <p>
        When this site is hosted through GitHub Pages, GitHub may process
        technical information such as IP addresses and request logs under its
        own privacy policy. F1 Stats does not use advertising cookies or
        third-party analytics.
      </p>
      <h2>Updates</h2>
      <p>
        This policy may be updated as the site changes. The latest version is
        always available on this page.
      </p>
    </main>
  );
}
