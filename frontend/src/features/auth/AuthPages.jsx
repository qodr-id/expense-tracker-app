import { Link, useNavigate } from "@tanstack/react-router";
import React, { useState } from "react";
import { request } from "../../shared/request";
import { authClient } from "../../shared/auth-client";

function AuthForm({ mode }) {
  const navigate = useNavigate();
  const isSignUp = mode === "sign-up";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    const result = isSignUp
      ? await authClient.signUp.email({ name, email, password })
      : await authClient.signIn.email({ email, password });

    setIsSubmitting(false);

    if (result.error) {
      setMessage(result.error.message ?? "Auth gagal.");
      return;
    }

    navigate({ to: "/protected" });
  }

  return (
    <section className="panel auth-panel">
      <header className="header">
        <p className="eyebrow">Better Auth</p>
        <h1>{isSignUp ? "Sign up" : "Sign in"}</h1>
      </header>
      <form className="note-form" onSubmit={handleSubmit}>
        {isSignUp ? (
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Nama"
            required
          />
        ) : null}
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password minimal 8 karakter"
          minLength={8}
          required
        />
        <button disabled={isSubmitting}>{isSubmitting ? "Memproses..." : isSignUp ? "Sign up" : "Sign in"}</button>
      </form>
      {message ? <p className="message error">{message}</p> : null}
      <p className="message">
        {isSignUp ? "Sudah punya akun? " : "Belum punya akun? "}
        <Link to={isSignUp ? "/sign-in" : "/sign-up"}>{isSignUp ? "Sign in" : "Sign up"}</Link>
      </p>
    </section>
  );
}

export function SignUpPage() {
  return <AuthForm mode="sign-up" />;
}

export function SignInPage() {
  return <AuthForm mode="sign-in" />;
}

export function PublicPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  async function loadPublicRoute() {
    setError("");
    try {
      setData(await request("/api/public"));
    } catch (routeError) {
      setError(routeError.message);
    }
  }

  return (
    <section className="panel">
      <header className="header">
        <p className="eyebrow">Public route</p>
        <h1>Bisa dibuka tanpa login</h1>
      </header>
      <button onClick={loadPublicRoute}>Cek route publik</button>
      {data ? <pre className="code-block">{JSON.stringify(data, null, 2)}</pre> : null}
      {error ? <p className="message error">{error}</p> : null}
    </section>
  );
}

export function ProtectedPage() {
  const { data: session, isPending, refetch } = authClient.useSession();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  async function loadProtectedRoute() {
    setError("");
    try {
      setData(await request("/api/protected"));
    } catch (routeError) {
      setData(null);
      setError(routeError.message);
    }
  }

  async function handleSignOut() {
    await authClient.signOut();
    setData(null);
    await refetch();
  }

  return (
    <section className="panel">
      <header className="header">
        <p className="eyebrow">Protected route</p>
        <h1>Butuh sesi login</h1>
      </header>
      {isPending ? <p className="message">Memeriksa sesi...</p> : null}
      {!isPending && !session ? (
        <div className="auth-card">
          <p>Kamu belum sign in. Route server `/api/protected` akan menolak request ini.</p>
          <Link to="/sign-in">Sign in dulu</Link>
        </div>
      ) : null}
      {session ? (
        <div className="auth-card">
          <p>
            Login sebagai <strong>{session.user.name}</strong> ({session.user.email})
          </p>
          <div className="pager">
            <button onClick={loadProtectedRoute}>Cek route protected</button>
            <button className="ghost-button" onClick={handleSignOut}>Sign out</button>
          </div>
        </div>
      ) : null}
      {data ? <pre className="code-block">{JSON.stringify(data, null, 2)}</pre> : null}
      {error ? <p className="message error">{error}</p> : null}
    </section>
  );
}
