"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

 import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
 } from "@/components/ui/form"

 import {Input} from "@/components/ui/input"
//  import {authClient} from "@/lib/auth"
 import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth-client"

const registerSchema = z.object({
    email: z.email("Please enter a valid email address"),
    password: z.string().min(1 , "Password is required"),
    confirmPassword: z.string().min(1 , "Confirm Password is required"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm(){
    const router = useRouter();
    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
    });
    
    const onSubmit = async (values: RegisterFormValues) =>{
        await authClient.signUp.email({
            name:values.email,
            email: values.email,
            password: values.password,
            callbackURL:"/",
        },
        {
            onSuccess: () =>{
                router.push("/");
                toast.success("Account created successfully");
            },
            onError: (error) =>{
                toast.error(error.error?.message);
            }
        }
    )
    }
    const handleLoginGithub = async () =>{
            await authClient.signIn.social({
                provider: "github",
                callbackURL: "/",
            },{
                onSuccess: () => {
                    router.push("/");
                    toast.success("Signed Up successfully");
                },
                onError: (error) => {
                    toast.error(error.error?.message);
                },
            })
        }
        const handleLoginGoogle = async () =>{
            await authClient.signIn.social({
                provider: "google",
                callbackURL: "/",
            },{
                onSuccess: () => {
                    router.push("/");
                    toast.success("Signed Up successfully");
                },
                onError: (error) => {
                    toast.error(error.error?.message);
                },
            })
        }

    const isPending = form.formState.isSubmitting;
    
    return (
        <div className="flex flex-col gap-6">
           <Card>
            <CardHeader className="text-center">
                <CardTitle>Get Started</CardTitle>
                <CardDescription>
                    Create an account to get Started   
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid gap-6">
                            <div className="flex flex-col gap-4">
                                <Button
                                 variant={"outline"}
                                 type="button"
                                 className="w-full"
                                 disabled={isPending}
                                 onClick={handleLoginGithub}
                                 >
                                    <Image
                                    src="/logos/github.svg"
                                    alt="GitHub"
                                    width={20}
                                    height={20}
                                    />
                                Continue with GitHub
                                </Button>
                                <Button
                                 variant={"outline"}
                                 type="button"
                                 className="w-full"
                                 disabled={isPending}
                                 onClick={handleLoginGoogle}
                                 >
                                    <Image
                                    src="/logos/google.svg"
                                    alt="Google"
                                    width={20}
                                    height={20}
                                    />
                                Continue with Google
                                </Button>
                            </div>
                            <div className="grid gap-6">
                                <FormField
                                 control={form.control}
                                 name="email"
                                 render = {({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                            type="email"
                                            placeholder="a@example.com"
                                            disabled={isPending}
                                            {...field}
                                            />
                                        </FormControl>
                                        <FormMessage
                                        
                                        />
                                    </FormItem>
                                 )}
                                 />
                                 <FormField
                                 control={form.control}
                                 name="password"
                                 render = {({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                            type="password"
                                            placeholder="********"
                                            disabled={isPending}
                                            {...field}
                                            />
                                        </FormControl>
                                        <FormMessage
                                        
                                        />
                                    </FormItem>
                                 )}
                                 />
                                 <FormField
                                 control={form.control}
                                 name="confirmPassword"
                                 render = {({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input
                                            type="password"
                                            placeholder="********"
                                            disabled={isPending}
                                            {...field}
                                            />
                                        </FormControl>
                                        <FormMessage
                                        
                                        />
                                    </FormItem>
                                 )}
                                 />
                                 <Button
                                 type="submit"
                                 disabled={isPending}
                                 className="w-full"
                                 >
                                    Sign Up
                                 </Button>
                            </div>
                            <div className="text-center text-sm">
                                Already have an account?{" "}
                                <Link href="/login" className="underline underline-offset-4">
                                    Login
                                </Link>
                            </div>
                        </div>
                    </form>
                </Form>
            </CardContent>
           </Card>
        </div>
    )
    
}

