import { useQuery } from "@apollo/client/react";
import { GET_PRODUCT_WITH_PAGINATION } from "../../../graphql/queries";
const useGetProductWithPagination = ({
    page = 1,
    limit = 10,
    pagination = true,
    keyword = "",
} = {}) => {
    const { data, loading, error, refetch } = useQuery(
        GET_PRODUCT_WITH_PAGINATION,
        {
            variables: { page, limit, pagination, keyword },
            fetchPolicy: "cache-and-network",
        }
    );

    const products = data?.getProductsWithPagination?.data || [];
    const paginator = data?.getProductsWithPagination?.paginator || {};

    return {
        products,
        paginator,
        loading,
        error,
        refetch,
    };
};

export default useGetProductWithPagination;