import { Link } from "react-router";
import { SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-subly-background px-4">
      <div className="w-full max-w-md rounded-xl border border-subly-border bg-subly-card p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-subly-soft-blue text-subly-brand-blue">
          <SearchX size={26} />
        </div>
        <h1 className="mt-5 text-3xl font-bold text-subly-text-primary">404</h1>
        <p className="mt-2 text-sm text-subly-text-secondary">
          The page you are looking for does not exist.
        </p>
        <Button asChild className="mt-6">
          <Link to="/dashboard">Go to dashboard</Link>
        </Button>
      </div>
    </main>
  );
}
