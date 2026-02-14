"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export function ContactForm() {
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    // Replace with your actual submit logic / server action
    await new Promise((r) => setTimeout(r, 1200));
    setPending(false);
    setDone(true);
  }

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Send className="h-6 w-6 text-primary" />
        </div>
        <h3 className="font-michroma text-lg font-semibold text-foreground">
          Message sent!
        </h3>
        <p className="text-sm text-muted-foreground">
          We&apos;ll get back to you within 24 hours.
        </p>
        <button
          onClick={() => setDone(false)}
          className="mt-2 text-sm text-primary underline underline-offset-4 hover:opacity-80"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">

      {/* Row 1: First Name + Last Name */}
      <div className="grid gap-8 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            First Name
          </label>
          <input
            type="text"
            name="first_name"
            required
            placeholder=""
            className="border-0 border-b border-border bg-transparent pb-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Last Name
          </label>
          <input
            type="text"
            name="last_name"
            placeholder="Doe"
            className="border-0 border-b border-border bg-transparent pb-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Row 2: Email + Phone */}
      <div className="grid gap-8 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            placeholder=""
            className="border-0 border-b border-border bg-transparent pb-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            placeholder="+91 012 3456 789"
            className="border-0 border-b border-border bg-transparent pb-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Row 3: Message */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">
          Message
        </label>
        <textarea
          name="message"
          required
          rows={3}
          placeholder="Write your message.."
          className="resize-none border-0 border-b border-border bg-transparent pb-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none transition-colors"
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          {pending ? "Sending…" : "Send Message"}
        </Button>
      </div>

    </form>
  );
}