
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
  SelectScrollDownButton,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Spinner } from "../ui/spinner";


const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),

  amount: z.coerce.number().positive("Amount must be greater than 0."),
  currency: z.string().min(1, "Please select a currency."),
  billingCycle: z.string().min(1, "Please select a duration."),
  category: z.string().min(1, "Please select a category."),
});

const AddForm = ({ rates, isError, mutation }) => {
  
  const currencyLists = Object.keys(rates || {});

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      amount: undefined,
      currency: "",
      billingCycle: "",
      category: "",
    },
  });

  
  const onSubmit = (values) => {
    console.log("Validated Data ready for TanStack Mutation:", values);

    mutation.mutate(values);
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
              className="py-5"
              {...register("name")}
            />
            {errors.name && <FieldError>{errors.name.message}</FieldError>}
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
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="py-5">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="ENTERTAINMENT">
                          Entertainment
                        </SelectItem>
                        <SelectItem value="PRODUCTIVITY">
                          Productivity
                        </SelectItem>
                        <SelectItem value="AI_TOOLS">Ai Tools</SelectItem>
                        <SelectItem value="STORAGE">Storage</SelectItem>
                      </SelectGroup>
                      <SelectScrollDownButton />
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && (
                <FieldError>{errors.category.message}</FieldError>
              )}
            </Field>
          </div>
        </FieldGroup>
      </FieldSet>

      <Button
        type="submit"
        disabled={mutation.isPending || isSubmitting}
        className="mt-4 py-5 flex justify-self-end"
      >
        {mutation.isPending ? (
          <>
            <Spinner className={"mr-1"} /> submitting
          </>
        ) : (
          "submit"
        )}
      </Button>
    </form>
  );
};

export default AddForm;
