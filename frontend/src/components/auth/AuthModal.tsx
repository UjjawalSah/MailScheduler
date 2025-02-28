
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";
import { useState } from "react";

export const AuthModal = ({ trigger }: { trigger?: React.ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="default" className="bg-primary text-white rounded-full px-6 py-2 hover:bg-primary/90 transition-colors">
            Get Started
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-0">
        <Card className="border-0">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <SignInForm onSuccess={() => setOpen(false)} />
            </TabsContent>
            <TabsContent value="signup">
              <SignUpForm onSuccess={() => setOpen(false)} />
            </TabsContent>
          </Tabs>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
