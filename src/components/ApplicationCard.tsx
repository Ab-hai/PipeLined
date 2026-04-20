"use client";

import { useRouter } from "next/navigation";
import { Application } from "@prisma/client";
import { ApplicationActions } from "@/components/ApplicationActions";
import { StatusBadge } from "@/components/ui/status-badge";
import { Building2, ExternalLink, CalendarIcon } from "lucide-react";

export default function ApplicationCard({
  application,
}: {
  application: Application;
}) {
  const router = useRouter();
  const aiScore = (application.aiScore as { score?: number } | null)?.score ?? null;

  const formattedDate = new Date(application.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <li
      className="px-5 py-4 border-b border-foreground/[0.07] last:border-b-0 hover:bg-white/[0.02] cursor-pointer transition-colors group"
      onClick={() => router.push(`/dashboard/applications/${application.id}`)}
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
          <Building2 className="size-4 text-foreground/40" />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="font-semibold text-foreground group-hover:text-foreground/80 transition-colors truncate">
              {application.role}
            </p>
            {application.jobUrl && (
              <a
                href={application.jobUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-foreground/30 hover:text-foreground/70 transition-colors shrink-0"
              >
                <ExternalLink className="size-3" />
              </a>
            )}
          </div>
          <p className="text-xs text-foreground/40 mt-0.5">{application.company}</p>
        </div>

        {/* Right side */}
        <div
          className="flex items-center gap-5 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          {aiScore !== null && (
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-foreground">{aiScore}%</p>
              <p className="text-xs text-foreground/40">AI Score</p>
            </div>
          )}

          <div className="hidden md:flex items-center gap-1 text-xs text-foreground/40">
            <CalendarIcon className="size-3" />
            {formattedDate}
          </div>

          <div className="hidden sm:block">
            <StatusBadge id={application.id} status={application.status} />
          </div>

          <ApplicationActions id={application.id} />
        </div>
      </div>
    </li>
  );
}
