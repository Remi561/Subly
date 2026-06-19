import { WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error() {


  const handleRetry = () => {
    
    // perform a standard browser reload to restore network state
      window.location.reload();
  
  };

  return (
    <div className="flex min-h-[450px] w-full flex-col items-center justify-center rounded-3xl border border-dashed border-subly-border bg-subly-card p-8 text-center sm:p-12">
      {/* Decorative Wifi Off Icon */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500 mb-5 dark:bg-red-950/30">
        <WifiOff size={28} />
      </div>

      {/* Primary Message */}
      <h2 className="text-xl font-bold tracking-tight text-subly-text-primary sm:text-2xl">
        Oops! Connection is unstable
      </h2>

      {/* Secondary Context */}
      <p className="mt-2 max-w-sm text-sm text-subly-text-secondary leading-relaxed">
        We're having trouble reaching the server right now. Please check your
        internet connection or network status.
      </p>

      {/* Action CTA */}
      <Button
        onClick={handleRetry}
        className="mt-6 px-6 py-5 text-sm font-semibold rounded-xl tracking-wide shadow-sm transition-all"
      >
        Try Again
      </Button>
    </div>
  );
}
