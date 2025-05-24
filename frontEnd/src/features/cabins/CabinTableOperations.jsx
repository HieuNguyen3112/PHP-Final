import TableOperations from "../../ui/TableOperations";
import Filter from "../../ui/Filter";
import SortBy from "../../ui/SortBy";

function CabinTableOperations() {
  return (
    <div>
      <TableOperations>
        <Filter
          filterField="discount"
          options={[
            { value: "all", label: "All" },
            { value: "no-discount", label: "No Discount" },
            { value: "with-discount", label: "With Discount" },
          ]}
        />

        <SortBy
          options={[
            {
              value: "name-asc",
              label: "Sort By Name (A-Z)",
            },
            {
              value: "name-desc",
              label: "Sort By Name (Z-A)",
            },
            {
              value: "price-asc",
              label: "Sort By Price (Low First)",
            },
            {
              value: "price-desc",
              label: "Sort By Price (High First)",
            },
            {
              value: "capacity-asc",
              label: "Sort By Capacity (Low First)",
            },
            {
              value: "capacity-desc",
              label: "Sort By Capacity (High First)",
            },
          ]}
        />
      </TableOperations>
    </div>
  );
}

export default CabinTableOperations;