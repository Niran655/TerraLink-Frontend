// DashboardSkeleton.js — Full layout skeleton for dashboard
import { Box, Grid, Skeleton, Stack, Card, CardContent, Divider } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const DashboardSkeleton = () => {
  const theme = useTheme();

  
  const TableRowSkeleton = ({ cols = 3 }) => (
    <Stack direction="row" spacing={2} sx={{ py: 1.2, px: 2 }}>
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} variant="text" width={`${100 / cols}%`} height={24} />
      ))}
    </Stack>
  );

  return (
    <Box sx={{  bgcolor: theme.palette.background.default }}>
 
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Skeleton variant="rounded" width={38} height={38} />
          <Box>
            <Skeleton variant="text" width={120} height={28} />
            <Skeleton variant="text" width={180} height={16} />
          </Box>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Skeleton variant="rounded" width={80} height={36} />
          <Skeleton variant="rounded" width={80} height={36} />
        </Stack>
      </Stack>

       
      <Box sx={{ bgcolor: theme.palette.background.paper, borderRadius: 1, p: 2, mb: 2.5 }}>
        <Grid container spacing={1.5} alignItems="center">
          <Grid size={{ xs: 12, md: 2 }}>
            <Skeleton variant="rounded" height={40} />
          </Grid>
        </Grid>
      </Box>

 
      <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
            <Card sx={{ borderRadius: 2, overflow: "hidden" }}>
              <Box sx={{ p: 2.5 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Box>
                    <Skeleton variant="text" width={100} height={16} />
                    <Skeleton variant="text" width={80} height={36} sx={{ mt: 0.5 }} />
                  </Box>
                  <Skeleton variant="circular" width={36} height={36} />
                </Stack>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

 
      <Grid container spacing={1.5} sx={{ mb: 2 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
            <Card sx={{ p: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Skeleton variant="text" width={100} height={16} />
                  <Skeleton variant="text" width={80} height={32} sx={{ mt: 0.5 }} />
                  <Skeleton variant="text" width={120} height={14} sx={{ mt: 1 }} />
                </Box>
                <Skeleton variant="circular" width={42} height={42} />
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>

    
      <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 2 }}>
            <Stack direction="row" justifyContent="space-between" mb={2}>
              <Skeleton variant="text" width={150} height={24} />
              <Skeleton variant="rounded" width={200} height={32} />
            </Stack>
            <Skeleton variant="rounded" height={280} />
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 2, height: "100%" }}>
            <Skeleton variant="text" width={120} height={24} sx={{ mb: 2 }} />
            <Grid container sx={{ mb: 2 }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <Grid size={4} key={i}>
                  <Box textAlign="center">
                    <Skeleton variant="text" width={50} height={28} sx={{ mx: "auto" }} />
                    <Skeleton variant="text" width={70} height={16} sx={{ mx: "auto" }} />
                  </Box>
                </Grid>
              ))}
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Skeleton variant="text" width={140} height={20} sx={{ mb: 1 }} />
            <Stack direction="row" spacing={2}>
              <Skeleton variant="circular" width={100} height={100} />
              <Box flex={1}>
                {Array.from({ length: 2 }).map((_, i) => (
                  <Box key={i} sx={{ mb: 1.5 }}>
                    <Stack direction="row" justifyContent="space-between" mb={0.5}>
                      <Skeleton variant="text" width={80} height={14} />
                      <Skeleton variant="text" width={40} height={14} />
                    </Stack>
                    <Skeleton variant="rounded" height={6} />
                  </Box>
                ))}
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>

 
      <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 2 }}>
            <Stack direction="row" justifyContent="space-between" mb={2}>
              <Skeleton variant="text" width={160} height={24} />
              <Skeleton variant="text" width={60} height={20} />
            </Stack>
            <Box>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRowSkeleton key={i} cols={3} />
              ))}
            </Box>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 2 }}>
            <Stack direction="row" justifyContent="space-between" mb={2}>
              <Skeleton variant="text" width={140} height={24} />
              <Skeleton variant="text" width={60} height={20} />
            </Stack>
            <Box>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRowSkeleton key={i} cols={4} />
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>

    
      <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ p: 2 }}>
            <Stack direction="row" justifyContent="space-between" mb={1}>
              <Skeleton variant="text" width={120} height={24} />
              <Stack direction="row" spacing={2}>
                <Skeleton variant="text" width={100} height={20} />
                <Skeleton variant="text" width={100} height={20} />
              </Stack>
            </Stack>
            <Skeleton variant="rounded" height={250} />
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ p: 2, height: "100%" }}>
            <Stack direction="row" justifyContent="space-between" mb={1}>
              <Skeleton variant="text" width={140} height={24} />
              <Skeleton variant="rounded" width={100} height={32} />
            </Stack>
            <Stack direction="row" spacing={2} sx={{ mb: 2, borderBottom: 1, borderColor: "divider" }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} variant="text" width={50} height={28} />
              ))}
            </Stack>
            <Box>
              {Array.from({ length: 6 }).map((_, i) => (
                <TableRowSkeleton key={i} cols={4} />
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>

    
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Card sx={{ p: 2, height: "100%" }}>
            <Stack direction="row" justifyContent="space-between" mb={2}>
              <Skeleton variant="text" width={120} height={24} />
              <Skeleton variant="text" width={60} height={20} />
            </Stack>
            <Stack spacing={2}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Stack key={i} direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Skeleton variant="rounded" width={36} height={36} />
                    <Box>
                      <Skeleton variant="text" width={100} height={16} />
                      <Skeleton variant="text" width={80} height={12} />
                    </Box>
                  </Stack>
                  <Skeleton variant="text" width={60} height={20} />
                </Stack>
              ))}
            </Stack>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 2, height: "100%" }}>
            <Stack direction="row" justifyContent="space-between" mb={2}>
              <Skeleton variant="text" width={120} height={24} />
              <Skeleton variant="rounded" width={100} height={32} />
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Skeleton variant="circular" width={120} height={120} />
              <Box flex={1}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <Stack key={i} direction="row" justifyContent="space-between" mb={1}>
                    <Skeleton variant="text" width={80} height={14} />
                    <Skeleton variant="text" width={40} height={14} />
                  </Stack>
                ))}
              </Box>
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Stack direction="row" justifyContent="space-around">
              {Array.from({ length: 2 }).map((_, i) => (
                <Box key={i} textAlign="center">
                  <Skeleton variant="text" width={60} height={28} />
                  <Skeleton variant="text" width={70} height={14} />
                </Box>
              ))}
            </Stack>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ p: 2, height: "100%" }}>
            <Stack direction="row" justifyContent="space-between" mb={2}>
              <Skeleton variant="text" width={120} height={24} />
              <Skeleton variant="rounded" width={100} height={32} />
            </Stack>
            <Skeleton variant="rounded" height={260} />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardSkeleton;