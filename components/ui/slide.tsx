"use client";
import * as React from "react";
import { Slider as ShadcnSlider } from "@radix-ui/react-slider";

const Slide = React.forwardRef<
  React.ElementRef<typeof ShadcnSlider>,
  React.ComponentPropsWithoutRef<typeof ShadcnSlider>
>(({ className, ...props }, ref) => (
  <ShadcnSlider ref={ref} className={className} {...props} />
));
Slide.displayName = ShadcnSlider.displayName;

export { Slide };
