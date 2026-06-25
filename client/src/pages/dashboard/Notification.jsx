import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Bell, Trash2 } from "lucide-react";

import { fetchWithAuth } from "@/lib/utils";

export default function NotificationPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notifications"],
    queryFn: () =>
      fetchWithAuth("/api/notification", {
        credentials: "include",
      }).then((res) => res.json()),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) =>
      fetchWithAuth(`/api/notification/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      }).then((res) => res.json()),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
  });

  if (isLoading) {
    return <div className="p-6">Loading notifications...</div>;
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500">Failed to load notifications.</div>
    );
  }

  const notifications = data?.data ?? [];

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-page-title font-bold">Notifications</h1>

        <p className="text-subly-text-secondary">
          Stay updated on subscription reminders and activity.
        </p>
      </header>

      {!notifications.length ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
            <Bell className="size-10" />

            <p className="text-subly-text-secondary">
              No notifications available.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card key={notification.id}>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle>{notification.title}</CardTitle>

                  <p className="text-sm text-subly-text-secondary mt-1">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteMutation.mutate(notification.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </CardHeader>

              <CardContent>
                <p className="text-sm">{notification.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
