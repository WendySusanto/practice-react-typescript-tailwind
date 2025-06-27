import React, { useState, useCallback } from "react";
import { InputField } from "../../components/InputField";
import { ProductSale, HargaSatuanState } from "../../types/Cashier";
import { MemberOption } from "../../types/Cashier";

interface HargaCellProps {
  row: { original: ProductSale };
  selectedMember: MemberOption | null;
  onHargaChange: (id: number, newHarga: number) => void;
}

export const HargaCell: React.FC<HargaCellProps> = ({
  row,
  selectedMember,
  onHargaChange,
}) => {
  const [draftState, setDraftState] = useState<HargaSatuanState>({
    value: row.original.harga,
    isEditing: false,
    inputValue: row.original.harga.toString(),
  });

  const handleFocus = useCallback(() => {
    setDraftState((prev) => ({
      ...prev,
      isEditing: true,
    }));
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setDraftState((prev) => ({
      ...prev,
      inputValue: value,
      value: parseFloat(value) || prev.value,
    }));
  }, []);

  const handleBlur = useCallback(() => {
    const numericValue = parseFloat(draftState.inputValue);
    if (!isNaN(numericValue) && numericValue !== row.original.harga) {
      onHargaChange(row.original.id, numericValue);
    }
    setDraftState((prev) => ({
      ...prev,
      isEditing: false,
    }));
  }, [
    draftState.inputValue,
    row.original.harga,
    row.original.id,
    onHargaChange,
  ]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.currentTarget.blur();
      }
    },
    []
  );

  const displayValue = draftState.isEditing
    ? draftState.inputValue
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
    row.original.harga_grosir?.some((hg) => row.original.quantity >= hg.min_qty)
  ) {
    priceType = "grosir";
  }

  return (
    <div className="flex items-center gap-2">
      <InputField
        type="number"
        className="w-24 border border-border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-secondary text-text"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        label=""
        name=""
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
};
