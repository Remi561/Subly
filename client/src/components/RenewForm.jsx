import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  FieldGroup,
  FieldSet,
  FieldLabel,
  Field,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,

  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const formSchema = z.object({
  
  amount: z.coerce.number().positive("Amount must be greater than 0."),
  currency: z.string().min(1, "Please select a currency."),
  billingCycle: z.string().min(1, "Please select a duration."),

});

// 1. Accept the 'subscription' object as a prop
const RenewForm = ({ rates, isError, mutation,  subscription }) => {
  const currencyLists = Object.keys(rates || {});

  // 2. Initialize React Hook Form with the existing data
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
 
    values: {
    
      amount: (subscription?.amount)/100 || undefined,
      currency: subscription?.currency || "",
      billingCycle: subscription?.billingCycle || "", // Fixed from 'duration'
   
    },
  });

  const onSubmit = (values) => {
    // You might also want to pass the subscription ID so the backend knows which one to update
    console.log("Validated Renew Data:", values);
    mutation.mutate(values)
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {mutation.isError && (
        <p className="mb-4 text-sm text-red-500 bg-red-200 p-2 rounded-md">
          {mutation.error.message}
        </p>
      )}
      <FieldSet>
        <FieldGroup>
          {/* --- NAME INPUT --- */}
          <Field>
            <FieldLabel htmlFor="name">Subscription Name</FieldLabel>
            <Input
              id="name"
                placeholder="e.g. Netflix"
                 defaultValue={subscription.name}  
              className="py-5 capitalize"
              disabled
            />
            
          </Field>

          <div className="flex flex-col md:flex-row items-center gap-2">
            {/* --- AMOUNT INPUT --- */}
            <Field className="w-full md:w-1/2 ">
              <FieldLabel htmlFor="amount">Amount</FieldLabel>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="e.g. 9.99"
                className="py-5"
                {...register("amount")}
              />
              {errors.amount && (
                <FieldError>{errors.amount.message}</FieldError>
              )}
            </Field>

            {/* --- CURRENCY SELECT --- */}
            <Field className="w-full md:w-1/2">
              <FieldLabel htmlFor="currency">Currency</FieldLabel>
              <Controller
                name="currency"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="py-5">
                      <SelectValue placeholder="Select a currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {currencyLists.map((list) => (
                          <SelectItem key={list} value={list}>
                            {list}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.currency && (
                <FieldError>{errors.currency.message}</FieldError>
              )}
              {isError && (
                <FieldError>
                  Something went wrong while fetching currencies
                </FieldError>
              )}
            </Field>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-2">
            {/* --- DURATION SELECT --- */}
            <Field className="w-full md:w-1/2">
              <FieldLabel htmlFor="billingCycle">Duration</FieldLabel>
              <Controller
                name="billingCycle"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="py-5">
                      <SelectValue placeholder="Duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="MONTHLY">MONTHLY</SelectItem>
                        <SelectItem value="WEEKLY">WEEKLY</SelectItem>
                        <SelectItem value="YEARLY">YEARLY</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.billingCycle && (
                <FieldError>{errors.billingCycle.message}</FieldError>
              )}
            </Field>

            {/* --- CATEGORY SELECT --- */}
            <Field className="w-full md:w-1/2">
              <FieldLabel htmlFor="category">Category</FieldLabel>
                <Input name='category' id='category' defaultValue={subscription.category}  disabled/>
            </Field>
          </div>
        </FieldGroup>
      </FieldSet>

      {/* Changed button text to indicate an update */}
      <Button
        type="submit"
        disabled={mutation.isPending || isSubmitting}
        className="mt-4 py-5 flex justify-self-end bg-subly-brand-blue"
      >
        {mutation.isPending ? (
          <>
            <Spinner className={"mr-1"} /> Renewing ...
          </>
        ) : (
          "Renew"
        )}
      </Button>
    </form>
  );
};

export default RenewForm;
