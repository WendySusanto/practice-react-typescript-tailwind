import { useEffect, useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  CartesianGrid,
  TooltipProps,
} from "recharts";
import Select from "react-select";
import { useFetch } from "../../hooks/useFetch";
import { LoadingIcon } from "../../components/LoadingIcon";
import { Product } from "../../types/Products";
import { Sales } from "../../types/Sales";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";
// --- Types for sales with product details ---
type SalesWithDetails = Sales & {
  products?: {
    product_id: number;
    product_name: string;
    quantity: number;
    harga: number;
  }[];
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background-muted p-2 rounded text-secondary">
        <p>{`${label}`}</p>
        <p>
          {payload[0].value
            ? payload[0].value.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              })
            : "-"}
        </p>
      </div>
    );
  }

  return null;
};

const TIME_RANGE_OPTIONS = [
  { value: "this_month", label: "This Month" },
  { value: "last_month", label: "Last Month" },
  { value: "this_year", label: "This Year" },
  { value: "all", label: "All Time" },
];

function filterSalesByRange(sales: SalesWithDetails[], range: string) {
  const now = new Date();
  if (range === "this_month") {
    const month = now.getMonth();
    const year = now.getFullYear();
    return sales.filter((sale) => {
      const date = new Date(sale.date_added);
      return date.getMonth() === month && date.getFullYear() === year;
    });
  }
  if (range === "last_month") {
    let month = now.getMonth() - 1;
    let year = now.getFullYear();
    if (month < 0) {
      month = 11;
      year -= 1;
    }
    return sales.filter((sale) => {
      const date = new Date(sale.date_added);
      return date.getMonth() === month && date.getFullYear() === year;
    });
  }
  if (range === "this_year") {
    const year = now.getFullYear();
    return sales.filter((sale) => {
      const date = new Date(sale.date_added);
      return date.getFullYear() === year;
    });
  }
  // "all"
  return sales;
}

export default function Dashboard() {
  const { get: getProducts, isLoading: loadingProducts } =
    useFetch<Product[]>();
  const { get: getSales, isLoading: loadingSales } =
    useFetch<SalesWithDetails[]>();
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<SalesWithDetails[]>([]);
  const [timeRange, setTimeRange] = useState(TIME_RANGE_OPTIONS[0]);

  useEffect(() => {
    const fetchData = async () => {
      const productsData = await getProducts("/api/products", {
        Authorization: "Bearer test",
      });
      if (productsData) setProducts(productsData);

      // Fetch sales with product details
      const salesData = await getSales("/api/sales?includeDetails=true", {
        Authorization: "Bearer test",
      });
      if (salesData) setSales(salesData);
    };
    fetchData();
  }, []);

  const filteredSales = useMemo(
    () => filterSalesByRange(sales, timeRange.value),
    [sales, timeRange]
  );

  if (loadingProducts || loadingSales) {
    return <LoadingIcon />;
  }

  // Filtered sales based on selected time range

  // 1. Total sales per month (Graph) - always show all months, but filter by range if not "all"
  const salesByMonth: Record<string, number> = {};
  (timeRange.value === "all" ? sales : filteredSales).forEach((sale) => {
    const date = new Date(sale.date_added);
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
    salesByMonth[month] = (salesByMonth[month] || 0) + sale.total;
  });
  const salesPerMonthData = Object.entries(salesByMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, total]) => ({
      month,
      total,
    }));

  // 2. Total Products
  const totalProducts = products.length;

  // 3. Top 5 Transaction in selected range (Normal List)
  const top5Transactions = [...filteredSales]
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  // 4. Most sold products (Normal List)
  const productSalesMap: Record<number, { name: string; quantity: number }> =
    {};
  filteredSales.forEach((sale) => {
    sale.products?.forEach((prod) => {
      if (!productSalesMap[prod.product_id]) {
        productSalesMap[prod.product_id] = {
          name: prod.product_name,
          quantity: 0,
        };
      }
      productSalesMap[prod.product_id].quantity += prod.quantity;
    });
  });

  console.log("Filtered Sales:", filteredSales);

  console.log("Product Sales Map:", productSalesMap);
  const mostSoldProducts = Object.values(productSalesMap)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  return (
    <div className="p-4 bg-background text-text">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-secondary">Dashboard</h1>
        <div className="w-full md:w-64">
          <Select
            options={TIME_RANGE_OPTIONS}
            value={timeRange}
            onChange={(v) => v && setTimeRange(v)}
            className="text-sm"
            classNamePrefix="react-select"
            styles={{
              control: (base) => ({
                ...base,
                background: "var(--color-background)",
                color: "var(--color-text)",
                borderColor: "var(--color-border-muted)",
              }),
              menu: (base) => ({
                ...base,
                background: "var(--color-background)",
                color: "var(--color-text)",
              }),
              singleValue: (base) => ({
                ...base,
                color: "var(--color-text)",
              }),
              option: (base, state) => ({
                ...base,
                background: state.isFocused
                  ? "var(--color-background-muted)"
                  : "var(--color-background)",
                color: "var(--color-text)",
              }),
            }}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Total Products */}
        <div className="rounded shadow p-4 flex flex-col items-center justify-center bg-background-muted text-secondary">
          <div className="text-4xl font-bold ">{totalProducts}</div>
          <div className="text-lg font-semibold mt-2 ">Total Products</div>
        </div>
        {/* Total Sales in Range */}
        <div className="rounded shadow p-4 flex flex-col items-center justify-center bg-background-muted text-secondary">
          <div className="text-4xl font-bold text-secondary">
            {filteredSales
              .reduce((sum, s) => sum + s.total, 0)
              .toLocaleString("id-ID")}
          </div>
          <div className="text-lg font-semibold mt-2 ">
            Total Sales ({timeRange.label})
          </div>
        </div>
        {/* Most Sold Product */}
        <div className="rounded shadow p-4 flex flex-col items-center justify-center bg-background-muted text-secondary">
          <div className="text-2xl font-bold ">{filteredSales.length}</div>
          <div className="text-lg font-semibold mt-2 ">Total Transaction</div>
        </div>
      </div>

      {/* 1. Total sales per month (Graph) */}
      <div className="rounded shadow p-4 mb-8 bg-background-muted">
        <h2 className="text-lg font-semibold mb-2 text-secondary">
          Total Sales per Month
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={salesPerMonthData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-border-muted)"
            />
            <XAxis dataKey="month" stroke="var(--color-text)" />
            <YAxis
              width={100}
              tickFormatter={(v) => v.toLocaleString("id-ID")}
              stroke="var(--color-text)"
            />
            <RechartsTooltip content={<CustomTooltip />} />
            <Bar dataKey="total" fill="var(--color-primary-light)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 3. Top 5 Transactions in Range */}
        <div className="rounded shadow p-4 bg-background">
          <h2 className="text-lg font-semibold mb-2 text-secondary">
            Top 5 Transactions ({timeRange.label})
          </h2>
          <ol className="list-decimal pl-4">
            {top5Transactions.length === 0 && (
              <li className="text-gray-500">No data</li>
            )}
            {top5Transactions.map((sale) => (
              <li key={sale.id} className="mb-2">
                <div className="flex justify-between">
                  <span>
                    {new Date(sale.date_added).toLocaleDateString("id-ID")} -{" "}
                    {sale.kasir_name} ({sale.member_name || "Non-member"})
                  </span>
                  <span className="font-bold text-secondary">
                    {sale.total.toLocaleString("id-ID")}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* 4. Most Sold Products */}
        <div className="rounded shadow p-4 bg-background ">
          <h2 className="text-lg font-semibold mb-2 text-secondary">
            Most Sold Products
          </h2>
          <ol className="list-decimal pl-4">
            {mostSoldProducts.length === 0 && (
              <li className="text-gray-500">No data</li>
            )}
            {mostSoldProducts.map((prod) => (
              <li key={prod.name} className="mb-2 flex justify-between">
                <span>{prod.name}</span>
                <span className="font-bold text-secondary">
                  {prod.quantity} pcs
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
