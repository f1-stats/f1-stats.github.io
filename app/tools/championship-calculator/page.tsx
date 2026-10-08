"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Text } from "@/app/components/language";

export default function Championship() {
  const router = useRouter();
  const compareHref = `/${new Date().getFullYear()}/compare`;

  useEffect(() => {
    router.replace(compareHref);
  }, [compareHref, router]);

  return (
    <main className="page">
      <p className="lead">
        <Link href={compareHref}>
          <Text id="compareTitle" />
        </Link>
      </p>
    </main>
  );
}
