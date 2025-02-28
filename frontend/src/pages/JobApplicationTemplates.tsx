import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Mail, Clock, Calendar } from "lucide-react";
import TemplateEditor from "@/components-dashboard/TemplateEditor";

interface Template {
  id: number;
  title: string;
  description: string;
  preview: string;
}

const templates: Template[] = [
  {
    id: 4,
    title: "Software Developer Application",
    description: "Job application template for software development roles",
    preview: `Dear [Hiring Manager],

I am writing to express my strong interest in the Software Developer position at [Company Name]. With my background in full-stack development and [Years] years of experience working with [Technologies], I am confident in my ability to contribute to your engineering team.

[Customize with specific technical skills and project achievements]

I look forward to discussing how my skills align with your team's needs.

Best regards,
[Your Name]`,
  },
  {
    id: 5,
    title: "Marketing Manager Application",
    description: "Job application template for marketing positions",
    preview: `Dear [Hiring Manager],

I am excited to apply for the Marketing Manager position at [Company Name]. With my proven track record in digital marketing and campaign management, I believe I would be an excellent fit for your team.

[Customize with marketing achievements and ROI metrics]

I am eager to discuss how I can contribute to [Company Name]'s marketing objectives.

Best regards,
[Your Name]`,
  },
  {
    id: 6,
    title: "Sales Representative Application",
    description: "Job application template for sales positions",
    preview: `Dear [Hiring Manager],

I am writing to express my keen interest in the Sales Representative role at [Company Name]. With a demonstrated history of exceeding sales targets and building strong client relationships, I am excited about the opportunity to join your sales team.

[Customize with sales achievements and performance metrics]

I would welcome the chance to discuss how I can contribute to your sales objectives.

Best regards,
[Your Name]`,
  }
];

interface EditingTemplate {
  id: number;
  title: string;
  description: string;
  preview: string;
  category?: string;
}

const JobApplicationTemplates = () => {
  const [editingTemplate, setEditingTemplate] = useState<EditingTemplate | null>(null);

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate({
      ...template,
      category: "Job Applications"
    });
  };

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-blue-50 via-white to-blue-50 min-h-screen">
      {/* Header */}
      <header className="space-y-2">
      <h1>--</h1>
        <h1 className="text-4xl font-bold text-blue-900">Job Application Templates</h1>
        <p className="text-blue-600">Professional templates for job applications</p>
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
                  onClick={() => handleEditTemplate(template)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Template
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

export default JobApplicationTemplates;
