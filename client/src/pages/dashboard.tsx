import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import type { SelectWorkOrder } from "@db/schema";

export default function Dashboard() {
  const { data: workOrders, isLoading } = useQuery<SelectWorkOrder[]>({
    queryKey: ["/api/work-orders"],
  });

  if (isLoading) {
    return <Skeleton className="w-full h-[400px] rounded-lg" />;
  }

  const workloadData = [
    { week: "Week 43", workload: 4 },
    { week: "Week 44", workload: 3 },
    { week: "Week 45", workload: 5 },
    { week: "Week 46", workload: 5 },
  ];

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-bold text-foreground">Dashboard</h1>

      <div className="grid gap-3 md:grid-cols-3">
        <Card className="bg-card rounded-lg">
          <CardHeader className="p-4">
            <CardTitle className="text-card-foreground text-base">Totaal Mutaties</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl font-bold text-card-foreground">
              {workOrders?.length || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card rounded-lg">
          <CardHeader className="p-4">
            <CardTitle className="text-card-foreground text-base">In Behandeling</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl font-bold text-card-foreground">
              {workOrders?.filter((wo) => wo.status === "IN_PROGRESS").length || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card rounded-lg">
          <CardHeader className="p-4">
            <CardTitle className="text-card-foreground text-base">Deze Week Afgerond</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl font-bold text-card-foreground">
              {workOrders?.filter((wo) => wo.status === "COMPLETED").length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card rounded-lg">
        <CardHeader className="p-4">
          <CardTitle className="text-card-foreground text-base">Werkbelasting Trend</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 text-card-foreground">
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={workloadData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="week" 
                  stroke="hsl(var(--foreground))"
                  tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                />
                <YAxis 
                  stroke="hsl(var(--foreground))"
                  tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    color: "hsl(var(--foreground))",
                    fontSize: 12,
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="workload"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}