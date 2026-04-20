"use client";

import { useRouter } from "next/navigation";
import { Application } from "@prisma/client";
import { ApplicationActions } from "@/components/ApplicationActions";
import { StatusBadge } from "@/components/ui/status-badge";

const AVATAR_COLORS = [
  "bg-violet-200 text-violet-700",
  "bg-blue-200 text-blue-700",
  "bg-emerald-200 text-emerald-700",
  "bg-orange-200 text-orange-700",
  "bg-pink-200 text-pink-700",
  "bg-teal-200 text-teal-700",
];

function avatarColor(company: string) {
  return AVATAR_COLORS[company.charCodeAt(0) % AVATAR_COLORS.length];
}

export default function ApplicationCard({
  application,
}: {
  application: Application;
}) {
  const router = useRouter();

  return (
    <li
      className="px-4 py-4 border-b border-foreground/10 last:border-b-0 hover:bg-background/60 cursor-pointer transition-colors"
      onClick={() => router.push(`/dashboard/applications/${application.id}`)}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div
          className={`size-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 mt-0.5 ${avatarColor(application.company)}`}
        >
          {application.company.charAt(0).toUpperCase()}
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold text-foreground">{application.company}</p>
              <p className="text-xs uppercase font-semibold text-foreground/40 tracking-wide mt-0.5">
                {application.role}
              </p>
            </div>

            <div
              className="flex items-center gap-2 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="hidden sm:block">
                <StatusBadge id={application.id} status={application.status} />
              </div>
              <ApplicationActions id={application.id} />
            </div>
          </div>

          {application.notes && (
            <p className="text-xs text-foreground/40 leading-relaxed line-clamp-2 pr-4">
              {application.notes}
            </p>
          )}
        </div>
      </div>
    </li>
  );
}
