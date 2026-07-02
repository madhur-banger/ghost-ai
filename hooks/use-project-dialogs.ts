import { useState } from "react"

import { slugify, type Project } from "@/lib/mock-projects"

type DialogState =
  | { type: "create" }
  | { type: "rename"; project: Project }
  | { type: "delete"; project: Project }
  | null

export function useProjectDialogs() {
  const [dialog, setDialog] = useState<DialogState>(null)
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const openCreate = () => {
    setName("")
    setDialog({ type: "create" })
  }

  const openRename = (project: Project) => {
    setName(project.name)
    setDialog({ type: "rename", project })
  }

  const openDelete = (project: Project) => {
    setDialog({ type: "delete", project })
  }

  const close = () => {
    setDialog(null)
    setName("")
    setIsSubmitting(false)
  }

  const slug = slugify(name)

  return {
    dialog,
    name,
    setName,
    slug,
    isSubmitting,
    setIsSubmitting,
    openCreate,
    openRename,
    openDelete,
    close,
  }
}
