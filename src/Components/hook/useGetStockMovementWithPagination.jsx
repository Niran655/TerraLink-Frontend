import { useQuery } from "@apollo/client/react";
import { useEffect, useState } from "react";

import { GET_STOCK_MOVMENT_WITH_PAGINATION } from "../../../graphql/queries";


const useGetStockMovementWithPagination = ({
    shopId,
    page = 1,
    limit = 10,
    pagination = true,
    keyword,
    type,
    onError,
})=>{
    const [stockMovement,setStockMovement] = useState([]);
    const [paginator, setPaginator] = useState(true);
    const { data, loading, error, refetch } = useQuery(
        GET_STOCK_MOVMENT_WITH_PAGINATION,
        {
          variables: {shopId, page, limit, pagination, keyword, type },
          fetchPolicy: "cache-and-network",
          onError,
        },
      );   
      
    useEffect(()=>{
        if(data?.getStockMovementWithPagination?.data){
            setStockMovement(data?.getStockMovementWithPagination?.data);
            setPaginator(data?.getStockMovementWithPagination?.paginator)
        }
    },[data]);

    return{
        stockMovement,
        paginator,
        refetch,
        error,
        loading
    }
}

export default useGetStockMovementWithPagination;
