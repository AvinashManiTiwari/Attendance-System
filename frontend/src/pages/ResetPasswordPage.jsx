import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { apiFetch } from "../services/api";

function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Check password match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Check minimum length
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const data = await apiFetch(
        `/auth/reset-password/${token}`,
        {
          method: "POST",
          body: JSON.stringify({
            password
          })
        }
      );

      setSuccess(data.message);

      // Go to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);

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
          Reset Password
        </h1>

        <p className="text-gray-500 text-center mt-2 mb-7">
          Enter your new password below.
        </p>

        {/* Error */}
        {error && (
          <div className="mb-5 bg-red-50 border border-red-300 text-red-700 rounded-lg p-3">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-5 bg-green-50 border border-green-300 text-green-700 rounded-lg p-3">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* New Password */}
          <div className="mb-5">

            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

          </div>

          {/* Confirm Password */}
          <div className="mb-5">

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-xl transition"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

        </form>

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

export default ResetPasswordPage;