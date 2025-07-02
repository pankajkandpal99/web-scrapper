import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Loader } from "../general/Loader";
import { Link, useNavigate } from "react-router-dom";
import {
  registerFormSchema,
  RegisterFormValues,
} from "../../schema/authSchema";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  registerUser,
  resetRegistration,
} from "../../features/auth/auth.slice";
import { Eye, EyeOff } from "lucide-react";

const RegisterForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { authenticated } = useAppSelector((state) => state.auth);
  const { loading, error, registered } = useAppSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: undefined,
      phoneNumber: "",
      email: undefined,
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    await dispatch(registerUser(data));
  };

  useEffect(() => {
    if (registered) {
      navigate("/login", {
        state: {
          message: "Registration successful! Please login.",
          registeredEmail: form.getValues("email"),
        },
        replace: true,
      });

      form.reset();
      dispatch(resetRegistration());
    }
  }, [registered, navigate, form, dispatch]);

  useEffect(() => {
    const subscription = form.watch(() => {
      if (error) {
        dispatch(resetRegistration());
      }
    });
    return () => subscription.unsubscribe();
  }, [form, error, dispatch]);

  useEffect(() => {
    if (authenticated) {
      navigate("/", { replace: true });
    }
  }, [authenticated, navigate, dispatch]);

  return (
    <div className="flex items-center justify-center p-4 sm:px-6 md:px-8">
      <Card className="w-full max-w-md mx-auto shadow-lg p-4 sm:p-6">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">
            Create an Account
          </CardTitle>
          <CardDescription>
            Fill in the details below to register.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="mb-4 p-2 bg-red-50 text-red-500 text-sm text-center rounded">
              {error}
            </div>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your username"
                        {...field}
                        className={`text-sm pr-10 ${
                          fieldState.error
                            ? "border-red-400 focus-visible:ring-red-400"
                            : ""
                        }`}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <div className="flex justify-between gap-1">
                      <FormLabel className="text-sm font-medium">
                        Email
                      </FormLabel>
                      <span className="text-xs text-muted-foreground">
                        (optional)
                      </span>
                    </div>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        {...field}
                        className={`text-sm pr-10 ${
                          fieldState.error
                            ? "border-red-400 focus-visible:ring-red-400"
                            : ""
                        }`}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field, fieldState }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-sm font-medium">
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter phone number"
                        {...field}
                        className={`text-sm pr-10 ${
                          fieldState.error
                            ? "border-red-400 focus-visible:ring-red-400"
                            : ""
                        }`}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          form.setValue("phoneNumber", value.slice(0, 10));
                        }}
                        value={field.value}
                        type="tel"
                        maxLength={10}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className={`text-sm pr-10 ${
                            fieldState.error
                              ? "border-red-400 focus-visible:ring-red-400"
                              : ""
                          }`}
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:bg-transparent hover:text-muted-foreground cursor-pointer"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          className={`text-sm pr-10 ${
                            fieldState.error
                              ? "border-red-400 focus-visible:ring-red-400"
                              : ""
                          }`}
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:bg-transparent hover:text-muted-foreground cursor-pointer"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full mt-4 bg-primary hover:bg-green-400 cursor-pointer"
                disabled={loading}
              >
                {loading ? <Loader size="small" /> : "Register"}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-muted-foreground">
          <span>Already have an account?</span>
          <Link
            to="/login"
            className="text-primary font-medium hover:underline"
          >
            Log in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterForm;
