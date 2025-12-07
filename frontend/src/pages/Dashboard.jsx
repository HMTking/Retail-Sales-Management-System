import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { salesService } from "../services/salesService";
import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import SummaryCards from "../components/SummaryCards";
import SalesTable from "../components/SalesTable";
import Pagination from "../components/Pagination";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const [sales, setSales] = useState([]);
  const [summary, setSummary] = useState({
    totalUnitsSold: 0,
    totalAmount: 0,
    totalDiscount: 0,
  });
  const [filterOptions, setFilterOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter and search states
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    customerRegion: [],
    gender: [],
    minAge: "",
    maxAge: "",
    productCategory: [],
    tags: [],
    paymentMethod: [],
    startDate: "",
    endDate: "",
  });
  const [sortBy, setSortBy] = useState("date-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Fetch filter options on mount
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const data = await salesService.getFilterOptions();
        setFilterOptions(data.filters);
      } catch (err) {
        console.error("Error fetching filter options:", err);
      }
    };
    fetchFilterOptions();
  }, []);

  // Fetch sales data
  useEffect(() => {
    const fetchSales = async () => {
      setLoading(true);
      setError("");

      try {
        const params = {
          page: currentPage,
          limit: 10,
          sortBy,
        };

        if (searchQuery) params.search = searchQuery;
        if (filters.customerRegion.length)
          params.customerRegion = filters.customerRegion.join(",");
        if (filters.gender.length) params.gender = filters.gender.join(",");
        if (filters.minAge) params.minAge = filters.minAge;
        if (filters.maxAge) params.maxAge = filters.maxAge;
        if (filters.productCategory.length)
          params.productCategory = filters.productCategory.join(",");
        if (filters.tags.length) params.tags = filters.tags.join(",");
        if (filters.paymentMethod.length)
          params.paymentMethod = filters.paymentMethod.join(",");
        if (filters.startDate) params.startDate = filters.startDate;
        if (filters.endDate) params.endDate = filters.endDate;

        const data = await salesService.getSales(params);

        setSales(data.data);
        setSummary(data.summary);
        setTotalPages(data.pages);
        setTotalRecords(data.total);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch sales data");
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [searchQuery, filters, sortBy, currentPage]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <header className="bg-white dark:bg-gray-800 shadow-sm px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Sales Management System
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Welcome back, {user?.name}
              </p>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <SearchBar onSearch={handleSearch} />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <FilterPanel
                  filters={filters}
                  filterOptions={filterOptions}
                  onFilterChange={handleFilterChange}
                />
              </div>

              <div className="lg:col-span-3 space-y-6">
                <SummaryCards summary={summary} />

                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}

                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <Loader2
                      className="animate-spin text-primary-600"
                      size={48}
                    />
                  </div>
                ) : (
                  <>
                    <SalesTable
                      sales={sales}
                      sortBy={sortBy}
                      onSortChange={handleSortChange}
                    />

                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalRecords={totalRecords}
                      onPageChange={handlePageChange}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
