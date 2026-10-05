"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useProductsViewModel } from "../view-models/use-products-view-model";

export default function ProductsView() {
  const {
    products,
    isLoading,
    isError,
  } = useProductsViewModel();

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  if (isError) {
    return <div>Unable to load products.</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Products</CardTitle>
      </CardHeader>

      <CardContent>
        <pre className="overflow-auto text-sm">
          {JSON.stringify(products, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
}