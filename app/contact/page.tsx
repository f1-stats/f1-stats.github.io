import type { Metadata } from "next";
import { Text } from "@/app/components/language";
import { GiscusComments } from "@/app/components/giscus-comments";

export const metadata: Metadata = {
  title: "Contact | F1 Stats",
  description: "Contact F1 Stats with questions, corrections, and suggestions.",
};

export default function ContactPage() {
  return (
    <main className="page policy">
      <h1>
        <Text id="contact" />
      </h1>
      <GiscusComments />
    </main>
  );
}
