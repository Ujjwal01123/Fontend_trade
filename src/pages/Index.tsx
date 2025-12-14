import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />

      {/* Call To Action Section */}
      <section className="py-24 bg-gradient-to-br from-[#0A2540] via-[#0F3A66] to-[#1B4B8C]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-primary-foreground mb-6">
            Start Your Trading Journey with{" "}
            <span className="text-[#FFD447]">MKfrx</span>
          </h2>

          <p className="text-primary-foreground/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Join a global ecosystem trusted by thousands. Trade faster, smarter,
            and more securely using MKfrx’s advanced trading infrastructure.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            {user && (
              <a
                href="/markets"
                className="inline-flex items-center justify-center px-10 py-4 bg-accent text-accent-foreground hover:bg-accent/80
                   font-semibold text-lg rounded-xl transition-all shadow-lg shadow-accent/20"
              >
                Explore Live Markets
              </a>
            )}

            {!user && (
              <a
                href="/signup"
                className="inline-flex items-center justify-center px-10 py-4 bg-primary-foreground 
                     text-primary hover:bg-primary-foreground/90 font-semibold text-lg 
                     rounded-xl transition-all"
              >
                Create Account
              </a>
            )}
            {/* <a
              href="/signup"
              className="inline-flex items-center justify-center px-10 py-4 bg-primary-foreground text-primary hover:bg-primary-foreground/90
                   font-semibold text-lg rounded-xl transition-all"
            >
              Create Account
            </a> */}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card py-16 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Brand */}
            <div>
              <h3 className="font-extrabold text-2xl mb-4 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                MKfrx
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                A next-generation trading platform built for speed, security,
                and global scalability. Trade with confidence, anytime.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="/" className="hover:text-foreground transition">
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/markets"
                    className="hover:text-foreground transition"
                  >
                    Live Markets
                  </a>
                </li>
                <li>
                  <a href="/about" className="hover:text-foreground transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="hover:text-foreground transition"
                  >
                    Contact Us
                  </a>
                </li>
                {/* <li>
                  <a href="/admin" className="hover:text-foreground transition">
                    Admin Dashboard
                  </a>
                </li> */}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Resources</h4>
              <ul className="space-y-2 text-muted-foreground">
                {/* <li>
                  <a href="/docs" className="hover:text-foreground transition">
                    API Documentation
                  </a>
                </li>
                <li>
                  <a href="/fees" className="hover:text-foreground transition">
                    Fees & Limits
                  </a>
                </li> */}
                <li>
                  <a href="/blogs" className="hover:text-foreground transition">
                    Blogs
                  </a>
                </li>
                {/* <li>
                  <a
                    href="/privacy"
                    className="hover:text-foreground transition"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="hover:text-foreground transition">
                    Terms & Conditions
                  </a>
                </li> */}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Contact</h4>
              <p className="text-muted-foreground mb-2">24/7 Support</p>
              <p className="text-muted-foreground mb-6">support@mkfrx.com</p>

              <div className="flex gap-4">
                <a
                  href="#"
                  className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-foreground transition"
                >
                  <i className="fa-brands fa-x-twitter text-xl"></i>
                </a>
                <a
                  href="#"
                  className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-foreground transition"
                >
                  <i className="fa-brands fa-telegram text-xl"></i>
                </a>
                <a
                  href="#"
                  className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-foreground transition"
                >
                  <i className="fa-brands fa-youtube text-xl"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-12 pt-8 border-t border-border text-center text-muted-foreground">
            <p>© {new Date().getFullYear()} MKfrx. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
