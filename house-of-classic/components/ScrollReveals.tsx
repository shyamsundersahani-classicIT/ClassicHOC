"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Progressive enhancement: server HTML and the first viewport stay visible.
export default function ScrollReveals() {
  const pathname = usePathname();

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches || !("IntersectionObserver" in window)) return;

    const elements = Array.from(document.querySelectorAll<HTMLElement>("main [data-reveal]"));
    const reveal = (element: HTMLElement) => {
      element.dataset.revealState = "visible";
      observer.unobserve(element);
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) reveal(entry.target as HTMLElement);
      });
    }, { threshold: 0, rootMargin: "0px 0px -24px 0px" });

    elements.forEach((element) => {
      // Never hide content already on screen, including restored scroll positions.
      if (element.getBoundingClientRect().top < window.innerHeight) return;
      element.dataset.revealState = "pending";
      observer.observe(element);
    });

    const onFocus = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      const element = event.target.closest<HTMLElement>("[data-reveal-state='pending']");
      if (element) reveal(element);
    };
    const showAll = () => {
      if (!preference.matches) return;
      observer.disconnect();
      elements.forEach((element) => delete element.dataset.revealState);
    };
    document.addEventListener("focusin", onFocus);
    preference.addEventListener("change", showAll);

    return () => {
      observer.disconnect();
      document.removeEventListener("focusin", onFocus);
      preference.removeEventListener("change", showAll);
      elements.forEach((element) => delete element.dataset.revealState);
    };
  }, [pathname]);

  return null;
}
