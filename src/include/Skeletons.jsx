import React from "react";
import { Box, Paper, Stack, Grid, Skeleton, Divider, Card, CardContent } from "@mui/material";

export function AIPermissionsSkeleton() {
  return (
    <Stack spacing={3}>
      {[1, 2, 3].map((idx) => (
        <Paper key={idx} sx={{ p: 3, border: 1, borderColor: "divider", boxShadow: "none", bgcolor: "background.paper", textAlign: "start" }}>
          <Skeleton variant="text" width={220} height={32} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="60%" height={20} sx={{ mb: 3 }} />
          <Stack divider={<Divider flexItem />} spacing={2}>
            {[1, 2, 3].map((key) => (
              <Stack key={key} direction="row" alignItems="center" justifyContent="space-between">
                <Box sx={{ width: "80%" }}>
                  <Skeleton variant="text" width="40%" height={24} sx={{ mb: 0.5 }} />
                  <Skeleton variant="text" width="70%" height={16} />
                </Box>
                <Skeleton variant="rectangular" width={40} height={20} sx={{ borderRadius: 10 }} />
              </Stack>
            ))}
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}

export function AccountSecuritySkeleton() {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper sx={{ p: 3, borderRadius: 2, border: "1px solid", borderColor: "divider", boxShadow: "none", textAlign: "center", bgcolor: "background.paper", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <Skeleton variant="text" width={120} height={28} sx={{ mb: 2 }} />
          <Skeleton variant="circular" width={120} height={120} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="80%" height={20} />
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <Stack spacing={3}>
          {[1, 2, 3].map((i) => (
            <Paper key={i} sx={{ p: 3, borderRadius: 2, border: "1px solid", borderColor: "divider", boxShadow: "none", bgcolor: "background.paper" }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box sx={{ width: "70%" }}>
                  <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    <Skeleton variant="circular" width={20} height={20} />
                    <Skeleton variant="text" width={150} height={24} />
                  </Stack>
                  <Skeleton variant="text" width="85%" height={20} />
                </Box>
                {i === 2 ? (
                  <Skeleton variant="rectangular" width={80} height={36} sx={{ borderRadius: 1.5 }} />
                ) : (
                  <Skeleton variant="rectangular" width={40} height={20} sx={{ borderRadius: 10 }} />
                )}
              </Stack>
              {i === 2 && (
                <Stack direction="row" spacing={2} mt={2}>
                  <Skeleton variant="rectangular" height={40} sx={{ flexGrow: 1, borderRadius: 1 }} />
                  <Skeleton variant="rectangular" width={80} height={40} sx={{ borderRadius: 1 }} />
                </Stack>
              )}
            </Paper>
          ))}
        </Stack>
      </Grid>
    </Grid>
  );
}

export function SecurityCenterSkeleton() {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Paper sx={{ p: 4, border: "1px solid", borderColor: "divider", boxShadow: "none", bgcolor: "background.paper", textAlign: "center", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <Skeleton variant="text" width={120} height={28} sx={{ mb: 2 }} />
          <Skeleton variant="circular" width={140} height={140} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="80%" height={20} sx={{ mt: 2 }} />
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid size={{ xs: 12, sm: 6 }} key={i}>
              <Paper sx={{ p: 3, border: "1px solid", borderColor: "divider", boxShadow: "none", bgcolor: "background.paper" }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Skeleton variant="rectangular" width={48} height={48} sx={{ borderRadius: 2 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Skeleton variant="text" width="60%" height={20} sx={{ mb: 0.5 }} />
                    <Skeleton variant="text" width="30%" height={28} />
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}

export function SocialPagesSkeleton() {
  return (
    <Grid container spacing={3}>
      {[1, 2].map((i) => (
        <Grid size={{ xs: 12, md: 6 }} key={i}>
          <Card sx={{ borderRadius: 2, boxShadow: 1, border: "1px solid", borderColor: "divider" }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                <Skeleton variant="circular" width={64} height={64} />
                <Box sx={{ flexGrow: 1 }}>
                  <Skeleton variant="text" width="50%" height={28} sx={{ mb: 0.5 }} />
                  <Skeleton variant="text" width="30%" height={16} sx={{ mb: 1 }} />
                  <Skeleton variant="rectangular" width={80} height={20} sx={{ borderRadius: 5 }} />
                </Box>
              </Stack>
              <Divider sx={{ my: 1.5 }} />
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Skeleton variant="text" width="40%" height={16} />
                <Stack direction="row" spacing={1}>
                  <Skeleton variant="circular" width={32} height={32} />
                  <Skeleton variant="rectangular" width={90} height={32} sx={{ borderRadius: 1.5 }} />
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export function SocialInsightsSkeleton() {
  return (
    <Box>
      <Grid container spacing={3} mb={4}>
        {[1, 2, 3, 4].map((i) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
            <Card sx={{ borderRadius: 2, boxShadow: 1, border: "1px solid", borderColor: "divider" }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Skeleton variant="text" width="70%" height={18} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="40%" height={32} />
                  </Box>
                  <Skeleton variant="rectangular" width={40} height={40} sx={{ borderRadius: 2 }} />
                </Stack>
                <Skeleton variant="text" width="50%" height={16} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
            <CardContent>
              <Skeleton variant="text" width="30%" height={28} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 1 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider", height: "100%" }}>
            <CardContent>
              <Skeleton variant="text" width="50%" height={28} sx={{ mb: 2 }} />
              <Stack spacing={2}>
                {[1, 2, 3].map((i) => (
                  <Stack key={i} direction="row" spacing={2} alignItems="center">
                    <Skeleton variant="rectangular" width={48} height={48} sx={{ borderRadius: 1 }} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Skeleton variant="text" width="90%" height={20} sx={{ mb: 0.5 }} />
                      <Skeleton variant="text" width="40%" height={16} />
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export function SocialPostsSkeleton() {
  return (
    <Stack spacing={2}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Stack key={i} direction="column" spacing={0.5} sx={{ p: 1 }}>
          <Skeleton variant="text" width="85%" height={20} />
          <Skeleton variant="text" width="40%" height={16} />
        </Stack>
      ))}
    </Stack>
  );
}

export function SocialCommentsSkeleton() {
  return (
    <Stack spacing={2} width="100%">
      {[1, 2, 3].map((i) => (
        <Box key={i} sx={{ mb: 2, p: 1.5, borderRadius: 2, bgcolor: "action.hover" }}>
          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <Skeleton variant="circular" width={32} height={32} />
            <Box sx={{ flexGrow: 1 }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                <Skeleton variant="text" width={100} height={18} />
                <Skeleton variant="text" width={60} height={14} />
              </Stack>
              <Skeleton variant="text" width="95%" height={20} sx={{ mb: 0.5 }} />
              <Skeleton variant="text" width="60%" height={20} />
            </Box>
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}
