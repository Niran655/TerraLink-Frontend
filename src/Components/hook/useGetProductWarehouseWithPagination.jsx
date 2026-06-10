import { useQuery } from "@apollo/client/react";
import { useEffect, useState } from "react";

import { GET_PRDUCT_WAREHOUSE_WITH_PAGINATION } from "../../../graphql/queries";

const useGetProductWarehouseWithPagination = ({
  page = 1,
  limit = 10,
  pagination = true,
  keyword = "",
  status,
}) => {
  const [productWarehouseWithPagination, setProductwarehouseWithPagination] = useState([]);
  const [paginator, setPaginator] = useState(true);
  const { data, loading, error, refetch } = useQuery(
    GET_PRDUCT_WAREHOUSE_WITH_PAGINATION,
    {
      variables: { page, limit, pagination, keyword, status },
      fetchPolicy: "cache-and-network",
    },
  );
  useEffect(() => {
    if (data?.getProductWareHouseWithPagination) {
      setProductwarehouseWithPagination(data?.getProductWareHouseWithPagination?.data);
      setPaginator(data?.getProductWareHouseWithPagination?.paginator);

    }
  }, [data]);

  return {
    productWarehouseWithPagination,
    paginator,
    loading,
    error,
    refetch,
  };
};
export default useGetProductWarehouseWithPagination;
