import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen pt-16 bg-[#081525]">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-block px-4 py-2 bg-accent/20 text-accent rounded-full text-sm font-semibold backdrop-blur-sm">
              MKfrx — Smart Trading for the Next Generation
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight">
              Your Premium Modern Trading Platform
            </h1>

            <div className="space-y-4 text-primary-foreground/90">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-accent" />
                <span className="text-lg">Hyper-fast Order Execution</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-accent" />
                <span className="text-lg">Advanced Charting & AI Signals</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-accent" />
                <span className="text-lg">Ultra-High Leverage Options</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-accent" />
                <span className="text-lg">
                  Instant Deposit & Fast Withdrawals
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              {/* (
              {user && (
                <Button
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-lg px-8"
                >
                  Start Trading
                </Button>
              )} */}
              {/* )  */}
              {user ? (
                <Button
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-lg px-8"
                  onClick={() => navigate("/markets")}
                >
                  Start Trading
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-lg px-8"
                  onClick={() => navigate("/login")}
                >
                  Start Trading
                </Button>
              )}

              {/* <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/20 text-accent-foreground hover:bg-primary-foreground/10 font-semibold text-lg px-8"
              >
                Try Demo Mode
              </Button> */}
            </div>

            <p className="text-primary-foreground/70 text-sm max-w-lg">
              MKfrx brings you a powerful, ultra-fast trading experience with
              modern tools, unbeatable margin options, and frictionless
              execution.
            </p>
          </div>

          {/* <div className="relative">
            <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full"></div>
            <img
              src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80"
              alt="Trading Platform"
              className="relative rounded-2xl shadow-2xl border border-primary-foreground/10"
            />
          </div> */}
          <div className="relative">
            <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full" />

            <video
              src="/trading-level.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="relative rounded-2xl shadow-2xl w-full h-auto object-cover"
              controls={false}
              disablePictureInPicture
              controlsList="nodownload nofullscreen noremoteplayback"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

// import { Button } from "@/components/ui/button";
// import { CheckCircle2 } from "lucide-react";

// const Hero = () => {
//   return (
//     <section className="relative min-h-screen pt-16 bg-gradient-to-br from-primary via-primary to-primary/90">
//       <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>

//       <div className="container mx-auto px-4 py-20 relative z-10">
//         <div className="grid lg:grid-cols-2 gap-12 items-center">
//           <div className="space-y-8">
//             <div className="inline-block px-4 py-2 bg-accent/20 text-accent rounded-full text-sm font-semibold backdrop-blur-sm">
//               Turn ₹1 into ₹500 power – trade big, pay zero!
//             </div>

//             <h1 className="text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight">
//               Premium Trading Platform
//             </h1>

//             <div className="space-y-4 text-primary-foreground/90">
//               <div className="flex items-center gap-3">
//                 <CheckCircle2 className="h-5 w-5 text-accent" />
//                 <span className="text-lg">500x Intraday Margin</span>
//               </div>
//               <div className="flex items-center gap-3">
//                 <CheckCircle2 className="h-5 w-5 text-accent" />
//                 <span className="text-lg">60x Carry Forward Margin</span>
//               </div>
//               <div className="flex items-center gap-3">
//                 <CheckCircle2 className="h-5 w-5 text-accent" />
//                 <span className="text-lg">Quick Deposit and Withdrawal</span>
//               </div>
//               <div className="flex items-center gap-3">
//                 <CheckCircle2 className="h-5 w-5 text-accent" />
//                 <span className="text-lg">24x7 Customer Support</span>
//               </div>
//             </div>

//             <div className="flex flex-wrap gap-4 pt-4">
//               <Button
//                 size="lg"
//                 className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-lg px-8"
//               >
//                 Trade Now
//               </Button>
//               <Button
//                 size="lg"
//                 variant="outline"
//                 className="border-primary-foreground/20  text-accent-foreground hover:bg-primary-foreground/10 font-semibold text-lg px-8 "
//               >
//                 Try Demo
//               </Button>
//             </div>

//             <p className="text-primary-foreground/70 text-sm max-w-lg">
//               Trade smarter with TradeHub: Zero charges, lightning-fast trades &
//               massive margin advantage!
//             </p>
//           </div>

//           <div className="relative">
//             <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full"></div>
//             <img
//               src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80"
//               alt="Trading Platform"
//               className="relative rounded-2xl shadow-2xl border border-primary-foreground/10"
//             />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Hero;
