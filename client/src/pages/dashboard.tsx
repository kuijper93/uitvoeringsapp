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
    return <Skeleton className="w-full h-[400px]" />;
  }

  const workloadData = [
    { week: "Week 43", workload: 4 },
    { week: "Week 44", workload: 3 },
    { week: "Week 45", workload: 5 },
    { week: "Week 46", workload: 5 },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">Totaal Mutaties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">
              {workOrders?.length || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">In Behandeling</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">
              {workOrders?.filter((wo) => wo.status === "in_progress").length || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">Deze Week Afgerond</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">
              {workOrders?.filter((wo) => wo.status === "completed").length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Werkbelasting Trend</CardTitle>
        </CardHeader>
        <CardContent className="text-card-foreground">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={workloadData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="week" 
                  stroke="hsl(var(--foreground))"
                  tick={{ fill: "hsl(var(--foreground))" }}
                />
                <YAxis 
                  stroke="hsl(var(--foreground))"
                  tick={{ fill: "hsl(var(--foreground))" }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    color: "hsl(var(--foreground))"
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