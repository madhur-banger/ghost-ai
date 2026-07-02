export interface Project {
  id: string
  name: string
  slug: string
  isOwner: boolean
}

export const MOCK_OWNED_PROJECTS: Project[] = [
  { id: "1", name: "Checkout Redesign", slug: "checkout-redesign", isOwner: true },
  { id: "2", name: "Payments Service", slug: "payments-service", isOwner: true },
]

export const MOCK_SHARED_PROJECTS: Project[] = [
  { id: "3", name: "Notification Pipeline", slug: "notification-pipeline", isOwner: false },
]

export function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
