import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, TrendingUp, Users, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const About = () => {
  const { token } = useAuth();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              About MKfrx
            </h1>
            <p className="text-lg text-muted-foreground">
              A next-generation trading ecosystem built for speed, power and
              precision.
            </p>
          </div>

          <div className="mb-12">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Our Story</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  MKfrx was created to redefine how modern traders interact with
                  the markets. In a world where milliseconds matter, we built a
                  high-performance platform that delivers unmatched speed,
                  transparency, and control.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Powered by advanced infrastructure and an intuitive user
                  experience, MKfrx gives traders of all levels access to
                  professional-grade tools, hyper-fast execution, and real-time
                  market insights. We believe trading should be simple,
                  powerful, and accessible — and MKfrx is designed to make that
                  vision a reality.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <Shield className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">Secure & Reliable</h3>
                    <p className="text-sm text-muted-foreground">
                      Multi-layer security, encrypted transactions, and
                      enterprise-grade protection keep your assets safe 24/7.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <Zap className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">Lightning Fast Execution</h3>
                    <p className="text-sm text-muted-foreground">
                      Experience near-instant order execution with our optimized
                      trading engine.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">Live Market Intelligence</h3>
                    <p className="text-sm text-muted-foreground">
                      Access real-time charts, indicators, and market data to
                      make confident decisions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <Users className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">Dedicated 24/7 Support</h3>
                    <p className="text-sm text-muted-foreground">
                      Our support specialists are available round-the-clock to
                      assist traders globally.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
            <CardContent className="p-8 text-center">
              {/* COUNTUP STATES */}
              {(() => {
                const [traders, setTraders] = useState(0);
                const [volume, setVolume] = useState(0);
                const [assets, setAssets] = useState(0);

                async function getTotalAmount() {
                  const res2 = await fetch(
                    `${apiUrl}/api/markets/total/amount/all`
                  );
                  const data2 = await res2.json(); // ← FIXED

                  // console.log(data2.totalApprovedBuys); // now prints correctly

                  return data2;
                }

                async function getTotalAssets() {
                  const res3 = await fetch(`${apiUrl}/api/markets/count`);
                  const data3 = await res3.json(); // ← FIXED

                  // console.log(data2.totalApprovedBuys); // now prints correctly

                  return data3;
                }

                useEffect(() => {
                  const fetchDataAndAnimate = async () => {
                    try {
                      // 1️⃣ Fetch end1 from API
                      const res = await fetch(
                        `${apiUrl}/api/auth/total-users`,
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        }
                      );
                      const data = await res.json();
                      const Data2 = await getTotalAmount();
                      const Data3 = await getTotalAssets();
                      // console.log(Data2);
                      // console.log(Data2);
                      // console.log(Data2);

                      const end1 = data.totalUsers - 1; // value from API
                      const end2 = Data2.totalApprovedBuys; // still static
                      const end3 = Data3.totalAssets; // still static

                      let start1 = 0,
                        start2 = 0,
                        start3 = 0;

                      const duration = 2000;
                      const startTime = performance.now();

                      // 2️⃣ Animation function
                      const animate = (now) => {
                        const progress = Math.min(
                          (now - startTime) / duration,
                          1
                        );

                        setTraders(Math.floor(start1 + end1 * progress));
                        setVolume(Math.floor(start2 + end2 * progress));
                        setAssets(Math.floor(start3 + end3 * progress));

                        if (progress < 1) requestAnimationFrame(animate);
                      };

                      requestAnimationFrame(animate);
                    } catch (error) {
                      console.error("Error fetching stats:", error);
                    }
                  };

                  fetchDataAndAnimate();
                }, []);

                return (
                  <>
                    <h2 className="text-2xl font-bold mb-4">
                      Trusted by Traders Worldwide
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Join the fast-growing MKfrx community and trade with
                      confidence, speed, and stability.
                    </p>

                    <div className="flex gap-4 justify-center">
                      {/* ACTIVE TRADERS */}
                      <div className="text-center">
                        <div className="text-3xl font-bold text-accent">
                          {traders.toLocaleString()}+
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Active Traders
                        </div>
                      </div>

                      <div className="w-px bg-border"></div>

                      {/* TRADING VOLUME */}
                      <div className="text-center">
                        <div className="text-3xl font-bold text-accent">
                          ${volume.toLocaleString()}+
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Daily Trading Volume
                        </div>
                      </div>

                      <div className="w-px bg-border"></div>

                      {/* TRADABLE ASSETS */}
                      <div className="text-center">
                        <div className="text-3xl font-bold text-accent">
                          {assets}+
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Tradable Assets
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </CardContent>
          </Card>
          {/* <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">
                Trusted by Traders Worldwide
              </h2>
              <p className="text-muted-foreground mb-6">
                Join the fast-growing MKfrx community and trade with confidence,
                speed, and stability.
              </p>
              <div className="flex gap-4 justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">150K+</div>
                  <div className="text-sm text-muted-foreground">
                    Active Traders
                  </div>
                </div>
                <div className="w-px bg-border"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">$3.5B+</div>
                  <div className="text-sm text-muted-foreground">
                    Daily Trading Volume
                  </div>
                </div>
                <div className="w-px bg-border"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">75+</div>
                  <div className="text-sm text-muted-foreground">
                    Tradable Assets
                  </div>
                </div>
              </div>
            </CardContent>
          </Card> */}
        </div>
      </main>
    </div>
  );
};

export default About;
