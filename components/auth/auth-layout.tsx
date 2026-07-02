import { Clock, FileText, Share2 } from "lucide-react"
import type { ReactNode } from "react"

const FEATURES = [
  {
    icon: Clock,
    title: "AI Architecture Generation",
    description: "Describe your system, AI maps it to nodes and edges on a live canvas.",
  },
  {
    icon: Share2,
    title: "Real-time Collaboration",
    description: "Live cursors, presence indicators, and shared node editing across your team.",
  },
  {
    icon: FileText,
    title: "Instant Spec Generation",
    description: "Export a complete Markdown technical spec directly from the canvas graph.",
  },
]

interface AuthLayoutProps {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 flex-col justify-between bg-base px-16 py-12 lg:flex">
        <div className="flex items-center gap-2.5">
          <span className="h-8 w-8 rounded-xl bg-brand" />
          <span className="text-lg font-semibold text-copy-primary">Ghost AI</span>
        </div>

        <div className="max-w-md">
          <h1 className="text-4xl leading-tight font-bold text-copy-primary">
            Design systems at the speed of thought.
          </h1>
          <p className="mt-4 text-base text-copy-secondary">
            Describe your architecture in plain English. Ghost AI maps it to a shared
            canvas your whole team can refine in real time.
          </p>

          <ul className="mt-12 space-y-6">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-dim text-brand">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-medium text-copy-primary">{title}</p>
                  <p className="mt-0.5 text-sm text-copy-muted">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-copy-faint">
          &copy; {new Date().getFullYear()} Ghost AI. All rights reserved.
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center bg-surface px-6">
        {children}
      </div>
    </div>
  )
}
