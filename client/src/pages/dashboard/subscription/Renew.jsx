import Breadcrumbs from "@/components/Breadcrumb"
import { useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { Spinner } from "@/components/ui/spinner";
import { apiFetch } from "@/lib/action";
import RenewForm from "@/components/RenewForm";

export default function Renew() {
    const { id } = useParams()
    const queryClient = useQueryClient()
    const navigate = useNavigate()


    const breadCrumb = [
      { name: "Dashboard", href: "/dashboard" },
        { name: "Subscriptions", href: "/dashboard/subscriptions" },
      {name: "Renew", href: `/dashboard/subscriptions/${id}/renew`}
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
      mutationFn: (renewSub) => 
        apiFetch(`/api/subscription/${id}/renew`, {
          method: "PATCH",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(renewSub)
        }),
        

      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
        queryClient.invalidateQueries({ queryKey: ["history"] });
        queryClient.invalidateQueries({ queryKey: ["subscriptions", "info"] });
        navigate("/dashboard/subscriptions");
      },
    });
    
    
    return (
      <section>
        <header className="mb-6">
          <div className="mt-1 text-subly-text-primary">
            <Breadcrumbs crumbs={breadCrumb} />
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-subly-text-primary">
            Renew Subscription
          </h1>

          {isLoading ? (
            <div className="flex items-center justify-center h-[100vh-200px]">
              <Spinner className={"size-8"} />
            </div>
          ) : (
            <RenewForm
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