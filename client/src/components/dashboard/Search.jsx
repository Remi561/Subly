import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link } from "react-router";
import { Plus } from "lucide-react";
import { useSearchParams } from "react-router";
import { useDebounce } from "use-debounce";
import { useState, useEffect } from "react";


export function Search() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [inputValue, setInputValue] = useState(searchParams.get('search') || '');
  
  const [debouncedValue] = useDebounce(inputValue, 500); // Debounce with a delay of 500ms


  useEffect(() => {
    setSearchParams(
      (preParams) => {
        if (debouncedValue) {
          preParams.set("search", debouncedValue);
        } else {
          preParams.delete("search");
        }

        preParams.set("page", 1); // reset the page

        return preParams;
      },
      {
        replace: true,
      },
    );
  }, [debouncedValue, setSearchParams])

    

    
  
    return (
      <Field orientation="horizontal">
        <Input
          className={"py-5  placeholder:text-subly-text-secondary "}
          type={"search"}
          value={inputValue}
    
          placeholder={" Search for your subscription"}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Link
          className={`flex  items-center gap-1 bg-linear-to-r from-subly-brand-blue to-subly-brand-purple hover:opacity-80 p-2 rounded-lg`}
          to={'/dashboard/subscriptions/add'}
        >
          <Plus size={10}  className="text-white"/>
          <p className="text-white">Add</p>
        </Link>
      </Field>
    );
}