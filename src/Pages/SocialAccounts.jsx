import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import {
  Facebook,
  RefreshCw,
  Trash2,
  TrendingUp,
  MessageSquare,
  BarChart2,
  Share2,
  Send,
  EyeOff,
  Eye,
  Settings,
  Heart,
  Calendar,
} from "lucide-react";
import { gql } from "@apollo/client";
import { useAuth } from "../Context/AuthContext";
import { translateLauguage } from "../function/translate";

// GraphQL queries & mutations inline matching backend schemas
const GET_FACEBOOK_PAGES = gql`
  query GetFacebookPages($shopId: ID) {
    facebookPages(shopId: $shopId) {
      _id
      pageId
      pageName
      pageCategory
      pagePicture
      active
      lastSyncedAt
      tokenExpiresAt
    }
  }
`;

const GET_FACEBOOK_INSIGHTS = gql`
  query GetFacebookInsights($pageId: String!) {
    facebookInsights(pageId: $pageId) {
      reach
      impressions
      engagement
      followers
      pageGrowth
      topPosts {
        id
        message
        createdTime
        likes
        commentsCount
      }
    }
  }
`;

const GET_FACEBOOK_POSTS = gql`
  query GetFacebookPosts($pageId: String!) {
    facebookPosts(pageId: $pageId) {
      id
      message
      createdTime
      permalinkUrl
      fullPicture
    }
  }
`;

const GET_FACEBOOK_COMMENTS = gql`
  query GetFacebookComments($postId: String!) {
    facebookComments(postId: $postId) {
      id
      message
      fromName
      fromId
      createdTime
      likeCount
      userLikes
      isHidden
      parentId
    }
  }
`;

const CONNECT_FACEBOOK = gql`
  mutation ConnectFacebook($shopId: ID!) {
    connectFacebook(shopId: $shopId) {
      isSuccess
      message {
        messageEn
        messageKh
      }
      data {
        url
      }
    }
  }
`;

const DISCONNECT_FACEBOOK = gql`
  mutation DisconnectFacebook($pageId: String!) {
    disconnectFacebook(pageId: $pageId) {
      isSuccess
      message {
        messageEn
        messageKh
      }
    }
  }
`;

const REPLY_COMMENT = gql`
  mutation ReplyComment($pageId: String!, $commentId: String!, $message: String!) {
    replyComment(pageId: $pageId, commentId: $commentId, message: $message) {
      isSuccess
      message {
        messageEn
        messageKh
      }
    }
  }
`;

const REFRESH_FACEBOOK_TOKEN = gql`
  mutation RefreshFacebookToken($pageId: String!) {
    refreshFacebookToken(pageId: $pageId) {
      isSuccess
      message {
        messageEn
        messageKh
      }
    }
  }
`;

export default function SocialAccounts() {
  const { user, setAlert, language } = useAuth();
  const { t } = translateLauguage(language);
  const activeShopId = localStorage.getItem("activeShopId") || "";

  const [currentTab, setCurrentTab] = useState(0);
  const [selectedPageId, setSelectedPageId] = useState("");
  const [selectedPostId, setSelectedPostId] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [activeReplyId, setActiveReplyId] = useState("");

  // 1. Fetch connected pages list
  const { data: pageData, refetch: refetchPages, loading: pagesLoading } = useQuery(GET_FACEBOOK_PAGES, {
    variables: { shopId: activeShopId },
    skip: !activeShopId,
    onCompleted: (data) => {
      if (data?.facebookPages?.length && !selectedPageId) {
        setSelectedPageId(data.facebookPages[0].pageId);
      }
    },
  });

  const connectedPages = pageData?.facebookPages || [];

  // 2. Fetch page insights
  const { data: insightsData, loading: insightsLoading, refetch: refetchInsights } = useQuery(GET_FACEBOOK_INSIGHTS, {
    variables: { pageId: selectedPageId },
    skip: !selectedPageId,
  });

  const insights = insightsData?.facebookInsights;

  // 3. Fetch recent page posts for moderation selection
  const { data: postsData, loading: postsLoading } = useQuery(GET_FACEBOOK_POSTS, {
    variables: { pageId: selectedPageId },
    skip: !selectedPageId || currentTab !== 2,
    onCompleted: (data) => {
      if (data?.facebookPosts?.length) {
        setSelectedPostId(data.facebookPosts[0].id);
      }
    },
  });

  const pagePosts = postsData?.facebookPosts || [];

  // 4. Fetch comments for selected post
  const { data: commentsData, loading: commentsLoading, refetch: refetchComments } = useQuery(GET_FACEBOOK_COMMENTS, {
    variables: { postId: selectedPostId },
    skip: !selectedPostId || currentTab !== 2,
  });

  const postComments = commentsData?.facebookComments || [];

  // Mutations
  const [connectFacebook, { loading: connecting }] = useMutation(CONNECT_FACEBOOK);
  const [disconnectFacebook] = useMutation(DISCONNECT_FACEBOOK);
  const [refreshFacebookToken, { loading: syncing }] = useMutation(REFRESH_FACEBOOK_TOKEN);
  const [replyComment, { loading: sendingReply }] = useMutation(REPLY_COMMENT);

  // Check URL parameters for OAuth status updates
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const facebookStatus = params.get("facebook");
    if (facebookStatus === "connected") {
      setAlert(true, "success", {
        messageEn: `Successfully connected ${params.get("pages") || 0} Facebook Pages.`,
        messageKh: `បានភ្ជាប់ Facebook Pages ចំនួន ${params.get("pages") || 0} ដោយជោគជ័យ។`,
      });
      // Clean query parameters from URL
      window.history.replaceState({}, "", "/setting/social-accounts");
      refetchPages();
    } else if (facebookStatus === "error") {
      setAlert(true, "error", {
        messageEn: params.get("message") || "Facebook connection failed.",
        messageKh: "ការភ្ជាប់ទៅ Facebook មិនបានជោគជ័យទេ។",
      });
      window.history.replaceState({}, "", "/setting/social-accounts");
    }
  }, [setAlert, refetchPages]);

  const handleConnect = async () => {
    if (!activeShopId) {
      setAlert(true, "warning", { messageEn: "Please select an active store first." });
      return;
    }
    try {
      const { data } = await connectFacebook({ variables: { shopId: activeShopId } });
      if (data?.connectFacebook?.isSuccess && data?.connectFacebook?.data?.url) {
        window.location.href = data.connectFacebook.data.url;
      } else {
        setAlert(true, "error", { messageEn: data?.connectFacebook?.message?.messageEn || "Could not begin OAuth process" });
      }
    } catch (err) {
      setAlert(true, "error", { messageEn: err.message });
    }
  };

  const handleDisconnect = async (pageId) => {
    try {
      const { data } = await disconnectFacebook({ variables: { pageId } });
      if (data?.disconnectFacebook?.isSuccess) {
        setAlert(true, "success", { messageEn: "Disconnected page successfully." });
        refetchPages();
        if (selectedPageId === pageId) {
          setSelectedPageId("");
        }
      }
    } catch (err) {
      setAlert(true, "error", { messageEn: err.message });
    }
  };

  const handleSyncToken = async (pageId) => {
    try {
      const { data } = await refreshFacebookToken({ variables: { pageId } });
      if (data?.refreshFacebookToken?.isSuccess) {
        setAlert(true, "success", { messageEn: "Connection verified and page details refreshed." });
        refetchPages();
      }
    } catch (err) {
      setAlert(true, "error", { messageEn: err.message });
    }
  };

  const handleReplySubmit = async (commentId) => {
    if (!replyMessage.trim()) return;
    try {
      const { data } = await replyComment({
        variables: {
          pageId: selectedPageId,
          commentId,
          message: replyMessage,
        },
      });
      if (data?.replyComment?.isSuccess) {
        setAlert(true, "success", { messageEn: "Reply posted to Facebook successfully." });
        setReplyMessage("");
        setActiveReplyId("");
        refetchComments();
      }
    } catch (err) {
      setAlert(true, "error", { messageEn: err.message });
    }
  };

  return (
    <Box sx={{ p: { xs: 1, md: 3 }, bgcolor: "background.default" }}>
      {/* Header Banner */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1877F2 0%, #1D4592 100%)",
          borderRadius: 2,
          p: 3,
          mb: 3,
          color: "white",
          boxShadow: "0 8px 32px rgba(24, 119, 242, 0.15)",
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 48, height: 48 }}>
              <Facebook size={24} />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                Facebook Page Integration
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                Connect and manage your corporate Facebook Pages, view reach insights, and moderate post feedback.
              </Typography>
            </Box>
          </Stack>
          <Button
            variant="contained"
            onClick={handleConnect}
            disabled={connecting}
            startIcon={connecting ? <CircularProgress size={16} color="inherit" /> : <Share2 size={16} />}
            sx={{
              bgcolor: "white",
              color: "#1877F2",
              fontWeight: 700,
              px: 3,
              textTransform: "none",
              borderRadius: 2,
              "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
            }}
          >
            Connect Facebook Page
          </Button>
        </Stack>
      </Box>

      {/* Connection Selection for Child Tabs */}
      {connectedPages.length > 0 && (
        <Paper sx={{ p: 2, mb: 3, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
          <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
              Managing Connection:
            </Typography>
            <FormControl size="small" sx={{ minWidth: 220 }}>
              <Select
                value={selectedPageId}
                onChange={(e) => setSelectedPageId(e.target.value)}
                sx={{ borderRadius: 1.5 }}
              >
                {connectedPages.map((page) => (
                  <MenuItem key={page.pageId} value={page.pageId}>
                    {page.pageName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Paper>
      )}

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={currentTab}
          onChange={(_, val) => setCurrentTab(val)}
          textColor="primary"
          indicatorColor="primary"
          sx={{
            "& .MuiTab-root": { textTransform: "none", fontWeight: 600, fontSize: "0.95rem" },
          }}
        >
          <Tab icon={<Settings size={16} style={{ marginRight: 8 }} />} iconPosition="start" label="Connected Pages" />
          <Tab
            icon={<BarChart2 size={16} style={{ marginRight: 8 }} />}
            iconPosition="start"
            label="Insights & Analytics"
            disabled={connectedPages.length === 0}
          />
          <Tab
            icon={<MessageSquare size={16} style={{ marginRight: 8 }} />}
            iconPosition="start"
            label="Feed Moderation"
            disabled={connectedPages.length === 0}
          />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      {currentTab === 0 && (
        <Box>
          {pagesLoading ? (
            <Stack py={8} alignItems="center">
              <CircularProgress />
            </Stack>
          ) : connectedPages.length === 0 ? (
            <Paper sx={{ py: 8, px: 3, textAlign: "center", borderRadius: 2, border: "1px dashed", borderColor: "divider" }}>
              <Facebook size={48} strokeWidth={1} style={{ margin: "0 auto 16px", color: "#b0bec5" }} />
              <Typography variant="h6" fontWeight={600} color="text.primary" mb={1}>
                No Facebook Pages Connected
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3} maxWidth={400} mx="auto">
                Authenticate with Facebook to sync your business Facebook Page. TerraLink stores your tokens with bank-grade encryption.
              </Typography>
              <Button variant="contained" color="primary" onClick={handleConnect} sx={{ borderRadius: 2, px: 4 }}>
                Connect Page Now
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {connectedPages.map((page) => (
                <Grid size={{ xs: 12, md: 6 }} key={page._id}>
                  <Card sx={{ borderRadius: 2, boxShadow: 1, border: "1px solid", borderColor: "divider" }}>
                    <CardContent>
                      <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                        <Avatar
                          src={page.pagePicture}
                          alt={page.pageName}
                          sx={{ width: 64, height: 64, border: "2px solid #1877F2" }}
                        >
                          {page.pageName.charAt(0)}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" fontWeight={700}>
                            {page.pageName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Category: {page.pageCategory || "Business Page"}
                          </Typography>
                          <Box mt={0.5}>
                            <Chip size="small" label="Connected" color="success" variant="outlined" />
                          </Box>
                        </Box>
                      </Stack>
                      <Divider sx={{ my: 1.5 }} />
                      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                        <Typography variant="caption" color="text.secondary">
                          Synced: {new Date(page.lastSyncedAt).toLocaleString()}
                        </Typography>
                        <Stack direction="row" spacing={1}>
                          <IconButton
                            size="small"
                            onClick={() => handleSyncToken(page.pageId)}
                            title="Verify Connection"
                            disabled={syncing}
                          >
                            <RefreshCw size={16} />
                          </IconButton>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleDisconnect(page.pageId)}
                            startIcon={<Trash2 size={14} />}
                            sx={{ borderRadius: 1.5, textTransform: "none" }}
                          >
                            Disconnect
                          </Button>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {currentTab === 1 && (
        <Box>
          {insightsLoading ? (
            <Stack py={8} alignItems="center">
              <CircularProgress />
            </Stack>
          ) : !insights ? (
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <Typography>Could not retrieve insights for this page. Reconnect the page and try again.</Typography>
            </Paper>
          ) : (
            <Box>
              {/* Analytics Cards Grid */}
              <Grid container spacing={3} mb={4}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card sx={{ bgcolor: "background.paper", borderRadius: 2, boxShadow: 1 }}>
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                          Page Reach
                        </Typography>
                        <TrendingUp size={20} color="#1877F2" />
                      </Stack>
                      <Typography variant="h4" fontWeight={700} color="text.primary">
                        {insights.reach.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="success.main" sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                        +{insights.pageGrowth}% this week
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card sx={{ bgcolor: "background.paper", borderRadius: 2, boxShadow: 1 }}>
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                          Page Impressions
                        </Typography>
                        <BarChart2 size={20} color="#00C9A7" />
                      </Stack>
                      <Typography variant="h4" fontWeight={700} color="text.primary">
                        {insights.impressions.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Total post views
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card sx={{ bgcolor: "background.paper", borderRadius: 2, boxShadow: 1 }}>
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                          Page Engagement
                        </Typography>
                        <MessageSquare size={20} color="#845ADF" />
                      </Stack>
                      <Typography variant="h4" fontWeight={700} color="text.primary">
                        {insights.engagement.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Likes, comments, shares
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card sx={{ bgcolor: "background.paper", borderRadius: 2, boxShadow: 1 }}>
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                          Total Followers
                        </Typography>
                        <Heart size={20} color="#F44336" />
                      </Stack>
                      <Typography variant="h4" fontWeight={700} color="text.primary">
                        {insights.followers.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Total likes & follows
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Top Posts */}
              <Card sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
                <CardHeader title="Top Performing Posts" titleTypographyProps={{ variant: "h6", fontWeight: 700 }} />
                <CardContent sx={{ p: 0 }}>
                  <List sx={{ width: "100%" }}>
                    {insights.topPosts.map((post, idx) => (
                      <React.Fragment key={post.id}>
                        {idx > 0 && <Divider />}
                        <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                          <Avatar sx={{ bgcolor: "rgba(24,119,242,0.1)", color: "#1877F2", mr: 2 }}>
                            #{idx + 1}
                          </Avatar>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle2" fontWeight={600} noWrap>
                                {post.message}
                              </Typography>
                            }
                            secondary={
                              <Stack direction="row" spacing={2} mt={1} alignItems="center" flexWrap="wrap">
                                <Typography variant="caption" color="text.secondary">
                                  {new Date(post.createdTime).toLocaleDateString()}
                                </Typography>
                                <Chip size="small" label={`${post.likes} Likes`} color="primary" variant="outlined" />
                                <Chip size="small" label={`${post.commentsCount} Comments`} color="secondary" variant="outlined" />
                              </Stack>
                            }
                          />
                        </ListItem>
                      </React.Fragment>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Box>
          )}
        </Box>
      )}

      {currentTab === 2 && (
        <Box>
          <Grid container spacing={3}>
            {/* Posts Selector */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ borderRadius: 2, height: "100%" }}>
                <CardHeader title="Select Post" titleTypographyProps={{ variant: "h6", fontWeight: 700 }} />
                <Divider />
                <CardContent>
                  {postsLoading ? (
                    <Stack py={4} alignItems="center">
                      <CircularProgress size={24} />
                    </Stack>
                  ) : pagePosts.length === 0 ? (
                    <Typography color="text.secondary" variant="body2">
                      No posts found on this page. Create posts in the CMS dashboard first.
                    </Typography>
                  ) : (
                    <List sx={{ maxHeight: 400, overflow: "auto" }}>
                      {pagePosts.map((post) => (
                        <ListItem
                          button
                          key={post.id}
                          selected={selectedPostId === post.id}
                          onClick={() => setSelectedPostId(post.id)}
                          sx={{
                            borderRadius: 1,
                            mb: 1,
                            "&.Mui-selected": { bgcolor: "rgba(24, 119, 242, 0.08)" },
                          }}
                        >
                          <ListItemText
                            primary={
                              <Typography variant="body2" fontWeight={600} noWrap>
                                {post.message || "(Post Image/Video)"}
                              </Typography>
                            }
                            secondary={new Date(post.createdTime).toLocaleDateString()}
                          />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Comments List */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Card sx={{ borderRadius: 2 }}>
                <CardHeader
                  title="Feed Comments"
                  titleTypographyProps={{ variant: "h6", fontWeight: 700 }}
                  action={
                    selectedPostId && (
                      <IconButton size="small" onClick={() => refetchComments()}>
                        <RefreshCw size={14} />
                      </IconButton>
                    )
                  }
                />
                <Divider />
                <CardContent sx={{ minHeight: 300, display: "flex", flexDirection: "column" }}>
                  {!selectedPostId ? (
                    <Stack flexGrow={1} justifyContent="center" alignItems="center" py={8}>
                      <MessageSquare size={32} style={{ color: "#cfd8dc", marginBottom: 8 }} />
                      <Typography color="text.secondary" variant="body2">
                        Select a post from the left sidebar to load its comments.
                      </Typography>
                    </Stack>
                  ) : commentsLoading ? (
                    <Stack flexGrow={1} justifyContent="center" alignItems="center" py={8}>
                      <CircularProgress size={28} />
                    </Stack>
                  ) : postComments.length === 0 ? (
                    <Stack flexGrow={1} justifyContent="center" alignItems="center" py={8}>
                      <Typography color="text.secondary" variant="body2">
                        No comments found on this post.
                      </Typography>
                    </Stack>
                  ) : (
                    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                      {postComments.map((comment) => (
                        <Box key={comment.id} sx={{ mb: 2, p: 1.5, borderRadius: 2, bgcolor: "action.hover" }}>
                          <Stack direction="row" spacing={1.5} alignItems="flex-start">
                            <Avatar sx={{ width: 32, height: 32, bgcolor: "#1877F2" }}>
                              {comment.fromName.charAt(0)}
                            </Avatar>
                            <Box sx={{ flexGrow: 1 }}>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Typography variant="subtitle2" fontWeight={700}>
                                  {comment.fromName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {new Date(comment.createdTime).toLocaleTimeString()}
                                </Typography>
                              </Stack>
                              <Typography variant="body2" sx={{ mt: 0.5, color: "text.primary" }}>
                                {comment.message}
                              </Typography>

                              {/* Action Bar */}
                              <Stack direction="row" spacing={2} mt={1} alignItems="center">
                                <Button
                                  size="small"
                                  variant="text"
                                  onClick={() => {
                                    setActiveReplyId(comment.id);
                                    setReplyMessage("");
                                  }}
                                  startIcon={<MessageSquare size={12} />}
                                  sx={{ textTransform: "none", p: 0, minWidth: 0 }}
                                >
                                  Reply
                                </Button>
                              </Stack>

                              {/* Inline Reply input */}
                              {activeReplyId === comment.id && (
                                <Stack direction="row" spacing={1} mt={2} alignItems="center">
                                  <TextField
                                    size="small"
                                    fullWidth
                                    placeholder="Write a reply..."
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                    sx={{ bgcolor: "background.paper" }}
                                  />
                                  <IconButton
                                    color="primary"
                                    disabled={sendingReply || !replyMessage.trim()}
                                    onClick={() => handleReplySubmit(comment.id)}
                                  >
                                    <Send size={16} />
                                  </IconButton>
                                </Stack>
                              )}
                            </Box>
                          </Stack>
                        </Box>
                      ))}
                    </List>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
}
