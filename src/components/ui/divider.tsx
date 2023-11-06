import { FunctionComponent } from "react";
import { cn } from "@/libs/utils";

interface DividerProps {
  className?: string;
}

const Divider: FunctionComponent<DividerProps> = ({ className, ...props }) => {
  return (
    <div className="w-full">
      <hr
        aria-hidden="true"
        className={cn("border border-destructive px-4 md:px-0", className)}
        {...props}
      />
    </div>
  );
};

export { Divider };
