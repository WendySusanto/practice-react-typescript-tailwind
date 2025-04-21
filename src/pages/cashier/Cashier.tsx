import React, { useState, useEffect } from "react";
import Select from "react-select";
import Fuse from "fuse.js"; // Import fuse.js
import Button from "../../components/Button";
import { DataTable } from "../../components/DataTable";
import { products as dummyProducts } from "../../data/dummyProducts"; // Dummy data for products
import { Product } from "../../types/Products";
import { Minus, Plus, Trash2Icon } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useModeContext } from "../../contexts/ModeContext";
import { InputField } from "../../components/InputField";

type ProductSale = {
  id: number;
  name: string;
  satuan: string;
  quantity: number;
  harga: number;
  subTotal: number;
};

export default function Cashier() {
  const [products, setProducts] = useState<ProductSale[]>([]);
  const [productOptions, setProductOptions] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [total, setTotal] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const location = useLocation(); // Get the current location
  const { toggleAdmin } = useModeContext(); // State for admin mode

  // Synchronize isAdminMode with the URL
  useEffect(() => {
    if (location.pathname === "/cashier") {
      toggleAdmin(true); // Set admin mode if the path is /cashier
    } else {
      toggleAdmin(false); // Otherwise, set it to false
    }
  }, [location.pathname]);

  // Fetch initial data for products
  useEffect(() => {
    fetchProductOptions();
  }, []);

  useEffect(() => {
    handleAddProduct();
  }, [selectedProduct]);

  const fetchProductOptions = async () => {
    const data = dummyProducts; // Use dummy data for now
    setProductOptions(data);
  };

  const handleAddProduct = () => {
    if (!selectedProduct) return;

    const existingProduct = products.find((p) => p.id === selectedProduct.id);
    if (existingProduct) {
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.id === selectedProduct.id
            ? {
                ...p,
                quantity: p.quantity + 1,
                subTotal: (p.quantity + 1) * p.harga,
              }
            : p
        )
      );
    } else {
      setProducts((prevProducts) => [
        ...prevProducts,
        {
          ...selectedProduct,
          quantity: 1,
          subTotal: selectedProduct.harga,
        },
      ]);
    }

    setSelectedProduct(null); // Clear the selected product
  };

  const handleQuantityChange = (id: number, quantity: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.id === id
          ? {
              ...p,
              quantity,
              subTotal: quantity * p.harga,
            }
          : p
      )
    );
  };

  const handleRemoveProduct = (id: number) => {
    setProducts((prevProducts) => prevProducts.filter((p) => p.id !== id));
  };

  const calculateTotals = () => {
    const total = products.reduce((sum, p) => sum + p.subTotal, 0);
    const totalItems = products.length;
    setTotal(total);
    setTotalItems(totalItems);
  };

  useEffect(() => {
    calculateTotals();
  }, [products]);

  // Custom filter function using fuse.js
  const customFilter = (candidate: any, input: string) => {
    if (!input) return true; // Show all options if input is empty

    const fuse = new Fuse(productOptions, {
      keys: ["name", "id"], // Fields to search
      threshold: 0.4, // Adjust threshold for fuzzy matching
    });

    const results = fuse.search(input);
    return results.some((result) => result.item.id === candidate.value);
  };

  return (
    <div className="text-text sm:p-25 p-4 bg-background h-screen">
      <h1 className="text-2xl font-bold text-secondary mb-5">Cashier</h1>

      {/* Product Selection */}
      <div className="mb-8">
        <label className="block text-sm font-medium mb-2">Input Product</label>

        <Select
          className="bg-background"
          options={productOptions.map((product) => ({
            value: product.id,
            label: `${product.id} - ${product.name}`,
          }))}
          value={
            selectedProduct
              ? {
                  value: selectedProduct.id,
                  label: `${selectedProduct.id} - ${selectedProduct.name}`,
                }
              : null
          }
          onChange={(option) => {
            const product = productOptions.find((p) => p.id === option?.value);
            setSelectedProduct(product || null);
          }}
          filterOption={customFilter} // Use custom filter function
          placeholder="Search or select a product"
          styles={{
            control: (base, state) => ({
              ...base,
              backgroundColor: "var(--color-background-muted)", // Matches your design
              borderColor: state.isFocused
                ? "var(--color-primary)"
                : "var(--color-border-muted)",
              boxShadow: state.isFocused
                ? "0 0 0 2px var(--color-primary)"
                : "none",
              "&:hover": {
                borderColor: "var(--color-primary-hover)",
              },
              color: "var(--color-text-primary)",
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: "var(--color-background-muted)", // Matches dark mode
              borderRadius: "0.375rem",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isFocused
                ? "var(--color-primary-light)"
                : "var(--color-background-muted)",
              "&:hover": {
                backgroundColor: "var(--color-primary-light)",
              },
            }),
            placeholder: (base) => ({
              ...base,
              color: "var(--color-text-muted)",
            }),
            singleValue: (base) => ({
              ...base,
              color: "var(--color-text-primary)",
            }),
            input: (base) => ({
              ...base,
              color: "var(--color-text-primary)",
            }),
          }}
        />
      </div>

      {/* Product Table */}
      <div className="mb-4">
        <DataTable
          columns={[
            { accessorKey: "name", header: "Nama Produk" },
            { accessorKey: "satuan", header: "Satuan" },
            {
              accessorKey: "quantity",
              header: "Qty",
              cell: ({ row }) => (
                <div className="flex items-center gap-2">
                  {/* Decrease Quantity Button */}
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleQuantityChange(
                        row.original.id,
                        row.original.quantity - 1
                      )
                    }
                    disabled={row.original.quantity <= 1} // Disable if quantity is 1
                  >
                    <Minus className="w-4 h-4 mx-auto" />
                  </Button>

                  {/* Quantity Input */}
                  <InputField
                    className=""
                    type="number"
                    value={row.original.quantity}
                    onChange={(e) =>
                      handleQuantityChange(row.original.id, +e.target.value)
                    }
                    min={1} // Minimum value for quantity
                    label={""}
                    name={""}
                  />

                  {/* Increase Quantity Button */}
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleQuantityChange(
                        row.original.id,
                        row.original.quantity + 1
                      )
                    }
                  >
                    <Plus className=" w-4 h-4 mx-auto" />
                  </Button>
                </div>
              ),
            },
            {
              accessorKey: "harga",
              header: "Harga Satuan",
              cell: ({ getValue }) => {
                const value = getValue() as number;
                return value.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                });
              },
            },
            {
              accessorKey: "subTotal",
              header: "Sub Total",
              cell: ({ getValue }) => {
                const value = getValue() as number;
                return value.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                });
              },
            },
            {
              accessorKey: "actions",
              header: "",
              cell: ({ row }) => (
                <button
                  onClick={() => handleRemoveProduct(row.original.id)}
                  className="text-red-500 cursor-pointer hover:text-red-700"
                >
                  <Trash2Icon className="w-4 h-4" />
                </button>
              ),
            },
          ]}
          data={products}
          disableSearch={true}
        />
      </div>

      {/* Totals */}
      <div className="flex justify-between items-center">
        <div>Total Items: {totalItems}</div>
        <div className="text-lg font-bold">
          Total:{" "}
          {total.toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
          })}
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-4 text-center">
        <Button variant="default" onClick={() => alert("Save & Print Receipt")}>
          Save & Print Receipt
        </Button>
      </div>
    </div>
  );
}
