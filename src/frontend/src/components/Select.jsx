import * as Select from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";

export default function CustomSelect({
  value,
  onChange,
  placeholder,
  options,
  error,
}) {
  return (
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger
        className={`
          w-full h-[52px] px-4 pr-4
          border-2 rounded-lg bg-white
          flex items-center justify-between
          focus:outline-none focus:border-[#7e7bf1]
          ${error ? "border-red-400" : "border-gray-300"}
        `}
      >
        <Select.Value placeholder={placeholder} />
        <Select.Icon className="ml-4">
          <ChevronDown size={20} />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          side="bottom"
          align="start"
          sideOffset={8}
          className="
    bg-white rounded-xl shadow-lg
    border border-gray-200
    max-h-60
    z-50
    w-(--radix-select-trigger-width)
  "
        >
          <Select.Viewport className="p-2 max-h-60 overflow-y-auto scrollbar">
            {options.map((opt) => (
              <Select.Item
                key={opt.value}
                value={opt.value}
                className="
                  px-4 py-2 rounded-md cursor-pointer
                  outline-none
                  data-highlighted:bg-gray-100
                "
              >
                <Select.ItemText>{opt.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
