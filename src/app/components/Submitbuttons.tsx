"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Trash } from "lucide-react";
import { useFormStatus } from "react-dom";

export function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button disabled className="w-fit">
          <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Please Wait
        </Button>
      ) : (
        <Button className="w-fit" type="submit">
          Save Now
        </Button>
      )}
    </>
  );
}

export function StripeSubscriptionCreationButton() {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <Button disabled className="w-full">
          <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Please Wait
        </Button>
      ) : (
        <Button type="submit" className="w-full">
          BUY THIS PLAN
        </Button>
      )}
    </>
  );
}

export function StripePortal() {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <Button disabled className="w-full">
          <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Please Wait
        </Button>
      ) : (
        <Button className="w-full" type="submit">
          MANAGE SUBSCRIPTION
        </Button>
      )}
    </>
  );
}

export function TrashDelete() {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <Button variant={"destructive"} size="icon" disabled>
          <Loader2 className="h-4 w-4 animate-spin" />
        </Button>
      ) : (
        <Button variant={"destructive"} size="icon" type="submit">
          <Trash className="h-4 w-4" />
        </Button>
      )}
    </>
  );
}

export function SubmitSellFormbutton({ title }: { title: string }) {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <Button disabled>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please Wait
        </Button>
      ) : (
        <Button type="submit">{title}</Button>
      )}
    </>
  );
}

export function BuyButton({ price }: { price: number }) {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <Button disabled size="lg" className="w-full mt-10">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please Wait
        </Button>
      ) : (
        <Button type="submit" size="lg" className="w-full mt-10">
          Buy for ${price}
        </Button>
      )}
    </>
  );
}