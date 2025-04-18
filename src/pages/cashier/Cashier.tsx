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
    <div className="text-text sm:p-25 p-4">
      <h1 className="text-2xl font-bold text-primary">Cashier</h1>

      {/* Product Selection */}
      <div className="mb-8">
        <label className="block text-sm font-medium">Input Product</label>
        <Select
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
                  <button
                    onClick={() =>
                      handleQuantityChange(
                        row.original.id,
                        row.original.quantity - 1
                      )
                    }
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    disabled={row.original.quantity <= 1} // Disable if quantity is 1
                  >
                    <Minus className="w-4 h-4 mx-auto" />
                  </button>

                  {/* Quantity Input */}
                  <input
                    type="number"
                    value={row.original.quantity}
                    onChange={(e) =>
                      handleQuantityChange(row.original.id, +e.target.value)
                    }
                    className="w-16 border rounded px-2 py-1 text-center"
                    min={1} // Minimum value for quantity
                  />

                  {/* Increase Quantity Button */}
                  <button
                    onClick={() =>
                      handleQuantityChange(
                        row.original.id,
                        row.original.quantity + 1
                      )
                    }
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    <Plus className=" w-4 h-4 mx-auto" />
                  </button>
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
                  className="text-red-500"
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
