"use client"

import { useState } from "react"
import { ChevronDownIcon, CheckIcon } from "lucide-react"
import { ApplicationStatus } from "@prisma/client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { updateApplicationStatus } from "@/app/actions/applications"

const STATUS_STYLES: Record<string, string> = {
  BOOKMARKED: "bg-zinc-700 text-zinc-300 hover:bg-zinc-600",
  APPLIED:    "bg-blue-900 text-blue-300 hover:bg-blue-800",
  INTERVIEW:  "bg-purple-900 text-purple-300 hover:bg-purple-800",
  OFFER:      "bg-emerald-900 text-emerald-300 hover:bg-emerald-800",
  REJECTED:   "bg-red-900 text-red-300 hover:bg-red-800",
}

const STATUS_LABELS: Record<string, string> = {
  BOOKMARKED: "Bookmarked",
  APPLIED:    "Applied",
  INTERVIEW:  "Interview",
  OFFER:      "Offer",
  REJECTED:   "Rejected",
}

interface StatusBadgeProps {
  id: string
  status: ApplicationStatus
}

export function StatusBadge({ id, status: initialStatus }: StatusBadgeProps) {
  const [status, setStatus] = useState<ApplicationStatus>(initialStatus)

  async function handleSelect(newStatus: ApplicationStatus) {
    setStatus(newStatus)
    await updateApplicationStatus(id, newStatus)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        onClick={(e) => e.stopPropagation()}
        className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full cursor-pointer transition-colors focus:outline-none focus:ring-1 focus:ring-zinc-500 ${STATUS_STYLES[status]}`}
      >
        {STATUS_LABELS[status]}
        <ChevronDownIcon className="size-3 opacity-70" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-36"
        onClick={(e) => e.stopPropagation()}
      >
        <DropdownMenuGroup>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <DropdownMenuItem
              key={value}
              onClick={() => handleSelect(value as ApplicationStatus)}
              className="justify-between"
            >
              {label}
              {status === value && <CheckIcon className="size-3.5 opacity-60" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
