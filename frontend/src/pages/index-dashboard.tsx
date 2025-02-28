import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { 
  Mail, 
  Calendar, 
  Send,
  MessageCircle,
  ArrowRight,
  XCircle,
  TrendingUp
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import axios from "axios";

// API Base URL
const API_BASE_URL = "http://127.0.0.1:5001/api";

// Types
interface DashboardSummary {
  totalEmails: number;
  scheduledEmails: number;
  sentEmails: number;
  failedEmails: number;
  openRate: string;
  clickRate: string;
  distribution?: {
    Sent: number;
    Scheduled: number;
    Failed: number;
  };
}

const Index = () => {
  const accountEmail = sessionStorage.getItem("userEmail") || "vtu19622@veltech.edu.in";
  
  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data automatically when page loads
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_BASE_URL}/dashboard-data`, { params: { accountEmail } });
        setDashboardData(response.data);
      } catch (err) {
        setError("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format distribution data for Area Chart
  const performanceData = dashboardData?.distribution
    ? Object.entries(dashboardData.distribution).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-indigo-50 via-white to-indigo-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="h-14 w-14 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1>---</h1>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-900 to-blue-900 bg-clip-text text-transparent">
              MailScheduler Dashboard
            </h1>
            <p className="text-indigo-600">Track your email performance</p>
          </div>
        </div>
        <div className="text-sm text-indigo-600 font-medium">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-600">{error}</p>}

      {/* Show Data Only When Available */}
      {!loading && dashboardData && (
        <div>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Total Emails Card */}
            <Card className="p-6 bg-gradient-to-br from-indigo-50 to-white border-indigo-100 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-indigo-600">Total Emails</p>
                  <h3 className="text-2xl font-bold text-indigo-900 mt-1">
                    {dashboardData?.totalEmails || 0}
                  </h3>
                </div>
                <div className="h-12 w-12 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center">
                  <Send className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
            </Card>

            {/* Sent Emails Card */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-white border-blue-100 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Sent Emails</p>
                  <h3 className="text-2xl font-bold text-blue-900 mt-1">
                    {dashboardData?.sentEmails || 0}
                  </h3>
                </div>
                <div className="h-12 w-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </Card>

            {/* Scheduled Emails Card */}
            <Card className="p-6 bg-gradient-to-br from-green-50 to-white border-green-100 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Scheduled Emails</p>
                  <h3 className="text-2xl font-bold text-green-900 mt-1">
                    {dashboardData?.scheduledEmails || 0}
                  </h3>
                </div>
                <div className="h-12 w-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </Card>

            {/* Failed Emails Card */}
            <Card className="p-6 bg-gradient-to-br from-red-50 to-white border-red-100 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Failed Emails</p>
                  <h3 className="text-2xl font-bold text-red-900 mt-1">
                    {dashboardData?.failedEmails || 0}
                  </h3>
                </div>
                <div className="h-12 w-12 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Performance Chart (Full Width) */}
          <Card className="p-8 hover:shadow-lg transition-all bg-gradient-to-br from-white to-indigo-50 border-indigo-100 w-full mt-8">
            <h3 className="text-lg font-semibold text-indigo-900 mb-6 text-center">Email Status Over Time</h3>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#4F46E5" fillOpacity={1} fill="url(#colorSent)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Inspirational Quote */}
          <Card className="p-8 bg-gradient-to-br from-indigo-100 to-white border-indigo-200 mt-8">
            <blockquote className="text-center">
              <p className="text-lg text-indigo-800 font-medium italic">
                "Effective email scheduling is the key to maintaining meaningful connections in the digital age."
              </p>
              <footer className="mt-2 text-sm text-indigo-600">— MailScheduler Team</footer>
            </blockquote>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Index;
