import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,

  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { Link } from "react-router";
import { toast } from "sonner";
import { apiFetch } from "@/lib/action";

export function SubscriptionActions({ subscription }) {
  const queryClient = useQueryClient();

  // 1. The Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => apiFetch(`/api/subscription/delete/${id}`, {
        method: "DELETE",
      }),

      
    
    onSuccess: () => {
        // Instantly refresh the table!
       
        queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      queryClient.invalidateQueries({ queryKey: ["chart"] });
        toast.success(`${subscription.name} has been successfully deleted`);
      },
      onError: () => {
        toast.error(`${subscription.name} cannot be deleted`)
    }
     
  });

  const cancelMutation = useMutation({
    mutationFn: (id) => apiFetch(`/api/subscription/cancel/${id}`, {
      method: 'PATCH'
    }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      queryClient.invalidateQueries({ queryKey: ["chart"] });
      toast.success(`${subscription.name} has been successfully cancelled`);
    },
    onError: () => {
      toast.error(`${subscription.name} cannot be cancelled`)
    }

  })

  return (
    // Wrap the ENTIRE menu inside the AlertDialog context
    <AlertDialog>
      <DropdownMenu>
        {/* The 3-dot Trigger Button */}
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            className="h-9 w-10 rounded-full border-subly-border bg-subly-card text-subly-text-primary hover:bg-subly-soft-blue hover:text-subly-brand-blue"
          >
            <MoreHorizontal size={18} />
          </Button>
        </DropdownMenuTrigger>

        {/* The Dropdown Menu Content */}
        <DropdownMenuContent
          align="end"
          className="rounded-2xl border-subly-border"
        >
          <DropdownMenuItem>View details</DropdownMenuItem>
          <Link to={`/dashboard/subscriptions/${subscription.id}/edit`}>
            <DropdownMenuItem>Edit</DropdownMenuItem>
          </Link>

          {subscription.status === 'ACTIVE'&& (
            <DropdownMenuItem className={'text-subly-danger focus:text-subly-danger focus:bg-red-50 disabled:text-gray-500'} onClick={() => cancelMutation.mutate(subscription.id)} disabled={cancelMutation.isPending} onSelect={(e) => e.preventDefault()}>{cancelMutation.isPending? 'Cancelling': 'Cancel'}</DropdownMenuItem>
          )}

          {subscription.status === 'EXPIRED'&& (
            <DropdownMenuItem className={'text-subly-danger focus:text-subly-danger focus:bg-red-50'}>Archive</DropdownMenuItem>
          )}

          {["EXPIRED", "ARCHIVED", "CANCELLED"].includes(subscription.status) && (
            <Link to={`/dashboard/subscriptions/${subscription.id}/renew`}>
              <DropdownMenuItem  onSelect={(e) => e.preventDefault()}>Renew</DropdownMenuItem>
            </Link>

          )}

          {/* THE MAGIC TRICK: AlertDialogTrigger acts as the DropdownMenuItem */}
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              className="text-subly-danger focus:text-subly-danger focus:bg-red-50"
              // CRITICAL: Stop the dropdown from instantly closing the alert modal!
              onSelect={(e) => e.preventDefault()}
            >
              Delete
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* THE CONFIRMATION MODAL */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete your{" "}
            <strong>{subscription.name}</strong> subscription. This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Show server errors if the delete fails */}
        {deleteMutation.isError && (
          <p className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
            {deleteMutation.error.message}
          </p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>
            Cancel
          </AlertDialogCancel>

          <Button
            variant="destructive"
            onClick={() => deleteMutation.mutate(subscription.id)}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <>
                <Spinner className="mr-2" /> Deleting...
              </>
            ) : (
              "Yes, delete subscription"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
