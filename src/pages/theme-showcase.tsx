import { ColorShowcase } from "@/components/ui/color-showcase";

export default function ThemeShowcasePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-primary-blue">MessHub Theme Showcase</h1>
      <p className="mb-8 text-muted-foreground">
        This page demonstrates the updated color scheme and UI components for MessHub.
      </p>
      
      <ColorShowcase />
    </div>
  );
} 