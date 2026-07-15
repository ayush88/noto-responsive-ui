import { useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Variant = React.ComponentProps<typeof Button>["variant"];
type Size = React.ComponentProps<typeof Button>["size"];

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> & {
  children: ReactNode;
  pendingLabel?: string;
  successLabel?: string;
  toastMessage?: string;
  onAction: () => Promise<unknown> | unknown;
  variant?: Variant;
  size?: Size;
  simulateMs?: number;
  showCheck?: boolean;
};

export function PendingButton({
  children,
  pendingLabel,
  successLabel,
  toastMessage,
  onAction,
  variant,
  size,
  simulateMs = 700,
  showCheck = true,
  className,
  disabled,
  ...rest
}: Props) {
  const [state, setState] = useState<"idle" | "pending" | "done">("idle");

  const handle = async () => {
    if (state !== "idle") return;
    setState("pending");
    try {
      await Promise.all([
        Promise.resolve(onAction()),
        new Promise((r) => setTimeout(r, simulateMs)),
      ]);
      setState("done");
      if (toastMessage) toast.success(toastMessage);
      setTimeout(() => setState("idle"), 1400);
    } catch {
      setState("idle");
      toast.error("Something went wrong. Try again.");
    }
  };

  const label =
    state === "pending" && pendingLabel
      ? pendingLabel
      : state === "done" && successLabel
        ? successLabel
        : children;

  return (
    <Button
      {...rest}
      variant={variant}
      size={size}
      onClick={handle}
      disabled={disabled || state !== "idle"}
      className={cn(
        "relative overflow-hidden inline-flex items-center justify-center gap-2 leading-none transition-transform active:scale-[0.98] [&_svg]:size-4 [&_svg]:shrink-0",
        className,
      )}
    >
      {state === "pending" ? (
        <Loader2 className="animate-spin" aria-hidden />
      ) : state === "done" && showCheck ? (
        <Check aria-hidden />
      ) : null}
      {label}
      {state === "done" && (
        <span className="absolute bottom-0 left-0 h-[2px] w-full bg-accent animate-accent-sweep" />
      )}
    </Button>
  );
}
