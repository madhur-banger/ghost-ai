"use client"

import { useEffect, useRef } from "react"

import { EditorDialog } from "@/components/editor/editor-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { useProjectDialogs } from "@/hooks/use-project-dialogs"

interface ProjectDialogsProps {
  state: ReturnType<typeof useProjectDialogs>
  onCreate: (name: string) => void
  onRename: (projectId: string, name: string) => void
  onDelete: (projectId: string) => void
}

export function ProjectDialogs({
  state,
  onCreate,
  onRename,
  onDelete,
}: ProjectDialogsProps) {
  const { dialog, name, setName, slug, isSubmitting, close } = state

  return (
    <>
      <EditorDialog
        open={dialog?.type === "create"}
        onOpenChange={(open) => !open && close()}
        title="Create Project"
        description="Name your new architecture workspace."
        footer={
          <Button
            disabled={!name.trim() || isSubmitting}
            onClick={() => onCreate(name.trim())}
          >
            Create
          </Button>
        }
      >
        <CreateProjectForm name={name} setName={setName} slug={slug} />
      </EditorDialog>

      {dialog?.type === "rename" && (
        <EditorDialog
          open
          onOpenChange={(open) => !open && close()}
          title="Rename Project"
          description={`Renaming "${dialog.project.name}"`}
          footer={
            <Button
              disabled={!name.trim() || isSubmitting}
              onClick={() => onRename(dialog.project.id, name.trim())}
            >
              Save
            </Button>
          }
        >
          <RenameProjectForm
            name={name}
            setName={setName}
            onSubmit={() => {
              if (name.trim()) onRename(dialog.project.id, name.trim())
            }}
          />
        </EditorDialog>
      )}

      {dialog?.type === "delete" && (
        <EditorDialog
          open
          onOpenChange={(open) => !open && close()}
          title="Delete Project"
          description={`This will permanently delete "${dialog.project.name}". This action cannot be undone.`}
          footer={
            <Button
              variant="destructive"
              disabled={isSubmitting}
              onClick={() => onDelete(dialog.project.id)}
            >
              Delete
            </Button>
          }
        />
      )}
    </>
  )
}

function CreateProjectForm({
  name,
  setName,
  slug,
}: {
  name: string
  setName: (value: string) => void
  slug: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="project-name">Project name</Label>
      <Input
        id="project-name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="My Architecture Project"
        autoFocus
      />
      <p className="text-xs text-copy-muted">
        {slug ? `Slug: ${slug}` : "Slug will appear as you type"}
      </p>
    </div>
  )
}

function RenameProjectForm({
  name,
  setName,
  onSubmit,
}: {
  name: string
  setName: (value: string) => void
  onSubmit: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [])

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="project-rename">Project name</Label>
      <Input
        id="project-rename"
        ref={inputRef}
        value={name}
        onChange={(event) => setName(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") onSubmit()
        }}
      />
    </div>
  )
}
