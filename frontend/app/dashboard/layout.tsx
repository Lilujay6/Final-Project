"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { LogOut } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/");

    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }

    setMounted(true);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  if (!mounted) return null;

  const nav = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/users", label: "Users" },
    { href: "/dashboard/scan", label: "Scan" },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r p-6 flex flex-col justify-between">
        <div>
          <div className="mb-8 pb-4 border-b">
            <h1 className="text-xl font-bold">Library Access</h1>
            <p className="text-xs opacity-50 mt-1">Management System</p>
          </div>

          <nav className="space-y-2">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-2.5 text-sm rounded-lg transition-colors ${
                  pathname === item.href
                    ? "font-semibold bg-muted"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="space-y-3">
          <div className="flex gap-2 bg-muted rounded-lg p-1">
            <button
              onClick={() => {
                document.documentElement.classList.remove("dark");
                localStorage.setItem("theme", "light");
                setIsDark(false);
              }}
              className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                !isDark ? "bg-background font-semibold shadow-sm" : "opacity-70"
              }`}
            >
              Light
            </button>
            <button
              onClick={() => {
                document.documentElement.classList.add("dark");
                localStorage.setItem("theme", "dark");
                setIsDark(true);
              }}
              className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                isDark ? "bg-background font-semibold shadow-sm" : "opacity-70"
              }`}
            >
              Dark
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm rounded-lg opacity-70 hover:opacity-100 transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <div className="max-w-7xl">{children}</div>
        <footer className="mt-16 text-xs text-center opacity-40 pb-4">
          © 2026 Library Access System
        </footer>
      </main>
    </div>
  );
}
