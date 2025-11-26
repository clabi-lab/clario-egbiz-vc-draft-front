"use client";

import theme from "@/app/providers/theme";
import { ThemeProvider } from "@mui/material/styles";

export default function ThemeProviderClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
