import { useMutation, useQuery } from "@apollo/client/react";
import { Alert, Box, Button, Chip, Divider, Grid, MenuItem, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { Facebook, Plus, RefreshCcw, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import * as Yup from "yup";

import ReusableForm from "../Components/include/useForm";
import { CREATE_CMS_POST, CREATE_FACEBOOK_OAUTH_URL, DELETE_CMS_POST, DELETE_FACEBOOK_PAGE_CONNECTION, PUBLISH_POST_TO_FACEBOOK, UPDATE_FACEBOOK_PAGE_CONNECTION } from "../../graphql/mutation";
import { useAuth } from "../Context/AuthContext";
import { GET_ALL_SHOP, GET_CMS_POSTS, GET_FACEBOOK_PAGE_CONNECTIONS } from "../../graphql/queries";
import { translateLauguage } from "../function/translate";
import { canAccessShop } from "../utils/tenantAccess";

const statusColor = {
  draft: "default",
  scheduled: "warning",
  published: "success",
  failed: "error",
};

const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString();
};

const toDateTimeLocal = (date = new Date(Date.now() + 30 * 60 * 1000)) => {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

const parseImages = (value) =>
  value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);

const postValidationSchema = Yup.object({
  title: Yup.string(),
  content: Yup.string().trim().required("Content is required"),
  images: Yup.string(),
  facebookPageConnectionId: Yup.string(),
  publishAt: Yup.string(),
  action: Yup.string().required("Action is required"),
});

export default function SocialCms() {
  const { user, setAlert, language } = useAuth();
  const { t } = translateLauguage(language);
  const [selectedShopId, setSelectedShopId] = useState(localStorage.getItem("activeShopId") || "");
  const [postForm, setPostForm] = useState({
    title: "",
    content: "",
    images: "",
    facebookPageConnectionId: "",
    publishAt: toDateTimeLocal(),
    action: "draft",
  });
  const [postFormOpen, setPostFormOpen] = useState(false);

  const { data: shopData } = useQuery(GET_ALL_SHOP, {
    variables: { id: user?._id || "" },
    fetchPolicy: "cache-and-network",
  });

  const shops = useMemo(
    () => (shopData?.getAllShops || []).filter((shop) => canAccessShop(user, shop?._id)),
    [shopData, user]
  );

  useEffect(() => {
    if (!selectedShopId && shops.length) {
      setSelectedShopId(shops[0]._id);
    }
  }, [selectedShopId, shops]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const facebookStatus = params.get("facebook");
    if (facebookStatus === "connected") {
      setAlert(true, "success", {
        messageEn: `${t("Facebook Pages connected")}: ${params.get("pages") || 0}`,
      });
      window.history.replaceState({}, "", "/social-cms");
    }
    if (facebookStatus === "error") {
      setAlert(true, "error", {
        messageEn: params.get("message") || t("Facebook connection failed"),
      });
      window.history.replaceState({}, "", "/social-cms");
    }
  }, [setAlert]);

  const pageVariables = { shopId: selectedShopId || undefined };
  const {
    data: pageData,
    refetch: refetchPages,
    loading: pagesLoading,
  } = useQuery(GET_FACEBOOK_PAGE_CONNECTIONS, {
    variables: pageVariables,
    skip: !selectedShopId,
    fetchPolicy: "cache-and-network",
  });
  const pages = pageData?.getFacebookPageConnections || [];

  const {
    data: postData,
    refetch: refetchPosts,
    loading: postsLoading,
  } = useQuery(GET_CMS_POSTS, {
    variables: { shopId: selectedShopId || undefined, limit: 50 },
    skip: !selectedShopId,
    fetchPolicy: "cache-and-network",
  });
  const posts = postData?.getCmsPosts || [];

  useEffect(() => {
    if (!postForm.facebookPageConnectionId && pages.length) {
      setPostForm((current) => ({ ...current, facebookPageConnectionId: pages[0]._id }));
    }
  }, [pages, postForm.facebookPageConnectionId]);

  const notify = (response, key) => {
    const result = response?.[key];
    if (result?.isSuccess) {
      setAlert(true, "success", result.message);
      return true;
    }
    setAlert(true, "error", result?.message || { messageEn: t("Operation failed") });
    return false;
  };

  const refreshAll = () => {
    refetchPages();
    refetchPosts();
  };

  const [createOAuthUrl, { loading: connectingPage }] = useMutation(CREATE_FACEBOOK_OAUTH_URL, {
    onCompleted: (data) => {
      const result = data?.createFacebookOAuthUrl;
      if (result?.isSuccess && result?.data?.url) {
        window.location.href = result.data.url;
        return;
      }
      setAlert(true, "error", result?.message || { messageEn: t("Could not start Facebook connection") });
    },
    onError: (error) => setAlert(true, "error", { messageEn: error.message }),
  });

  const [updatePage] = useMutation(UPDATE_FACEBOOK_PAGE_CONNECTION, {
    onCompleted: (data) => {
      notify(data, "updateFacebookPageConnection");
      refetchPages();
    },
    onError: (error) => setAlert(true, "error", { messageEn: error.message }),
  });

  const [deletePage] = useMutation(DELETE_FACEBOOK_PAGE_CONNECTION, {
    onCompleted: (data) => {
      notify(data, "deleteFacebookPageConnection");
      refetchPages();
    },
    onError: (error) => setAlert(true, "error", { messageEn: error.message }),
  });

  
  const [createPost, { loading: savingPost }] = useMutation(CREATE_CMS_POST, {
    onError: (error) => setAlert(true, "error", { messageEn: error.message }),
  });

  const [publishPost, { loading: publishingPost }] = useMutation(PUBLISH_POST_TO_FACEBOOK, {
    onCompleted: (data) => {
      notify(data, "publishPostToFacebook");
      refetchPosts();
    },
    onError: (error) => setAlert(true, "error", { messageEn: error.message }),
  });

  const [deletePost] = useMutation(DELETE_CMS_POST, {
    onCompleted: (data) => {
      notify(data, "deleteCmsPost");
      refetchPosts();
    },
    onError: (error) => setAlert(true, "error", { messageEn: error.message }),
  });

  const handleConnectPage = () => {
    createOAuthUrl({ variables: { shopId: selectedShopId } });
  };

  const resetPostForm = () => {
    setPostForm({
      title: "",
      content: "",
      images: "",
      facebookPageConnectionId: pages[0]?._id || "",
      publishAt: toDateTimeLocal(),
      action: "draft",
    });
  };

  const openCreatePost = () => {
    setPostForm({
      title: "",
      content: "",
      images: "",
      facebookPageConnectionId: pages[0]?._id || "",
      publishAt: toDateTimeLocal(),
      action: "draft",
    });
    setPostFormOpen(true);
  };

  const handlePostSubmit = async (values) => {
    if (!selectedShopId) {
      setAlert(true, "warning", { messageEn: t("Please select a shop first") });
      return;
    }
    if (values.action === "publishNow" && !values.facebookPageConnectionId) {
      setAlert(true, "warning", { messageEn: t("Please select a Facebook Page before publishing") });
      return;
    }

    const status = values.action === "scheduled" ? "scheduled" : "draft";
    const result = await createPost({
      variables: {
        input: {
          shopId: selectedShopId,
          title: values.title,
          content: values.content,
          images: parseImages(values.images || ""),
          facebookPageConnectionId: values.facebookPageConnectionId || null,
          status,
          publishAt: status === "scheduled" ? new Date(values.publishAt).toISOString() : null,
        },
      },
    });

    if (!notify(result.data, "createCmsPost")) return;

    const postId = result.data?.createCmsPost?.data?.postId;
    if (values.action === "publishNow" && postId) {
      await publishPost({ variables: { postId } });
    }
    resetPostForm();
    setPostFormOpen(false);
    await refetchPosts();
  };

  const postFormTabs = [
    {
      label: t("Post"),
      fields: [
        { name: "title", label: t("title"), grid: { xs: 12 } },
        { name: "content", label: t("Content"), rows: 5, grid: { xs: 12 } },
        { name: "images", label: t("Image URLs"), rows: 2, grid: { xs: 12 } },
      ],
    },
    {
      label: t("Publishing"),
      fields: [
        {
          name: "facebookPageConnectionId",
          label: t("Facebook Page"),
          type: "select",
          options: [
            { value: "", label: t("No page") },
            ...pages.filter((page) => page.active).map((page) => ({
              value: page._id,
              label: page.pageName,
            })),
          ],
          grid: { xs: 12, md: 6 },
        },
        {
          name: "action",
          label: t("action"),
          type: "select",
          options: [
            { value: "draft", label: t("Save Draft") },
            { value: "scheduled", label: t("Schedule") },
            { value: "publishNow", label: t("Publish Now") },
          ],
          grid: { xs: 12, md: 6 },
        },
        { name: "publishAt", label: t("Schedule Time"), type: "datetime-local", grid: { xs: 12 } },
      ],
    },
  ];

  return (
    <Box>
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" gap={2} mb={3}>
        <Box>
          <Typography variant="h5" fontWeight={700}>{t("CMS & Facebook Publishing")}</Typography>
          <Typography color="text.secondary" variant="body2">
            {t("Create content, schedule posts, publish to connected Facebook Pages, and track status.")}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button startIcon={<RefreshCcw size={18} />} variant="outlined" onClick={refreshAll}>
            {t("refresh")}
          </Button>
          <Button startIcon={<Plus size={18} />} variant="contained" onClick={openCreatePost}>
            {t("New Post")}
          </Button>
        </Stack>
      </Stack>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight={700} mb={2}>{t("Facebook Page Connection")}</Typography>
            <TextField
              select
              fullWidth
              size="small"
              label={t("shop")}
              value={selectedShopId}
              onChange={(event) => setSelectedShopId(event.target.value)}
              sx={{ mb: 2 }}
            >
              {shops.map((shop) => (
                <MenuItem key={shop._id} value={shop._id}>{shop.nameEn || shop.nameKh}</MenuItem>
              ))}
            </TextField>

            <Alert severity="info" sx={{ mb: 2 }}>
              {t("Connect with Facebook to select Pages you manage. TerraLink stores Page tokens encrypted and never shows them in the browser.")}
            </Alert>
            <Button
              fullWidth
              disabled={!selectedShopId || connectingPage}
              variant="contained"
              startIcon={<Facebook size={18} />}
              onClick={handleConnectPage}
            >
              {t("Connect Facebook Page")}
            </Button>

            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" fontWeight={700} mb={1}>{t("Connected pages")}</Typography>
            <Stack spacing={1}>
              {pagesLoading && <Typography variant="body2" color="text.secondary">{t("Loading pages...")}</Typography>}
              {!pagesLoading && pages.length === 0 && <Typography variant="body2" color="text.secondary">{t("No Facebook Pages connected.")}</Typography>}
              {pages.map((page) => (
                <Paper key={page._id} variant="outlined" sx={{ p: 1.5 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
                    <Box>
                      <Typography fontWeight={700}>{page.pageName}</Typography>
                      <Typography variant="caption" color="text.secondary">{page.pageId}</Typography>
                    </Box>
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        color={page.active ? "warning" : "success"}
                        onClick={() => updatePage({ variables: { id: page._id, input: { active: !page.active } } })}
                      >
                        {page.active ? t("Disable") : t("Enable")}
                      </Button>
                      <Button color="error" size="small" onClick={() => deletePage({ variables: { id: page._id } })}>
                        <Trash2 size={16} />
                      </Button>
                    </Stack>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 2, borderRadius: 2, mb: 2 }}>
            <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={1}>
              <Box>
                <Typography variant="h6" fontWeight={700}>{t("Posts")}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {t("Draft, schedule, or publish posts from the shared form dialog.")}
                </Typography>
              </Box>
              <Button startIcon={<Plus size={17} />} variant="contained" onClick={openCreatePost}>
                {t("New Post")}
              </Button>
            </Stack>
            {pages.length === 0 && (
              <Alert severity="info" sx={{ mt: 2 }}>
                {t("Connect a Facebook Page before publishing. You can still save drafts.")}
              </Alert>
            )}
          </Paper>

          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t("Post")}</TableCell>
                  <TableCell>{t("page")}</TableCell>
                  <TableCell>{t("status")}</TableCell>
                  <TableCell>{t("Schedule / Published")}</TableCell>
                  <TableCell align="right">{t("action")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {postsLoading && (
                  <TableRow><TableCell colSpan={5}>{t("Loading posts...")}</TableCell></TableRow>
                )}
                {!postsLoading && posts.length === 0 && (
                  <TableRow><TableCell colSpan={5}>{t("No posts yet.")}</TableCell></TableRow>
                )}
                {posts.map((post) => (
                  <TableRow key={post._id}>
                    <TableCell>
                      <Typography fontWeight={700}>{post.title || t("Untitled post")}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360 }} noWrap>
                        {post.content}
                      </Typography>
                      {post.failureReason && (
                        <Typography variant="caption" color="error">{post.failureReason}</Typography>
                      )}
                    </TableCell>
                    <TableCell>{post.facebookPageConnection?.pageName || "-"}</TableCell>
                    <TableCell>
                      <Chip size="small" label={post.status} color={statusColor[post.status] || "default"} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{formatDateTime(post.publishAt || post.publishedAt)}</Typography>
                      {post.facebookPostId && <Typography variant="caption" color="text.secondary">{post.facebookPostId}</Typography>}
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" justifyContent="flex-end" spacing={1}>
                        {post.status !== "published" && (
                          <Button
                            size="small"
                            disabled={publishingPost || !post.facebookPageConnection?._id}
                            onClick={() => publishPost({ variables: { postId: post._id } })}
                          >
                            {t("Publish")}
                          </Button>
                        )}
                        <Button color="error" size="small" onClick={() => deletePost({ variables: { id: post._id } })}>
                          <Trash2 size={16} />
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <ReusableForm
        open={postFormOpen}
        onClose={() => setPostFormOpen(false)}
        initialValues={postForm}
        validationSchema={postValidationSchema}
        onSubmit={handlePostSubmit}
        dialogTitle={t("Create Post")}
        tabs={postFormTabs}
        loading={savingPost || publishingPost}
        t={t}
      />
    </Box>
  );
}
