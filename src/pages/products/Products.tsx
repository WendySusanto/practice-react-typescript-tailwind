import { useEffect, useMemo, useState } from "react";
import { Product } from "../../types/Products";
import { DataTable } from "../../components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import Button from "../../components/Button";
import { Pencil, PlusCircle } from "lucide-react";
import { Modal } from "../../components/Modal";
import { useModal } from "../../hooks/useModal";
import { z } from "zod"; // Import zod
import { InputField } from "../../components/InputField";
import { AnimatedSuccessIcon } from "../../components/AnimatedSuccessIcon";
import { useFetch } from "../../hooks/useFetch";
import { TextArea } from "../../components/TextArea";

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
          <div className="">
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                console.log("on click");
                handleEdit(row.original);
              }}
            >
              <Pencil className="h-4 w-4" />
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

  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    satuan: "",
    modal: "",
    harga: "",
    barcode: "",
    note: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [data, setData] = useState<Product[]>([]);

  const { get, post, patch, isError, isLoading, errorMessage, statusCode } =
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
      note: row.note,
    });
    openEditModal();
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
            Export
          </Button>
          <Button className="" variant="default" size="md">
            Import
          </Button>
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
