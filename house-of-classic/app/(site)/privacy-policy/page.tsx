import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import legal from "@/data/legal.json";

export const metadata: Metadata = { title: "Privacy Policy", description: "How House of Classic collects and uses your information." };

export default function Privacy() {
  return <LegalPage title="Privacy Policy" lines={legal.privacy} />;
}
