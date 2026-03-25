import { Link } from "wouter";
import { ArrowRight, ShieldCheck, Zap, BarChart3, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <div className="relative w-full">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-20 overflow-hidden text-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
            alt="Hero Tech Background" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="z-10 max-w-4xl mx-auto flex flex-col items-center"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-semibold uppercase tracking-widest mb-8 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse mr-2" />
            Hackathon MVP v1.0
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tight mb-6 leading-tight">
            AI-Powered <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary text-glow">Driver Safety</span> & Civic Intelligence
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
            Predict, prevent, and shape safer driving behavior on Indian urban roads. 
            Real-time hazard awareness for riders, and actionable intelligence for city operators.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link href="/demo" className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_30px_rgba(0,184,217,0.3)] hover:shadow-[0_0_40px_rgba(0,184,217,0.5)] transition-all hover:-translate-y-1 flex items-center justify-center group text-lg">
              Start Live Demo
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/score" className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-white/5 border border-white/10 text-foreground hover:bg-white/10 transition-all backdrop-blur-md flex items-center justify-center text-lg">
              View Dashboard
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-white/5 bg-black/20 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x-0 md:divide-x divide-white/5">
            {[
              { label: "Drivers Monitored", value: "50K+" },
              { label: "Hazards Detected", value: "2.3M" },
              { label: "AI Accuracy", value: "94.2%" },
              { label: "Cities Active", value: "5" }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col"
              >
                <span className="text-4xl md:text-5xl font-display font-bold text-foreground mb-2">{stat.value}</span>
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Core Capabilities</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">A comprehensive ecosystem turning edge AI detections into systemic safety improvements.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Activity,
                title: "Real-time Edge AI",
                desc: "Detects potholes, wrong-side driving, and lane violations instantly via smartphone camera.",
                color: "from-primary/20 to-primary/5 text-primary border-primary/20"
              },
              {
                icon: ShieldCheck,
                title: "Civic Driving Score",
                desc: "A standardized metric evaluating driver safety, compliance, and noise discipline over time.",
                color: "from-success/20 to-success/5 text-success border-success/20"
              },
              {
                icon: BarChart3,
                title: "Urban Intelligence",
                desc: "Aggregated hotspot data helping city planners prioritize road repairs and traffic enforcement.",
                color: "from-secondary/20 to-secondary/5 text-secondary border-secondary/20"
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="glass-card p-8 rounded-3xl hover:bg-card/60 transition-all duration-300 group cursor-default"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${feature.color}`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
