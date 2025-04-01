import type { Metadata } from "next"
import Link from "next/link"
import { SignUpForm } from "@/components/signup-form"

export const metadata: Metadata = {
  title: "Sign Up - PfeArchive",
  description: "Create a new account on PfeArchive",
}

export default function SignUpPage() {
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
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Create an account</h2>
              <p className="text-sm text-muted-foreground">Join our community of researchers and students</p>
            </div>
            
            <SignUpForm />
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">Or</span>
              </div>
            </div>
            
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-pfebrand hover:text-pfebrand/80 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
        
        {/* Footer */}
        <div className="px-8 py-4 border-t border-gray-100">
          <p className="text-xs text-center text-muted-foreground">
            By signing up, you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-2 hover:text-pfebrand">Terms of Service</Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-pfebrand">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  )
}