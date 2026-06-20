import { Link } from "react-router"; // or "react-router"
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Bell, Landmark } from "lucide-react";
import SublyLogo from "./components/SublyLogo";

export default function App() {
  return (
    <div className="min-h-screen bg-subly-background text-subly-text-primary selection:bg-subly-brand-blue/20">
      {/* --- MINIMAL HEADER / NAV --- */}
      <header className="mx-auto max-w-7xl px-6 py-6 flex items-center justify-between">
        <SublyLogo />
        <div className="flex items-center gap-4">
          <Link
            to="/auth/login"
            className="text-sm font-medium text-subly-text-secondary hover:text-subly-text-primary transition-colors"
          >
            Sign In
          </Link>
          <Button
            asChild
            className="rounded-xl px-4 py-2 bg-subly-brand-blue text-white hover:bg-subly-brand-blue/90"
          >
            <Link to="/auth/register">Get Started</Link>
          </Button>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="mx-auto max-w-4xl px-6 pt-16 pb-20 text-center sm:pt-24 sm:pb-28">
        {/* Small Tagline */}
        <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-subly-brand-blue dark:bg-blue-950/40">
          Smart Subscription Management
        </span>

        {/* Main Value Proposition Title */}
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-subly-text-primary sm:text-6xl leading-tight">
          Take control of your <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
            digital subscriptions
          </span>
        </h1>

        {/* Clear App Explanation */}
        <p className="mx-auto mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-subly-text-secondary">
          Stop leaking money on forgotten renewals. Subly tracks all your
          streaming tools, SaaS packages, and utilities in one place—complete
          with automatic currency conversion and spending analytics.
        </p>

        {/* Call to Actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto rounded-xl px-8 py-6 text-base font-semibold bg-blue-500 text-white hover:bg-blue-600 shadow-md shadow-blue-500/10 group"
          >
            <Link
              to="/auth/register"
              className="flex items-center justify-center gap-2"
            >
              Start Tracking Free
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="w-full sm:w-auto rounded-xl px-8 py-6 text-base font-semibold border-subly-border bg-subly-card text-subly-text-primary hover:bg-subly-background"
          >
            <Link to="/dashboard">Access Dashboard</Link>
          </Button>
        </div>
      </section>

      <hr className="border-subly-border max-w-5xl mx-auto opacity-60" />

      {/* --- QUICK FEATURE HIGHLIGHTS --- */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          {/* Feature 1 */}
          <div className="flex flex-col items-center text-center p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-500 dark:bg-blue-950/30">
              <Landmark size={22} />
            </div>
            <h3 className="mt-4 text-lg font-bold text-subly-text-primary">
              Multi-Currency Support
            </h3>
            <p className="mt-2 text-sm text-subly-text-secondary leading-relaxed">
              Paying for international tools in USD or EUR? Subly fetches live
              conversion rates to show exactly what you're spending in your
              local base currency.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center text-center p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500 dark:bg-indigo-950/30">
              <BarChart3 size={22} />
            </div>
            <h3 className="mt-4 text-lg font-bold text-subly-text-primary">
              Monthly Analytics
            </h3>
            <p className="mt-2 text-sm text-subly-text-secondary leading-relaxed">
              Visualize your cash outflows through dynamic charts and breakdowns
              by category, allowing you to easily identify unnecessary
              subscriptions.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center text-center p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-500 dark:bg-purple-950/30">
              <Bell size={22} />
            </div>
            <h3 className="mt-4 text-lg font-bold text-subly-text-primary">
              Renewal Reminders
            </h3>
            <p className="mt-2 text-sm text-subly-text-secondary leading-relaxed">
              See a clean chronological record of your billing history and
              incoming deadlines so you never get hit with an unexpected charges
              again.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
