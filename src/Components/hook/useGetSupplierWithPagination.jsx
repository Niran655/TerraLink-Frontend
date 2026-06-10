import { useQuery } from "@apollo/client/react";
import { GET_SUPPLIERS_WITH_PAGINATION } from "../../../graphql/queries";

const useGetSupplierWithPagination = (
    page,
    limit,
    pagination,
    keyword,
    active
) => {
    const { data, loading, error, refetch } = useQuery(
        GET_SUPPLIERS_WITH_PAGINATION,
        {
            variables: { page, limit, pagination, keyword, active },
            // fetchPolicy: "cache-and-network",
        }
    );

    const suppliers = data?.getSuppliersWithPagination?.data || [];
    const paginator = data?.getSuppliersWithPagination?.paginator || {};
    return {
        suppliers,
        paginator,
        loading,
        error,
        refetch,
    };
}

export default useGetSupplierWithPagination;