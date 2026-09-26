"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Text } from "@/app/components/language";

export default function Championship() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/compare");
    }, [router]);

    return <main className="page"><p className="lead"><Link href="/compare"><Text id="compareTitle" /></Link></p></main>;
}