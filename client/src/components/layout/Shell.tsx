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
      {/* Sidebar */}
      <div className="fixed inset-y-0 z-50 w-64">
        <div className="flex h-full flex-col bg-white border-r">
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center px-6 border-b bg-primary">
            <h1 className="text-xl font-bold tracking-tight text-primary-foreground">JCDecaux</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
            <ul role="list" className="flex flex-1 flex-col gap-y-8">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          item.href === location
                            ? "bg-primary/10 text-primary"
                            : "text-gray-700 hover:bg-gray-50",
                          "group flex gap-x-3 rounded-sm p-2 text-sm font-medium transition-all"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "h-5 w-5 shrink-0",
                            item.href === location
                              ? "text-primary"
                              : "text-gray-400 group-hover:text-gray-600"
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              {/* Actions */}
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
                            : "bg-primary/5 text-primary hover:bg-primary hover:text-primary-foreground",
                          "group flex gap-x-3 rounded-sm p-2 text-sm font-medium transition-all"
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

              {/* Footer Actions */}
              <li className="mt-auto space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-x-3 px-2 py-1.5 h-9 text-gray-700 hover:bg-gray-50"
                >
                  <Settings className="h-5 w-5 text-gray-400" />
                  <span>Instellingen</span>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-x-3 px-2 py-1.5 h-9 text-destructive hover:text-destructive-foreground hover:bg-destructive"
                >
                  <LogOut className="h-5 w-5" />
                  Uitloggen
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 pl-64">
        <div className="py-6 px-8">
          {children}
        </div>
      </main>
    </div>
  );
}