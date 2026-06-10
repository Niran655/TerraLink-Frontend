import { Box } from "@mui/material";

import ReportPage from "./Report";
 

const ReportInShop = () => {
  const savedStoreId = localStorage.getItem("activeShopId");

  return(
    <Box sx={{p: 2}}>
          <ReportPage shopId={savedStoreId} />
    </Box>
 
    ); 
};

export default ReportInShop;