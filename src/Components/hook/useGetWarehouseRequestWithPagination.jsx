import { useQuery } from "@apollo/client/react";

import { GET_WAREHOUSE_REQUESTS_WITH_PAGINATION } from "../../../graphql/queries";

const useGetWarehouseRequestWithPagination = ({
  page = 1,
  limit = 10,
  pagination = true,
  keyword = "",
  status,
  shopId,
} = {}) => {
  const normalizedShopId =
    shopId && shopId !== "null" && shopId !== "undefined" ? shopId : undefined;
  const normalizedStatus =
    status && status !== "All" && status !== "null" && status !== "undefined"
      ? status
      : undefined;

  const { data, loading, error, refetch } = useQuery(
    GET_WAREHOUSE_REQUESTS_WITH_PAGINATION,
    {
      variables: {
        page,
        limit,
        pagination,
        keyword: keyword || "",
        shopId: normalizedShopId,
        status: normalizedStatus,
      },
      fetchPolicy: "cache-and-network",
      notifyOnNetworkStatusChange: true,
    },
  );

  return {
    warehouseRequests: data?.getWarehouseRequestsWithPagination?.data || [],
    paginator: data?.getWarehouseRequestsWithPagination?.paginator || {},
    loading,
    error,
    refetch,
  };
};

export default useGetWarehouseRequestWithPagination;
