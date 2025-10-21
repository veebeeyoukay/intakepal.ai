"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submission
    setSubmitted(true);
  };

  return (
    <section className="mx-auto max-w-xl px-6 py-16">
      <Card>
        <CardHeader>
          <CardTitle>Join the Florida Pilot</CardTitle>
          <CardDescription>
            We're partnering with select practices to co-develop IntakePal.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Alert variant="success">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  Thanks! We'll be in touch within 2 business days.
                </AlertDescription>
              </Alert>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Practice Name</Label>
                <Input id="name" placeholder="Your practice" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Contact Email</Label>
                <Input
                  id="contact"
                  type="email"
                  placeholder="admin@practice.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialty">Specialty</Label>
                <Input
                  id="specialty"
                  placeholder="OB-GYN, Podiatry, etc."
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Request Pilot Access
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
