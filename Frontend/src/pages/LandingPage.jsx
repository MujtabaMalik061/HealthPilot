import {
  ArrowRight,
  CalendarDays,
  Check,
  FileText,
  Heart,
  Stethoscope,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import "../assets/style/LandingPage.css";

const features = [
  {
    icon: Stethoscope,
    title: "Find your doctor",
    description:
      "Explore healthcare professionals and find the right specialist for your needs.",
    to: "/landing-doctors",
    action: "Explore doctors",
  },
  {
    icon: CalendarDays,
    title: "Make time for your health",
    description:
      "Book appointments and keep your upcoming visits organized in one place.",
    to: "/signIn",
    action: "Manage appointments",
  },
  {
    icon: FileText,
    title: "Keep your care connected",
    description:
      "Access your reports and appointment history from your personal dashboard.",
    to: "/signIn",
    action: "View your dashboard",
  },
];

export default function LandingPage() {
  return (
    <main id="main-content" className="hp-home">
      <section className="landing-page-hero">
        <div className="hp-hero-grid">
          <div className="hp-hero-copy">
            <div className="landing-page-hero-badge">
              <Heart size={16} /> Your health. A little simpler.
            </div>
            <h1 className="landing-page-hero-title">
              Good care starts with{" "}
              <span className="landing-page-text-primary">a connection.</span>
            </h1>
            <p className="landing-page-hero-subtitle">
              Find a doctor, plan your next visit, and keep your health journey
              in one place. We’re here to help you take the next step.
            </p>
            <div className="landing-page-hero-cta">
              <Link
                to="/landing-doctors"
                className="landing-page-btn landing-page-btn-primary"
              >
                Find a doctor <ArrowRight size={18} />
              </Link>
              <Link
                to="/landing-services"
                className="landing-page-btn landing-page-btn-outline"
              >
                Explore services
              </Link>
            </div>
            <p className="hp-hero-note">
              <Check size={16} /> For patients, doctors, and the care that
              connects them.
            </p>
          </div>
          <div
            className="hp-care-visual"
            aria-label="Illustration of connected healthcare tools"
          >
            <div className="hp-orbit hp-orbit-one" />
            <div className="hp-orbit hp-orbit-two" />
            <div className="hp-care-symbol">
              <Heart size={64} strokeWidth={1.5} />
              <span>Care, connected.</span>
            </div>
            <div className="hp-visual-card hp-visual-top">
              <div className="hp-card-icon">
                <Stethoscope size={24} />
              </div>
              <div>
                <strong>A doctor for your needs</strong>
                <span>Discover your care team</span>
              </div>
            </div>
            <div className="hp-visual-card hp-visual-bottom">
              <div className="hp-card-icon">
                <CalendarDays size={24} />
              </div>
              <div>
                <strong>Your next step, organized</strong>
                <span>Appointments in one place</span>
              </div>
              <Check size={18} />
            </div>
            <span className="hp-visual-caption">
              A simpler path to better care
            </span>
          </div>
        </div>
      </section>
      <div className="hp-benefit-strip">
        <span>
          <Stethoscope size={19} /> Discover specialists
        </span>
        <span>
          <CalendarDays size={19} /> Plan your appointments
        </span>
        <span>
          <FileText size={19} /> Access your health records
        </span>
      </div>
      <section className="landing-page-features">
        <div className="landing-page-features-inner">
          <div className="hp-section-heading">
            <div>
              <p className="hp-eyebrow">CARE THAT FITS YOUR LIFE</p>
              <h2 className="landing-page-section-title">
                Less admin. More peace of mind.
              </h2>
            </div>
            <p>
              Everything you need to take a more active role in your healthcare.
            </p>
          </div>
          <div className="hp-feature-grid">
            {features.map(({ icon, title, description, to, action }) => {
              const Icon = icon;
              return (
                <article className="landing-page-feature-card" key={title}>
                  <div className="landing-page-feature-icon-wrapper">
                    <Icon size={25} />
                  </div>
                  <h3 className="landing-page-feature-title">{title}</h3>
                  <p className="landing-page-feature-desc">{description}</p>
                  <Link className="hp-text-link" to={to}>
                    {action}
                    <ArrowRight size={16} />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <section className="hp-how-section">
        <div className="landing-page-features-inner">
          <p className="hp-eyebrow">YOUR NEXT STEP</p>
          <h2 className="landing-page-section-title">
            Getting started is simple.
          </h2>
          <div className="hp-steps">
            {[
              {
                title: "Explore your options",
                text: "Browse services and doctors to find the care you’re looking for.",
              },
              {
                title: "Create your account",
                text: "Set up your profile so you can book and manage your visits.",
              },
              {
                title: "Stay on top of your care",
                text: "Keep appointments and reports together in your dashboard.",
              },
            ].map((step, i) => (
              <article key={step.title}>
                <span className="hp-step-number">0{i + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="landing-page-cta">
        <div className="landing-page-cta-inner">
          <div className="hp-cta-icon">
            <Users size={28} />
          </div>
          <h2 className="landing-page-cta-title">
            Your next chapter of care starts here.
          </h2>
          <p className="landing-page-cta-subtitle">
            Create your account and bring your healthcare into focus.
          </p>
          <Link
            to="/signUp"
            className="landing-page-btn landing-page-btn-primary landing-page-cta-btn"
          >
            Get started <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
