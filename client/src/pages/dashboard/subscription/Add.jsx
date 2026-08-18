import Breadcrumbs from "@/components/Breadcrumb"
import AddForm from "@/components/dashboard/AddForm";
import { apiFetch } from "@/lib/action";

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
    queryFn: () => apiFetch('/api/rate'),
    
    staleTime: 24 * 60 * 60 * 1000, //1 day
    gcTime: 1000 * 60*60*24,
  })
  
  const mutation = useMutation({
    mutationFn: (newSub) => 
      apiFetch('/api/subscription/add', {
        method: "POST",
        headers: {
          'Content-Type': "application/json"
        }, 
        body: JSON.stringify(newSub)
    }),
    
      

      
   

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ["subscriptions", "info"] });
      queryClient.invalidateQueries({queryKey: ['history']})
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