// ✅ FIXED MARKETS.TSX — FINAL VERSION
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PriceChart from "@/components/PriceChart";
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
// import { useAuth } from "@/contexts/AuthContext";
import { Star, Wallet, PieChart, TrendingUp, TrendingDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Ticker {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  openPrice: string;
  lowPrice: string;
  highPrice: string;
  lastPrice: string;
  volume: string;
  bidPrice: string;
  askPrice: string;
  at: number;
}

const apiUrl = import.meta.env.VITE_BASE_API_URL;
const API = `${apiUrl}/api/markets`;

const Markets = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { token } = useAuth();

  // Market Data State
  const [tickers, setTickers] = useState<Ticker[]>([]);
  const [filteredTickers, setFilteredTickers] = useState<Ticker[]>([]);
  const [quoteFilters, setQuoteFilters] = useState<string[]>([]);
  const [selectedQuote, setSelectedQuote] = useState("ALL");
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState<"NONE" | "GAINERS" | "LOSERS">(
    "NONE"
  );
  const [tradeQty, setTradeQty] = useState<Record<string, number>>({});

  // Chart State
  const [selectedPair, setSelectedPair] = useState("btcinr");
  const [chartData, setChartData] = useState<
    Array<{ time: string; price: number }>
  >([]);

  // User Database State
  const [balance, setBalance] = useState<{ INR: number }>({ INR: 0 });
  const [portfolio, setPortfolio] = useState<Record<string, number>>({});
  const [watchlist, setWatchlist] = useState<string[]>([]);

  // payment details
  const [paymentDetails, setPaymentDetails] = useState<{
    bankName?: string;
    accountNumber?: string;
    ifsc?: string;
    upiId?: string;
  } | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchPaymentDetails = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/payments/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success && data.payment) {
          setPaymentDetails(data.payment);
        } else {
          setPaymentDetails(null);
        }
      } catch (err) {
        console.error("Payment fetch failed:", err);
        setPaymentDetails(null);
      }
    };

    fetchPaymentDetails();
  }, [user]);

  // ---------------------------------------------
  // 1️⃣ AUTH & USER DATA LOADING
  // ---------------------------------------------
  useEffect(() => {
    if (isLoading) return;
    if (!user || user.role == "admin") {
      navigate("/");
      return;
    }
    loadUserState();
  }, [user, isLoading]);

  const loadUserState = async () => {
    try {
      if (!user?.id) return;

      const res = await fetch(`${apiUrl}/api/auth/${user.id}`);
      if (!res.ok) {
        console.error("Failed to fetch user data");
        return;
      }

      const data1 = await res.json();
      const data = await data1.user;
      // console.log("User prot Loaded:", data.portfolio);

      // ✅ Fix: Ensure structure exists before setting
      setBalance(data.balance || { INR: 0 });
      setPortfolio(data.portfolio ? data.portfolio : {});
      setWatchlist(data.watchlist || []);
    } catch (err) {
      console.error("User load failed:", err);
    }
  };

  // console.log(portfolio);

  // ---------------------------------------------
  // 2️⃣ FETCH TICKERS
  // ---------------------------------------------
  useEffect(() => {
    fetchTickers();
    const interval = setInterval(fetchTickers, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  const fetchTickers = async () => {
    try {
      const res = await fetch(`${API}/tickers`);
      const data = await res.json();
      if (!Array.isArray(data)) return;

      setTickers(data);
      // Update filters only if empty to prevent UI jumping
      setQuoteFilters((prev) =>
        prev.length === 0
          ? ["ALL", ...new Set(data.map((t) => t.quoteAsset))]
          : prev
      );
    } catch (err) {
      console.error("Ticker fetch failed:", err);
    }
  };

  // ---------------------------------------------
  // 3️⃣ FETCH CHART DATA
  // ---------------------------------------------
  useEffect(() => {
    if (!selectedPair) return;
    fetchChartData(selectedPair);
    const iv = setInterval(() => fetchChartData(selectedPair), 5000);
    return () => clearInterval(iv);
  }, [selectedPair]);

  const fetchChartData = async (symbol: string) => {
    try {
      const res = await fetch(`${API}/tickers`);
      const data = await res.json();
      if (!Array.isArray(data)) return;

      const ticker = data.find((t: Ticker) => t.symbol === symbol);
      if (!ticker) return;

      const price = parseFloat(ticker.lastPrice);

      // Simulate 24h data based on current price (mock logic)
      const chart = Array.from({ length: 24 }, (_, i) => ({
        time: `${i}:00`,
        price: price + (Math.random() - 0.5) * price * 0.02,
      }));

      setChartData(chart);
    } catch (err) {
      console.error("Chart fetch failed:", err);
    }
  };

  // ---------------------------------------------
  // 4️⃣ HELPERS
  // ---------------------------------------------
  const calculateChange = (t: Ticker) => {
    const open = parseFloat(t.openPrice);
    const last = parseFloat(t.lastPrice);
    if (!open) return 0;
    return ((last - open) / open) * 100;
  };

  // ---------------------------------------------
  // 5️⃣ FILTERS & SORTING
  // ---------------------------------------------
  useEffect(() => {
    let d = [...tickers];

    if (selectedQuote !== "ALL") {
      d = d.filter((t) => t.quoteAsset === selectedQuote);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      d = d.filter(
        (t) =>
          t.baseAsset.toLowerCase().includes(q) ||
          t.symbol.toLowerCase().includes(q)
      );
    }

    if (sortType === "GAINERS")
      d.sort((a, b) => calculateChange(b) - calculateChange(a));
    if (sortType === "LOSERS")
      d.sort((a, b) => calculateChange(a) - calculateChange(b));

    setFilteredTickers(d);
  }, [tickers, selectedQuote, search, sortType]);

  // ---------------------------------------------
  // 6️⃣ PORTFOLIO CALCULATION
  // ---------------------------------------------
  const portfolioSummary = useMemo(() => {
    const items = Object.entries(portfolio)
      .map(([asset, qty]) => {
        // Find current price from tickers
        const t = tickers.find(
          (x) => x.baseAsset.toLowerCase() === asset.toLowerCase()
        );
        const price = t ? parseFloat(t.lastPrice) : 0;
        return {
          asset: asset.toUpperCase(),
          qty,
          price,
          totalValue: qty * price,
        };
      })
      .filter((item) => item.qty > 0); // Hide assets with 0 qty

    const totalPortfolioValue = items.reduce(
      (sum, item) => sum + item.totalValue,
      0
    );

    return { items, totalPortfolioValue };
  }, [portfolio, tickers]);

  // ---------------------------------------------
  // 7️⃣ TRADING ACTIONS
  // ---------------------------------------------
  const handleTrade = async (action: "buy" | "sell", t: Ticker, qty = 1) => {
    if (!user) return;

    // ✅ Check if bank or UPI details are missing
    if (
      !paymentDetails ||
      !paymentDetails.bankName ||
      !paymentDetails.accountNumber ||
      !paymentDetails.ifsc ||
      !paymentDetails.upiId
    ) {
      toast({
        title: "Payment Details Missing",
        description: "Please add your bank/UPI details before trading.",
        variant: "destructive",
      });
      navigate("/payment-details");
      return;
    }

    try {
      const res = await fetch(`${API}/${user.id}/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asset: t.baseAsset,
          qty,
          price: parseFloat(t.lastPrice),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        return toast({
          title: "Error",
          description: data.message,
          variant: "destructive",
        });
      }

      if (action === "buy") {
        toast({
          title: "Request Submitted",
          description: `Your request to BUY ${qty} ${t.baseAsset.toUpperCase()} has been sent to admin for approval.`,
        });
      } else {
        toast({
          title: "Sell Request Sent",
          description: `Your request to SELL ${qty} ${t.baseAsset.toUpperCase()} has been sent to admin for approval.`,
        });
      }
    } catch (err) {
      console.error(`${action} failed:`, err);
      toast({
        title: "Failed",
        description: "Network error occurred.",
        variant: "destructive",
      });
    }
  };

  // const handleTrade = async (action: "buy" | "sell", t: Ticker, qty = 1) => {
  //   if (!user) return;

  //   try {
  //     const res = await fetch(`${API}/${user.id}/${action}`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         asset: t.baseAsset,
  //         qty,
  //         price: parseFloat(t.lastPrice),
  //       }),
  //     });

  //     const data = await res.json();

  //     if (!res.ok) {
  //       return toast({
  //         title: "Error",
  //         description: data.message,
  //         variant: "destructive",
  //       });
  //     }

  //     // ❌ Do NOT update balance or portfolio for SELL (goes to admin first)
  //     if (action === "buy") {
  //       // Buy stays same
  //       toast({
  //         title: "Request Submitted",
  //         description: `Your request to BUY ${qty} ${t.baseAsset.toUpperCase()} has been sent to admin for approval.`,
  //       });
  //     } else {
  //       // NEW: Sell request also goes to admin
  //       toast({
  //         title: "Sell Request Sent",
  //         description: `Your request to SELL ${qty} ${t.baseAsset.toUpperCase()} has been sent to admin for approval.`,
  //       });
  //     }
  //   } catch (err) {
  //     console.error(`${action} failed:`, err);
  //     toast({
  //       title: "Failed",
  //       description: "Network error occurred.",
  //       variant: "destructive",
  //     });
  //   }
  // };

  // const handleTrade = async (action: "buy" | "sell", t: Ticker, qty = 1) => {
  //   if (!user) return;

  //   try {
  //     const res = await fetch(`${API}/${user.id}/${action}`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         asset: t.baseAsset,
  //         qty,
  //         price: parseFloat(t.lastPrice),
  //       }),
  //     });

  //     const data = await res.json();

  //     if (!res.ok) {
  //       return toast({
  //         title: "Error",
  //         description: data.message,
  //         variant: "destructive",
  //       });
  //     }

  //     // ✅ Update Local State
  //     setBalance(data.user.balance);
  //     setPortfolio(data.user.portfolio);

  //     // ---------------------------------------------
  //     // ⭐ CUSTOM TOAST MESSAGES FOR BUY & SELL
  //     // ---------------------------------------------
  //     if (action === "buy") {
  //       toast({
  //         title: "Request Submitted",
  //         description: `Your request to BUY ${qty} ${t.baseAsset.toUpperCase()} has been sent to admin for approval.`,
  //       });
  //     } else {
  //       toast({
  //         title: "Sell Successful",
  //         description: `You have successfully SOLD ${qty} ${t.baseAsset.toUpperCase()}.`,
  //       });
  //     }
  //   } catch (err) {
  //     console.error(`${action} failed:`, err);
  //     toast({
  //       title: "Failed",
  //       description: "Network error occurred.",
  //       variant: "destructive",
  //     });
  //   }
  // };

  // const handleTrade = async (action: "buy" | "sell", t: Ticker, qty = 1) => {
  //   if (!user) return;
  //   try {
  //     const res = await fetch(`${API}/${user.id}/${action}`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         asset: t.baseAsset,
  //         qty,
  //         price: parseFloat(t.lastPrice),
  //       }),
  //     });

  //     const data = await res.json();
  //     if (!res.ok)
  //       return toast({
  //         title: "Error",
  //         description: data.message,
  //         variant: "destructive",
  //       });

  //     // Update Local State immediately
  //     setBalance(data.user.balance);
  //     setPortfolio(data.user.portfolio);

  //     toast({
  //       title: "Success",
  //       description: `Your request to ${action} ${qty} ${t.baseAsset.toUpperCase()} has been sent to admin`,
  //     });
  //   } catch (err) {
  //     console.error(`${action} failed:`, err);
  //     toast({ title: "Failed", description: "Network error occurred." });
  //   }
  // };

  const toggleWatch = async (symbol: string) => {
    if (!user) return;
    try {
      const res = await fetch(`${API}/${user.id}/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol }),
      });
      const data = await res.json();
      setWatchlist(data.watchlist || []);
    } catch (err) {
      console.error("Watchlist failed:", err);
    }
  };

  if (isLoading) return <div className="p-10 text-center">Loading...</div>;

  // ---------------------------------------------
  // UI RENDER
  // ---------------------------------------------
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* ✅ FIXED: DASHBOARD SECTION (Balance & Portfolio) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* 1. Balance Card */}
          <div className="bg-card border rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Wallet className="w-5 h-5" />
              <span className="font-medium">Available Balance</span>
            </div>
            <div className="text-3xl font-bold">
              ₹
              {balance?.INR?.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              }) || "0.00"}
            </div>
          </div>

          {/* 2. Portfolio Summary Card */}
          <div className="bg-card border rounded-xl p-6 shadow-sm col-span-1 md:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <PieChart className="w-5 h-5" />
                <span className="font-medium">Your Holdings</span>
              </div>
              <span className="text-xl font-bold text-green-600">
                {/* Portfolio as small tags */}
                <div className="flex flex-wrap gap-2">
                  {Object.entries(portfolio)
                    .filter(([_, qty]) => qty > 0)
                    .map(([asset, qty]) => (
                      <span
                        key={asset}
                        className="bg-secondary/30 text-sm px-2 py-1 rounded-full font-medium"
                      >
                        {asset.toUpperCase()}: {qty}
                      </span>
                    ))}
                </div>
              </span>
            </div>
            {/* Total Portfolio Value */}
            <div className="text-right text-lg font-bold text-green-600">
              Total: ₹{portfolioSummary.totalPortfolioValue.toFixed(2)}
            </div>
          </div>
        </section>

        {/* CONTROLS */}
        <div className="flex flex-wrap gap-3 mb-6 items-center">
          <h1 className="text-2xl font-bold mr-4">Markets</h1>

          {/* Filter Dropdown */}
          <select
            value={selectedQuote}
            onChange={(e) => setSelectedQuote(e.target.value)}
            className="border bg-background p-2 rounded text-sm min-w-[100px]"
          >
            {quoteFilters.map((q) => (
              <option key={q} value={q}>
                {q === "ALL" ? "All Pairs" : q.toUpperCase()}
              </option>
            ))}
          </select>

          {/* Search */}
          <input
            type="text"
            placeholder="Search Coin (e.g. BTC)..."
            className="border bg-background p-2 rounded flex-1 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Sort Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setSortType("GAINERS")}
              className={`flex items-center gap-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
                sortType === "GAINERS"
                  ? "bg-green-600 text-white"
                  : "bg-secondary hover:bg-green-100 dark:hover:bg-green-900/30"
              }`}
            >
              <TrendingUp className="w-4 h-4" /> Gainers
            </button>
            <button
              onClick={() => setSortType("LOSERS")}
              className={`flex items-center gap-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
                sortType === "LOSERS"
                  ? "bg-red-600 text-white"
                  : "bg-secondary hover:bg-red-100 dark:hover:bg-red-900/30"
              }`}
            >
              <TrendingDown className="w-4 h-4" /> Losers
            </button>
          </div>
        </div>

        {/* TABS (MARKET LIST / CHARTS) */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-secondary mb-4">
            <TabsTrigger value="overview">Market List</TabsTrigger>
            <TabsTrigger value="myassets">My Assets</TabsTrigger>
            <TabsTrigger value="charts">Price Charts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTickers.map((t) => {
                const change = calculateChange(t);
                return (
                  <div
                    key={t.symbol}
                    className="bg-card border p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-lg">
                          {t.baseAsset.toUpperCase()}
                        </h4>
                        <span className="text-xs text-muted-foreground bg-secondary px-1 rounded">
                          /{t.quoteAsset.toUpperCase()}
                        </span>
                      </div>
                      {/* <button
                        onClick={() => toggleWatch(t.symbol)}
                        className="hover:scale-110 transition-transform"
                      >
                        <Star
                          className="w-5 h-5"
                          fill={
                            watchlist.includes(t.symbol) ? "#fbbf24" : "none"
                          } // Yellow-400
                          color={
                            watchlist.includes(t.symbol)
                              ? "#fbbf24"
                              : "currentColor"
                          }
                        />
                      </button> */}
                    </div>

                    {/* Price & Change */}
                    <div className="flex justify-between items-baseline mb-4">
                      <div className="text-xl font-semibold">
                        ₹{parseFloat(t.lastPrice).toFixed(2)}
                      </div>
                      <div
                        className={`text-sm font-medium ${
                          change >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {change > 0 ? "+" : ""}
                        {change.toFixed(2)}%
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 items-center">
                      {/* Quantity Input */}
                      <input
                        type="number"
                        min={1}
                        max={portfolio[t.baseAsset] || 100000} // optional max check
                        value={tradeQty[t.symbol] || ""}
                        onChange={(e) =>
                          setTradeQty({
                            ...tradeQty,
                            [t.symbol]: parseInt(e.target.value),
                          })
                        }
                        placeholder="Qty"
                        className="border p-1 rounded text-sm col-span-1"
                      />

                      {/* Buy Button */}
                      <button
                        className="bg-green-600 hover:bg-green-700 text-white py-1.5 rounded text-sm font-medium col-span-1"
                        onClick={() =>
                          handleTrade("buy", t, tradeQty[t.symbol] || 1)
                        }
                      >
                        Buy
                      </button>

                      {/* Sell Button */}
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white py-1.5 rounded text-sm font-medium col-span-1"
                        onClick={() =>
                          handleTrade(
                            "sell",
                            t,
                            tradeQty[t.symbol] > (portfolio[t.baseAsset] || 0)
                              ? portfolio[t.baseAsset]
                              : tradeQty[t.symbol] || 1
                          )
                        }
                      >
                        Sell
                      </button>
                    </div>

                    {/* Action Buttons */}
                    {/* <div className="grid grid-cols-2 gap-2">
                      <button
                        className="bg-green-600 hover:bg-green-700 text-white py-1.5 rounded text-sm font-medium transition-colors"
                        onClick={() => handleTrade("buy", t)}
                      >
                        Buy
                      </button>
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white py-1.5 rounded text-sm font-medium transition-colors"
                        onClick={() => handleTrade("sell", t)}
                      >
                        Sell
                      </button>
                    </div> */}
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="myassets">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {portfolioSummary.items.length === 0 && (
                <div className="text-center p-6 col-span-full text-muted-foreground">
                  You don't have any crypto assets yet.
                </div>
              )}

              {portfolioSummary.items.map((item) => {
                const ticker = tickers.find(
                  (t) => t.baseAsset.toLowerCase() === item.asset.toLowerCase()
                );
                const change = ticker ? calculateChange(ticker) : 0;

                return (
                  <div
                    key={item.asset}
                    className="bg-card border p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-lg">{item.asset}</h4>
                      </div>
                      <span className="text-xs bg-secondary px-2 rounded">
                        Holding
                      </span>
                    </div>

                    {/* Price + Change */}
                    <div className="flex justify-between items-center mb-3">
                      <div className="text-xl font-semibold">
                        ₹{item.price.toFixed(2)}
                      </div>
                      <div
                        className={`text-sm font-medium ${
                          change >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {change >= 0 ? "+" : ""}
                        {change.toFixed(2)}%
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="text-sm font-medium text-muted-foreground mb-2">
                      Qty: <span className="font-bold">{item.qty}</span>
                    </div>

                    {/* Total Value */}
                    <div className="text-sm font-medium mb-2">
                      Value:{" "}
                      <span className="font-bold text-green-500">
                        ₹{item.totalValue.toFixed(2)}
                      </span>
                    </div>

                    {/* Buttons */}
                    <button
                      onClick={() =>
                        handleTrade(
                          "sell",
                          ticker!,
                          item.qty // full sell
                        )
                      }
                      className="bg-red-600 hover:bg-red-700 text-white py-1.5 mt-3 w-full rounded font-medium"
                    >
                      Sell All
                    </button>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="charts">
            <div className="bg-card border rounded-xl p-4">
              <div className="flex gap-2 flex-wrap mb-6 border-b pb-4">
                {tickers.slice(0, 10).map((t) => (
                  <button
                    key={t.symbol}
                    onClick={() => setSelectedPair(t.symbol)}
                    className={`px-3 py-1 text-sm rounded transition-colors ${
                      selectedPair === t.symbol
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary hover:bg-secondary/80"
                    }`}
                  >
                    {t.baseAsset}/{t.quoteAsset}
                  </button>
                ))}
              </div>

              <div className="h-[400px]">
                <PriceChart
                  data={chartData}
                  title={`${selectedPair.toUpperCase()} Analysis`}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Markets;
