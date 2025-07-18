/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
  useNavigate,
  Navigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import {
  Mail,
  Lock,
  LogIn,
  UserPlus,
  AlertCircle,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import Footer from "@/components/Footer";

const Auth = () => {
  const { user, isLoading, signIn, signUp, signInWithGoogle, resetPassword } =
    useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const { toast } = useToast();

  // Get the invitation ID from the URL if present
  const invitationId = searchParams.get("invitation");

  // Determine the redirect path based on context
  const getRedirectPath = () => {
    // Check for invitation parameter first
    if (invitationId) {
      return `/join-team?id=${invitationId}`;
    }

    // Then check for stored invitation in localStorage
    const pendingInvitation = localStorage.getItem("pendingTeamInvitation");
    if (pendingInvitation) {
      return `/join-team?id=${pendingInvitation}`;
    }

    // Otherwise use location state or default to workspace
    return location.state?.from || "/workspace";
  };

  const defaultTab = searchParams.get("tab") || "signin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTab, setCurrentTab] = useState(defaultTab);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  useEffect(() => {
    // Reset form fields when switching tabs
    if (mode === "signup") {
      setCurrentTab("signup");
    } else {
      setCurrentTab("signin");
    }
  }, [mode]);

  useEffect(() => {
    // Update tab when URL param changes
    if (searchParams.get("tab")) {
      setCurrentTab(searchParams.get("tab") || "signin");
    }
  }, [searchParams]);

  // If user is already logged in, redirect them appropriately
  if (!isLoading && user) {
    return <Navigate to={getRedirectPath()} />;
  }

  const handleRedirectAfterAuth = () => {
    // Check for redirect param in URL
    const redirectParam = searchParams.get("redirect");
    if (redirectParam) {
      navigate(redirectParam, { replace: true });
      return;
    }
    const redirectPath = getRedirectPath();

    // Clear the stored invitation if we're going to use it
    if (
      redirectPath.includes("join-team") &&
      localStorage.getItem("pendingTeamInvitation")
    ) {
      localStorage.removeItem("pendingTeamInvitation");
    }

    toast({
      title: "Authentication successful",
      description: redirectPath.includes("join-team")
        ? "You can now accept the team invitation."
        : "You've successfully signed in.",
    });

    navigate(redirectPath);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message);
      } else {
        handleRedirectAfterAuth();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const { error } = await signUp(email, password);
      if (error) {
        setError(error.message);
      } else {
        // If there's an invitation, direct the user there immediately
        if (invitationId || localStorage.getItem("pendingTeamInvitation")) {
          handleRedirectAfterAuth();
        } else {
          toast({
            title: "Success!",
            description: "Please check your email to confirm your account.",
          });
          // Switch to signin tab after successful signup if no invitation
          setCurrentTab("signin");
        }
      }
    } catch (err: any) {
      setError(err.message);
      console.error("Signup error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const { error } = await resetPassword(email);
      if (error) {
        setError(error.message);
      } else {
        toast({
          title: "Password reset email sent",
          description:
            "Please check your email for password reset instructions.",
        });
        setIsForgotPassword(false);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // Google sign-in will handle redirection through the useEffect/Navigate
    } catch (error: any) {
      setError(error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-biotech-purple" />
      </div>
    );
  }

  if (isForgotPassword) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-background/80 px-4 py-8">
        <div className="w-full max-w-md space-y-6 rounded-lg border bg-card p-8 shadow-lg">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Reset Password</h1>
            <p className="text-muted-foreground">
              Enter your email to receive reset instructions
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  className="pl-10"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-biotech-purple to-biotech-teal text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="mr-2 h-4 w-4" />
              )}
              Send Reset Link
            </Button>

            <div className="text-center">
              <Button
                variant="link"
                onClick={() => setIsForgotPassword(false)}
                className="text-sm text-muted-foreground"
              >
                Back to Sign In
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }


  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-background/80 px-4 py-8">
        <div className="w-full max-w-md space-y-6 rounded-lg border bg-card p-8 shadow-lg">
          <div className="flex justify-center">
             <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-black">
                <span className="text-blue-400">Web</span>App
              </h1>
            </div>
          </div>
          </div>

          <div className="space-y-2 text-center">
            <p className="text-muted-foreground">Create Your Free Acount</p>
            {/* {isInvitationFlow && (
              <p className="text-sm text-biotech-purple font-medium">
                You need to sign in to accept the team invitation
              </p>
            )} */}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs
            defaultValue={currentTab}
            value={currentTab}
            onValueChange={setCurrentTab}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      className="pl-10"
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      className="pl-10"
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-sm text-muted-foreground"
                  >
                    Forgot password?
                  </Button>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-biotech-purple to-biotech-teal text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <LogIn className="mr-2 h-4 w-4" />
                  )}
                  Sign In
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      className="pl-10"
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      className="pl-10"
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-biotech-purple to-biotech-teal text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <UserPlus className="mr-2 h-4 w-4" />
                  )}
                  Sign Up
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            onClick={handleGoogleSignIn}
            variant="outline"
            className="w-full"
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </Button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Auth;
