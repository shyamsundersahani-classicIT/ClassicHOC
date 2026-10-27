import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import legal from "@/data/legal.json";

export const metadata: Metadata = { title: "Cancellation & Refund Policy", description: "Cancellation and refund terms for bookings at House of Classic." };

export default function Cancellation() {
  return <LegalPage title="Cancellation & Refund Policy" lines={legal.cancellation} />;
}
