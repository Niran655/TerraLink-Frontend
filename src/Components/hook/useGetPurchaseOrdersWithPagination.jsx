import { useQuery } from "@apollo/client/react";
import { GET_PURCHASE_ORDER_WITH_PAGINATION } from "../../../graphql/queries";

const useGetPurchaseOrdersWithPagination = ({
  supplierId = null,
  shopId = null,
  status = null,
  page = 1,
  limit = 10,
  pagination = true,
  keyword = "",
}) => {
  const normalizedShopId =
    shopId && shopId !== "null" && shopId !== "undefined" ? shopId : undefined;
  const normalizedStatus =
    status && status !== "All" && status !== "null" && status !== "undefined"
      ? status
      : undefined;

  const { data, loading, error, refetch } = useQuery(
    GET_PURCHASE_ORDER_WITH_PAGINATION,
    {
      variables: {
        supplierId,
        shopId: normalizedShopId,
        status: normalizedStatus,
        page,
        limit,
        pagination,
        keyword,
      },
      fetchPolicy: "cache-and-network",
      notifyOnNetworkStatusChange: true,
      skip: !pagination && !keyword,
    }
  );

  return {
    purchaseOrders: data?.getPurchaseOrdersWithPagination?.data ?? [],
    paginator: data?.getPurchaseOrdersWithPagination?.paginator ?? {},
    loading,
    error,
    refetch,
  };
};

export default useGetPurchaseOrdersWithPagination;
