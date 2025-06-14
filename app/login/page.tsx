import type { Metadata } from "next"
import Link from "next/link"

import { LoginForm } from "@/components/login-form"

export const metadata: Metadata = {
  title: "Login - PfeArchive",
  description: "Login to your PfeArchive account",
}

export default function LoginPage() {   
  return (     
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">       
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Logo and Header Section */}
        <div className="bg-pfebrand py-6 px-8">
          <div className="flex flex-col items-center justify-center space-y-3">
            {/* You can add your logo here */}
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
              <span className="text-pfebrand text-xl font-bold">PfA</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">PfeArchive</h1>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col space-y-2 text-center">
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Welcome back</h2>
              <p className="text-sm text-muted-foreground">Enter your credentials to sign in to your account</p>
            </div>
            
            <LoginForm />
            
            <div className="flex justify-center">
              <Link href="/forgot-password" className="text-sm text-muted-foreground hover:text-pfebrand transition-colors">
                Forgot your password?
              </Link>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">Or</span>
              </div>
            </div>
            
            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-medium text-pfebrand hover:text-pfebrand/80 transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
        
        {/* Footer */}
        {/* <div className="px-8 py-4 border-t border-gray-100">
          <p className="text-xs text-center text-muted-foreground">
            By logging in, you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-2 hover:text-pfebrand">Terms of Service</Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-pfebrand">Privacy Policy</Link>
          </p>
        </div> */}
      </div>
    </div>
  ) 
}