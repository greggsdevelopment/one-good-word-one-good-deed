import React from "react";
import { Link } from "react-router-dom";
import BackButton from "@/components/app/BackButton";

/**
 * Branded sign-in frame. A custom look (not the builder's stock screen) matters
 * for App Store review, and Terms and Privacy must be reachable before signup.
 */
export default function AuthLayout({ icon: Icon, title, subtitle, footer, children }) {
  return (
    <div className="dark min-h-screen bg-black text-cream relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full opacity-[0.18]" style={{ background: "radial-gradient(closest-side, var(--rb-purple), transparent)" }} />
        <div className="absolute -bottom-40 -right-40 w-[520px] h-[520px] rounded-full opacity-[0.16]" style={{ background: "radial-gradient(closest-side, var(--rb-blue), transparent)" }} />
      </div>
      <div className="relative max-w-md mx-auto px-5 pt-4 pb-12">
        <BackButton fallback="/" />
        <div className="text-center mt-6 mb-8">
          <div className="relative inline-flex w-20 h-20 rounded-full mb-5">
            <span aria-hidden="true" className="absolute -inset-[3px] rounded-full animate-spin-slow" style={{ background: "var(--rainbow-conic)" }} />
            <img src="/brand/logo-256.webp" alt="One Good Word...One Good Deed" className="relative w-20 h-20 rounded-full object-cover bg-black" />
            {Icon && (
              <span className="absolute -bottom-1 -right-1 grid place-items-center w-8 h-8 rounded-full bg-gold text-ink ring-4 ring-black">
                <Icon className="w-4 h-4" aria-hidden="true" />
              </span>
            )}
          </div>
          <h1 className="font-anton text-4xl tracking-wide text-cream uppercase">{title}</h1>
          {subtitle && <p className="font-barlow text-cream/60 mt-2">{subtitle}</p>}
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#0e0e11] p-6 sm:p-8 shadow-2xl shadow-black/60 [&_label]:text-cream/80 [&_input]:bg-black/40 [&_input]:border-white/15 [&_input]:text-cream">
          {children}
        </div>
        {footer && <p className="text-center font-barlow text-sm text-cream/60 mt-6">{footer}</p>}
        <p className="text-center font-barlow text-xs text-cream/40 mt-4">
          By continuing you agree to our{" "}
          <Link to="/terms" className="underline underline-offset-2 hover:text-cream">Terms</Link> and{" "}
          <Link to="/privacy" className="underline underline-offset-2 hover:text-cream">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
