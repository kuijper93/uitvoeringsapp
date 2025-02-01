import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ClipboardList,
  Settings,
  LogOut,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Work Orders", href: "/work-orders", icon: ClipboardList },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="flex h-screen">
      <div className="fixed inset-y-0 z-50 flex w-64 flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-sidebar px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <img
              className="h-8 w-auto"
              src="https://www.jcdecaux.com/sites/default/files/assets/logo_jcdecaux_2.svg"
              alt="JCDecaux"
            />
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href}>
                        <a
                          className={cn(
                            item.href === location
                              ? "bg-sidebar-accent text-sidebar-accent-foreground"
                              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6"
                          )}
                        >
                          <item.icon
                            className="h-6 w-6 shrink-0"
                            aria-hidden="true"
                          />
                          {item.name}
                        </a>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li>
                <Link href="/work-orders/new">
                  <Button className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    New Work Order
                  </Button>
                </Link>
              </li>
              <li className="mt-auto">
                <Separator className="mb-4" />
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-x-3"
                >
                  <Settings className="h-6 w-6" />
                  Settings
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-x-3 text-red-500"
                >
                  <LogOut className="h-6 w-6" />
                  Logout
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="pl-64 w-full">
        <main className="py-6">
          <div className="px-6">{children}</div>
        </main>
      </div>
    </div>
  );
}