import React, { useEffect, useState } from "react";
import * as LucideIcons from "lucide-react";
import {
  Header,
  LoadMore,
  SearchInput,
  ServiceCard,
} from "../components/CustomComponents";
import AddServices from "../components/AddServices";
import {
  getServicesHelper,
  deleteServiceHelper,
} from "../services/AdminServices";
import Loader from "../components/Loader";
import { limit } from "../utils/constants";
import { useDebounce } from "../utils/hooks/useDebounce";

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [editService, setEditService] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    getServices();
  }, []);

  useEffect(() => {
    getServices(1, debouncedSearch);
  }, [debouncedSearch]);

  const getServices = async (nextPage = 1, searchValue = search) => {
    try {
      if (nextPage === 1) setLoading(true);
      else setLoadMoreLoading(true);

      const res = await getServicesHelper(nextPage, limit, searchValue);

      if (nextPage === 1) {
        setServices(res.data);
      } else {
        setServices((prev) => [...prev, ...res.data]);
      }

      setTotal(res.total);
      setPage(nextPage);
    } catch (err) {
      console.error("Failed to get Services:", err);
    } finally {
      setLoading(false);
      setLoadMoreLoading(false);
    }
  };

  const handleUpdateService = (service) => {
    setEditService(service);
  };

  const handleDeleteService = async (id) => {
    try {
      await deleteServiceHelper(id);
      setServices((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Failed to delete service:", err);
    }
  };

  const handleLoadMore = () => {
    if (services.length >= total) return;
    getServices(page + 1);
  };

  return (
    <div className="page-container">
      <div className="custom-header-outer-container">
        <Header
          title="All Services"
          desc="Browse all comprehensive range of medical services"
        />
        <AddServices
          disbaled={loading}
          data={editService}
          setData={setEditService}
          afterAction={() => getServices()}
        />
      </div>
      <SearchInput
        value={search}
        setValue={setSearch}
        placeholder="Search services..."
        margin="20px 0"
      />

      {loading ? (
        <Loader height="50vh" />
      ) : services?.length > 0 ? (
        <div className="services-grid">
          {services.map((service) => {
            const Icon = LucideIcons[service.icon];

            return (
              <ServiceCard
                key={service._id}
                Icon={Icon}
                title={service.title}
                description={service.description}
                doctors={service.doctors.length || 0}
                viewDoctor={service?.doctors?.length > 0 ? true : false}
                longPress={true}
                longPressOptions={[
                  {
                    Icon: LucideIcons.PenBox,
                    text: "Edit",
                    action: () => handleUpdateService(service),
                  },
                  {
                    Icon: LucideIcons.Trash2,
                    text: "Delete",
                    action: () => handleDeleteService(service._id),
                  },
                ]}
              />
            );
          })}
        </div>
      ) : (
        <p className="empty-data">No services available.</p>
      )}
      <LoadMore
        loading={loadMoreLoading}
        disabled={loadMoreLoading || loading}
        show={services.length < total}
        onLoad={handleLoadMore}
      />
    </div>
  );
};

export default AdminServices;
