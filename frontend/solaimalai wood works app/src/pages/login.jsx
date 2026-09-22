import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, LogIn, Loader2, AlertCircle, ShieldCheck, Sparkles } from "lucide-react";
import api from "../api/api";
import logo from "../assets/logo.png";

function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let isValid = true;
    setEmailError("");
    setPasswordError("");

    if (!email.trim()) {
      setEmailError("Email address is required");
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoginError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email: email.trim(),
        password,
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        nav("/home");
      }
    } catch (err) {
      setLoginError(
        err.response?.data?.message ||
        "Invalid email or password. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=2000&q=80)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark Ambient Overlay with Woodcraft Tint */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#140b07]/85 via-[#1a0f09]/90 to-[#0d0704]/95" />

      {/* Decorative Warm Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#C9873F]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative w-full max-w-md">
        {/* Brand Card */}
        <div className="backdrop-blur-2xl bg-[#1f140e]/85 border border-[#C9873F]/30 rounded-3xl shadow-2xl p-6 sm:p-10 text-white transition-all duration-300 hover:border-[#C9873F]/50">
          
          {/* Header & Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-2.5 rounded-2xl bg-gradient-to-tr from-[#3a2012] to-[#693917] border border-[#C9873F]/40 shadow-lg shadow-black/40 mb-4">
              <img
                src={logo}
                alt="Solaimalai Wood Works"
                className="w-14 h-14 object-cover rounded-xl"
              />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9873F]/15 border border-[#C9873F]/30 text-[#F0A35C] text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Handcrafted Heritage</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#F3E9D8] tracking-tight">
              Welcome Back
            </h1>
            <p className="text-xs sm:text-sm text-[#D4C3AC] mt-1.5">
              Sign in to manage orders & custom woodcraft requests
            </p>
          </div>

          {/* Error Banner */}
          {loginError && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/70 border border-red-500/40 text-red-200 text-sm flex items-start gap-3 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-300">Authentication Failed</p>
                <p className="text-xs text-red-200/90 mt-0.5">{loginError}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-[#E8D9C5] mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#C9873F]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  id="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError("");
                  }}
                  className={`w-full pl-10 pr-4 py-3 bg-[#2d1b12]/90 border rounded-xl text-white placeholder-[#8f7a6a] text-sm outline-none transition-all duration-200 focus:bg-[#382216] ${
                    emailError
                      ? "border-red-500/80 focus:ring-2 focus:ring-red-500/30"
                      : "border-[#5c371e] focus:border-[#D4934B] focus:ring-2 focus:ring-[#D4934B]/25"
                  }`}
                />
              </div>
              {emailError && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                  <span>•</span> {emailError}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#E8D9C5]"
                >
                  Password
                </label>
                <span className="text-xs text-[#C9873F] hover:text-[#E0A05A] transition cursor-pointer">
                  Forgot?
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#C9873F]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError("");
                  }}
                  className={`w-full pl-10 pr-11 py-3 bg-[#2d1b12]/90 border rounded-xl text-white placeholder-[#8f7a6a] text-sm outline-none transition-all duration-200 focus:bg-[#382216] ${
                    passwordError
                      ? "border-red-500/80 focus:ring-2 focus:ring-red-500/30"
                      : "border-[#5c371e] focus:border-[#D4934B] focus:ring-2 focus:ring-[#D4934B]/25"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#B89F8B] hover:text-white transition"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                  <span>•</span> {passwordError}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <label className="flex items-center gap-2 text-xs text-[#D4C3AC] cursor-pointer select-none">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded border-[#5c371e] text-[#C9873F] bg-[#2d1b12] focus:ring-[#C9873F] focus:ring-offset-0"
                />
                <span>Remember me on this device</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full relative group overflow-hidden rounded-xl font-semibold text-sm py-3.5 px-4 text-[#1C130D] bg-gradient-to-r from-[#F0A35C] via-[#C9873F] to-[#E0A05A] hover:brightness-110 active:scale-[0.99] transition-all duration-200 shadow-lg shadow-[#C9873F]/25 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#1C130D]" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#5c371e]/70" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-[#1f140e] text-[#A68F7A]">
                New to Solaimalai?
              </span>
            </div>
          </div>

          {/* Switch to Register */}
          <div className="text-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border border-[#C9873F]/40 bg-[#2d1b12]/50 hover:bg-[#C9873F]/15 text-[#F0A35C] hover:text-[#FFC480] text-sm font-medium transition duration-200"
            >
              <span>Create New Account</span>
            </Link>
          </div>

          {/* Trust badge */}
          <div className="mt-8 pt-4 border-t border-[#3e2516] flex items-center justify-center gap-2 text-xs text-[#A68F7A]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C9873F]" />
            <span>Secure 256-bit Encrypted Authentication</span>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;