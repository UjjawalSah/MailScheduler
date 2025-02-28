
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { BarChart, ChevronRight, Mail, MousePointerClick, Users, Rocket, Target } from "lucide-react";

const analyticsData = [
  { name: "Jan", value: 1200, engagement: 65, conversion: 42 },
  { name: "Feb", value: 2100, engagement: 75, conversion: 55 },
  { name: "Mar", value: 800, engagement: 45, conversion: 38 },
  { name: "Apr", value: 1600, engagement: 85, conversion: 62 },
  { name: "May", value: 900, engagement: 55, conversion: 45 },
  { name: "Jun", value: 1700, engagement: 90, conversion: 68 },
];

const Analytics = () => {
  return (
    <div className="space-y-8">
      <header className="mb-8">
      <h1>-----</h1>
      <h1>-----</h1>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Analytics Overview
        </h1>
        <p className="text-indigo-600">Track your email campaign performance with real-time insights</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-gradient-to-br from-indigo-50 to-white border-indigo-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Mail className="h-5 w-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-indigo-900">Open Rates</h3>
            </div>
            <Button variant="ghost" size="sm" className="hover:bg-indigo-50">
              <ChevronRight className="h-4 w-4 text-indigo-600" />
            </Button>
          </div>
          <p className="text-3xl font-bold text-indigo-900">45.2%</p>
          <div className="flex items-center mt-2">
            <span className="text-green-500 text-sm font-medium">+2.5%</span>
            <span className="text-slate-600 text-sm ml-1">from last month</span>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-white border-blue-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MousePointerClick className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-blue-900">Click-Through</h3>
            </div>
            <Button variant="ghost" size="sm" className="hover:bg-blue-50">
              <ChevronRight className="h-4 w-4 text-blue-600" />
            </Button>
          </div>
          <p className="text-3xl font-bold text-blue-900">28.9%</p>
          <div className="flex items-center mt-2">
            <span className="text-green-500 text-sm font-medium">+1.2%</span>
            <span className="text-slate-600 text-sm ml-1">from last month</span>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-cyan-50 to-white border-cyan-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-cyan-100 rounded-lg">
                <Target className="h-5 w-5 text-cyan-600" />
              </div>
              <h3 className="text-lg font-semibold text-cyan-900">Response Rate</h3>
            </div>
            <Button variant="ghost" size="sm" className="hover:bg-cyan-50">
              <ChevronRight className="h-4 w-4 text-cyan-600" />
            </Button>
          </div>
          <p className="text-3xl font-bold text-cyan-900">15.7%</p>
          <div className="flex items-center mt-2">
            <span className="text-green-500 text-sm font-medium">+0.8%</span>
            <span className="text-slate-600 text-sm ml-1">from last month</span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-gradient-to-br from-white to-indigo-50 border-indigo-100">
          <h3 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center">
            <Rocket className="h-5 w-5 mr-2 text-indigo-600" />
            Performance Trends
          </h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData}>
                <defs>
                  <linearGradient id="valueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #E5E7EB',
                    borderRadius: '6px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#4F46E5"
                  strokeWidth={2}
                  dot={{
                    stroke: '#4F46E5',
                    strokeWidth: 2,
                    r: 4,
                    fill: '#fff'
                  }}
                  activeDot={{
                    stroke: '#4F46E5',
                    strokeWidth: 2,
                    r: 6,
                    fill: '#fff'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="engagement"
                  stroke="#0EA5E9"
                  strokeWidth={2}
                  dot={{
                    stroke: '#0EA5E9',
                    strokeWidth: 2,
                    r: 4,
                    fill: '#fff'
                  }}
                  activeDot={{
                    stroke: '#0EA5E9',
                    strokeWidth: 2,
                    r: 6,
                    fill: '#fff'
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-white to-blue-50 border-blue-100">
          <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-600" />
            Audience Engagement
          </h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData}>
                <defs>
                  <linearGradient id="conversionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #E5E7EB',
                    borderRadius: '6px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="conversion"
                  stroke="#0EA5E9"
                  strokeWidth={2}
                  dot={{
                    stroke: '#0EA5E9',
                    strokeWidth: 2,
                    r: 4,
                    fill: '#fff'
                  }}
                  activeDot={{
                    stroke: '#0EA5E9',
                    strokeWidth: 2,
                    r: 6,
                    fill: '#fff'
                  }}
                  fill="url(#conversionGradient)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
