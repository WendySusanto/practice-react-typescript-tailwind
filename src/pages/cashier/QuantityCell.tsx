import React from "react";
import { ProductSale } from "../../types/Cashier";
import Button from "../../components/Button";
import { Minus, Plus } from "lucide-react";
import { InputField } from "../../components/InputField";

type QuantityState = {
  value: number;
  isEditing: boolean;
  inputValue: string;
};

// Memoize the cell components
export const QuantityCell = React.memo(
  ({
    row,
    handleQuantityChange,
  }: {
    row: { original: ProductSale };
    handleQuantityChange: (id: number, quantity: number) => void;
  }) => {
    const [draftState, setDraftState] = React.useState<QuantityState>({
      value: row.original.quantity,
      isEditing: false,
      inputValue: row.original.quantity.toString(),
    });

    const displayValue = draftState.isEditing
      ? draftState.inputValue
      : row.original.quantity.toString();

    return (
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
          value={displayValue}
          onChange={(e) => {
            setDraftState((prev) => ({
              ...prev,
              inputValue: e.target.value,
              value: parseFloat(e.target.value) || prev.value,
            }));
          }}
          onFocus={() => {
            setDraftState({
              ...draftState,
              isEditing: true,
            });
          }}
          onBlur={() => {
            const numericValue = parseFloat(draftState.inputValue);
            if (!isNaN(numericValue)) {
              handleQuantityChange(row.original.id, numericValue);
            }
            setDraftState((prev) => ({
              ...prev,
              isEditing: false,
            }));
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.currentTarget.blur();
            }
          }}
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
    );
  }
);
