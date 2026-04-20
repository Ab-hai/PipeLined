"use client"

import { useRouter } from "next/navigation"
import { MoreHorizontalIcon, PencilIcon, Trash2Icon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deleteApplication } from "@/app/actions/applications"

interface ApplicationActionsProps {
  id: string
}

export function ApplicationActions({ id }: ApplicationActionsProps) {
  const router = useRouter()

  async function handleDelete() {
    await deleteApplication(id)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="More options"
          onClick={(e) => e.stopPropagation()}
          className="size-8 flex items-center justify-center rounded-lg text-foreground/50 hover:text-foreground hover:bg-foreground/5 transition-colors focus:outline-none"
        >
          <MoreHorizontalIcon className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/dashboard/applications/${id}/edit`)
            }}
          >
            <PencilIcon className="size-4" />
            Edit
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-foreground/10" />
        <DropdownMenuGroup>
          <DropdownMenuItem
            variant="destructive"
            onClick={(e) => {
              e.stopPropagation()
              handleDelete()
            }}
          >
            <Trash2Icon className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
