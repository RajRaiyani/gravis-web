"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { submitContactInquiry } from "@/services/api/inquiry.api";

const defaultValues = {
  name: "",
  email: "",
  phone_number: "",
  message: "",
};

export function ContactForm() {
  const [form, setForm] = useState(defaultValues);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitContactInquiry({
        name: form.name,
        email: form.email,
        phone_number: form.phone_number,
        message: form.message,
      });
      toast.success("Message sent! We'll get back to you soon.");
      setForm(defaultValues);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="contact-name"
            className="text-sm font-medium text-foreground"
          >
            Name <span className="text-destructive">*</span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            className={inputClass}
            placeholder="Your name"
            autoComplete="name"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="contact-email"
            className="text-sm font-medium text-foreground"
          >
            Email <span className="text-destructive">*</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            className={inputClass}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="contact-phone"
          className="text-sm font-medium text-foreground"
        >
          Phone
        </label>
        <input
          id="contact-phone"
          name="phone_number"
          type="tel"
          value={form.phone_number}
          onChange={handleChange}
          className={inputClass}
          placeholder="+91 98765 43210"
          autoComplete="tel"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="contact-message"
          className="text-sm font-medium text-foreground"
        >
          Message <span className="text-destructive">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          value={form.message}
          onChange={handleChange}
          className={inputClass + " resize-y min-h-[120px]"}
          placeholder="How can we help?"
        />
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="w-full sm:w-auto"
      >
        {isSubmitting ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
