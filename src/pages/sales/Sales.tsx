import Button from "../../components/Button";
import { DataTable } from "../../components/DataTable";
import { ColumnDef } from "@tanstack/react-table";

type Sale = {
  id: number;
  product: string;
  quantity: number;
  total: number;
};

const salesData: Sale[] = [
  { id: 1, product: "Product A", quantity: 2, total: 200 },
  { id: 2, product: "Product B", quantity: 1, total: 100 },
];

const salesColumns: ColumnDef<Sale>[] = [
  { accessorKey: "product", header: "Product" },
  { accessorKey: "quantity", header: "Quantity" },
  { accessorKey: "total", header: "Total" },
];

export default function Sales() {
  return (
    <div className="text-text">
      <h1 className="text-2xl font-bold text-primary">Sales</h1>
      <DataTable columns={salesColumns} data={salesData} />
    </div>
  );
}
