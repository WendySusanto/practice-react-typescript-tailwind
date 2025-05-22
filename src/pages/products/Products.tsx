import { useEffect, useMemo, useState } from "react";
import { Product } from "../../types/Products";
import { DataTable } from "../../components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import Button from "../../components/Button";
import { Delete, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { Modal } from "../../components/Modal";
import { useModal } from "../../hooks/useModal";
import { z } from "zod"; // Import zod
import { InputField } from "../../components/InputField";
import { AnimatedSuccessIcon } from "../../components/AnimatedSuccessIcon";
import { LoadingIcon } from "../../components/LoadingIcon";
import { useFetch } from "../../hooks/useFetch";
import { TextArea } from "../../components/TextArea";
import { CSVLink } from "react-csv";
import Papa, { ParseResult } from "papaparse";

// Define a zod schema for form validation
const productSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name is required"),
  satuan: z.string().min(1, "Satuan is required"),
  modal: z.number().min(0, "Modal must be a positive number"),
  harga: z.number().min(0, "Harga must be a positive number"),
  barcode: z.string().nonempty("Barcode is required"),
  note: z.string().optional(),
});

export default function Products() {
  console.log("Products page loaded");

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
    {
      header: "Edit",
      cell: ({ row }) => {
        return (
          <div className="gap-2 flex items-center">
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                handleEdit(row.original);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                handleDeleteModal(row.original);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const {
    isOpen: isAddModalOpen,
    openModal: openAddModal,
    closeModal: closeAddModal,
  } = useModal();
  const {
    isOpen: isSuccessModalOpen,
    openModal: openSuccessModal,
    closeModal: closeSuccessModal,
  } = useModal();

  const {
    isOpen: isEditModalOpen,
    openModal: openEditModal,
    closeModal: closeEditModal,
  } = useModal();

  const {
    isOpen: isDeleteModalOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();

  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    satuan: "",
    modal: "",
    harga: "",
    barcode: "",
    expired: "",
    note: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [data, setData] = useState<Product[]>([]);

  const {
    get,
    post,
    patch,
    del,
    isError,
    isLoading,
    errorMessage,
    statusCode,
  } = useFetch<Product[]>();

  const csvData = data.map((row) => ({
    ...row,
    name: escapeCsvField(row.name),
    satuan: escapeCsvField(row.satuan),
    barcode: escapeCsvField(row.barcode),
    note: escapeCsvField(row.note),
    // Add other fields as needed
  }));

  function escapeCsvField(field: string) {
    if (typeof field !== "string") return field;
    // Escape double quotes by replacing " with ""
    const escaped = field.replace(/"/g, '""');

    return escaped;
  }

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
    return <LoadingIcon />;
  } else if (isError) {
    return (
      <div>
        Error...
        {errorMessage && <p>{errorMessage}</p>}
      </div>
    );
  }

  // Import handler
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse<Product>(file, {
      delimiter: ",",
      header: true,
      skipEmptyLines: true,
      dynamicTyping: {
        barcode: false,
        id: true,
        harga: true,
        modal: true,
        flag: true,
      },
      complete: async (results: ParseResult<Product>) => {
        // Optionally validate/transform data here

        console.log("Parsed CSV data:", results.data);

        await post("/api/products/import", results.data);

        // Option 1: Add to local state only
        setData((prev) => [...prev, ...results.data]);

        openSuccessModal();

        // Option 2: Also send to backend (uncomment if needed)
        // for (const product of importedProducts) {
        //   await post("/api/products", product, { Authorization: "Bearer test" });
        // }
      },
      error: (error: Error) => {
        alert("Failed to import CSV: " + error.message);
      },
    });

    // Reset the input so the same file can be uploaded again if needed
    e.target.value = "";
  };

  // Delete handler for button click
  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent default form submission
    try {
      await del(`/api/products/${formData.id}`);
      setData((prev) => prev.filter((item) => item.id !== formData.id));

      closeDeleteModal();
      openSuccessModal();
      setFormData({
        id: 0,
        name: "",
        satuan: "",
        modal: "",
        harga: "",
        barcode: "",
        expired: "",
        note: "",
      });
      setErrors({}); // Clear errors on successful submission
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Map zod errors to a state object
        console.log(error);
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        console.log(fieldErrors);
        setErrors(fieldErrors);
      } else {
        //handle api error
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
    try {
      // Validate form data using zod
      const validatedData = productSchema.parse({
        ...formData,
        modal: Number(formData.modal),
        harga: Number(formData.harga),
      });

      console.log("Saving product:", validatedData);

      await post("/api/products", validatedData, {
        Authorization: "Bearer test",
      });

      // Optionally, you can update the data state here to reflect the new product
      setData((prev) => [...prev, validatedData as Product]);

      closeAddModal();
      openSuccessModal();
      setFormData({
        id: 0,
        name: "",
        satuan: "",
        modal: "",
        harga: "",
        barcode: "",
        expired: "",
        note: "",
      });
      setErrors({}); // Clear errors on successful submission
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Map zod errors to a state object
        console.log(error);
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        console.log(fieldErrors);
        setErrors(fieldErrors);
      } else {
        //handle api error
      }
    }
  };

  const handleEdit = (row: Product) => {
    console.log("Editing product:", row);
    setFormData({
      id: Number(row.id),
      name: row.name,
      satuan: row.satuan,
      modal: String(row.modal),
      harga: String(row.harga),
      barcode: row.barcode,
      expired: row.expired,
      note: row.note,
    });
    openEditModal();
  };

  const handleDeleteModal = (row: Product) => {
    setFormData({
      id: Number(row.id),
      name: row.name,
      satuan: row.satuan,
      modal: String(row.modal),
      harga: String(row.harga),
      barcode: String(row.barcode),
      expired: row.expired,
      note: row.note,
    });
    openDeleteModal();
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
    try {
      // Validate form data using zod
      const validatedData = productSchema.parse({
        ...formData,
        modal: Number(formData.modal),
        harga: Number(formData.harga),
      });

      console.log("Saving product:", validatedData);

      await patch("/api/products", validatedData, {
        Authorization: "Bearer test",
      });

      debugger;

      setData((prev) => {
        const index = prev.findIndex((item) => item.id === Number(formData.id));
        if (index !== -1) {
          const updatedData = [...prev];
          updatedData[index] = { ...updatedData[index], ...validatedData };
          return updatedData;
        }
        return prev;
      });

      closeEditModal();
      openSuccessModal();
      setFormData({
        id: 0,
        name: "",
        satuan: "",
        modal: "",
        harga: "",
        barcode: "",
        expired: "",
        note: "",
      });
      setErrors({}); // Clear errors on successful submission
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Map zod errors to a state object
        console.log(error);
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        console.log(fieldErrors);
        setErrors(fieldErrors);
      } else {
        //handle api error
      }
    }
  };

  return (
    <div className="">
      <h1 className="text-2xl font-bold text-secondary mb-6">Products</h1>
      <div className="flex items-center justify-end gap-2">
        <div className="flex items-center gap-2">
          <Button onClick={openAddModal} variant="default" size="md">
            <PlusCircle className="mr-2" />
            Add Product
          </Button>
          <Button className="" variant="default" size="md">
            <CSVLink
              data={csvData}
              enclosingCharacter={`"`}
              filename={`Product_Sinar_Terang_${new Date().toDateString()}`}
            >
              Export to CSV
            </CSVLink>
          </Button>

          {/* Import Button */}
          <label className="cursor-pointer inline-block">
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleImport}
            />
            <span className="inline-block px-4 py-2 font-medium rounded-lg bg-primary text-white  hover:bg-primary-dark transition">
              Import CSV
            </span>
          </label>
        </div>
      </div>
      <Modal
        description="Fill in the product details below."
        title="Add Product"
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
      >
        <form className="space-y-4" onSubmit={handleSave}>
          <InputField
            label="Name"
            name="name"
            min={1}
            value={formData.name}
            onChange={handleInputChange}
            error={errors.name}
          />
          <InputField
            label="Satuan"
            name="satuan"
            min={1}
            value={formData.satuan}
            onChange={handleInputChange}
            error={errors.satuan}
          />
          <InputField
            label="Modal"
            name="modal"
            type="number"
            min={1}
            value={formData.modal}
            onChange={handleInputChange}
            error={errors.modal}
          />
          <InputField
            label="Harga"
            name="harga"
            type="number"
            min={1}
            value={formData.harga}
            onChange={handleInputChange}
            error={errors.harga}
          />

          <InputField
            label="Barcode"
            name="barcode"
            type="text"
            value={formData.barcode}
            onChange={handleInputChange}
            error={errors.barcode}
          />
          <InputField
            label="Expiration Date"
            name="expired"
            type="date"
            value={formData.expired}
            onChange={handleInputChange}
            error={errors.expired}
          />
          <TextArea
            label="Note"
            name="note"
            value={formData.note}
            onChange={handleTextAreaChange}
            error={errors.note}
          />

          <div className="flex justify-end gap-2">
            <Button onClick={closeAddModal} variant="outline" size="md">
              Cancel
            </Button>
            <Button type="submit" variant="default" size="md">
              Save
            </Button>
          </div>
        </form>
      </Modal>
      <Modal
        description=""
        title=""
        isOpen={isSuccessModalOpen}
        onClose={closeSuccessModal}
      >
        <div className="text-center">
          <AnimatedSuccessIcon />
          <p className="text-xl font-bold mb-8">Success!</p>
        </div>
      </Modal>
      <Modal
        description="Are you sure you want to delete this product?"
        title="Delete Product"
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
      >
        <div className="justify-end gap-2 flex">
          <Button size="md" onClick={closeDeleteModal}>
            No
          </Button>
          <Button variant={"outline"} size="md" onClick={handleDelete}>
            Yes
          </Button>
        </div>
      </Modal>
      <Modal
        description="Edit the product details below."
        title="Edit Product"
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
      >
        <form className="space-y-4" onSubmit={handleUpdate}>
          <InputField
            label="Name"
            name="name"
            min={1}
            value={formData.name}
            onChange={handleInputChange}
            error={errors.name}
          />
          <InputField
            label="Satuan"
            name="satuan"
            min={1}
            value={formData.satuan}
            onChange={handleInputChange}
            error={errors.satuan}
          />
          <InputField
            label="Modal"
            name="modal"
            type="number"
            min={1}
            value={formData.modal}
            onChange={handleInputChange}
            error={errors.modal}
          />
          <InputField
            label="Harga"
            name="harga"
            type="number"
            min={1}
            value={formData.harga}
            onChange={handleInputChange}
            error={errors.harga}
          />

          <InputField
            label="Barcode"
            name="barcode"
            type="text"
            value={formData.barcode}
            onChange={handleInputChange}
            error={errors.barcode}
          />

          <TextArea
            label="Note"
            name="note"
            value={formData.note}
            onChange={handleTextAreaChange}
            error={errors.note}
          />

          <div className="flex justify-end gap-2">
            <Button onClick={closeEditModal} variant="outline" size="md">
              Cancel
            </Button>
            <Button type="submit" variant="default" size="md">
              Update
            </Button>
          </div>
        </form>
      </Modal>

      <DataTable columns={productColumns} data={data} />
    </div>
  );
}
