import React, { useState, useEffect } from "react";
import Select from "react-select";
import Button from "../../components/Button";
import { DataTable } from "../../components/DataTable";
import { Minus, Plus, Trash2Icon } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useModeContext } from "../../contexts/ModeContext";
import { InputField } from "../../components/InputField";
import { LoadingIcon } from "../../components/LoadingIcon";
import { useFetch } from "../../hooks/useFetch";
import { useProductSearch } from "../../hooks/useProductSearch";
import { useProductManagement } from "../../hooks/useProductManagement";
import { useHargaSatuan } from "../../hooks/useHargaSatuan";
import { MemberOption, ProductSale } from "../../types/Cashier";
import { Product } from "../../types/Products";

type Member = {
  id: number;
  name: string;
};

export default function Cashier() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedMember, setSelectedMember] = useState<MemberOption | null>({
    value: 0,
    label: "Umum",
  });
  const [memberOptions, setMemberOptions] = useState<MemberOption[] | null>([]);

  const location = useLocation();
  const { toggleAdmin } = useModeContext();
  const { get } = useFetch<Member[]>();

  const {
    products,
    setProducts,
    total,
    totalItems,
    handleAddProduct,
    handleQuantityChange,
    handleRemoveProduct,
  } = useProductManagement(selectedMember);

  const {
    productOptions,
    filteredProductOptions,
    isLoading,
    handleInputChange,
    fetchProducts,
  } = useProductSearch();

  const {
    hargaSatuanStates,
    handleHargaSatuanFocus,
    handleHargaSatuanChange,
    handleHargaSatuanBlur,
  } = useHargaSatuan(products, setProducts);

  useEffect(() => {
    if (location.pathname === "/cashier") {
      toggleAdmin(true);
    } else {
      toggleAdmin(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    fetchProducts();
    const fetchMembers = async () => {
      const memberData = await get("/api/members");
      if (memberData) {
        setMemberOptions(
          memberData.map((member: Member) => ({
            value: member.id,
            label: member.name,
          }))
        );
      }
    };
    fetchMembers();
  }, []);

  useEffect(() => {
    handleAddProduct(selectedProduct);
  }, [selectedProduct]);

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
          className=""
          options={memberOptions?.map((member) => ({
            value: member.value,
            label: member.label,
          }))}
          value={selectedMember}
          onChange={(selectedOption) => {
            setSelectedMember(selectedOption as MemberOption);
          }}
          placeholder="Search member..."
          isDisabled={products.length > 0}
          styles={{
            control: (base, state) => ({
              ...base,
              backgroundColor: "var(--color-background-muted)",
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
              backgroundColor: "var(--color-background-muted)",
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
          filterOption={null}
          placeholder="Search or select a product"
          styles={{
            control: (base, state) => ({
              ...base,
              backgroundColor: "var(--color-background-muted)",
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
              backgroundColor: "var(--color-background-muted)",
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
              cell: ({ row }: { row: { original: ProductSale } }) => (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleQuantityChange(
                        row.original.id,
                        row.original.quantity - 1
                      )
                    }
                    disabled={row.original.quantity <= 1}
                  >
                    <Minus className="w-4 h-4 mx-auto" />
                  </Button>
                  <InputField
                    className="w-16"
                    type="number"
                    value={row.original.quantity}
                    onChange={(e) =>
                      handleQuantityChange(row.original.id, +e.target.value)
                    }
                    min={1}
                    label={""}
                    name={""}
                  />
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
              cell: ({ row }: { row: { original: ProductSale } }) => {
                const editingState = hargaSatuanStates[row.original.id];
                const displayValue = editingState?.isEditing
                  ? editingState.inputValue
                  : row.original.harga.toString();

                // Determine price type
                let priceType = "regular";
                if (row.original.manualHargaSatuan !== undefined) {
                  priceType = "manual";
                } else if (
                  selectedMember?.value !== 0 &&
                  row.original.member_prices?.find(
                    (mp) => mp.member_id === selectedMember?.value
                  )
                ) {
                  priceType = "member";
                } else if (
                  selectedMember?.value === 0 &&
                  row.original.harga_grosir?.some(
                    (hg) => row.original.quantity >= hg.min_qty
                  )
                ) {
                  priceType = "grosir";
                }

                return (
                  <div className="flex items-center gap-2">
                    <InputField
                      className="w-24"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={displayValue}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, "");
                        handleHargaSatuanChange(row.original.id, value);
                      }}
                      onFocus={() =>
                        handleHargaSatuanFocus(
                          row.original.id,
                          row.original.harga
                        )
                      }
                      onBlur={() => handleHargaSatuanBlur(row.original.id)}
                      label={""}
                      name={""}
                    />
                    {priceType !== "regular" && (
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          priceType === "member"
                            ? "bg-blue-100 text-blue-800"
                            : priceType === "grosir"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {priceType === "member"
                          ? "Member"
                          : priceType === "grosir"
                          ? "Grosir"
                          : "Manual"}
                      </span>
                    )}
                  </div>
                );
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
              cell: ({ row }: { row: { original: ProductSale } }) => (
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
        <Button variant="default" onClick={handleSaveReceipt}>
          Save & Print Receipt
        </Button>
      </div>
    </div>
  );
}
