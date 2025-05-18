
import React from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AccessibilityControls = () => {
  const { options, updateOption } = useAccessibility();

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Accessibility Options</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Font Size</h3>
            <RadioGroup 
              defaultValue={options.fontSize} 
              onValueChange={(value) => updateOption('fontSize', value)}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="normal" id="font-normal" />
                <Label htmlFor="font-normal">Normal</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="large" id="font-large" />
                <Label htmlFor="font-large">Large</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="x-large" id="font-x-large" />
                <Label htmlFor="font-x-large">Extra Large</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Contrast</h3>
            <RadioGroup 
              defaultValue={options.contrast}
              onValueChange={(value) => updateOption('contrast', value)}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="normal" id="contrast-normal" />
                <Label htmlFor="contrast-normal">Normal</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="contrast-high" />
                <Label htmlFor="contrast-high">High Contrast</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Motion</h3>
            <RadioGroup 
              defaultValue={options.motion}
              onValueChange={(value) => updateOption('motion', value)}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="full" id="motion-full" />
                <Label htmlFor="motion-full">Full Animation</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="reduced" id="motion-reduced" />
                <Label htmlFor="motion-reduced">Reduced Motion</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="screen-reader">Screen Reader Mode</Label>
            <Switch 
              id="screen-reader" 
              checked={options.screenReader}
              onCheckedChange={(checked) => updateOption('screenReader', checked)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessibilityControls;
