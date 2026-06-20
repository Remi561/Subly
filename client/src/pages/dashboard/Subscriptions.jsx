import { SubscriptionResponsiveTable } from "@/components/dashboard/SubsTable"
import { Search } from "@/components/dashboard/Search";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/utils";
import { useRouteLoaderData, useSearchParams } from "react-router";
import Breadcrumbs from "@/components/Breadcrumb";
import { SubscriptionTableSkeleton } from "@/components/dashboard/Skeleton";
import PaginationList from "@/components/dashboard/Pagination";


const Subscriptions = () => {
  const[searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const page = searchParams.get("page") || 1;
  const userData = useRouteLoaderData("dashboard");
  const handlePageChange = (newPage) => {
    // Update the "page" parameter inside our search params object
    searchParams.set("page", newPage);

    // Push the updated parameters back into the browser's address bar
    setSearchParams(searchParams);
  };
  console.log("User data in Subscriptions:", userData);

  const { data, isLoading } = useQuery({
    // 1. The query key automatically tracks changes to search or page
    queryKey: ["subscriptions", { search: searchQuery, page }],

    // 2. The query function is properly wrapped in an arrow function
    // (Also added encodeURIComponent to safely handle spaces/special characters in search)
    queryFn: () =>
      fetchWithAuth(
        `/api/subscription/paginated?search=${encodeURIComponent(searchQuery)}&page=${page}`,
      ).then((res) => res.json()),

    // 3. Pro-Tip: This stops the table from flashing "Loading..."
    // every time they click 'Next Page' or type a letter.
    placeholderData: keepPreviousData,
  });

 
  const breadCrumb = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Subscriptions", href: "/dashboard/subscriptions" },
  ];
  return (
    <section>
      <header className="mb-6">
        <div className="mt-1 text-subly-text-primary">
          <Breadcrumbs crumbs={breadCrumb} />
        </div>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-subly-text-primary">
          Manage Subscription
        </h1>

        <p className="mt-2 text-sm text-subly-text-secondary">
          Track active plans, upcoming renewals, archived subscriptions, and
          payments.
        </p>
      </header>
      <Search />
      {isLoading ? (
        <SubscriptionTableSkeleton/>
      ) : (
        <SubscriptionResponsiveTable
          data={data}
          baseCurrency={userData?.user?.baseCurrency}
        />
      )}
      <div className="mt-2">
        <PaginationList currentPage={data?.pagination?.currentPage} totalPages={data?.pagination?.totalPages} onPageChange={handlePageChange}/>
      </div>
    </section>
  );
}

export default Subscriptions