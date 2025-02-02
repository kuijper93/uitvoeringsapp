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
    <div className="min-h-screen flex bg-background">
      <div className="fixed inset-y-0 z-50 w-72">
        <div className="flex h-full flex-col overflow-y-auto bg-sidebar border-r shadow-lg">
          <div className="flex h-16 shrink-0 items-center px-6 border-b">
            <h1 className="text-xl font-bold tracking-tight">JCDecaux</h1>
          </div>
          <nav className="flex-1 px-4 pb-4">
            <ul role="list" className="flex flex-1 flex-col gap-y-7 pt-6">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          item.href === location
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                          "group flex gap-x-3 rounded-md p-3 text-sm font-medium transition-all"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "h-5 w-5 shrink-0",
                            item.href === location
                              ? "text-primary-foreground"
                              : "text-sidebar-foreground/60 group-hover:text-sidebar-foreground"
                          )}
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
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground",
                          "group flex gap-x-3 rounded-md p-3 text-sm font-medium transition-all"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "h-5 w-5 shrink-0",
                            item.href === location
                              ? "text-primary-foreground"
                              : "text-primary group-hover:text-primary-foreground"
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-x-3 px-3 py-6 h-auto"
                >
                  <Settings className="h-5 w-5 text-muted-foreground" />
                  <span className="text-muted-foreground">Instellingen</span>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-x-3 px-3 py-6 h-auto text-destructive hover:text-destructive-foreground hover:bg-destructive"
                >
                  <LogOut className="h-5 w-5" />
                  Uitloggen
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <main className="flex-1 pl-72">
        <div className="py-8 px-8">
          {children}
        </div>
      </main>
    </div>
  );
}