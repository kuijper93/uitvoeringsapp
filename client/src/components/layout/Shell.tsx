import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ClipboardList,
  Settings,
  LogOut,
  FileText,
  Plus,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Aanvragen", href: "/requests", icon: ClipboardList },
  { name: "Werkorders", href: "/work-orders", icon: Wrench },
];

const actions = [
  { name: "Nieuwe Aanvraag", href: "/create-request", icon: Plus },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex">
      <div className="fixed inset-y-0 z-50 w-64">
        <div className="flex h-full flex-col overflow-y-auto bg-sidebar border-r">
          <div className="flex h-16 shrink-0 items-center px-6">
            <h1 className="text-xl font-bold tracking-wider">JCDecaux</h1>
          </div>
          <nav className="flex-1 px-6 pb-4">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
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
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li>
                <Separator className="my-4" />
                <ul role="list" className="-mx-2 space-y-1">
                  {actions.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          item.href === location
                            ? "bg-primary text-primary-foreground"
                            : "text-primary hover:bg-primary/90 hover:text-primary-foreground",
                          "group flex gap-x-3 rounded-md p-2 text-sm leading-6"
                        )}
                      >
                        <item.icon
                          className="h-6 w-6 shrink-0"
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-x-3"
                >
                  <Settings className="h-6 w-6" />
                  Instellingen
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-x-3 text-red-500"
                >
                  <LogOut className="h-6 w-6" />
                  Uitloggen
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <main className="flex-1 pl-64">
        <div className="p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}