import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ShieldCheck, Users, CreditCard, History, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import Breadcrumbs from "@/components/Breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchWithAuth, formatDate } from "@/lib/utils";

const metricCards = [
  {
    key: "users",
    label: "Total users",
    icon: Users,
    getValue: (stats) => stats?.users?.total ?? 0,
  },
  {
    key: "subscriptions",
    label: "Subscriptions",
    icon: CreditCard,
    getValue: (stats) => stats?.subscriptions?.total ?? 0,
  },
  {
    key: "history",
    label: "History records",
    icon: History,
    getValue: (stats) => stats?.history?.total ?? 0,
  },
  {
    key: "currency",
    label: "Rates updated",
    icon: RefreshCw,
    getValue: (stats) =>
      stats?.currency?.lastUpdated ? formatDate(stats.currency.lastUpdated) : "N/A",
  },
];

function AdminMetricCard({ item, stats }) {
  const Icon = item.icon;

  return (
    <Card className="rounded-xl border-subly-border bg-subly-card shadow-sm">
      <CardContent className="flex items-center gap-4 pt-2">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-subly-soft-blue text-subly-brand-blue">
          <Icon size={20} />
        </span>
        <div>
          <p className="text-sm text-subly-text-secondary">{item.label}</p>
          <p className="mt-1 text-xl font-bold text-subly-text-primary">
            {item.getValue(stats)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Admin() {
  const queryClient = useQueryClient();
  const breadCrumb = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Admin", href: "/dashboard/admin" },
  ];

  const {
    data: statsData,
    isLoading: statsLoading,
    isError: statsError,
  } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => fetchWithAuth("/api/admin/stats").then((res) => res.json()),
  });

  const {
    data: usersData,
    isLoading: usersLoading,
    isError: usersError,
  } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => fetchWithAuth("/api/admin/users").then((res) => res.json()),
  });

  const roleMutation = useMutation({
    mutationFn: async ({ userId, action }) => {
      const response = await fetchWithAuth(`/api/admin/${action}/${userId}`, {
        method: "PATCH",
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      toast.success(data?.message || "User role updated");
    },
    onError: (error) => {
      toast.error(error.message || "Unable to update user role");
    },
  });

  const stats = statsData?.stats;
  const users = usersData?.users ?? [];

  return (
    <section>
      <header className="mb-6">
        <div className="mt-1 text-subly-text-primary">
          <Breadcrumbs crumbs={breadCrumb} />
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-subly-brand-blue" size={26} />
              <h1 className="text-3xl font-bold tracking-tight text-subly-text-primary">
                Admin
              </h1>
            </div>
            <p className="mt-2 text-sm text-subly-text-secondary">
              Monitor platform activity and manage user roles.
            </p>
          </div>
          <Badge className="bg-subly-soft-blue text-subly-brand-blue">
            Admin only
          </Badge>
        </div>
      </header>

      {statsError ? (
        <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-subly-danger">
          Unable to load admin stats.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statsLoading
            ? metricCards.map((item) => (
                <Card
                  key={item.key}
                  className="h-24 animate-pulse rounded-xl border-subly-border bg-subly-card"
                />
              ))
            : metricCards.map((item) => (
                <AdminMetricCard key={item.key} item={item} stats={stats} />
              ))}
        </div>
      )}

      <Card className="mt-6 rounded-xl border-subly-border bg-subly-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-subly-text-primary">
            Users
          </CardTitle>
          <CardDescription>
            Promote users to admin or demote admins back to standard access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {usersError ? (
            <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-subly-danger">
              Unable to load users.
            </p>
          ) : usersLoading ? (
            <div className="flex min-h-40 items-center justify-center">
              <Spinner className="size-8" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Role actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const pendingUser = roleMutation.variables?.userId === user.id;

                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium text-subly-text-primary">
                        {user.name}
                      </TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={roleMutation.isPending && pendingUser}
                            onClick={() =>
                              roleMutation.mutate({
                                userId: user.id,
                                action: "promote",
                              })
                            }
                          >
                            Promote
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={roleMutation.isPending && pendingUser}
                            onClick={() =>
                              roleMutation.mutate({
                                userId: user.id,
                                action: "demote",
                              })
                            }
                          >
                            Demote
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
