
import React from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';

const AccessibilitySettings: React.FC = () => {
  const { options, updateOption } = useAccessibility();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Accessibility Settings</CardTitle>
        <CardDescription>
          Personalize your experience with these accessibility options
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Font Size Options */}
        <div className="space-y-2">
          <Label htmlFor="font-size" className="text-base font-medium">Font Size</Label>
          <RadioGroup
            id="font-size"
            value={options.fontSize}
            onValueChange={(value) => updateOption('fontSize', value as 'normal' | 'large' | 'x-large')}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="normal" id="fs-normal" />
              <Label htmlFor="fs-normal" className="text-base">Normal</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="large" id="fs-large" />
              <Label htmlFor="fs-large" className="text-lg">Large</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="x-large" id="fs-x-large" />
              <Label htmlFor="fs-x-large" className="text-xl">Extra Large</Label>
            </div>
          </RadioGroup>
        </div>
        
        <Separator />
        
        {/* Contrast Options */}
        <div className="space-y-2">
          <Label htmlFor="contrast" className="text-base font-medium">Color Contrast</Label>
          <RadioGroup
            id="contrast"
            value={options.contrast}
            onValueChange={(value) => updateOption('contrast', value as 'normal' | 'high')}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="normal" id="contrast-normal" />
              <Label htmlFor="contrast-normal">Normal Contrast</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="high" id="contrast-high" />
              <Label htmlFor="contrast-high">High Contrast</Label>
            </div>
          </RadioGroup>
        </div>
        
        <Separator />
        
        {/* Animation Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="animations" className="text-base font-medium">Animations</Label>
            <p className="text-sm text-muted-foreground">
              Enable or disable animations throughout the interface
            </p>
          </div>
          <Switch
            id="animations"
            checked={options.animations}
            onCheckedChange={(checked) => updateOption('animations', checked)}
          />
        </div>
        
        <Separator />
        
        {/* Focus Indicator Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="focus-indicator" className="text-base font-medium">Enhanced Focus Indicator</Label>
            <p className="text-sm text-muted-foreground">
              Make focus indicators more visible for keyboard navigation
            </p>
          </div>
          <Switch
            id="focus-indicator"
            checked={options.focusIndicator}
            onCheckedChange={(checked) => updateOption('focusIndicator', checked)}
          />
        </div>
        
      </CardContent>
    </Card>
  );
};

export default AccessibilitySettings;
