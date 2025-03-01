import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Mail, Clock } from "lucide-react"; // Icons

// Type definitions for analytics data
interface DayEngagement {
  day_of_week: number;
  click_rate: number;
}

interface TimeEngagement {
  times_of_day: string;
  click_rate: number;
}

interface SubjectClick {
  subject_len: number;
  click_rate: number;
}

interface CategoryEngagement {
  category: string;
  click_rate: number;
}

interface ProductEngagement {
  product: string;
  click_rate: number;
}

interface TargetAudienceEngagement {
  target_audience: string;
  click_rate: number;
}

interface AnalyticsData {
  engagement_by_day: DayEngagement[];
  engagement_by_time: TimeEngagement[];
  subject_vs_click: SubjectClick[];
  category_engagement: CategoryEngagement[];
  product_engagement: ProductEngagement[];
  target_audience_engagement: TargetAudienceEngagement[];
}

const Analytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  // Automatically fetch analytics data when the component mounts.
  useEffect(() => {
    axios
      .get<AnalyticsData>("http://localhost:5001/analytics")
      .then((response) => setAnalytics(response.data))
      .catch((error) =>
        console.error("Error fetching analytics data:", error)
      );
  }, []);

  if (!analytics) {
    return <div>Loading analytics...</div>;
  }

  // Determine the best time to send mail based on the highest average click rate.
  let bestTimeRecommendation = "";
  if (analytics.engagement_by_time.length > 0) {
    const bestTime = analytics.engagement_by_time.reduce((max, cur) =>
      cur.click_rate > max.click_rate ? cur : max
    );
    bestTimeRecommendation = `Recommended best time to send mail: ${bestTime.times_of_day} (Avg Click Rate: ${bestTime.click_rate.toFixed(
      2
    )})`;
  }

  return (
     
    <div className="p-8 space-y-12">
       
      {/* Header */}
      <header className="flex items-center space-x-3">
         
        <Mail className="h-12 w-10 text-blue-600" />
        <h1 className="text-4xl font-bold text-blue-600 text-left">
          Email Campaign Analytics
        </h1>
      </header>

      {/* 1. Best Time & Day for Email Engagement */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 flex items-center space-x-2">
          <Clock className="h-6 w-6 text-blue-500" />
          <span>Best Time & Day for Email Engagement</span>
        </h2>
        {bestTimeRecommendation && (
          <p className="mb-4 text-lg text-gray-700">
            {bestTimeRecommendation}
          </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Engagement by Day */}
          <Card className="p-4">
            <h3 className="text-xl font-semibold mb-2">By Day of Week</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.engagement_by_day}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="day_of_week"
                  label={{
                    value: "Day of Week",
                    position: "insideBottom",
                    offset: -5,
                  }}
                />
                <YAxis
                  label={{
                    value: "Avg Click Rate",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip />
                <Bar
                  dataKey="click_rate"
                  fill="#4F46E5"
                  isAnimationActive={true}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          {/* Engagement by Time */}
          <Card className="p-4">
            <h3 className="text-xl font-semibold mb-2">By Time of Day</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.engagement_by_time}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="times_of_day"
                  label={{
                    value: "Time of Day",
                    position: "insideBottom",
                    offset: -5,
                  }}
                />
                <YAxis
                  label={{
                    value: "Avg Click Rate",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip />
                <Bar
                  dataKey="click_rate"
                  fill="#0EA5E9"
                  isAnimationActive={true}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </section>

      {/* 2. Email Content Effectiveness: Subject Length vs. Click Rate */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">
          Subject Length vs. Click Rate
        </h2>
        <Card className="p-4">
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="subject_len"
                name="Subject Length"
                label={{
                  value: "Subject Length",
                  position: "insideBottom",
                  offset: 0,
                }}
              />
              <YAxis
                type="number"
                dataKey="click_rate"
                name="Click Rate"
                label={{
                  value: "Click Rate",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter
                name="Subject vs Click"
                data={analytics.subject_vs_click}
                fill="#34D399"
                isAnimationActive={true}
                animationDuration={1500}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </Card>
      </section>

      {/* 3. Target Audience Impact on CTR */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">
          Target Audience Impact on CTR
        </h2>
        <p className="mb-4 text-lg text-gray-700">
          Compare how different target audiences—such as Marketing emails versus
          Job Application emails—perform in terms of click-through rate (CTR). These insights
          help you optimize campaigns for specific audience segments.
        </p>
        <Card className="p-4">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.target_audience_engagement}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="target_audience"
                label={{
                  value: "Target Audience",
                  position: "insideBottom",
                  offset: -5,
                }}
              />
              <YAxis
                label={{
                  value: "Avg CTR",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip />
              <Bar
                dataKey="click_rate"
                fill="#ff7300"
                isAnimationActive={true}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </section>

      {/* 4. Product/Category Impact on CTR */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">
          Product/Category Impact on CTR
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-4">
            <h3 className="text-xl font-semibold mb-2">By Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.category_engagement}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="category"
                  label={{
                    value: "Category",
                    position: "insideBottom",
                    offset: -5,
                  }}
                />
                <YAxis
                  label={{
                    value: "Avg Click Rate",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip />
                <Bar
                  dataKey="click_rate"
                  fill="#EF4444"
                  isAnimationActive={true}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card className="p-4">
            <h3 className="text-xl font-semibold mb-2">By Product</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.product_engagement}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="product"
                  label={{
                    value: "Product",
                    position: "insideBottom",
                    offset: -5,
                  }}
                />
                <YAxis
                  label={{
                    value: "Avg Click Rate",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip />
                <Bar
                  dataKey="click_rate"
                  fill="#10B981"
                  isAnimationActive={true}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Analytics;
