import type { ReactNode } from "react"

const FEATURES = [
  "Design systems on an infinite canvas",
  "AI-generated specs from your diagrams",
  "Real-time collaboration with your team",
]

interface AuthLayoutProps {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-base">
      <div className="hidden w-1/2 flex-col justify-center border-r border-surface-border px-16 lg:flex">
        <span className="text-lg font-semibold text-copy-primary">
          Ghost AI
        </span>
        <p className="mt-2 text-sm text-copy-secondary">
          Design, generate, and ship faster.
        </p>
        <ul className="mt-10 space-y-3">
          {FEATURES.map((feature) => (
            <li key={feature} className="text-sm text-copy-muted">
              {feature}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex w-full items-center justify-center px-6 lg:w-1/2">
        {children}
      </div>
    </div>
  )
}
