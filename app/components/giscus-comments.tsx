"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "@/app/components/language";

function isGiscusFrameReady(
  frame: HTMLIFrameElement | null | undefined,
): boolean {
  if (!frame?.src.startsWith("https://giscus.app/")) return false;

  try {
    return frame.contentWindow?.location.origin === "https://giscus.app";
  } catch {
    return true;
  }
}

export function GiscusComments() {
  const containerRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const localeRef = useRef(locale);
  localeRef.current = locale;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const syncConfig = () => {
      const theme =
        document.documentElement.dataset.theme === "dark" ? "dark" : "light";
      const frame = container.querySelector<HTMLIFrameElement>(
        "iframe.giscus-frame",
      );
      if (!isGiscusFrameReady(frame)) return;

      frame?.contentWindow?.postMessage(
        {
          giscus: {
            setConfig: {
              theme,
              lang: localeRef.current === "zh" ? "zh-CN" : "en",
            },
          },
        },
        "https://giscus.app",
      );
    };
    const handleFrameLoad = (event: Event) => {
      if (
        event.target instanceof HTMLIFrameElement &&
        event.target.classList.contains("giscus-frame") &&
        event.target.src.startsWith("https://giscus.app/")
      ) {
        syncConfig();
      }
    };
    let loadStarted = false;
    const loadGiscus = () => {
      if (loadStarted) return;
      loadStarted = true;

      const script = document.createElement("script");
      script.src = "https://giscus.app/client.js";
      script.async = true;
      script.crossOrigin = "anonymous";
      script.dataset.repo = "f1-stats/f1-stats.github.io";
      script.dataset.repoId = "R_kgDOUrFvFw";
      script.dataset.category = "Q&A";
      script.dataset.categoryId = "DIC_kwDOUrFvF84DHX5H";
      script.dataset.mapping = "title";
      script.dataset.strict = "0";
      script.dataset.reactionsEnabled = "1";
      script.dataset.emitMetadata = "0";
      script.dataset.inputPosition = "bottom";
      script.dataset.theme =
        document.documentElement.dataset.theme === "dark" ? "dark" : "light";
      script.dataset.lang = localeRef.current === "zh" ? "zh-CN" : "en";
      container.append(script);
    };

    const themeObserver = new MutationObserver(syncConfig);
    let intersectionObserver: IntersectionObserver | undefined;

    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    container.addEventListener("load", handleFrameLoad, true);
    if ("IntersectionObserver" in window) {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            loadGiscus();
            intersectionObserver?.disconnect();
          }
        },
        { rootMargin: "300px 0px" },
      );
      intersectionObserver.observe(container);
      const rect = container.getBoundingClientRect();
      if (rect.top <= window.innerHeight + 300 && rect.bottom >= -300) {
        loadGiscus();
        intersectionObserver.disconnect();
      }
    } else {
      loadGiscus();
    }

    return () => {
      themeObserver.disconnect();
      intersectionObserver?.disconnect();
      container.removeEventListener("load", handleFrameLoad, true);
      container.replaceChildren();
    };
  }, []);

  useEffect(() => {
    const frame = containerRef.current?.querySelector<HTMLIFrameElement>(
      "iframe.giscus-frame",
    );
    if (!isGiscusFrameReady(frame)) return;

    frame?.contentWindow?.postMessage(
      { giscus: { setConfig: { lang: locale === "zh" ? "zh-CN" : "en" } } },
      "https://giscus.app",
    );
  }, [locale]);

  return <div className="giscus" ref={containerRef} />;
}
