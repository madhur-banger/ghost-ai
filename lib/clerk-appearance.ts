import { dark } from "@clerk/ui/themes"
import type { Appearance } from "@clerk/ui/internal"

export const clerkAppearance: Appearance = {
  theme: dark,
  variables: {
    colorPrimary: "var(--accent-primary)",
    colorPrimaryForeground: "var(--bg-base)",
    colorDanger: "var(--state-error)",
    colorSuccess: "var(--state-success)",
    colorWarning: "var(--state-warning)",
    colorNeutral: "var(--text-primary)",
    colorForeground: "var(--text-primary)",
    colorMuted: "var(--bg-subtle)",
    colorMutedForeground: "var(--text-muted)",
    colorBackground: "var(--bg-elevated)",
    colorInputForeground: "var(--text-primary)",
    colorInput: "var(--bg-surface)",
    colorBorder: "var(--border-default)",
    colorRing: "var(--accent-primary)",
    fontFamily: "var(--font-geist-sans)",
    fontFamilyMono: "var(--font-geist-mono)",
    borderRadius: "0.75rem",
  },
}
