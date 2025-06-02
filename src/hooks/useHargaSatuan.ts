import { useState } from "react";
import { ProductSale, HargaSatuanState } from "../types/Cashier";

export const useHargaSatuan = (
  products: ProductSale[],
  setProducts: React.Dispatch<React.SetStateAction<ProductSale[]>>
) => {
  const [hargaSatuanStates, setHargaSatuanStates] = useState<
    Record<number, HargaSatuanState>
  >({});

  const handleHargaSatuanFocus = (id: number, currentValue: number) => {
    setHargaSatuanStates((prev) => ({
      ...prev,
      [id]: {
        value: currentValue,
        isEditing: true,
        inputValue: currentValue.toString(),
      },
    }));
  };

  const handleHargaSatuanChange = (id: number, inputValue: string) => {
    setHargaSatuanStates((prev) => ({
      ...prev,
      [id]: {
        value: parseFloat(inputValue) || prev[id]?.value || 0,
        isEditing: true,
        inputValue,
      },
    }));
  };

  const handleHargaSatuanBlur = (id: number) => {
    const state = hargaSatuanStates[id];
    if (state?.isEditing) {
      const numericValue = parseFloat(state.inputValue);
      if (!isNaN(numericValue)) {
        setProducts((prevProducts) =>
          prevProducts.map((p) => {
            if (p.id === id) {
              return {
                ...p,
                manualHargaSatuan: numericValue,
                harga: numericValue,
                subTotal: p.quantity * numericValue,
              };
            }
            return p;
          })
        );
      }

      setHargaSatuanStates((prev) => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    }
  };

  return {
    hargaSatuanStates,
    handleHargaSatuanFocus,
    handleHargaSatuanChange,
    handleHargaSatuanBlur,
  };
};
