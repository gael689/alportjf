import {
  BoltIcon,
  CloudIcon,
  TvIcon,
  PaintBrushIcon,
  HomeIcon,
  SunIcon,
  MoonIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import type { ComponentType, SVGProps } from "react";

const ICON_MAP: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  BoltIcon,
  CloudIcon,
  TvIcon,
  PaintBrushIcon,
  HomeIcon,
  SunIcon,
  MoonIcon,
  WrenchScrewdriverIcon,
};

export function CategoryIcon({
  icono,
  className,
}: {
  icono: string;
  className?: string;
}) {
  const Icon = ICON_MAP[icono] ?? HomeIcon;
  return <Icon className={className} aria-hidden="true" />;
}
