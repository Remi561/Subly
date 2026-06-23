import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { CirclePlus, Pencil, RefreshCcw } from "lucide-react";
import { useSearchParams } from "react-router";
import { useDebounce } from "use-debounce";
import { useEffect, useState } from "react";

import Breadcrumbs from "@/components/Breadcrumb";
import PaginationList from "@/components/dashboard/Pagination";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchWithAuth, formatCategory, formatDate, formatMoney } from "@/lib/utils";

const historyTypeConfig = {
  CREATED: {
    label: "Created",
    icon: CirclePlus,
    className: "border-green-100 bg-green-50 text-subly-success",
  },
  EDITED: {
    label: "Edited",
    icon: Pencil,
    className: "border-blue-100 bg-blue-50 text-subly-brand-blue",
  },
  RENEWED: {
    label: "Renewed",
    icon: RefreshCcw,
    className: "border-amber-100 bg-amber-50 text-subly-warning",
  },
};

function HistoryTypeBadge({ type }) {
  const config = historyTypeConfig[type] || historyTypeConfig.CREATED;
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={config.className}>
      <Icon size={12} />
      {config.label}
    </Badge>
  );
}

export default function History() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const type = searchParams.get("type") || "ALL";
  const range = searchParams.get("range") || "ALL";
  const page = Number(searchParams.get("page") || 1);
  const [inputValue, setInputValue] = useState(searchQuery);
  const [debouncedValue] = useDebounce(inputValue, 500);

  useEffect(() => {
    setSearchParams(
      (prevParams) => {
        if (debouncedValue) {
          prevParams.set("search", debouncedValue);
        } else {
          prevParams.delete("search");
        }
        prevParams.set("page", 1);
        return prevParams;
      },
      { replace: true },
    );
  }, [debouncedValue, setSearchParams]);

  const updateFilter = (key, value) => {
    setSearchParams((prevParams) => {
      if (value === "ALL") {
        prevParams.delete(key);
      } else {
        prevParams.set(key, value);
      }
      prevParams.set("page", 1);
      return prevParams;
    });
  };

  const handlePageChange = (newPage) => {
    setSearchParams((prevParams) => {
      prevParams.set("page", newPage);
      return prevParams;
    });
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["history", { search: searchQuery, type, range, page }],
    queryFn: () => {
      const params = new URLSearchParams();

      if (searchQuery) params.set("search", searchQuery);
      if (type !== "ALL") params.set("type", type);
      if (range !== "ALL") params.set("range", range);
      params.set("page", page);

      return fetchWithAuth(`/api/history?${params.toString()}`).then((res) =>
        res.json(),
      );
    },
    placeholderData: keepPreviousData,
  });

  const breadCrumb = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "History", href: "/dashboard/history" },
  ];

  return (
    <section>
      <header className="mb-6">
        <div className="mt-1 text-subly-text-primary">
          <Breadcrumbs crumbs={breadCrumb} />
        </div>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-subly-text-primary">
          History
        </h1>
        <p className="mt-2 text-sm text-subly-text-secondary">
          Review subscription creations, edits, and renewals.
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
        <Input
          className="py-5 placeholder:text-subly-text-secondary"
          type="search"
          value={inputValue}
          placeholder="Search subscription history"
          onChange={(event) => setInputValue(event.target.value)}
        />

        <Select value={type} onValueChange={(value) => updateFilter("type", value)}>
          <SelectTrigger className="h-10 w-full">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="ALL">All types</SelectItem>
              <SelectItem value="CREATED">Created</SelectItem>
              <SelectItem value="EDITED">Edited</SelectItem>
              <SelectItem value="RENEWED">Renewed</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={range}
          onValueChange={(value) => updateFilter("range", value)}
        >
          <SelectTrigger className="h-10 w-full">
            <SelectValue placeholder="Date range" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="ALL">All time</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Card className="mt-6 rounded-xl border-subly-border bg-subly-card shadow-sm">
        <CardContent>
          {isLoading ? (
            <div className="flex min-h-60 items-center justify-center">
              <Spinner className="size-8" />
            </div>
          ) : isError ? (
            <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-subly-danger">
              {error.message || "Unable to load history."}
            </p>
          ) : data?.history?.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subscription</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Settled</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.history.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={item.subscriptionLogoUrl}
                          alt=""
                          className="h-9 w-9 rounded-xl border border-subly-border object-cover"
                        />
                        <span className="font-medium capitalize text-subly-text-primary">
                          {item.subscriptionName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <HistoryTypeBadge type={item.type} />
                    </TableCell>
                    <TableCell>{formatCategory(item.category)}</TableCell>
                    <TableCell>{formatMoney(item.paidAmount, item.paidCurrency)}</TableCell>
                    <TableCell>
                      {formatMoney(item.settledAmount, item.baseCurrency)}
                    </TableCell>
                    <TableCell>{formatDate(item.paidAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex min-h-60 items-center justify-center rounded-xl border border-dashed border-subly-border text-sm text-subly-text-secondary">
              No history found.
            </div>
          )}
        </CardContent>
      </Card>

      <PaginationList
        currentPage={data?.meta?.currentPage || page}
        totalPages={data?.meta?.totalPages || 1}
        onPageChange={handlePageChange}
      />
    </section>
  );
}
