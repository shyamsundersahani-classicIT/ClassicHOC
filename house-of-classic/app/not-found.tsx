import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Unknown URLs render under the root layout only, so the site header and footer are added here.
export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-xl px-4 py-24 text-center">
          <h1 className="font-serif text-4xl">Page not found</h1>
          <p className="mt-4 text-muted">Sorry, that page does not exist.</p>
          <Link href="/" className="mt-8 inline-block rounded-full bg-ink px-6 py-3 font-bold text-cream hover:bg-gold">Back to home</Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
