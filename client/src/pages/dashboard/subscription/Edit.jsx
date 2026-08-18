import Breadcrumbs from "@/components/Breadcrumb"
import { useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import EditForm from "@/components/dashboard/EditForm";
import { useNavigate } from "react-router";
import { Spinner } from "@/components/ui/spinner";
import { apiFetch } from "@/lib/action";

export default function Edit() {
    const { id } = useParams()
    const queryClient = useQueryClient()
    const navigate = useNavigate()


    const breadCrumb = [
      { name: "Dashboard", href: "/dashboard" },
        { name: "Subscriptions", href: "/dashboard/subscriptions" },
      {name: "Edit", href: `/dashboard/subscriptions/${id}/edit`}
    ];
    
    const {data: subscription, isLoading  } = useQuery({
        queryKey: ['subscriptions', "edit",{id}],
        queryFn: ()=> apiFetch(`/api/subscription/${id}`)
    })

    const { data:rateDb, isError } = useQuery({
      queryKey: ["rates"],
      queryFn: () => apiFetch("/api/rate"),

      staleTime: 24 * 60 * 60 * 1000, //1 day
      gcTime: 1000 * 60 * 60 * 24,
    });

    const mutation = useMutation({
      mutationFn: async (editSub) =>  await apiFetch(`/api/subscription/edit/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(editSub),
        }),
        

      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
        queryClient.invalidateQueries({ queryKey: ["history"] });
        queryClient.invalidateQueries({ queryKey: ["subscriptions", "info"] });
        navigate("/dashboard/subscriptions");
      },
    });
    console.log()
    return (
      <section>
        <header className="mb-6">
          <div className="mt-1 text-subly-text-primary">
            <Breadcrumbs crumbs={breadCrumb} />
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-subly-text-primary">
            Edit Subscription
          </h1>

          {isLoading ? (
            <div className="flex items-center justify-center h-[100vh-200px]">
              <Spinner className={"size-8"} />
            </div>
          ) : (
            <EditForm
              rates={rateDb?.rates ?? null}
              isError={isError}
              mutation={mutation}
              subscription={subscription.data}
            />
          )}
        </header>
      </section>
    );
}