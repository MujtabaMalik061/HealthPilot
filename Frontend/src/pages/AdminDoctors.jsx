import React, { useState } from "react";
import { Header, SearchInput, Selector } from "../components/CustomComponents";
import { limit } from "../utils/constants";

const AdminDoctors = () => {
  const [search, setSearch] = useState("");
  const [availableFilter, setAvailableFilter] = useState("All");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  const [lastDoc, setLastDoc] = useState(null);
  const [lastIndex, setLastIndex] = useState(false);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);

  const getDoctors = async () => {
    await getUsersHelper((role = "doctor"), limit, { search });
  };

  return (
    <div className="page-container">
      <Header
        title="All Doctors"
        desc="Manage and oversee all registered doctors and their profiles"
      />
      <div className="">
        <SearchInput
          value={search}
          setValue={setSearch}
          placeholder="Search collections..."
          margin="20px 0"
        />
        <Selector
          disabled={loading || loadMoreLoading}
          filter={availableFilter}
          setFilter={setAvailableFilter}
          options={[{}]}
        />
      </div>
    </div>
  );
};

export default AdminDoctors;
