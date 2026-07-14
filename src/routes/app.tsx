import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/app/app-shell";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "NoTo · Library" },
      { name: "description", content: "Your captured sessions, transcripts, and action items." },
    ],
  }),
  component: () => (
    <AppShell>
      <Outlet />
    </AppShell>
  ),
});
