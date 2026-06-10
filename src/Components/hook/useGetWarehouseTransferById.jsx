import { useQuery } from "@apollo/client/react"
import { GET_WAREHOUSE_TRANSFER_BY_ID } from "../../../graphql/queries"
import { useEffect, useState } from "react";


const useGetWarehouseTransferById = ({ id }) => {
    
    const { data, loading, error, refetch } = useQuery(GET_WAREHOUSE_TRANSFER_BY_ID, {
        variables: {
            id
        },
        fetchPolicy: "cache-and-network",
    });
    const [warehouseTransfer, setWarehouseTransfer] = useState([]);
    useEffect(() => {
        if (data?.getWarehouseTransferById) {
            setWarehouseTransfer(data?.getWarehouseTransferById);
        }
    }, [data]);

 
    return {
        warehouseTransfer,
        loading,
        error,
        refetch,
    };

}

export default useGetWarehouseTransferById;