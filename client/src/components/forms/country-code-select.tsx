/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ControllerRenderProps } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { COUNTRY_CODES } from "../../config/country-codes";

interface CountryCodeSelectProps {
  field: ControllerRenderProps<any, any>;
  className?: string;
}

const CountryCodeSelect = ({ field, className }: CountryCodeSelectProps) => {
  return (
    <Select
      onValueChange={field.onChange}
      defaultValue={field.value || "+91"} // Default to India
    >
      <SelectTrigger className="text-sm">
        <SelectValue placeholder="Code" />
      </SelectTrigger>
      <SelectContent className="max-h-[300px] overflow-y-auto">
        {COUNTRY_CODES.map((country) => (
          <SelectItem
            key={country.code}
            value={country.dialCode}
            className="flex items-center space-x-2"
          >
            <span className="text-xl mr-2">{country.flag}</span>
            <span>{country.dialCode}</span>
            <span className="text-muted-foreground text-xs ml-2">
              {country.name}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CountryCodeSelect;
