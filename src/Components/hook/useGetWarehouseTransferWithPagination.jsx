import { useQuery } from "@apollo/client/react";
import { useEffect, useState } from "react";

import { GET_PRODUCTS_WAREHOUSE_TRANSFER_WITH_PAGINATION } from "../../../graphql/queries";

const useGetWarehouseTransferWithPagination = ({
  page = 1,
  limit = 10,
  pagination = true,
  keyword = "",
  status,
  shopId
} = {}) => {
  const normalizedShopId =
    shopId && shopId !== "null" && shopId !== "undefined" ? shopId : undefined;
  const normalizedStatus =
    status && status !== "All" && status !== "null" && status !== "undefined"
      ? status
      : undefined;

  const { data, loading, error, refetch } = useQuery(
    GET_PRODUCTS_WAREHOUSE_TRANSFER_WITH_PAGINATION,
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

  const [productsWarehouseTransfer, setProductsWarehouseTransfer] = useState(
    [],
  );
  const [paginator, setPaginator] = useState({});

  useEffect(() => {
    if (error) {
      console.error("getWarehouseTransfersWithPagination error:", error);
    }

    if (data?.getWarehouseTransfersWithPagination) {
      setProductsWarehouseTransfer(
        data.getWarehouseTransfersWithPagination.data || [],
      );
      setPaginator(data.getWarehouseTransfersWithPagination.paginator || {});
    }
  }, [data, error]);

  return {
    productsWarehouseTransfer,
    paginator,
    loading,
    error,
    refetch,
  };
};

export default useGetWarehouseTransferWithPagination;
