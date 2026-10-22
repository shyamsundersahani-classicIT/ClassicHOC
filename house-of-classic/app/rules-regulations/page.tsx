import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import legal from "@/data/legal.json";

export const metadata: Metadata = { title: "House Rules", description: "House rules, timings and party rules for House of Classic." };

export default function Rules() {
  return <LegalPage title="House Rules & Regulations" lines={legal.rules} />;
}
