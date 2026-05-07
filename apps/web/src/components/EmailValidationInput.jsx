import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { useEmailValidation } from '@/hooks/useEmailValidation.js';
import { cn } from '@/lib/utils';

export const EmailValidationInput = ({ 
  id = "email", 
  label = "Email Address", 
  value, 
  onChange, 
  placeholder = "name@example.com",
  required = false,
  className,
  onValidationChange
}) => {
  const { isValidating, isValid, reason, suggestions } = useEmailValidation(value);

  // Notify parent of validation state changes
  React.useEffect(() => {
    if (onValidationChange) {
      onValidationChange(isValid);
    }
  }, [isValid, onValidationChange]);

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="relative">
        <Input
          id={id}
          type="email"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={cn(
            "pr-10 transition-colors",
            value && isValid === true && "border-success focus-visible:ring-success",
            value && isValid === false && "border-destructive focus-visible:ring-destructive"
          )}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
          {isValidating && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          {!isValidating && value && isValid === true && <CheckCircle2 className="h-4 w-4 text-success" />}
          {!isValidating && value && isValid === false && <XCircle className="h-4 w-4 text-destructive" />}
        </div>
      </div>
      
      {!isValidating && value && isValid === false && (
        <div className="flex items-start gap-2 text-sm text-destructive mt-1.5">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <div>
            <p>{reason}</p>
            {suggestions && suggestions.length > 0 && (
              <p className="mt-1 text-muted-foreground">
                Did you mean: <button type="button" className="text-primary hover:underline font-medium" onClick={() => onChange({ target: { value: suggestions[0] } })}>{suggestions[0]}</button>?
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};