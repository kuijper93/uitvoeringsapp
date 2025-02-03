import { useState, useEffect } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { SelectWorkOrder } from "@db/schema";

// Simplified WorkOrder interface
interface WorkOrder extends SelectWorkOrder {}

export default function InternalRequests() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);

  // Fetch work orders with proper typing
  const { data: workOrders, isLoading } = useQuery({
    queryKey: ['/api/work-orders'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/work-orders');
      return response as WorkOrder[];
    }
  });

  useEffect(() => {
    if (workOrders && workOrders.length > 0 && !selectedWorkOrder) {
      setSelectedWorkOrder(workOrders[0]);
    }
  }, [workOrders, selectedWorkOrder]);

  const filteredWorkOrders = workOrders?.filter((order: WorkOrder) => {
    return order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
  }) || [];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-[calc(100vh-6rem)]">
      <ResizablePanelGroup direction="horizontal" className="h-full rounded-lg border">
        <ResizablePanel defaultSize={30}>
          <div className="p-4">
            <Input 
              placeholder="Search orders..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-4"
            />
            <div className="space-y-2">
              {filteredWorkOrders.map((order) => (
                <Card
                  key={order.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => setSelectedWorkOrder(order)}
                >
                  <CardContent className="p-4">
                    <div>
                      <p className="font-medium">{order.orderNumber}</p>
                      <p className="text-sm text-gray-500">{order.municipality}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={70}>
          {selectedWorkOrder && (
            <div className="p-4">
              <Card>
                <CardContent className="p-4">
                  <h2 className="text-xl font-bold mb-4">Order Details</h2>
                  <div className="space-y-2">
                    <p><strong>Order Number:</strong> {selectedWorkOrder.orderNumber}</p>
                    <p><strong>Municipality:</strong> {selectedWorkOrder.municipality}</p>
                    <p><strong>Status:</strong> {selectedWorkOrder.status}</p>
                    <p><strong>Action Type:</strong> {selectedWorkOrder.actionType}</p>
                    <p><strong>Furniture Type:</strong> {selectedWorkOrder.furnitureType}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}