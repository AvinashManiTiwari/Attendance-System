import { useState } from "react";
import { Link } from "react-router";
import { apiFetch } from "../services/api";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetUrl, setResetUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    // setResetUrl("");

    try {
      setLoading(true);

      const data = await apiFetch("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({
          email
        })
      });

      setMessage(data.message);

      // Development testing ke liye
      // if (data.resetUrl) {
      //   setResetUrl(data.resetUrl);
      // }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-gray-900 text-center">
          Forgot Password
        </h1>

        <p className="text-gray-500 text-center mt-2 mb-7">
          Enter your registered email to reset your password.
        </p>

        {message && (
          <div className="mb-4 bg-green-50 border border-green-300 text-green-700 rounded-lg p-3">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 bg-red-50 border border-red-300 text-red-700 rounded-lg p-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your registered email"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-xl transition"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

        </form>

        {/* Development testing link */}
        {/* {resetUrl && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-300 rounded-lg">

            <p className="text-sm font-semibold text-gray-700 mb-2">
              Development Reset Link:
            </p>

            <a
              href={resetUrl}
              className="text-blue-600 break-all text-sm underline"
            >
              {resetUrl}
            </a>

          </div>
        )} */}

        <div className="text-center mt-6">
          <Link
            to="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            ← Back to Login
          </Link>
        </div>

      </div>

    </div>
  );
}

export default ForgotPasswordPage;