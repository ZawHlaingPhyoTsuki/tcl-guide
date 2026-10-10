"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const THEMES = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export function AppearanceCard() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>How the directory looks on this device.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2" role="group" aria-label="Theme">
          {THEMES.map(({ value, label, icon: Icon }) => (
            <Button
              key={value}
              type="button"
              variant={mounted && theme === value ? "default" : "outline"}
              onClick={() => setTheme(value)}
              disabled={!mounted}
              aria-pressed={mounted && theme === value}
              className="flex-1"
            >
              <Icon className="size-4" aria-hidden />
              {label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
