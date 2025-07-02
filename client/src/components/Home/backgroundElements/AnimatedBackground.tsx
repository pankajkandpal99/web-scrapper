const AnimatedBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Horizontal grid lines */}
    <div
      className="absolute top-0 left-0 w-full h-full"
      style={{
        backgroundImage:
          "linear-gradient(0deg, rgba(111, 255, 180, 0.03) 1px, transparent 1px)",
        backgroundSize: "100% 50px",
      }}
    ></div>

    {/* Vertical grid lines */}
    <div
      className="absolute top-0 left-0 w-full h-full"
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgba(111, 255, 180, 0.03) 1px, transparent 1px)",
        backgroundSize: "50px 100%",
      }}
    ></div>

    {/* Glowing orbs */}
    <div className="absolute top-20 left-10 w-64 h-64 bg-[#6FFFB4]/5 rounded-full blur-3xl"></div>
    <div className="absolute bottom-40 right-20 w-80 h-80 bg-[#3694FF]/5 rounded-full blur-3xl"></div>
    <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-[#FF6FE5]/5 rounded-full blur-3xl"></div>
  </div>
);

export default AnimatedBackground;
