import { InfoCircledIcon as Info } from "@radix-ui/react-icons";

export function MDXNote({
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <aside {...props} className="relative">
      <div className="absolute -left-2 -top-2 bg-muted rounded-full">
        <Info className="h-6 w-6" />
      </div>
      <div className="pl-4">
        <b>Note: </b>
        {children}
      </div>
    </aside>
  );
}
