"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

// Animated light grid background
function GridBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      // Light base gradient
      const bg = ctx.createLinearGradient(0, 0, width, height);
      bg.addColorStop(0, "#f0f4ff");
      bg.addColorStop(0.5, "#f7f9ff");
      bg.addColorStop(1, "#eef2ff");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      // Subtle dot grid
      const spacing = 32;
      for (let x = 0; x < width; x += spacing) {
        for (let y = 0; y < height; y += spacing) {
          const pulse = 0.12 + 0.06 * Math.sin(t * 0.35 + x * 0.02 + y * 0.02);
          ctx.beginPath();
          ctx.arc(x, y, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(58,90,255,${pulse})`;
          ctx.fill();
        }
      }

      // Soft blue glow orb — left
      const g1 = ctx.createRadialGradient(width * 0.1, height * 0.5, 0, width * 0.1, height * 0.5, width * 0.4);
      g1.addColorStop(0, "rgba(58,90,255,0.07)");
      g1.addColorStop(1, "transparent");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, width, height);

      // Soft blue glow orb — right
      const g2 = ctx.createRadialGradient(width * 0.85, height * 0.35, 0, width * 0.85, height * 0.35, width * 0.35);
      g2.addColorStop(0, "rgba(99,130,255,0.08)");
      g2.addColorStop(1, "transparent");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, width, height);

      t++;
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
    />
  );
}

// Stat item
function Stat({ value, label, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="flex flex-col gap-0.5"
    >
      <span
        className="text-[22px] font-bold tracking-tight"
        style={{ fontFamily: "'Syne', sans-serif", color: "#0f1535" }}
      >
        {value}
      </span>
      <span
        className="text-[10px] tracking-[0.2em] uppercase font-semibold"
        style={{ color: "rgba(58,90,255,0.6)" }}
      >
        {label}
      </span>
    </motion.div>
  );
}

export default function HeroBanner() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
      `}</style>

      <section
        className="relative min-h-screen w-full overflow-hidden flex items-center"
        style={{ background: "#f0f4ff" }}
      >
        <GridBackground />

        {/* Left edge accent line */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute left-0 top-[10%] bottom-[10%] w-[2px] origin-top"
          style={{ background: "linear-gradient(to bottom, transparent, #3a5aff, transparent)" }}
        />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

            {/* ── LEFT COLUMN ── */}
            <div className="flex flex-col gap-7">

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 self-start"
              >
                <span
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-semibold tracking-[0.15em] uppercase"
                  style={{
                    borderColor: "rgba(58,90,255,0.25)",
                    background: "rgba(58,90,255,0.07)",
                    color: "#3a5aff",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  New Release
                  <span
                    className="px-2 py-0.5 rounded-full text-[9px] tracking-widest"
                    style={{ background: "rgba(58,90,255,0.12)", color: "#2a4aef" }}
                  >
                    V2.4 NEURAL CORE
                  </span>
                </span>
              </motion.div>

              {/* Heading */}
              <div className="flex flex-col gap-1">
                <motion.h1
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.6 }}
                  className="text-[32px] md:text-[52px] lg:text-[58px] font-extrabold leading-[1.05]"
                  style={{ fontFamily: "'Syne', sans-serif", color: "#0a1030" }}
                >
                  Next-Gen
                  <br />
                  Architecture
                </motion.h1>
                <motion.h2
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="text-[32px] md:text-[52px] lg:text-[58px] font-extrabold leading-[1.05]"
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    background: "linear-gradient(90deg, #3a5aff 0%, #5a7fff 60%, #7a9fff 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Precisely Engineered.
                </motion.h2>
              </div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-[15px] leading-relaxed max-w-md"
                style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(15,21,53,0.55)" }}
              >
                Experience the pinnacle of hardware-software integration. Our new network interface
                delivers sub-1ms latency with industry-leading security protocols.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex items-center gap-3 flex-wrap"
              >
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: "0 6px 28px rgba(58,90,255,0.35)" }}
                  whileTap={{ scale: 0.97 }}
                  className="px-6 py-3 rounded-lg text-[13px] font-semibold text-white tracking-wide transition-all"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    background: "linear-gradient(135deg, #3a5aff 0%, #2a44dd 100%)",
                    boxShadow: "0 4px 18px rgba(58,90,255,0.25)",
                  }}
                >
                  Configure Now
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03, borderColor: "rgba(58,90,255,0.5)", background: "rgba(58,90,255,0.06)" }}
                  whileTap={{ scale: 0.97 }}
                  className="px-6 py-3 rounded-lg text-[13px] font-semibold tracking-wide transition-all border"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: "#1a2a80",
                    borderColor: "rgba(58,90,255,0.2)",
                    background: "rgba(255,255,255,0.7)",
                  }}
                >
                  View Documentation
                </motion.button>
              </motion.div>

              {/* Divider */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.55, duration: 0.6 }}
                className="origin-left h-px w-full max-w-xs"
                style={{ background: "linear-gradient(to right, rgba(58,90,255,0.3), transparent)" }}
              />

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-10"
              >
                <Stat value="10Gbps" label="Throughput" delay={0.65} />
                <div className="w-px h-8" style={{ background: "rgba(58,90,255,0.18)" }} />
                <Stat value="0.8ms" label="Latency" delay={0.72} />
                <div className="w-px h-8" style={{ background: "rgba(58,90,255,0.18)" }} />
                <Stat value="99.99%" label="Uptime" delay={0.79} />
              </motion.div>
            </div>

            {/* ── RIGHT COLUMN — Image card ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, x: 40 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.25, duration: 0.75, ease: "easeOut" }}
              className="relative flex items-center justify-center"
            >
              {/* Outer glow */}
              <div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background: "radial-gradient(ellipse at center, rgba(58,90,255,0.12) 0%, transparent 70%)",
                  filter: "blur(24px)",
                  transform: "scale(1.1)",
                }}
              />

              {/* Card */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative rounded-2xl overflow-hidden w-full max-w-[520px] aspect-[4/3]"
                style={{
                  background: "linear-gradient(145deg, #e8eeff 0%, #edf1ff 50%, #e4eaff 100%)",
                  border: "1px solid rgba(58,90,255,0.18)",
                  boxShadow:
                    "0 0 0 1px rgba(255,255,255,0.8) inset, 0 4px 40px rgba(58,90,255,0.12), 0 20px 60px rgba(58,90,255,0.08), 0 2px 8px rgba(0,0,0,0.06)",
                }}
              >
                {/* Inner top border shine */}
                <div
                  className="absolute top-0 left-0 right-0 h-[1px]"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(58,90,255,0.5), transparent)" }}
                />

                {/* Circuit SVG */}
                <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
                  <svg viewBox="0 0 400 300" className="w-3/4 h-3/4" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Board base */}
                    <rect x="80" y="40" width="240" height="220" rx="8" fill="rgba(255,255,255,0.6)" stroke="rgba(58,90,255,0.2)" strokeWidth="1.5"/>

                    {/* Circuit traces */}
                    <path d="M120 80 L160 80 L160 120 L200 120" stroke="rgba(58,90,255,0.25)" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M200 120 L240 120 L240 80 L280 80" stroke="rgba(58,90,255,0.25)" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M140 160 L180 160 L180 200 L220 200" stroke="rgba(58,90,255,0.25)" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M220 200 L260 200 L260 160 L300 160" stroke="rgba(58,90,255,0.25)" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M100 140 L100 180 L140 180" stroke="rgba(58,90,255,0.18)" strokeWidth="1.5"/>
                    <path d="M300 100 L300 140 L260 140" stroke="rgba(58,90,255,0.18)" strokeWidth="1.5"/>

                    {/* Main chip */}
                    <rect x="155" y="115" width="90" height="70" rx="4" fill="rgba(58,90,255,0.08)" stroke="rgba(58,90,255,0.45)" strokeWidth="1.5"/>
                    <rect x="163" y="123" width="74" height="54" rx="2" fill="rgba(58,90,255,0.04)" stroke="rgba(58,90,255,0.2)" strokeWidth="1"/>
                    <text x="200" y="155" textAnchor="middle" fill="rgba(58,90,255,0.7)" fontSize="8" fontFamily="monospace">NEURAL</text>
                    <text x="200" y="166" textAnchor="middle" fill="rgba(58,90,255,0.5)" fontSize="7" fontFamily="monospace">CORE v2.4</text>

                    {/* Chip pins */}
                    {[125,135,145,155,165,175,185,195].map((y, i) => (
                      <rect key={`l${i}`} x="148" y={y} width="8" height="4" rx="1" fill="rgba(58,90,255,0.35)"/>
                    ))}
                    {[125,135,145,155,165,175,185,195].map((y, i) => (
                      <rect key={`r${i}`} x="244" y={y} width="8" height="4" rx="1" fill="rgba(58,90,255,0.35)"/>
                    ))}

                    {/* Small chips */}
                    <rect x="100" y="75" width="35" height="28" rx="3" fill="rgba(255,255,255,0.7)" stroke="rgba(58,90,255,0.3)" strokeWidth="1"/>
                    <rect x="265" y="75" width="35" height="28" rx="3" fill="rgba(255,255,255,0.7)" stroke="rgba(58,90,255,0.3)" strokeWidth="1"/>
                    <rect x="108" y="210" width="30" height="22" rx="3" fill="rgba(255,255,255,0.7)" stroke="rgba(58,90,255,0.3)" strokeWidth="1"/>
                    <rect x="262" y="195" width="38" height="28" rx="3" fill="rgba(255,255,255,0.7)" stroke="rgba(58,90,255,0.3)" strokeWidth="1"/>

                    {/* Capacitors */}
                    {[[108,160],[290,140],[185,220],[215,222]].map(([cx,cy],i) => (
                      <g key={i}>
                        <circle cx={cx} cy={cy} r="7" fill="rgba(255,255,255,0.8)" stroke="rgba(58,90,255,0.28)" strokeWidth="1"/>
                        <circle cx={cx} cy={cy} r="3" fill="rgba(58,90,255,0.2)"/>
                      </g>
                    ))}

                    {/* Glow dots (active nodes) */}
                    {[[200,120],[160,80],[240,80],[180,200]].map(([cx,cy],i) => (
                      <circle key={i} cx={cx} cy={cy} r="3.5" fill="rgba(58,90,255,0.85)">
                        <animate attributeName="opacity" values="0.85;0.25;0.85" dur={`${1.5+i*0.4}s`} repeatCount="indefinite"/>
                      </circle>
                    ))}

                    {/* Drop shadow */}
                    <ellipse cx="200" cy="268" rx="80" ry="6" fill="rgba(58,90,255,0.06)"/>
                  </svg>

                  {/* Scan line */}
                  <motion.div
                    className="absolute left-0 right-0 h-[2px] pointer-events-none"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(58,90,255,0.3), transparent)" }}
                    animate={{ top: ["10%", "90%", "10%"] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  />

                  {/* Corner accents */}
                  {[
                    "top-3 left-3 border-t border-l",
                    "top-3 right-3 border-t border-r",
                    "bottom-3 left-3 border-b border-l",
                    "bottom-3 right-3 border-b border-r",
                  ].map((cls, i) => (
                    <div
                      key={i}
                      className={`absolute w-5 h-5 ${cls}`}
                      style={{ borderColor: "rgba(58,90,255,0.4)" }}
                    />
                  ))}
                </div>

                {/* Bottom label bar */}
                <div
                  className="absolute bottom-0 left-0 right-0 px-4 py-2.5 flex items-center justify-between"
                  style={{
                    background: "rgba(240,244,255,0.92)",
                    borderTop: "1px solid rgba(58,90,255,0.12)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <span
                    className="text-[10px] tracking-[0.15em] uppercase font-semibold"
                    style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(58,90,255,0.55)" }}
                  >
                    Neural Core — Active
                  </span>
                  <span
                    className="flex items-center gap-1.5 text-[10px] font-medium"
                    style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(22,163,74,0.8)" }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Online
                  </span>
                </div>
              </motion.div>

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, x: -16, y: -16 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="absolute -top-3 -left-3 px-3 py-1.5 rounded-lg text-[10px] font-semibold tracking-widest uppercase"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  background: "rgba(255,255,255,0.9)",
                  border: "1px solid rgba(58,90,255,0.2)",
                  color: "#3a5aff",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 2px 12px rgba(58,90,255,0.1)",
                }}
              >
                V2.4 NEURAL CORE
              </motion.div>
            </motion.div>

          </div>
        </div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(240,244,255,0.8), transparent)" }}
        />
      </section>
    </>
  );
}