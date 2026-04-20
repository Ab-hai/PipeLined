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
  BOOKMARKED: "bg-foreground/10 text-foreground/60 hover:bg-foreground/15",
  APPLIED:    "bg-blue-500/15 text-blue-400 hover:bg-blue-500/25",
  INTERVIEW:  "bg-purple-500/15 text-purple-400 hover:bg-purple-500/25",
  OFFER:      "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25",
  REJECTED:   "bg-red-500/15 text-red-400 hover:bg-red-500/25",
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
        className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full cursor-pointer transition-colors focus:outline-none ${STATUS_STYLES[status]}`}
      >
        {STATUS_LABELS[status]}
        <ChevronDownIcon className="size-3 opacity-70" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-36" onClick={(e) => e.stopPropagation()}>
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
