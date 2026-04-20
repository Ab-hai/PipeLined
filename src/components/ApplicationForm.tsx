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

const inputClass =
  "w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-foreground placeholder-foreground/25 focus:outline-none focus:border-white/20 transition-colors text-sm";

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
          <label className="text-sm font-medium text-foreground/70">
            Company <span className="text-red-400">*</span>
          </label>
          <input
            name="company"
            required
            defaultValue={defaultValues?.company ?? ""}
            placeholder="e.g. Google"
            className={inputClass}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground/70">
            Role <span className="text-red-400">*</span>
          </label>
          <input
            name="role"
            required
            defaultValue={defaultValues?.role ?? ""}
            placeholder="e.g. Software Engineer"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground/70">
            Job URL <span className="text-foreground/25 font-normal">(optional)</span>
          </label>
          <input
            name="jobUrl"
            type="url"
            defaultValue={defaultValues?.jobUrl ?? ""}
            placeholder="https://..."
            className={inputClass}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground/70">Status</label>
          <select
            name="status"
            defaultValue={defaultValues?.status ?? "BOOKMARKED"}
            className={inputClass}
          >
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value} className="bg-neutral-900">
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground/70">
          Notes <span className="text-foreground/25 font-normal">(optional)</span>
        </label>
        <textarea
          name="notes"
          defaultValue={defaultValues?.notes ?? ""}
          placeholder="Referral, comp range, anything worth remembering..."
          rows={4}
          className={inputClass + " resize-none"}
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          className="bg-foreground text-background rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-foreground/90 transition-colors"
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
