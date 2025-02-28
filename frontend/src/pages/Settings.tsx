import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Clock, Calendar, CheckCircle2, XCircle, Mail, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface ScheduleHistory {
  formId: string;
  scheduledDateTime: string;
  emailStatus: "Sent" | "Scheduled" | "Cancelled";
  accountEmail: string;
  primaryRecipient: string;
  sender: string;
}

const getStatusColor = (status: ScheduleHistory["emailStatus"]) => {
  switch (status.toLowerCase()) {
    case "scheduled":
      return "text-blue-500";
    case "sent":
      return "text-green-500";
    case "cancelled":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};

const getStatusIcon = (status: ScheduleHistory["emailStatus"]) => {
  switch (status.toLowerCase()) {
    case "scheduled":
      return <Clock className="h-5 w-5" />;
    case "sent":
      return <CheckCircle2 className="h-5 w-5" />;
    case "cancelled":
      return <XCircle className="h-5 w-5" />;
    default:
      return null;
  }
};

const Settings = () => {
  const [scheduleHistory, setScheduleHistory] = useState<ScheduleHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScheduleHistory = async () => {
      const accountEmail = sessionStorage.getItem("userEmail");
      if (!accountEmail) {
        setError("User email not found.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("email_history", {
          params: { accountEmail },
        });
        setScheduleHistory(response.data.scheduleHistory);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.error || err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchScheduleHistory();
  }, []);

  const handleCancelScheduledEmail = async (formId: string, accountEmail: string) => {
    try {
      await axios.post("http://127.0.0.1:5001/api/cancel_email", { formId, accountEmail });
      setScheduleHistory((prev) =>
        prev.map((item) =>
          item.formId === formId ? { ...item, emailStatus: "Cancelled" } : item
        )
      );
    } catch (err) {
      console.error("[ERROR] Cancelling scheduled email:", err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1>................</h1>
      <header className="flex flex-col sm:flex-row items-center justify-between mb-6">
        <h1 className="text-4xl font-bold text-primary">Email Scheduling History</h1>
      </header>

      <Card className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-6">History</h3>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {scheduleHistory.map((item) => {
                const scheduledDate = new Date(item.scheduledDateTime);
                const dateStr = scheduledDate.toLocaleDateString();
                const timeStr = scheduledDate.toLocaleTimeString();

                return (
                  <div
                    key={item.formId}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors shadow"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col items-center justify-center p-3 bg-background rounded-lg shadow">
                        <Calendar className="h-6 w-6 text-muted-foreground" />
                        <span className="text-xs font-medium mt-1">{dateStr}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-6 w-6 text-muted-foreground" />
                          <span className="text-sm">{timeStr}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-6 w-6 text-muted-foreground" />
                          <span className="text-sm">To: {item.primaryRecipient}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <User className="h-6 w-6 text-muted-foreground" />
                          <span className="text-sm">From: {item.sender}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className={`flex items-center space-x-2 ${getStatusColor(item.emailStatus)}`}>
                        {getStatusIcon(item.emailStatus)}
                        <span className="text-sm font-medium capitalize">{item.emailStatus}</span>
                      </div>
                      {item.emailStatus.toLowerCase() === "scheduled" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600 hover:bg-red-100"
                          onClick={() => handleCancelScheduledEmail(item.formId, item.accountEmail)}
                        >
                          <XCircle className="h-5 w-5 mr-1" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </Card>
    </div>
  );
};

export default Settings;
