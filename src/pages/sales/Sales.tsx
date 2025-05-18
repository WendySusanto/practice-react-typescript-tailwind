import { useEffect, useMemo, useState } from "react";
import { Product } from "../../types/Products";
import { DataTable } from "../../components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import Button from "../../components/Button";
import { PlusCircle } from "lucide-react";
import { Modal } from "../../components/Modal";
import { useModal } from "../../hooks/useModal";
import { z } from "zod"; // Import zod
import { InputField } from "../../components/InputField";
import { AnimatedSuccessIcon } from "../../components/AnimatedSuccessIcon";
import { useFetch } from "../../hooks/useFetch";
import { TextArea } from "../../components/TextArea";

// Define a zod schema for form validation
const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  satuan: z.string().min(1, "Satuan is required"),
  modal: z.number().min(0, "Modal must be a positive number"),
  harga: z.number().min(0, "Harga must be a positive number"),
  barcode: z.string().nonempty("Barcode is required"),
  note: z.string().optional(),
});

const productColumns: ColumnDef<Product>[] = [
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
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return (
        <div className="">
          {value.toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "harga",
    header: "Harga",
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return (
        <div className="">
          {value.toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
          })}
        </div>
      );
    },
  },
];

export default function Sales() {
  console.log("Sales page loaded");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [data, setData] = useState<Product[]>([]);

  const { get, post, isError, isLoading, errorMessage, statusCode } =
    useFetch<Product[]>();

  useEffect(() => {
    const fetchData = async () => {
      const data = await get("/api/products", { Authorization: "Bearer test" });
      if (data) {
        setData(data);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  } else if (isError) {
    return (
      <div>
        Error...
        {errorMessage && <p>{errorMessage}</p>}
      </div>
    );
  }

  return (
    <div className="">
      <h1 className="text-2xl font-bold text-secondary mb-6">Sales</h1>
      <div className="flex items-center justify-end gap-2">
        <div className="flex items-center gap-2">
          <Button className="" variant="default" size="md">
            Export
          </Button>
        </div>
      </div>
      <DataTable columns={productColumns} data={data} />
    </div>
  );
}
