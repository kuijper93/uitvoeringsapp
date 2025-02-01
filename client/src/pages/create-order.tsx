import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function CreateOrder() {
  const [, navigate] = useLocation();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Nieuwe aanvraag</h1>

      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/work-orders")}
        >
          Annuleren
        </Button>
      </div>
    </div>
  );
}