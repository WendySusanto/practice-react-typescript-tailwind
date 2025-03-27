import { products } from "../../data/dummyProducts";
import { Product } from "../../types/Products";
import { columns } from "./columns";
import { DataTable } from "../../components/DataTable";

function getData(): Product[] {
  return products;
}

export default function Products() {
  const data = getData();

  return (
    <div className="">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
