import { useSearchParams } from "react-router-dom";
import Spinner from "../../ui/Spinner";
import CabinRow from "./CabinRow";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Empty from "../../ui/Empty";

const mockCabins = [
  {
    id: 1,
    name: "Cabin A",
    maxCapacity: 4,
    regularPrice: 100,
    discount: 0,
    description: "A cozy cabin for small families.",
    image: "/images/cabin-a.jpg",
  },
  {
    id: 2,
    name: "Cabin B",
    maxCapacity: 6,
    regularPrice: 150,
    discount: 20,
    description: "A large cabin perfect for groups.",
    image: "/images/cabin-b.jpg",
  },
  {
    id: 3,
    name: "Cabin C",
    maxCapacity: 2,
    regularPrice: 80,
    discount: 10,
    description: "A romantic getaway for couples.",
    image: "/images/cabin-c.jpg",
  },
];

function CabinTable() {
  // Thay thế useCabins bằng dữ liệu tĩnh
  const isLoading = false;
  const cabins = mockCabins;
  const [searchParams] = useSearchParams();

  if (isLoading) return <Spinner />;
  if (!cabins.length) return <Empty resourceName="cabins" />;

  // (1) Filter
  const filterValue = searchParams.get("discount") || "all";
  let filteredCabins;

  if (filterValue === "all") filteredCabins = cabins;
  else if (filterValue === "no-discount")
    filteredCabins = cabins.filter((cabin) => cabin.discount === 0);
  else if (filterValue === "with-discount")
    filteredCabins = cabins.filter((cabin) => cabin.discount > 0);

  // (2) SortBy
  const sortBy = searchParams.get("sortBy") || "name-asc";
  const [field, direction] = sortBy.split("-");

  const modifier = direction === "asc" ? 1 : -1;
  const sortedCabins = filteredCabins?.sort((a, b) =>
    typeof a[field] === "string"
      ? a[field].localeCompare(b[field]) * modifier
      : (a[field] - b[field]) * modifier
  );

  return (
    <Menus>
      <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 1fr">
        <Table.Header>
          <div></div>
          <div>Cabin</div>
          <div>Capacity</div>
          <div>Price</div>
          <div>Discount</div>
          <div></div>
        </Table.Header>

        <Table.Body
          data={sortedCabins}
          render={(cabin) => <CabinRow cabin={cabin} key={cabin.id} />}
        />
      </Table>
    </Menus>
  );
}

export default CabinTable;
