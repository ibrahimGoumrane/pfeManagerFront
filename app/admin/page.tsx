import React from "react"
// import library for redirecting to the admin dashboard
import { redirect } from "next/navigation"

const Main = () => {
    // redirect to the admin dashboard
    redirect("/admin/reports")
    return <div className="flex h-screen items-center justify-center">Redirecting...</div>
};

export default Main;
