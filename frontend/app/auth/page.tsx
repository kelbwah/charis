"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  BookOpenText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import CustomLink from "@/components/custom-link";
import { Textarea } from "@/components/ui/textarea";
import { LoginPayload, RegisterPayload } from "@/services/types";
import { login, register } from "@/services/auth";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("from") || "/dashboard";
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registerForm, setRegisterForm] = useState<RegisterPayload>({
    email: "",
    password: "",
    username: "",
    biography: "",
  } as RegisterPayload);
  const [loginForm, setLoginForm] = useState<LoginPayload>({
    email: "",
    password: "",
  } as LoginPayload);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(loginForm);
      toast.success("Logged in successfully!");
      router.push(redirectTo);
    } catch (err) {
      console.error(err);
      toast.error(`${err}`);
    }

    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await register(registerForm);
      toast.success("Registered successfully!");
      router.push(redirectTo);
    } catch (err) {
      console.error(err);
      toast.error(`${err}`);
    }

    setIsLoading(false);
  };

  return (
    <div className="container flex items-center justify-center min-h-[80vh] py-12">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M17 3.34a10 10 0 1 1 -14.83 8.17" />
              <path d="M16 8a5 5 0 1 1 -7.5 4.33" />
            </svg>
          </motion.div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome to Charis
          </h1>
          <p className="text-muted-foreground mt-1">
            Sign in to your account or create a new one
          </p>
        </motion.div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger className="cursor-pointer" value="login">
              Login
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="register">
              Register
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="sync">
            {/* ----- LOGIN TAB ----- */}
            <TabsContent value="login" key="login" asChild>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <form onSubmit={handleLogin}>
                    <CardHeader className="space-y-1 pb-6">
                      <CardTitle>Login</CardTitle>
                      <CardDescription>
                        Enter your email and password to access your account
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            className="pl-10"
                            value={loginForm.email}
                            onChange={(e) =>
                              setLoginForm({
                                ...loginForm,
                                email: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password">Password</Label>
                          <Link
                            href="/auth/forgot-password"
                            className="text-xs text-primary hover:underline"
                          >
                            Forgot password?
                          </Link>
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            className="pl-10 pr-10"
                            value={loginForm.password}
                            onChange={(e) =>
                              setLoginForm({
                                ...loginForm,
                                password: e.target.value,
                              })
                            }
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                            <span className="sr-only">
                              {showPassword ? "Hide password" : "Show password"}
                            </span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-5">
                      <Button
                        type="submit"
                        className="w-full cursor-pointer"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="flex items-center gap-1">
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Signing in...
                          </span>
                        ) : (
                          <span className="flex items-center">
                            Sign in
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </span>
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </motion.div>
            </TabsContent>

            {/* ----- REGISTER TAB ----- */}
            <TabsContent value="register" key="register" asChild>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <form onSubmit={handleRegister}>
                    <CardHeader className="space-y-1 pb-6">
                      <CardTitle>Create an account</CardTitle>
                      <CardDescription>
                        Enter your information to create an account
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <Label htmlFor="register-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="register-email"
                            type="email"
                            placeholder="you@example.com"
                            className="pl-10"
                            value={registerForm.email}
                            onChange={(e) =>
                              setRegisterForm({
                                ...registerForm,
                                email: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="username"
                            placeholder="johndoe123"
                            className="pl-10"
                            value={registerForm.username}
                            onChange={(e) =>
                              setRegisterForm({
                                ...registerForm,
                                username: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="register-password"
                            type={showPassword ? "text" : "password"}
                            className="pl-10 pr-10"
                            value={registerForm.password}
                            onChange={(e) =>
                              setRegisterForm({
                                ...registerForm,
                                password: e.target.value,
                              })
                            }
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                            <span className="sr-only">
                              {showPassword ? "Hide password" : "Show password"}
                            </span>
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground pt-1">
                          Password must be at least 8 characters long
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="biography">Biography</Label>
                        <div className="relative">
                          <BookOpenText className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Textarea
                            id="biography"
                            placeholder="Write a little bit about yourself."
                            className="pl-10 resize-none"
                            value={registerForm.biography}
                            onChange={(e) =>
                              setRegisterForm({
                                ...registerForm,
                                biography: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <p className="text-xs text-muted-foreground pt-1">
                          This will be public to others viewing your account.
                        </p>
                      </div>

                      <div className="flex items-center space-x-2 pt-2">
                        <Checkbox id="terms" required />
                        <label
                          htmlFor="terms"
                          className="block text-sm font-medium leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          I agree to the{" "}
                          <CustomLink
                            isComingSoon={
                              process.env.FEATURE_COMING_SOON === "true"
                            }
                            href="/terms"
                            className="text-primary hover:underline"
                          >
                            Terms of Service
                          </CustomLink>{" "}
                          and{" "}
                          <CustomLink
                            isComingSoon={
                              process.env.FEATURE_COMING_SOON === "true"
                            }
                            href="/privacy"
                            className="text-primary hover:underline"
                          >
                            Privacy Policy
                          </CustomLink>
                        </label>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-5">
                      <Button
                        type="submit"
                        className="w-full cursor-pointer"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="flex items-center gap-1">
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Creating account...
                          </span>
                        ) : (
                          <span className="flex items-center">
                            Create account
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </span>
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>

        <p className="text-center text-sm text-muted-foreground mt-6">
          By using our service, you agree to our commitment to privacy and
          creating a safe prayer community.
        </p>
      </div>
    </div>
  );
}
