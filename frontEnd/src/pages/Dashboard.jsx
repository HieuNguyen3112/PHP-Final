import { useState } from "react";
import DashboardFilter from "../features/dashboard/DashboardFilter";
import DashboardLayout from "../features/dashboard/DashboardLayout";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import { useSearchParams } from "react-router-dom";

function Dashboard() {
  const [searchParams] = useSearchParams();
  // Get the number of days from URL params, default to 7
  const numDays = searchParams.get("last") ? Number(searchParams.get("last")) : 7;

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Dashboard</Heading>
        <DashboardFilter />
      </Row>

      <DashboardLayout numDays={numDays} />
    </>
  );
}

export default Dashboard;