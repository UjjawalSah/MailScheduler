import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock, Plus, X, Check } from "lucide-react";
import { format, isAfter, isBefore, addMinutes, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import { toast } from "sonner";
interface TemplateEditorProps {
  isOpen: boolean;
  onClose: () => void;
  template: {
    id: number;
    title: string;
    description: string;
    preview: string;
    category?: string;
  };
}

interface FormValues {
  title: string;
  content: string;
  senderEmail: string;
  appPassword: string;
  recipientEmail: string;
  scheduledDate: Date | undefined;
  scheduledTime: string;
  country: string;
  timezone: string;
  files: File[];
}

const countries = [
  { code: "US", name: "United States", timezones: ["America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles"] },
  { code: "GB", name: "United Kingdom", timezones: ["Europe/London"] },
  { code: "IN", name: "India", timezones: ["Asia/Kolkata"] },
  { code: "AU", name: "Australia", timezones: ["Australia/Sydney", "Australia/Melbourne", "Australia/Perth"] },
  { code: "CA", name: "Canada", timezones: ["America/Toronto", "America/Vancouver"] },
  { code: "DE", name: "Germany", timezones: ["Europe/Berlin"] },
  { code: "FR", name: "France", timezones: ["Europe/Paris"] },
  { code: "JP", name: "Japan", timezones: ["Asia/Tokyo"] },
  { code: "SG", name: "Singapore", timezones: ["Asia/Singapore"] },
  { code: "BR", name: "Brazil", timezones: ["America/Sao_Paulo"] },
  { code: "ES", name: "Spain", timezones: ["Europe/Madrid"] },
  { code: "IT", name: "Italy", timezones: ["Europe/Rome"] },
  { code: "NL", name: "Netherlands", timezones: ["Europe/Amsterdam"] },
  { code: "SE", name: "Sweden", timezones: ["Europe/Stockholm"] },
  { code: "NO", name: "Norway", timezones: ["Europe/Oslo"] }
];

const TemplateEditor = ({ isOpen, onClose, template }: TemplateEditorProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [recipientEmails, setRecipientEmails] = useState<Array<{ email: string; isValid: boolean }>>([]);
  const [currentEmail, setCurrentEmail] = useState("");

  const form = useForm<FormValues>({
    defaultValues: {
      title: template.title,
      content: template.preview,
      senderEmail: "",
      appPassword: "",
      recipientEmail: "",
      scheduledDate: undefined,
      scheduledTime: "",
      country: "",
      timezone: "",
    },
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddEmail = () => {
    if (currentEmail && validateEmail(currentEmail)) {
      setRecipientEmails([...recipientEmails, { email: currentEmail, isValid: true }]);
      setCurrentEmail("");
    }
  };

  const removeEmail = (index: number) => {
    setRecipientEmails(recipientEmails.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

   

  const onSubmit = async (data: FormValues) => {
    const senderEmail = data.senderEmail.trim().toLowerCase(); // Normalize sender email
    const recipientEmailsList = recipientEmails.map(e => e.email.trim().toLowerCase()); // Normalize recipient emails

    // Validation: Ensure sender is not in the recipient list
    if (recipientEmailsList.includes(senderEmail)) {
        console.error("Error: Sender email cannot be the same as any recipient email.");
        alert("Sender email cannot be the same as recipient email.");
        return;
    }

    // Get user session from sessionStorage
    const userName = sessionStorage.getItem("userName");
    const userEmail = sessionStorage.getItem("userEmail");

    if (!userName || !userEmail) {
        console.error("Error: No user session found.");
        alert("Error: You must be logged in to submit the form.");
        return;
    }

    const formData = new FormData();

// Ensure recipientEmails is always an array
const recipientEmailsArray = Array.isArray(recipientEmailsList) ? recipientEmailsList : [recipientEmailsList];

// Append recipient emails properly (multiple entries for array)
recipientEmailsArray.forEach(email => formData.append("recipientEmails[]", email));

// Append files separately
selectedFiles.forEach(file => formData.append("files", file));

// Append other form fields, ensuring all values are strings
Object.entries({
    ...data,
    scheduledDateTime: data.scheduledDate && data.scheduledTime
        ? `${format(data.scheduledDate, 'yyyy-MM-dd')} ${data.scheduledTime}`
        : null,
    accountName: userName,  
    accountEmail: userEmail
}).forEach(([key, value]) => {
    if (value instanceof Date) {
        formData.append(key, value.toISOString()); // Convert Date to string
    } else if (Array.isArray(value)) {
        value.forEach(v => formData.append(`${key}[]`, String(v))); // Convert array values to strings
    } else if (value !== undefined && value !== null) {
        formData.append(key, String(value)); // Ensure everything else is string
    }
});

// Debugging: Print final form data
console.log("Form submitted:", {
    ...data,
    recipientEmails: recipientEmailsArray,
    files: selectedFiles.map(f => f.name),
});

try {
    const response = await axios.post("submit-form", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        },
        withCredentials: true
    });

    console.log("Success:", response.data);
    toast("Email Scheduled successfully! You can Find in History Section!");
    onClose();
} catch (error: any) {
    console.error("Submission error:", error.response?.data || error.message);
    alert(`Error: ${error.response?.data?.error || "An error occurred while submitting the form."}`);
}

};


  const now = new Date();
  const startOfToday = startOfDay(now);

  const timeOptions = Array.from({ length: 720 }, (_, i) => {
    const totalMinutes = i * 2;
    const hour = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    // Ensure minutes are displayed with two digits (e.g., "05" instead of "5")
    const minuteStr = minute.toString().padStart(2, '0');
    return `${hour12}:${minuteStr} ${ampm}`;
  }).filter(time => {
    if (!form.getValues("scheduledDate")) return true;
    const [hour, minute, period] = time.split(/:|\s/);
    let hours = parseInt(hour);
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    
    const selectedDateTime = new Date(form.getValues("scheduledDate"));
    selectedDateTime.setHours(hours, parseInt(minute));
    
    return isAfter(selectedDateTime, addMinutes(now, 5));
  });

  const handleCSVExcelUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      if (!data) return;
  
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  
      const extractedEmails = jsonData
        .flat()
        .filter((cell) => typeof cell === "string" && validateEmail(cell));
  
      setRecipientEmails((prev) => [
        ...prev,
        ...extractedEmails.map((email) => ({ email, isValid: true }))
      ]);
    };
  
    reader.readAsBinaryString(file);
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {template.category ? `Edit ${template.category} - ${template.title}` : `Edit Template - ${template.title}`}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex-1 overflow-y-auto">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      className="min-h-[200px]"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormLabel>Attachments</FormLabel>
              <div className="flex flex-wrap gap-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 bg-muted p-2 rounded-lg">
                    <span className="text-sm">{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add File
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>
<div className="space-y-4">
  <FormLabel>Upload CSV/Excel File</FormLabel>
  <input
    type="file"
    accept=".csv, .xlsx"
    className="bg-background border rounded p-2"
    onChange={handleCSVExcelUpload}
  />
</div>
            <div className="space-y-4">
              <FormLabel>Recipient Emails</FormLabel>
              <div className="flex gap-2 mb-2">
                <Input
                  value={currentEmail}
                  onChange={(e) => setCurrentEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="flex-1"
                />
                <Button 
                  type="button"
                  onClick={handleAddEmail}
                  disabled={!validateEmail(currentEmail)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recipientEmails.map((email, index) => (
                  <div key={index} className="flex items-center gap-2 bg-muted p-2 rounded-lg">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{email.email}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEmail(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="senderEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sender Email(Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="appPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>App Password(Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4 bg-muted/30 p-4 rounded-lg relative">
              <FormLabel className="text-lg">Schedule Settings</FormLabel>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel>Country</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedCountry(value);
                          form.setValue("timezone", "");
                        }}
                        value={field.value}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent className="z-[9999] bg-background border shadow-lg">
                          {countries.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="timezone"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel>Timezone</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!selectedCountry}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent className="z-[9999] bg-background border shadow-lg">
                          {selectedCountry && 
                            countries
                              .find(c => c.code === selectedCountry)
                              ?.timezones.map((timezone) => (
                                <SelectItem key={timezone} value={timezone}>
                                  {timezone}
                                </SelectItem>
                              ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="scheduledDate"
                  render={({ field }) => (
                    <FormItem className="col-span-1 relative">
                      <FormLabel>Schedule Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal bg-background",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 z-[9999] bg-background border shadow-lg" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              field.onChange(date);
                              form.setValue("scheduledTime", "");
                            }}
                            disabled={(date) => isBefore(date, startOfToday)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="scheduledTime"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel>Schedule Time</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select time">
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4" />
                              {field.value || "Select time"}
                            </div>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="z-[9999] bg-background border shadow-lg max-h-[300px]">
                          {timeOptions.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={recipientEmails.length === 0}
              >
                Save & Schedule
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateEditor;
