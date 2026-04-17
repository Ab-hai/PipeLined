"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Application } from "@prisma/client";
import { deleteApplication } from "@/app/actions/applications";

const STATUS_COLORS: Record<string, string> = {
  BOOKMARKED: "bg-zinc-700 text-zinc-300",
  APPLIED: "bg-blue-900 text-blue-300",
  PHONE_SCREEN: "bg-yellow-900 text-yellow-300",
  INTERVIEW: "bg-purple-900 text-purple-300",
  OFFER: "bg-emerald-900 text-emerald-300",
  REJECTED: "bg-red-900 text-red-300",
};

const STATUS_LABELS: Record<string, string> = {
  BOOKMARKED: "Bookmarked",
  APPLIED: "Applied",
  PHONE_SCREEN: "Phone Screen",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
};

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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    setMenuOpen(false);
    await deleteApplication(application.id);
  }

  function handleEdit(e: React.MouseEvent) {
    e.stopPropagation();
    setMenuOpen(false);
    router.push(`/dashboard/applications/${application.id}/edit`);
  }

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

            {/* Right side: status + menu */}
            <div
              className="flex items-center gap-2 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full hidden sm:inline-flex ${STATUS_COLORS[application.status]}`}
              >
                {STATUS_LABELS[application.status]}
              </span>

              <div className="relative" ref={menuRef}>
                <button
                  className="btn btn-square btn-ghost btn-sm text-zinc-500 hover:text-white"
                  onClick={() => setMenuOpen((v) => !v)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-5"
                  >
                    <circle cx="5" cy="12" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="19" cy="12" r="2" />
                  </svg>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-10 w-36 bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl z-10 overflow-hidden">
                    <button
                      onClick={handleEdit}
                      className="w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-zinc-800 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
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
