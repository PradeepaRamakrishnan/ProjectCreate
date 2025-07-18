import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { forwardRef } from "react";

const Collapsible = forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Root>
>(({ ...props }, ref) => (
  <CollapsiblePrimitive.Root ref={ref} {...props} />
));
Collapsible.displayName = "Collapsible";

// Fix for CollapsibleTrigger
const CollapsibleTrigger = forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Trigger>
>(({ ...props }, ref) => (
  <CollapsiblePrimitive.Trigger ref={ref} {...props} />
));
CollapsibleTrigger.displayName = "CollapsibleTrigger";

// Fix for CollapsibleContent
const CollapsibleContent = forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content>
>(({ ...props }, ref) => (
  <CollapsiblePrimitive.Content ref={ref} {...props} />
));
CollapsibleContent.displayName = "CollapsibleContent";

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
