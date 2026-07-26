import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

export interface ValidationWarning {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  suggestion?: string;
}

interface ContentValidationProps {
  warnings: ValidationWarning[];
  isValid: boolean;
}

export default function ContentValidation({ warnings, isValid }: ContentValidationProps) {
  if (isValid && warnings.length === 0) {
    return (
      <Card className="border-hw-green/20 bg-hw-green/5">
        <CardContent className="flex items-center gap-3 p-4">
          <CheckCircle2 className="h-5 w-5 text-hw-green shrink-0" />
          <div>
            <p className="text-sm font-semibold text-hw-green">Content is ready to publish</p>
            <p className="text-xs text-muted-foreground mt-0.5">All validation checks passed</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-hw-yellow" />
          Validation Warnings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {warnings.map((warning) => {
            const Icon = warning.type === 'error' ? AlertCircle : warning.type === 'warning' ? AlertTriangle : Info;
            const bgColor = warning.type === 'error' ? 'bg-hw-red/5' : warning.type === 'warning' ? 'bg-hw-yellow/5' : 'bg-hw-blue/5';
            const textColor = warning.type === 'error' ? 'text-hw-red' : warning.type === 'warning' ? 'text-hw-yellow' : 'text-hw-blue';
            const badgeVariant = warning.type === 'error' ? 'destructive' : warning.type === 'warning' ? 'secondary' : 'outline';

            return (
              <div key={warning.id} className={`flex gap-3 rounded-lg border p-3 ${bgColor}`}>
                <Icon className={`h-4 w-4 ${textColor} shrink-0 mt-0.5`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold">{warning.message}</p>
                    <Badge variant={badgeVariant} className="text-[10px]">
                      {warning.type === 'error' ? 'Error' : warning.type === 'warning' ? 'Warning' : 'Info'}
                    </Badge>
                  </div>
                  {warning.suggestion && (
                    <p className="text-xs text-muted-foreground mt-1">💡 {warning.suggestion}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
