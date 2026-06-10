import { useQuery } from "@apollo/client/react";
import { useEffect, useState } from "react";

import { GET_PRODUCT_WAREHOUSE_IN_SHOP_WITH_PAGINATION } from "../../../graphql/queries";


const useGetProductWarehouseInShopWithPagination = ({
    shopId,
    page = 1,
    limit = 10,
    pagination = true,
    keyword,
})=>{
    const [producteWarehouseInShop,setProductWarehouseInShop] = useState([]);
    const [paginator, setPaginator] = useState(true);
    const { data, loading, error, refetch } = useQuery(
        GET_PRODUCT_WAREHOUSE_IN_SHOP_WITH_PAGINATION,
        {
          variables: {shopId, page, limit, pagination, keyword },
          fetchPolicy: "cache-and-network",
        },
      );   
      
    useEffect(()=>{
        if(data?.getProductWareHouseInShopoWithPagination?.data){
            setProductWarehouseInShop(data?.getProductWareHouseInShopoWithPagination?.data);
            setPaginator(data?.getProductWareHouseInShopoWithPagination?.paginator)
        }
    },[data]);

    return{
        producteWarehouseInShop,
        paginator,
        refetch,
        error,
        loading
    }
}

export default useGetProductWarehouseInShopWithPagination;