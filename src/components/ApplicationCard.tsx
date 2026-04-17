"use client";

import { useRouter } from "next/navigation";
import { Application } from "@prisma/client";
import { ApplicationActions } from "@/components/ApplicationActions";
import { StatusBadge } from "@/components/StatusBadge";


const AVATAR_COLORS = [
  "bg-violet-800",
  "bg-blue-800",
  "bg-emerald-800",
  "bg-orange-800",
  "bg-pink-800",
  "bg-teal-800",
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
      className="px-4 py-4 border-b border-zinc-800 last:border-b-0 hover:bg-zinc-800/50 cursor-pointer transition-colors"
      onClick={() => router.push(`/dashboard/applications/${application.id}`)}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div
          className={`size-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0 mt-0.5 ${avatarColor(application.company)}`}
        >
          {application.company.charAt(0).toUpperCase()}
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-start justify-between gap-4">
            {/* Name + role */}
            <div>
              <p className="font-semibold text-white">{application.company}</p>
              <p className="text-xs uppercase font-semibold text-zinc-500 tracking-wide mt-0.5">
                {application.role}
              </p>
            </div>

            {/* Right side: status dropdown + menu */}
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

          {/* Notes */}
          {application.notes && (
            <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2 pr-4">
              {application.notes}
            </p>
          )}
        </div>
      </div>
    </li>
  );
}
