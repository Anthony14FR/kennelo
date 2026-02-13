"use client";

import Link from "next/link";
import { RegisterForm } from "@/features/users/components/forms/register-form";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@workspace/ui/components/card";
import { useNavigation } from "@/hooks/use-navigation";

export default function Register() {
    const { routes, router } = useNavigation();

    const handleSuccess = () => {
        router.push(routes.Home());
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                    <CardDescription>Enter your information to get started</CardDescription>
                </CardHeader>
                <CardContent>
                    <RegisterForm onSuccess={handleSuccess} />
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    <div className="text-sm text-muted-foreground text-center">
                        Already have an account?{" "}
                        <Link href={routes.Login()} className="text-primary hover:underline">
                            Login here
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
