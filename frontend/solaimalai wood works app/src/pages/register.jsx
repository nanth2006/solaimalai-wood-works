import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, UserPlus, Loader2, AlertCircle, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import api from "../api/api";
import logo from "../assets/logo.png";

function Register() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  // Simple password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { level: 0, text: "", color: "" };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1) return { level: 1, text: "Weak", color: "bg-red-500", textCol: "text-red-400" };
    if (score === 2 || score === 3) return { level: 2, text: "Medium", color: "bg-amber-500", textCol: "text-amber-400" };
    return { level: 3, text: "Strong", color: "bg-emerald-500", textCol: "text-emerald-400" };
  };

  const strength = getPasswordStrength();

  const validate = () => {
    let isValid = true;
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmError("");

    if (!name.trim()) {
      setNameError("Full name is required");
      isValid = false;
    }

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
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    }

    if (confirmPassword !== password) {
      setConfirmError("Passwords do not match");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setServerError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/register", {
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        nav("/home", { state: { name: res.data.user?.name } });
      }
    } catch (err) {
      setServerError(
        err.response?.data?.message ||
        "Registration failed. An account with this email may already exist."
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
      {/* Dark Wood Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#140b07]/85 via-[#1a0f09]/90 to-[#0d0704]/95" />

      {/* Decorative Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#C9873F]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative w-full max-w-lg">
        <div className="backdrop-blur-2xl bg-[#1f140e]/85 border border-[#C9873F]/30 rounded-3xl shadow-2xl p-6 sm:p-10 text-white transition-all duration-300 hover:border-[#C9873F]/50 my-6">
          
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center p-2.5 rounded-2xl bg-gradient-to-tr from-[#3a2012] to-[#693917] border border-[#C9873F]/40 shadow-lg shadow-black/40 mb-3">
              <img
                src={logo}
                alt="Solaimalai Wood Works"
                className="w-12 h-12 object-cover rounded-xl"
              />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9873F]/15 border border-[#C9873F]/30 text-[#F0A35C] text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Join Our Community</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#F3E9D8] tracking-tight">
              Create Your Account
            </h1>
            <p className="text-xs sm:text-sm text-[#D4C3AC] mt-1">
              Explore bespoke handcrafted teak furniture & woodcraft doors
            </p>
          </div>

          {/* Error Banner */}
          {serverError && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/70 border border-red-500/40 text-red-200 text-sm flex items-start gap-3 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-300">Registration Error</p>
                <p className="text-xs text-red-200/90 mt-0.5">{serverError}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-semibold uppercase tracking-wider text-[#E8D9C5] mb-1.5"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#C9873F]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  id="username"
                  placeholder="e.g. Nanthakumar"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (nameError) setNameError("");
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 bg-[#2d1b12]/90 border rounded-xl text-white placeholder-[#8f7a6a] text-sm outline-none transition-all duration-200 focus:bg-[#382216] ${
                    nameError
                      ? "border-red-500/80 focus:ring-2 focus:ring-red-500/30"
                      : "border-[#5c371e] focus:border-[#D4934B] focus:ring-2 focus:ring-[#D4934B]/25"
                  }`}
                />
              </div>
              {nameError && (
                <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                  <span>•</span> {nameError}
                </p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-[#E8D9C5] mb-1.5"
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
                  className={`w-full pl-10 pr-4 py-2.5 bg-[#2d1b12]/90 border rounded-xl text-white placeholder-[#8f7a6a] text-sm outline-none transition-all duration-200 focus:bg-[#382216] ${
                    emailError
                      ? "border-red-500/80 focus:ring-2 focus:ring-red-500/30"
                      : "border-[#5c371e] focus:border-[#D4934B] focus:ring-2 focus:ring-[#D4934B]/25"
                  }`}
                />
              </div>
              {emailError && (
                <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                  <span>•</span> {emailError}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-[#E8D9C5] mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#C9873F]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError("");
                  }}
                  className={`w-full pl-10 pr-11 py-2.5 bg-[#2d1b12]/90 border rounded-xl text-white placeholder-[#8f7a6a] text-sm outline-none transition-all duration-200 focus:bg-[#382216] ${
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

              {/* Password Strength Meter */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#A68F7A]">Password Strength:</span>
                    <span className={`font-semibold ${strength.textCol}`}>{strength.text}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 h-1.5 w-full bg-[#3d2417] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${strength.level >= 1 ? strength.color : 'bg-transparent'}`} />
                    <div className={`h-full rounded-full transition-all duration-300 ${strength.level >= 2 ? strength.color : 'bg-transparent'}`} />
                    <div className={`h-full rounded-full transition-all duration-300 ${strength.level >= 3 ? strength.color : 'bg-transparent'}`} />
                  </div>
                </div>
              )}

              {passwordError && (
                <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                  <span>•</span> {passwordError}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-semibold uppercase tracking-wider text-[#E8D9C5] mb-1.5"
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#C9873F]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (confirmError) setConfirmError("");
                  }}
                  className={`w-full pl-10 pr-11 py-2.5 bg-[#2d1b12]/90 border rounded-xl text-white placeholder-[#8f7a6a] text-sm outline-none transition-all duration-200 focus:bg-[#382216] ${
                    confirmError
                      ? "border-red-500/80 focus:ring-2 focus:ring-red-500/30"
                      : confirmPassword && confirmPassword === password
                      ? "border-emerald-500/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/25"
                      : "border-[#5c371e] focus:border-[#D4934B] focus:ring-2 focus:ring-[#D4934B]/25"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#B89F8B] hover:text-white transition"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {confirmPassword && confirmPassword === password && !confirmError && (
                <p className="mt-1 text-xs text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Passwords match
                </p>
              )}

              {confirmError && (
                <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                  <span>•</span> {confirmError}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 relative group overflow-hidden rounded-xl font-semibold text-sm py-3.5 px-4 text-[#1C130D] bg-gradient-to-r from-[#F0A35C] via-[#C9873F] to-[#E0A05A] hover:brightness-110 active:scale-[0.99] transition-all duration-200 shadow-lg shadow-[#C9873F]/25 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#1C130D]" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Sign Up & Continue</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#5c371e]/70" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-[#1f140e] text-[#A68F7A]">
                Already have an account?
              </span>
            </div>
          </div>

          {/* Switch to Login */}
          <div className="text-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border border-[#C9873F]/40 bg-[#2d1b12]/50 hover:bg-[#C9873F]/15 text-[#F0A35C] hover:text-[#FFC480] text-sm font-medium transition duration-200"
            >
              <span>Back to Sign In</span>
            </Link>
          </div>

          {/* Trust Badge */}
          <div className="mt-6 pt-4 border-t border-[#3e2516] flex items-center justify-center gap-2 text-xs text-[#A68F7A]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C9873F]" />
            <span>Your personal data is encrypted & secured</span>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Register;