import React from 'react';
import { useForm } from "react-hook-form"
import { useNavigate, useLocation } from "react-router-dom"
import { useDispatch } from "react-redux"
import { useLoginMutation } from "@/redux/features/auth/authApi"
import { setCredentials } from "@/redux/features/auth/authSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert.jsx"
import { Loader2, Eye, EyeOff } from "lucide-react"
import toast from 'react-hot-toast'

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [login, { isLoading, error }] = useLoginMutation()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const [showPassword, setShowPassword] = React.useState(false)

    const from = location.state?.from?.pathname || "/admin"

    const onSubmit = async (data) => {
        try {
            const userData = await login(data).unwrap()

            dispatch(setCredentials({
                user: userData,
                token: userData.token,
                roleId: userData.roleId
            }))
            toast.success("Login successful!");
            navigate(from, { replace: true })
        } catch (err) {
            console.error('Failed to login:', err)
            toast.error(err?.data?.message || 'Login failed.');
        }
    }

    const handleDirectLogin = () => {
        onSubmit({ email: "[EMAIL_ADDRESS]", password: "5555" })
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Sign in</CardTitle>
                    <CardDescription className="text-center">
                        Enter your email and password to access the admin panel
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {error && (
                            <Alert variant="destructive" className="mb-4 bg-red-50 text-red-900 border-red-200 p-3 rounded text-sm">
                                <AlertDescription>
                                    {error?.data?.message || 'Login failed. Please check your credentials.'}
                                </AlertDescription>
                            </Alert>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="text"
                                placeholder="Enter your email"
                                className="h-12"
                                {...register("email", { required: "email is required" })}
                            />
                            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    className="h-12 pr-10"
                                    {...register("password", { required: "Password is required" })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                        </div>
                        <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
                        </Button>
                        <Button
                            type="button"
                            className="w-full h-12 text-lg mt-4 bg-green-600 hover:bg-green-700 text-white"
                            onClick={handleDirectLogin}
                            disabled={isLoading}
                        >
                            Direct Login (Demo)
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    {/* Add footer content if needed */}
                </CardFooter>
            </Card>
        </div>
    )
}
