import { useState } from "react";
import { products } from "../../data/dummyProducts";
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

function getData(): Product[] {
  return products;
}

// Define a zod schema for form validation
const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  satuan: z.string().min(1, "Satuan is required"),
  modal: z.number().min(0, "Modal must be a positive number"),
  harga: z.number().min(0, "Harga must be a positive number"),
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

export default function Products() {
  const productData = getData();
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
  const [formData, setFormData] = useState({
    name: "",
    satuan: "",
    modal: "",
    harga: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      closeAddModal();
      openSuccessModal();
      setFormData({
        name: "",
        satuan: "",
        modal: "",
        harga: "",
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
      <h1 className="text-2xl font-bold text-primary mb-6">Products</h1>
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
            value={formData.name}
            onChange={handleInputChange}
            error={errors.name}
          />
          <InputField
            label="Satuan"
            name="satuan"
            value={formData.satuan}
            onChange={handleInputChange}
            error={errors.satuan}
          />
          <InputField
            label="Modal"
            name="modal"
            type="number"
            value={formData.modal}
            onChange={handleInputChange}
            error={errors.modal}
          />
          <InputField
            label="Harga"
            name="harga"
            type="number"
            value={formData.harga}
            onChange={handleInputChange}
            error={errors.harga}
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
          <p className="text-xl font-bold mb-8">
            Successfully add the product!
          </p>
        </div>
      </Modal>
      <DataTable columns={productColumns} data={productData} />
    </div>
  );
}
