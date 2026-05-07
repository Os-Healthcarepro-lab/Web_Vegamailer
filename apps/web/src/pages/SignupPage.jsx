import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  // Password validation rules
  const hasMinLength = formData.password.length >= 8;
  const hasUppercase = /[A-Z]/.test(formData.password);
  const hasNumber = /[0-9]/.test(formData.password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);
  const passwordsMatch = formData.password === formData.confirmPassword && formData.password !== '';
  
  const isPasswordValid = hasMinLength && hasUppercase && hasNumber && hasSpecialChar;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.businessName || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!isPasswordValid) {
      toast.error('Please ensure your password meets all requirements');
      return;
    }

    if (!passwordsMatch) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await signup(formData.email, formData.password, formData.businessName);
      toast.success('Account created successfully! Please check your email to verify.');
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Failed to create account. Email might already be in use.');
    } finally {
      setIsLoading(false);
    }
  };

  const ValidationItem = ({ isValid, text }) => (
    <div className="flex items-center gap-2 text-sm">
      {isValid ? (
        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
      ) : (
        <XCircle className="h-4 w-4 text-muted-foreground" />
      )}
      <span className={isValid ? "text-foreground" : "text-muted-foreground"}>{text}</span>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden py-12">
      <Helmet>
        <title>Create Account | VegaMailer</title>
      </Helmet>
      
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-secondary/10 via-background to-background -z-10" />

      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="bg-primary/20 p-2 rounded-xl">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <span className="font-bold text-2xl tracking-tight">VegaMailer</span>
          </Link>
        </div>

        <Card className="border-border/50 shadow-xl glass-panel">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
            <CardDescription>
              Start managing your email campaigns today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input 
                  id="businessName" 
                  placeholder="Acme Corp" 
                  value={formData.businessName}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Work Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@company.com" 
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="bg-background/50"
                />
              </div>
              
              {formData.password && (
                <div className="bg-muted/50 p-3 rounded-lg space-y-2 border border-border/50">
                  <ValidationItem isValid={hasMinLength} text="At least 8 characters" />
                  <ValidationItem isValid={hasUppercase} text="One uppercase letter" />
                  <ValidationItem isValid={hasNumber} text="One number" />
                  <ValidationItem isValid={hasSpecialChar} text="One special character" />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="bg-background/50"
                />
                {formData.confirmPassword && !passwordsMatch && (
                  <p className="text-sm text-destructive mt-1">Passwords do not match</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 mt-4" 
                disabled={isLoading || !isPasswordValid || !passwordsMatch}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create account'
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-border/50 pt-6">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;