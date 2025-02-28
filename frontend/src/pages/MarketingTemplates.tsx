import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Mail, Clock, Calendar } from "lucide-react";
import TemplateEditor from "@/components-dashboard/TemplateEditor";

const templates = [
  {
    id: 1,
    title: "Product Launch",
    description: "Announce new product releases",
    preview: "Introducing our latest product...",
  },
  {
    id: 2,
    title: "Newsletter",
    description: "Monthly company updates and news",
    preview: "Stay updated with our latest developments...",
  },
  {
    id: 3,
    title: "Promotional Offer",
    description: "Special discounts and promotions",
    preview: "Don't miss out on this exclusive offer...",
  },
];

const MarketingTemplates = () => {
  const [editingTemplate, setEditingTemplate] = useState<typeof templates[0] | null>(null);

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-blue-50 via-white to-blue-50 min-h-screen">
      {/* Header */}
      <header className="space-y-2">
        <h1>--</h1>
        <h1 className="text-4xl font-bold text-blue-900">Marketing Templates</h1>
        <p className="text-blue-600">Choose from our promotional email templates</p>
      </header>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg bg-white border-blue-100 overflow-hidden">
            <div className="p-6 space-y-4">
              {/* Template Title & Description */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-blue-900">{template.title}</h3>
                <p className="text-sm text-blue-600">{template.description}</p>
              </div>
              
              {/* Template Preview */}
              <div className="h-32 bg-blue-50/50 rounded-lg p-4 text-sm text-blue-800 shadow-sm">
                <p className="line-clamp-4">{template.preview}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-blue-100">
                {/* Icons (Left-Aligned) */}
                <div className="flex space-x-2 text-blue-600 text-sm">
                  <Mail className="h-4 w-4" />
                  <Clock className="h-4 w-4" />
                  <Calendar className="h-4 w-4" />
                </div>

                {/* Edit Button */}
                <Button 
                  size="sm" 
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center"
                  onClick={() => setEditingTemplate(template)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Template Editor Modal */}
      {editingTemplate && (
        <TemplateEditor
          isOpen={true}
          onClose={() => setEditingTemplate(null)}
          template={editingTemplate}
        />
      )}
    </div>
  );
};

export default MarketingTemplates;
