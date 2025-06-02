import { useState, useEffect } from "react";
import { ProductSale, MemberOption } from "../types/Cashier";
import { Product } from "../types/Products";
import { useToast } from "../contexts/ToastContext";

export const useProductManagement = (selectedMember: MemberOption | null) => {
  const [products, setProducts] = useState<ProductSale[]>([]);
  const [total, setTotal] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const { showToast } = useToast();

  const handleAddProduct = (selectedProduct: Product | null) => {
    if (!selectedProduct) return;

    const existingProduct = products.find((p) => p.id === selectedProduct.id);
    if (existingProduct) {
      handleQuantityChange(selectedProduct.id, existingProduct.quantity + 1);
    } else {
      if (selectedMember?.value !== 0) {
        const memberPrice = selectedProduct.member_prices?.find(
          (mp) => mp.member_id === selectedMember?.value
        );
        if (memberPrice) {
          setProducts((prevProducts) => [
            ...prevProducts,
            {
              ...selectedProduct,
              quantity: 1,
              harga: memberPrice.harga,
              original_harga: selectedProduct.harga,
              subTotal: memberPrice.harga,
            },
          ]);
          showToast(`Using member price for ${selectedProduct.name}`, "info");
          return;
        }
      }
      setProducts((prevProducts) => [
        ...prevProducts,
        {
          ...selectedProduct,
          quantity: 1,
          harga: selectedProduct.harga,
          original_harga: selectedProduct.harga,
          subTotal: selectedProduct.harga,
        },
      ]);
    }
  };

  const handleQuantityChange = (id: number, quantity: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => {
        if (p.id === id) {
          let hargaSatuan = p.harga;
          let priceType = "regular";

          if (p.manualHargaSatuan !== undefined) {
            hargaSatuan = p.manualHargaSatuan;
            priceType = "manual";
          } else {
            if (selectedMember?.value !== 0) {
              const memberPrice = p.member_prices?.find(
                (mp) => mp.member_id === selectedMember?.value
              );
              if (memberPrice) {
                hargaSatuan = memberPrice.harga;
                priceType = "member";
              }
            } else if (p.harga_grosir?.length) {
              const grosirPrice = p.harga_grosir
                .filter((hg) => quantity >= hg.min_qty)
                .sort((a, b) => b.min_qty - a.min_qty)[0];
              if (grosirPrice) {
                hargaSatuan = grosirPrice.harga;
                priceType = "grosir";
              } else {
                // If no grosir price applies, use original regular price
                hargaSatuan = p.original_harga;
                priceType = "regular";
              }
            }
          }

          // Show toast for member or grosir prices
          if (priceType === "member") {
            showToast(`Using member price for ${p.name}`, "info");
          } else if (priceType === "grosir") {
            showToast(`Using grosir price for ${p.name}`, "info");
          } else if (priceType === "regular" && p.harga_grosir?.length) {
            showToast(`Using regular price for ${p.name}`, "info");
          }

          return {
            ...p,
            quantity,
            harga: hargaSatuan,
            subTotal: quantity * hargaSatuan,
          };
        }
        return p;
      })
    );
  };

  const handleRemoveProduct = (id: number) => {
    setProducts((prevProducts) => prevProducts.filter((p) => p.id !== id));
  };

  useEffect(() => {
    const total = products.reduce((sum, p) => sum + p.subTotal, 0);
    const totalItems = products.length;
    setTotal(total);
    setTotalItems(totalItems);
  }, [products]);

  return {
    products,
    setProducts,
    total,
    totalItems,
    handleAddProduct,
    handleQuantityChange,
    handleRemoveProduct,
  };
};
