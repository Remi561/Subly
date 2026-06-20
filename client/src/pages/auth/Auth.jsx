import { NavLink, useLocation, Form, useActionData, useNavigation } from "react-router";
import {Lock, Ban }from 'lucide-react'
export default function Auth() {
  const location = useLocation();
  const actionData = useActionData();
  const { state } = useNavigation();



  

  const isLogin = location.pathname === "/auth/login";

  return (
    <main className="min-h-screen bg-subly-background flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-subly-border bg-subly-card p-8 shadow-xl shadow-subly-soft-blue">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-subly-brand-blue to-subly-brand-purple text-white text-section-title font-bold shadow-lg shadow-subly-soft-purple">
            <Lock />
          </div>

          <h1 className="text-page-title font-bold text-subly-text-primary">
            {isLogin ? "Welcome back" : "Create account"}
          </h1>

          <p className="mt-2 text-body-sm text-subly-text-secondary">
            {isLogin
              ? "Login to manage your subscriptions"
              : "Start tracking your subscriptions with Subly"}
          </p>
        </div>

        <div className="mb-6 grid grid-cols-2 rounded-xl bg-subly-soft-blue p-1">
          <NavLink
            to="/auth/login"
            className={({ isActive }) =>
              `rounded-lg py-2 text-button font-medium text-center transition ${
                isActive
                  ? "bg-gradient-to-r from-subly-brand-blue to-subly-brand-purple text-white shadow"
                  : "text-subly-brand-blue hover:text-subly-brand-purple"
              }`
            }
          >
            Login
          </NavLink>

          <NavLink
            to="/auth/register"
            className={({ isActive }) =>
              `rounded-lg py-2 text-button font-medium text-center transition ${
                isActive
                  ? "bg-gradient-to-r from-subly-brand-blue to-subly-brand-purple text-white shadow"
                  : "text-subly-brand-blue hover:text-subly-brand-purple"
              }`
            }
          >
            Register
          </NavLink>
        </div>

        {actionData?.message && state !== 'loading' ? (
          <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-body-sm text-subly-danger">
            {actionData?.message}
          </p>
        ): null}

        <Form method="post" className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1 block text-label font-medium text-subly-text-primary"
                  >
                    Full name
                  </label>
                  <input
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    id="name"
                    className="w-full rounded-xl border border-subly-border bg-subly-card px-4 py-3 text-input text-subly-text-primary outline-none transition placeholder:text-subly-text-secondary focus:border-subly-brand-purple focus:ring-4 focus:ring-subly-soft-purple"
                  />
                </div>
                {actionData?.errors?.name && (
                  <div className="text-xs flex items-center gap-1 text-subly-danger">
                    <Ban size={12} /> <span>{actionData.errors.name}</span>
                  </div>
                )}
              </div>

              <div>
                <div>
                  <label
                    htmlFor="currency"
                    className="mb-1 block text-label font-medium text-subly-text-primary"
                  >
                    Country currency
                  </label>
                  <select
                    name="baseCurrency"
                    id="currency"
                    className="w-full rounded-xl border border-subly-border bg-subly-card px-4 py-3 text-input text-subly-text-primary outline-none transition focus:border-subly-brand-purple focus:ring-4 focus:ring-subly-soft-purple"
                  >
                    <option value="USD">USD</option>
                  </select>
                  <p className="text-xs text-subly-text-secondary px-1">
                    Note: Choose your currency carefully, you won't be able to
                    edit it again
                  </p>
                </div>
                {actionData?.errors?.baseCurrency && (
                  <div className="text-xs flex items-center gap-1 text-subly-danger">
                    <Ban size={12} />{" "}
                    <span>{actionData.errors.baseCurrency}</span>
                  </div>
                )}
              </div>

              <div>
                <div>
                  <label
                    htmlFor="username"
                    className="mb-1 block text-label font-medium text-subly-text-primary"
                  >
                    Username
                  </label>
                  <input
                    name="username"
                    type="text"
                    placeholder="John@12"
                    id="username"
                    className="w-full rounded-xl border border-subly-border bg-subly-card px-4 py-3 text-input text-subly-text-primary outline-none transition placeholder:text-subly-text-secondary focus:border-subly-brand-purple focus:ring-4 focus:ring-subly-soft-purple"
                  />
                </div>
                {actionData?.errors?.username && (
                  <div className="text-body-sm flex items-center gap-1 text-subly-danger">
                    <ul>
                      {actionData.errors.username.map((error, i) => (
                        <li key={i} className="flex items-center gap-1 text-xs">
                          <Ban size={12} /> <span>{error}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}

          <div>
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-label font-medium text-subly-text-primary"
              >
                Email address
              </label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                id="email"
                className="w-full rounded-xl border border-subly-border bg-subly-card px-4 py-3 text-input text-subly-text-primary outline-none transition placeholder:text-subly-text-secondary focus:border-subly-brand-purple focus:ring-4 focus:ring-subly-soft-purple"
              />
            </div>
            {actionData?.errors?.email && (
              <div className="text-xs flex items-center gap-1 text-subly-danger">
                <Ban size={12} /> <span>{actionData.errors.email}</span>
              </div>
            )}
          </div>

          <div>
            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-label font-medium text-subly-text-primary"
              >
                Password
              </label>
              <input
                name="password"
                type="password"
                id="password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-subly-border bg-subly-card px-4 py-3 text-input text-subly-text-primary outline-none transition placeholder:text-subly-text-secondary focus:border-subly-brand-purple focus:ring-4 focus:ring-subly-soft-purple"
              />
            </div>
            {actionData?.errors?.password && (
              <div className="text-body-sm flex items-center gap-1 text-subly-danger">
                <ul>
                  {actionData.errors.password.map((error, i) => (
                    <li key={i} className="flex items-center gap-1 text-xs">
                      <Ban size={12} /> <span>{error}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {!isLogin && (
            <div>
              <div>
                <label
                  htmlFor="confirm-password"
                  className="mb-1 block text-label font-medium text-subly-text-primary"
                >
                  Confirm password
                </label>
                <input
                  name="confirmPassword"
                  type="password"
                  id="confirm-password"
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-subly-border bg-subly-card px-4 py-3 text-input text-subly-text-primary outline-none transition placeholder:text-subly-text-secondary focus:border-subly-brand-blue focus:ring-4 focus:ring-subly-soft-blue"
                />
              </div>
              {actionData?.errors?.confirmPassword && (
                <div className="text-xs flex items-center gap-1 text-subly-danger">
                  <Ban size={12} />{" "}
                  <span>{actionData.errors.confirmPassword}</span>
                </div>
              )}
            </div>
          )}

          {isLogin && (
            <div className="flex items-center justify-between text-body-sm">
              <button
                type="button"
                className="font-medium text-subly-brand-blue hover:text-subly-brand-purple"
              >
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={state === "submitting"}
            className="w-full rounded-xl bg-gradient-to-r from-subly-brand-blue to-subly-brand-purple py-3 text-button font-semibold text-white shadow-lg shadow-subly-soft-purple transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isLogin && state === "submitting"
              ? "Logging in..."
              : isLogin
                ? "Login"
                : !isLogin && state === "submitting"
                  ? "Creating account..."
                  : "Create account"}
          </button>
        </Form>

        <p className="mt-6 text-center text-body-sm text-subly-text-secondary">
          {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
          <NavLink
            to={isLogin ? "/auth/register" : "/auth/login"}
            className="font-semibold text-subly-brand-blue hover:text-subly-brand-purple"
          >
            {isLogin ? "Register" : "Login"}
          </NavLink>
        </p>
      </div>
    </main>
  );
}
