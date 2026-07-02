"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { ProjectDialogs } from "@/components/editor/project-dialogs"
import { Button } from "@/components/ui/button"
import { useProjectDialogs } from "@/hooks/use-project-dialogs"
import {
  MOCK_OWNED_PROJECTS,
  MOCK_SHARED_PROJECTS,
  slugify,
  type Project,
} from "@/lib/mock-projects"

export default function EditorPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [ownedProjects, setOwnedProjects] = useState(MOCK_OWNED_PROJECTS)
  const [sharedProjects] = useState(MOCK_SHARED_PROJECTS)

  const dialogs = useProjectDialogs()

  const handleCreate = (name: string) => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      name,
      slug: slugify(name),
      isOwner: true,
    }
    setOwnedProjects((projects) => [...projects, newProject])
    dialogs.close()
  }

  const handleRename = (projectId: string, name: string) => {
    setOwnedProjects((projects) =>
      projects.map((project) =>
        project.id === projectId
          ? { ...project, name, slug: slugify(name) }
          : project
      )
    )
    dialogs.close()
  }

  const handleDelete = (projectId: string) => {
    setOwnedProjects((projects) =>
      projects.filter((project) => project.id !== projectId)
    )
    dialogs.close()
  }

  return (
    <div className="flex h-screen flex-col bg-base">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
      />
      <div className="relative flex-1 overflow-hidden">
        <ProjectSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          ownedProjects={ownedProjects}
          sharedProjects={sharedProjects}
          onCreateProject={dialogs.openCreate}
          onRenameProject={dialogs.openRename}
          onDeleteProject={dialogs.openDelete}
        />

        <div className="flex h-full flex-col items-center justify-center gap-4 px-4 text-center">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-lg font-medium text-copy-primary">
              Create a project or open an existing one
            </h1>
            <p className="text-sm text-copy-muted">
              Start a new architecture workspace, or choose a project from
              the sidebar.
            </p>
          </div>
          <Button onClick={dialogs.openCreate}>
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      <ProjectDialogs
        state={dialogs}
        onCreate={handleCreate}
        onRename={handleRename}
        onDelete={handleDelete}
      />
    </div>
  )
}
