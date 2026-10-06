export default function LoginPage() {
  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Admin Login</h1>
        <form
          action="/api/auth/signin"
          method="POST"
          className="login-form"
        >
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                placeholder="admin@adyhanef.com"
                autoComplete="email"
                required
              />
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                placeholder="Password"
                autoComplete="current-password"
                required
              />
            </label>
          </div>
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>
        {/** Display NextAuth errors **/}
        {typeof window !== "undefined" && document.getElementById('login-error') && (
          <div id="login-error" className="login-error">
            <p>Invalid email or password. Please try again.</p>
          </div>
        )}
      </div>
    </div>
  );
}