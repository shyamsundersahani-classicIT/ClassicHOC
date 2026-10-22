import type { Metadata } from "next";
import EnquiryForm from "@/components/EnquiryForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact & Book",
  description: "Enquire or book House of Classic in Jaipur. Call, WhatsApp or send an enquiry for dates, packages and availability.",
};

export default function Contact() {
  const mapQuery = encodeURIComponent(`${site.name}, ${site.address.street}, ${site.address.locality}`);
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h1 data-reveal className="text-center font-serif text-4xl">Contact &amp; Book</h1>
      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        <div>
          <h2 className="font-serif text-2xl">Send an enquiry</h2>
          <p className="mt-2 text-sm text-muted">We reply on WhatsApp, usually the same day.</p>
          <div data-reveal className="mt-6">
            <EnquiryForm />
          </div>
        </div>
        <div data-reveal className="space-y-6">
          <div>
            <h2 className="font-serif text-2xl">Visit us</h2>
            <p className="mt-2 text-muted">{site.name}<br />{site.address.street}<br />{site.address.locality}, {site.address.region} {site.address.postalCode}</p>
          </div>
          <div>
            <p><strong>Phone:</strong> <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="underline">{site.phone}</a></p>
            <p><strong>Email:</strong> <a href={`mailto:${site.email}`} className="underline">{site.email}</a></p>
            <p><strong>Check-in:</strong> {site.checkIn} &nbsp; <strong>Check-out:</strong> {site.checkOut}</p>
          </div>
          <iframe
            title="House of Classic location"
            src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
            className="h-72 w-full rounded-lg border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
