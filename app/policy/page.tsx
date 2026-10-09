import type { Metadata } from "next";
import { Text } from "@/app/components/language";

export const metadata: Metadata = {
  title: "Privacy Policy | F1 Stats",
  description: "Privacy policy for F1 Stats.",
};

export default function PolicyPage() {
  return (
    <main className="page policy">
      <div className="eyebrow">
        <Text id="legal" />
      </div>
      <h1>
        <Text id="privacyPolicy" />
      </h1>
      <p className="lead">
        <Text id="policyLastUpdated" />
      </p>
      <h2>
        <Text id="informationCollection" />
      </h2>
      <p>
        <Text id="informationCollectionBody" />
      </p>
      <h2>
        <Text id="dataSources" />
      </h2>
      <p>
        <Text id="dataSourcesBody" />
      </p>
      <h2>
        <Text id="hostingTechnical" />
      </h2>
      <p>
        <Text id="hostingTechnicalBody" />
      </p>
      <h2>
        <Text id="updates" />
      </h2>
      <p>
        <Text id="updatesBody" />
      </p>
    </main>
  );
}
