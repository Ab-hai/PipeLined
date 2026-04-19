"use client";

import { ApplicationStatus } from "@prisma/client";
import Link from "next/link";

const STATUS_LABELS: Partial<Record<ApplicationStatus, string>> = {
  BOOKMARKED: "Bookmarked",
  APPLIED: "Applied",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
};

interface ApplicationFormProps {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: {
    company?: string;
    role?: string;
    jobUrl?: string;
    status?: ApplicationStatus;
    notes?: string;
  };
  submitLabel: string;
  cancelHref: string;
}

export default function ApplicationForm({
  action,
  defaultValues,
  submitLabel,
  cancelHref,
}: ApplicationFormProps) {
  return (
    <form action={action} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            Company <span className="text-red-500">*</span>
          </label>
          <input
            name="company"
            required
            defaultValue={defaultValues?.company ?? ""}
            placeholder="e.g. Google"
            className="w-full bg-input border border-foreground/15 rounded-lg px-4 py-2.5 text-foreground placeholder-foreground/30 focus:outline-none focus:border-foreground/40 transition-colors text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            Role <span className="text-red-500">*</span>
          </label>
          <input
            name="role"
            required
            defaultValue={defaultValues?.role ?? ""}
            placeholder="e.g. Software Engineer"
            className="w-full bg-input border border-foreground/15 rounded-lg px-4 py-2.5 text-foreground placeholder-foreground/30 focus:outline-none focus:border-foreground/40 transition-colors text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            Job URL <span className="text-foreground/30 font-normal">(optional)</span>
          </label>
          <input
            name="jobUrl"
            type="url"
            defaultValue={defaultValues?.jobUrl ?? ""}
            placeholder="https://..."
            className="w-full bg-input border border-foreground/15 rounded-lg px-4 py-2.5 text-foreground placeholder-foreground/30 focus:outline-none focus:border-foreground/40 transition-colors text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Status</label>
          <select
            name="status"
            defaultValue={defaultValues?.status ?? "BOOKMARKED"}
            className="w-full bg-input border border-foreground/15 rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-foreground/40 transition-colors text-sm"
          >
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">
          Notes <span className="text-foreground/30 font-normal">(optional)</span>
        </label>
        <textarea
          name="notes"
          defaultValue={defaultValues?.notes ?? ""}
          placeholder="Referral, comp range, anything worth remembering..."
          rows={4}
          className="w-full bg-input border border-foreground/15 rounded-lg px-4 py-2.5 text-foreground placeholder-foreground/30 focus:outline-none focus:border-foreground/40 transition-colors text-sm resize-none"
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          className="bg-primary text-primary-foreground rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          {submitLabel}
        </button>
        <Link
          href={cancelHref}
          className="text-sm text-foreground/40 hover:text-foreground transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
