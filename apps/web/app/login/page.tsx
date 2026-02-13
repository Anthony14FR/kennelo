"use client";

import Link from "next/link";
import { LoginForm } from "@/features/users/components/forms/login-form";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@workspace/ui/components/card";
import { useNavigation } from "@/hooks/use-navigation";

export default function Login() {
    const { routes, router } = useNavigation();

    const handleSuccess = () => {
        router.push(routes.Home());
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Login</CardTitle>
                    <CardDescription>Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <LoginForm onSuccess={handleSuccess} />
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    <div className="text-sm text-muted-foreground text-center">
                        Don&apos;t have an account?{" "}
                        <Link href={routes.Register()} className="text-primary hover:underline">
                            Register here
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
