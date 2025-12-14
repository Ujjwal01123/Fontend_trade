import { Shield, Smartphone, Headphones, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Shield,
    title: "Fast & Secure Trading",
    description: "Bank-level security with lightning-fast execution",
  },
  {
    icon: Smartphone,
    title: "Easy to Use Platform",
    description: "Intuitive interface designed for all traders",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Round-the-clock customer support team",
  },
  {
    icon: DollarSign,
    title: "Low Fees",
    description: "Competitive pricing with zero hidden charges",
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why Choose Us?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            In the current market, many dishonest brokers can be a risk. We
            prioritize your security and satisfaction, making sure you are
            equipped with the best tools and resources.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 rounded-xl bg-card border border-border hover:border-accent/50 transition-all hover:shadow-lg"
            >
              <div className="mb-4 inline-flex p-3 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                <feature.icon className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* <div className="text-center">
          <Button size="lg" className="bg-success text-success-foreground hover:bg-success/90 font-semibold text-lg px-8">
            Start Your Trading Journey
          </Button>
        </div> */}
      </div>
    </section>
  );
};

export default Features;
