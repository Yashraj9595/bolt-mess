import { Button } from "./button"

export function ColorShowcase() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Color Palette</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col space-y-2">
            <div className="w-full h-20 bg-primary-blue rounded-md"></div>
            <span className="text-sm font-medium">Primary Blue</span>
            <span className="text-xs text-muted-foreground">#145374</span>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="w-full h-20 bg-secondary-blue rounded-md"></div>
            <span className="text-sm font-medium">Secondary Blue</span>
            <span className="text-xs text-muted-foreground">#5588A3</span>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="w-full h-20 bg-dark-blue rounded-md"></div>
            <span className="text-sm font-medium">Dark Blue</span>
            <span className="text-xs text-muted-foreground">#00334E</span>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="w-full h-20 bg-neutral-gray rounded-md"></div>
            <span className="text-sm font-medium">Neutral Gray</span>
            <span className="text-xs text-muted-foreground">#E8E8E8</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Gradient Examples</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="gradient-primary w-full h-20 rounded-md"></div>
          <div className="gradient-secondary w-full h-20 rounded-md"></div>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Button Variants</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary-blue">Primary Blue</Button>
          <Button variant="secondary-blue">Secondary Blue</Button>
          <Button variant="dark-blue">Dark Blue</Button>
          <Button variant="neutral">Neutral</Button>
          <Button variant="outline-blue">Outline Blue</Button>
          <Button variant="gradient">Gradient</Button>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Text Colors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p className="text-primary-blue">Text in Primary Blue</p>
          <p className="text-secondary-blue">Text in Secondary Blue</p>
          <p className="text-dark-blue">Text in Dark Blue</p>
          <p className="text-gradient font-bold text-lg">Gradient Text</p>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Border Colors</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border-2 border-primary-blue p-4 rounded-md">Primary Blue Border</div>
          <div className="border-2 border-secondary-blue p-4 rounded-md">Secondary Blue Border</div>
          <div className="border-2 border-dark-blue p-4 rounded-md">Dark Blue Border</div>
          <div className="border-2 border-neutral-gray p-4 rounded-md">Neutral Gray Border</div>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Glass Effect</h2>
        <div className="relative h-40 bg-gradient-to-r from-primary-blue to-dark-blue rounded-md overflow-hidden">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 glass p-6 rounded-lg">
            <p className="font-medium text-white">Glass Effect</p>
          </div>
        </div>
      </div>
    </div>
  )
} 