import { ColumnDef } from "@tanstack/react-table";
import { Product } from "../../types/Products";

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "satuan",
    header: "Satuan",
  },
  {
    accessorKey: "modal",
    header: "Modal",
  },
  {
    accessorKey: "harga",
    header: "Harga",
  },
];
