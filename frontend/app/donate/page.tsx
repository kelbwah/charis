"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Coffee, Gift, Star } from "lucide-react";

export default function DonatePage() {
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null);

  const donationAmounts = [
    {
      value: "5",
      label: "$5",
      icon: Coffee,
      description: "A coffee for our team",
    },
    {
      value: "25",
      label: "$25",
      icon: Heart,
      description: "Support server costs",
    },
    {
      value: "50",
      label: "$50",
      icon: Gift,
      description: "Help develop new features",
    },
    {
      value: "100",
      label: "$100",
      icon: Star,
      description: "Become a major supporter",
    },
  ];

  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-4 text-center">
          <motion.h1
            className="text-4xl font-bold tracking-tighter sm:text-5xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Support Our Prayer Ministry
          </motion.h1>
          <motion.p
            className="text-xl text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Your generosity helps us connect believers through prayer
          </motion.p>
        </div>

        <Tabs defaultValue="one-time" className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger className="cursor-pointer" value="one-time">
              Support Us
            </TabsTrigger>
          </TabsList>

          <TabsContent value="one-time" className="space-y-6 pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {donationAmounts.map((amount) => {
                const Icon = amount.icon;
                return (
                  <Card
                    key={amount.value}
                    className={`cursor-pointer transition-all hover:border-primary/50 ${
                      selectedAmount === amount.value
                        ? "border-primary bg-primary/5"
                        : ""
                    }`}
                    onClick={() => setSelectedAmount(amount.value)}
                  >
                    <CardContent className="p-4 text-center flex flex-col items-center justify-center space-y-2">
                      <Icon className="h-8 w-8 text-primary mb-2" />
                      <p className="text-2xl font-bold">{amount.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {amount.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Custom Amount</CardTitle>
                <CardDescription>
                  Enter any amount you'd like to donate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <span className="text-2xl mr-2">$</span>
                  <input
                    type="number"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Enter amount"
                    min="1"
                    onChange={(e) => setSelectedAmount(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <Heart className="mr-2 h-4 w-4" />
                  Donate Now
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="bg-primary/5 rounded-lg p-6 border border-primary/20">
          <h3 className="text-xl font-medium mb-3">
            Your Support Makes a Difference
          </h3>
          <p className="text-muted-foreground mb-4">
            Charis is supported entirely by donations from people like you. Your
            generosity helps us:
          </p>
          <ul className="space-y-2 mb-4">
            <li className="flex items-start">
              <Heart className="h-5 w-5 text-primary mr-2 mt-0.5" />
              <span>Maintain and improve our prayer platform</span>
            </li>
            <li className="flex items-start">
              <Heart className="h-5 w-5 text-primary mr-2 mt-0.5" />
              <span>Develop new features to better connect believers</span>
            </li>
            <li className="flex items-start">
              <Heart className="h-5 w-5 text-primary mr-2 mt-0.5" />
              <span>Keep our services free and accessible to all</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
