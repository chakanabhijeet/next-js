"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useDashboardViewModel } from "../view-models/use-dashboard-view-model";

export default function DashboardView() {
  const {
    data,
    isLoading,
    isError,
  } = useDashboardViewModel();

  if (isLoading) {
    return (
      <div className="p-6">
        Loading dashboard...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        Unable to load dashboard.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="text-muted-foreground">
          Welcome to your dashboard.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">
              0
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Products</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">
              0
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">
              0
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">
              ₹0
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}