import { useParams } from "react-router-dom";
    
import { Box } from "@mui/material";
import Dashboard from "./Dashboard";
 

const DashboardInShop = () => {
  const savedStoreId = localStorage.getItem("activeShopId");

  return(
    <Box sx={{p: 2}}>
          <Dashboard shopId={savedStoreId} />
    </Box>
 
    ); 
};

export default DashboardInShop;