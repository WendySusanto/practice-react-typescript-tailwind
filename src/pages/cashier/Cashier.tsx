import React, { useState, useEffect, useMemo, useCallback } from "react";
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
import { MemberOption, ProductSale } from "../../types/Cashier";
import { Product } from "../../types/Products";
import { Input } from "react-select/animated";
import { ColumnDef } from "@tanstack/react-table";
import { HargaCell } from "../../components/HargaCell";

type Member = {
  id: number;
  name: string;
};

// Memoize the cell components
const QuantityCell = React.memo(
  ({
    row,
    handleQuantityChange,
  }: {
    row: { original: ProductSale };
    handleQuantityChange: (id: number, quantity: number) => void;
  }) => (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        onClick={() =>
          handleQuantityChange(row.original.id, row.original.quantity - 1)
        }
        disabled={row.original.quantity <= 1}
      >
        <Minus className="w-4 h-4 mx-auto" />
      </Button>
      <InputField
        className="w-16"
        type="number"
        value={row.original.quantity}
        onChange={(e) => handleQuantityChange(row.original.id, +e.target.value)}
        min={1}
        label=""
        name=""
      />
      <Button
        variant="outline"
        onClick={() =>
          handleQuantityChange(row.original.id, row.original.quantity + 1)
        }
      >
        <Plus className="w-4 h-4 mx-auto" />
      </Button>
    </div>
  )
);

const SubTotalCell = React.memo(({ row }: { row: { original: ProductSale } }) =>
  row.original.subTotal.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
  })
);

const ActionsCell = React.memo(
  ({
    row,
    handleRemoveProduct,
  }: {
    row: { original: ProductSale };
    handleRemoveProduct: (id: number) => void;
  }) => (
    <button
      onClick={() => handleRemoveProduct(row.original.id)}
      className="text-red-500 cursor-pointer hover:text-red-700"
    >
      <Trash2Icon className="w-4 h-4" />
    </button>
  )
);

// Memoize the DataTable component with proper typing
const MemoizedDataTable = React.memo(DataTable) as typeof DataTable;

export default function Cashier() {
  console.log("Cashier component rendering");

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

  const handleHargaChange = useCallback(
    (id: number, newHarga: number) => {
      setProducts((prevProducts) =>
        prevProducts.map((p) => {
          if (p.id === id) {
            return {
              ...p,
              manualHargaSatuan: newHarga,
              harga: newHarga,
              subTotal: p.quantity * newHarga,
            };
          }
          return p;
        })
      );
    },
    [setProducts]
  );

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

  useEffect(() => {
    console.log("products changed:", products);
  }, [products]);

  useEffect(() => {
    console.log("selectedMember changed:", selectedMember);
  }, [selectedMember]);

  const handleSaveReceipt = () => {
    console.log(products);
  };

  const renderHargaCell = useCallback(
    ({ row }: { row: { original: ProductSale } }) => (
      <HargaCell
        row={row}
        selectedMember={selectedMember}
        onHargaChange={handleHargaChange}
      />
    ),
    [selectedMember, handleHargaChange]
  );

  const renderQuantityCell = useCallback(
    ({ row }: { row: { original: ProductSale } }) => (
      <QuantityCell row={row} handleQuantityChange={handleQuantityChange} />
    ),
    [handleQuantityChange]
  );

  const renderSubTotalCell = useCallback(
    ({ row }: { row: { original: ProductSale } }) => <SubTotalCell row={row} />,
    []
  );

  const renderActionsCell = useCallback(
    ({ row }: { row: { original: ProductSale } }) => (
      <ActionsCell row={row} handleRemoveProduct={handleRemoveProduct} />
    ),
    [handleRemoveProduct]
  );

  const columns = useMemo<ColumnDef<ProductSale>[]>(
    () => [
      { accessorKey: "name", header: "Nama Produk" },
      { accessorKey: "satuan", header: "Satuan" },
      {
        accessorKey: "quantity",
        header: "Qty",
        cell: renderQuantityCell,
      },
      {
        accessorKey: "harga",
        header: "Harga Satuan",
        cell: renderHargaCell,
      },
      {
        accessorKey: "subTotal",
        header: "Sub Total",
        cell: renderSubTotalCell,
      },
      {
        accessorKey: "actions",
        header: "",
        cell: renderActionsCell,
      },
    ],
    [renderQuantityCell, renderHargaCell, renderSubTotalCell, renderActionsCell]
  );

  if (isLoading) return <LoadingIcon />;

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
            name=""
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
        <MemoizedDataTable
          disablePagination={true}
          columns={columns}
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
