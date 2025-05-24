import { useSearchParams } from "react-router-dom";
import Filter from "../../ui/Filter";

function DashboardFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const numDays = searchParams.get("last") || "7";

  function handleClick(value) {
    searchParams.set("last", value);
    setSearchParams(searchParams);
  }

  return (
    <Filter
      filterField="last"
      options={[
        { value: "7", label: "Last 7 days" },
        { value: "30", label: "Last 30 days" },
        { value: "90", label: "Last 90 days" },
      ]}
      currentValue={numDays}
      onChange={handleClick}
    />
  );
}

export default DashboardFilter;