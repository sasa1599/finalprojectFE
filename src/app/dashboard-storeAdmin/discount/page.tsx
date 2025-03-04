"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DiscountForm from "@/components/store-discount/DiscountForm";
import DiscountList from "@/components/store-discount/DiscountList";

export default function DiscountPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("list");

  const handleSuccess = () => {
    toast.success("Discount created successfully!");
    setActiveTab("list");
  };

  const handleError = (error: string) => {
    toast.error(error);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Discount Management</h1>

      <Tabs
        defaultValue="list"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="list">All Discounts</TabsTrigger>
          <TabsTrigger value="create">Create Discount</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-0">
          <DiscountList />
        </TabsContent>

        <TabsContent value="create" className="mt-0">
          <div className="max-w-md mx-auto">
            <DiscountForm
              onSuccess={handleSuccess}
              onError={handleError}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
