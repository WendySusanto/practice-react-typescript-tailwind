import React, { useState, useEffect, useMemo, useRef } from "react";
import Select from "react-select";
import Fuse from "fuse.js"; // Import fuse.js
import Button from "../../components/Button";
import { DataTable } from "../../components/DataTable";
import { Product } from "../../types/Products";
import { Minus, Plus, Trash2Icon } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useModeContext } from "../../contexts/ModeContext";
import { InputField } from "../../components/InputField";
import { useFetch } from "../../hooks/useFetch";
import { LoadingIcon } from "../../components/LoadingIcon";

type ProductSale = {
  id: number;
  name: string;
  satuan: string;
  quantity: number;
  harga: number;
  subTotal: number;
};

export default function Cashier() {
  const [products, setProducts] = useState<ProductSale[]>([]); // Array to hold products added to the sale
  const [productOptions, setProductOptions] = useState<Product[] | null>([]);
  const [filteredProductOptions, setFilteredProductOptions] =
    useState(productOptions);
  const [memberOptions, setMemberOptions] = useState<
    { value: number; label: string }[] | null
  >([]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedMember, setSelectedMember] = useState<{
    value: number;
    label: string;
  } | null>({ value: 0, label: "Umum" });

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

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
    }, 300);
  };

  const { get, isLoading, errorMessage } = useFetch<Product[]>();

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

  const fetchData = async () => {
    console.log("Fetched products");
    const result = await get("/api/products");
    const memberData = await get("/api/members");

    setProductOptions(result);
    setMemberOptions(
      memberData?.map((member) => ({
        value: member.id,
        label: member.name,
      })) || []
    );
  };

  // Fetch initial data for products
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    handleAddProduct();
  }, [selectedProduct]);

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

  // const fuse = useMemo(() => {
  //   console.log("Fuse initialized with product options");
  //   return new Fuse(productOptions || [], {
  //     keys: ["name", "id"],
  //     threshold: 0.4,
  //   });
  // }, [productOptions]);

  // // Custom filter function using fuse.js
  // const customFilter = (candidate: any, input: string) => {
  //   console.log("Custom filter running with input:", input);
  //   if (!input) return true;
  //   const results = fuse.search(input);
  //   return results.some((result: any) => result.item.id === candidate.value);
  // };

  if (isLoading) return <LoadingIcon />;

  const handleSaveReceipt = () => {
    console.log(products);
  };

  return (
    <div className="text-text sm:p-25 p-4 bg-background h-screen">
      <h1 className="text-2xl font-bold text-secondary mb-5">Cashier</h1>

      <div className="flex justify-between items-center mb-4">
        <div>
          <InputField
            label="Date"
            value={new Date().toLocaleDateString("id-ID", {
              year: "numeric",
              month: "short",
              day: "numeric",
              weekday: "long",
            })}
            name={""}
            disabled
            onChange={() => {}}
          />
        </div>
      </div>

      {/* Member Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Select Member</label>
        <Select
          className="bg-background"
          options={memberOptions?.map((member) => ({
            value: member.value,
            label: `${member.label}`,
          }))}
          value={selectedMember}
          onChange={(selectedOption) => {
            const selectedMember = selectedOption as {
              value: number;
              label: string;
            };
            setSelectedMember(selectedMember);
          }}
          placeholder="Search member..."
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
              color: "var(--color-text-secondary)",
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

      {/* Product Selection */}
      <div className="mb-8">
        <label className="block text-sm font-medium mb-2">Input Product</label>

        <Select
          className="bg-background"
          options={filteredProductOptions?.map((product) => ({
            value: product.id,
            label: `${product.id} - ${product.name} - ${
              product.satuan
            } - ${product.harga.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
            })}`,
          }))}
          value={
            selectedProduct
              ? {
                  value: selectedProduct.id,
                  label: `${selectedProduct.id} - ${selectedProduct.name} - ${
                    selectedProduct.satuan
                  } - ${selectedProduct.harga.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  })}`,
                }
              : null
          }
          onChange={(option) => {
            const product = productOptions?.find((p) => p.id === option?.value);
            setSelectedProduct(product || null);
          }}
          onInputChange={handleInputChange}
          filterOption={null} // Disable default filtering
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
          disablePagination={true}
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
                    className="w-16"
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
        <Button variant="default" onClick={() => handleSaveReceipt()}>
          Save & Print Receipt
        </Button>
      </div>
    </div>
  );
}
