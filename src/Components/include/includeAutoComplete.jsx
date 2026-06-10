import { useQuery } from "@apollo/client/react";
import { GET_ALL_SHOP } from "../../../graphql/queries";

const useGetAllShopAutoComplete = () => {
    const { data, loading, error, refetch } = useQuery(GET_ALL_SHOP, {
        variables: { id: "" },
    });
    const shops = data?.getAllShops || [];
    const options = shops.map((shop) => ({
        value: shop._id,
        label: shop.nameEn || shop.nameKh,
        raw: shop,
    }));
    return {
        options,
        loading,
        error,
        refetch,
    };
};

export default useGetAllShopAutoComplete;

