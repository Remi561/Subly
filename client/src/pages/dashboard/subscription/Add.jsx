import Breadcrumbs from "@/components/Breadcrumb"
import AddForm from "@/components/dashboard/AddForm";
import { fetchWithAuth } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";


export default function Add() {
  const queryClient = useQueryClient();
  const navigate = useNavigate()

    const breadCrumb = [
      { name: "Dashboard", href: "/dashboard" },
        { name: "Subscriptions", href: "/dashboard/subscriptions" },
      {name: "Add", href:"/dashboard/subscriptions/add"}
    ];
  const { data, isError } = useQuery({
    queryKey: ['rates'],
    queryFn: () => 
      fetchWithAuth('/api/rate').then(res => res.json()),
    
    staleTime: 24 * 60 * 60 * 1000, //1 day
    gcTime: 1000 * 60*60*24,
  })
  
  const mutation = useMutation({
    mutationFn: async (newSub) => {
      const response = await fetchWithAuth('/api/subscription/add', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSub)
      })
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message)
      }
      

      
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ["subscriptions", "info"] });
      queryClient.invalidateQueries({queryKey: ["chart"]})
      navigate('/dashboard/subscriptions')
    }
  })
    return (
      <section className="">
        <header className="mb-6">
          <div className="mt-1 text-subly-text-primary">
            <Breadcrumbs crumbs={breadCrumb} />
          </div>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-subly-text-primary">
            Add Subscription
          </h1>

          <p className="text-sm text-subly-text-secondary">
            Add your subscription to track and manage
          </p>
        </header>

        <AddForm
          rates={data?.rates ?? {}}
          isError={isError}
          mutation={mutation}
        />
      </section>
    );
}