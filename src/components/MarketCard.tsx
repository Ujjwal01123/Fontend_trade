import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface MarketCardProps {
  symbol: string;
  name: string;
  price: string;
  change: number;
  volume: string;
}

const MarketCard = ({ symbol, name, price, change, volume }: MarketCardProps) => {
  const isPositive = change >= 0;

  return (
    <Card className="hover:shadow-lg transition-shadow border-border/50">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-bold text-lg">{symbol}</h3>
            <p className="text-sm text-muted-foreground">{name}</p>
          </div>
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${
            isPositive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
          }`}>
            {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <span className="text-sm font-semibold">{Math.abs(change).toFixed(2)}%</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Price:</span>
            <span className="font-bold text-xl">₹{price}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">24h Volume:</span>
            <span className="font-semibold">₹{volume}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketCard;
