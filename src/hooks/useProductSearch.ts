import { useState, useRef } from "react";
import Fuse from "fuse.js";
import { Product } from "../types/Products";
import { useFetch } from "./useFetch";

export const useProductSearch = () => {
  const [productOptions, setProductOptions] = useState<Product[] | null>([]);
  const [filteredProductOptions, setFilteredProductOptions] = useState<
    Product[] | null
  >([]);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const { get, isLoading, errorMessage } = useFetch<Product[]>();

  const DEBOUNCE_DELAY = 300;

  const handleInputChange = (input: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (!input) {
        setFilteredProductOptions(productOptions);
        return;
      }
      const fuse = new Fuse(productOptions as Product[], {
        keys: ["name", "id"],
        threshold: 0.4,
      });
      const results = fuse.search(input);
      setFilteredProductOptions(results.map((r) => r.item));
    }, DEBOUNCE_DELAY);
  };

  const fetchProducts = async () => {
    const result = await get("/api/products");
    setProductOptions(result);
    setFilteredProductOptions(result);
  };

  return {
    productOptions,
    filteredProductOptions,
    isLoading,
    errorMessage,
    handleInputChange,
    fetchProducts,
  };
};
