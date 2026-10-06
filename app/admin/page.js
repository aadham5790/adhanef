"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // If signing in, redirect to login page
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  // If already authenticated, show admin panel preview
  if (status === "authenticated" && session) {
    return (
      <div className="admin-dashboard">
        <h1>Ady Hanef Admin</h1>
        <p>Welcome, {session.user?.email || "Admin"}</p>
        <div className="admin-actions">
          <button 
            onClick={() => router.push("/admin/dashboard")}
            className="btn btn-primary"
          >
            Go to Dashboard
          </button>
          <button onClick={signOut} className="btn btn-secondary">
            Logout
          </button>
        </div>
      </div>
    );
  }

  // If not authenticated, show login prompt or redirect to signIn
  return (
    <div className="admin-auth">
      <h1>Admin Panel</h1>
      <p>Please log in to access the admin panel.</p>
      <div className="auth-actions">
        <button 
          onClick={() => signIn("credentials")}
          className="btn btn-primary"
        >
          Login
        </button>
        <button 
          onClick={() => router.push("/")}
          className="btn btn-secondary"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}