import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  BarChart3,
  Users,
  TrendingUp,
  DollarSign,
  FilePlus,
} from "lucide-react";

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-accent to-primary text-transparent bg-clip-text mb-3">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Monitor and manage everything in your MKfrx ecosystem
          </p>

          {/* Add Blog Button */}
          <div className="mt-6 flex justify-center">
            <Button
              onClick={() => navigate("/admin/add-blog")}
              className="flex items-center gap-2 px-6 py-5 text-lg rounded-xl bg-gradient-to-r from-accent to-primary text-white shadow-lg hover:shadow-xl transition"
            >
              <FilePlus className="h-5 w-5" />
              Add New Blog
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="border-accent/40 shadow-md hover:shadow-lg transition">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">12,543</p>
              <p className="text-xs text-muted-foreground mt-1">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="border-accent/40 shadow-md hover:shadow-lg transition">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Trading Volume
              </CardTitle>
              <BarChart3 className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">$2.4M</p>
              <p className="text-xs text-muted-foreground mt-1">
                +8% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="border-accent/40 shadow-md hover:shadow-lg transition">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Active Trades
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">1,429</p>
              <p className="text-xs text-muted-foreground mt-1">
                +23% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="border-accent/40 shadow-md hover:shadow-lg transition">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">$54,231</p>
              <p className="text-xs text-muted-foreground mt-1">
                +18% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Management Panels */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="hover:shadow-md transition">
            <CardHeader>
              <CardTitle className="text-xl">User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Manage user accounts, roles, KYC, and access permissions. View
                trading activity, ban users, and adjust user-level settings.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition">
            <CardHeader>
              <CardTitle className="text-xl">Market Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Configure market pairs, adjust liquidity pools, set trading
                fees, and monitor market performance in real-time.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition">
            <CardHeader>
              <CardTitle className="text-xl">Transaction Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Track deposits, withdrawals, and trades. Ensure compliance and
                detect suspicious or high-risk activities instantly.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition">
            <CardHeader>
              <CardTitle className="text-xl">System Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Manage API keys, platform parameters, notification systems, and
                view backend performance metrics & logs.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Admin;
