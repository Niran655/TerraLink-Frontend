import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import EmptyImage from "../assets/Image/empty-image.png";
import { supabase } from "../supabaseClient";
import { useAuth } from "../Context/AuthContext";
import { translateLauguage } from "../function/translate";

function getCenteredCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

function canvasPreview(image, crop) {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  const pixelRatio = window.devicePixelRatio || 1;

 

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = "high";

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  ctx.drawImage(
    image,
    cropX,
    cropY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width * scaleX,
    crop.height * scaleY
  );

  return canvas;
}

function canvasToBlob(canvas, type = "image/jpeg", quality = 0.92) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Could not crop image."));
      },
      type,
      quality
    );
  });
}

function safeFileName(name) {
  return name.replace(/\.[^/.]+$/, "").replace(/[^a-z0-9_-]/gi, "-").toLowerCase();
}

export default function UploadImage({
  value,
  onChange,
  setFilePath,
  aspect = 1,
  bucketFolder = "users",
  outputType = "image/jpeg",
  outputQuality = 0.92,
}) {
  const [preview, setPreview] = useState(value || EmptyImage);
  const [loading, setLoading] = useState(false);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [cropSrc, setCropSrc] = useState("");
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [selectedFile, setSelectedFile] = useState(null);
  const imageRef = useRef(null);
  const objectUrlRef = useRef("");
   const {language} = useAuth();
  const {t}  = translateLauguage(language);
  useEffect(() => {
    if (value) setPreview(value);
    else setPreview(EmptyImage);
  }, [value]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const uploadFile = async (blob, originalFileName) => {
    setLoading(true);

    const extension = outputType === "image/png" ? "png" : "jpg";
    const fileName = `${Date.now()}_${safeFileName(originalFileName)}.${extension}`;
    const bucketPath = `${bucketFolder}/${fileName}`;

    const { error } = await supabase.storage
      .from("images")
      .upload(bucketPath, blob, { contentType: outputType, upsert: true });

    if (error) {
      alert("Upload error: " + error.message);
      setLoading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("images")
      .getPublicUrl(bucketPath);

    setPreview(urlData.publicUrl);
    onChange(urlData.publicUrl);

    if (setFilePath) setFilePath(bucketPath);

    setLoading(false);
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const objectUrl = URL.createObjectURL(file);
    objectUrlRef.current = objectUrl;
    setSelectedFile(file);
    setCropSrc(objectUrl);
    setCompletedCrop(undefined);
    setCropDialogOpen(true);
  };

  const handleImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    setCrop(getCenteredCrop(width, height, aspect));
  };

  const handleCancelCrop = () => {
    setCropDialogOpen(false);
    setCropSrc("");
    setSelectedFile(null);
  };

  const handleCropUpload = async () => {
    if (!imageRef.current || !selectedFile) return;

    const activeCrop = completedCrop || crop;
    if (!activeCrop?.width || !activeCrop?.height) {
      alert("Please select an area to crop.");
      return;
    }

    try {
      const canvas = canvasPreview(imageRef.current, activeCrop);
      if (!canvas) throw new Error("Could not prepare cropped image.");

      const blob = await canvasToBlob(canvas, outputType, outputQuality);
      setCropDialogOpen(false);
      setCropSrc("");
      await uploadFile(blob, selectedFile.name);
      setSelectedFile(null);
    } catch (error) {
      alert(error.message);
      setLoading(false);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setPreview(EmptyImage);
    onChange(null);
    if (setFilePath) setFilePath(null);
  };

  return (
    <div style={styles.container}>
      <div style={styles.uploadBox}>
        <div style={styles.previewContainer}>
          <img src={preview} alt="Preview" style={styles.previewImage} />
          {preview !== EmptyImage && (
            <IconButton
              aria-label="Remove image"
              onClick={handleRemove}
              size="small"
              sx={styles.removeButton}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
          <Box sx={styles.editBadge}>
            <PhotoCameraIcon fontSize="small" />
          </Box>
        </div>

        <input
          type="file"
          onChange={handleFile}
          style={styles.fileInput}
          accept="image/*"
        />

        {loading && <div style={styles.loadingOverlay}>Uploading...</div>}
      </div>

      <Dialog open={cropDialogOpen} onClose={handleCancelCrop} fullWidth maxWidth="md">
        <DialogTitle sx={{ pr: 6 }}>
          {t(`crop_image`)}
          <IconButton
            aria-label="Close crop dialog"
            onClick={handleCancelCrop}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon color="error" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={styles.cropShell}>
            {cropSrc && (
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(pixelCrop) => setCompletedCrop(pixelCrop)}
                aspect={aspect}
                minWidth={80}
              >
                <img
                  ref={imageRef}
                  alt="Crop preview"
                  src={cropSrc}
                  onLoad={handleImageLoad}
                  style={{
                    maxHeight: "60vh",
                  }}
                />
              </ReactCrop>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelCrop} color="inherit">
            {t(`cancel`)}
          </Button>
          <Button onClick={handleCropUpload} variant="contained" disabled={loading}>
            {loading ? t(`uploading`) : t(`crop_&_upload`)}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const styles = {
  container: { display: "flex", justifyContent: "center", marginTop: "10px" },
  uploadBox: {
    width: "150px",
    height: "150px",
    border: "2px dashed #aaa",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    cursor: "pointer",
    // backgroundColor: "#f9f9f9",
  },
  previewContainer: { width: "100%", height: "100%", position: "relative" },
  previewImage: { width: "100%", height: "100%", objectFit: "cover" },
  fileInput: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    opacity: 0,
    cursor: "pointer",
    zIndex: 1,
  },
  loadingOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    background: "rgba(255,255,255,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    color: "#555",
  },
  removeButton: {
    position: "absolute",
    top: 6,
    right: 6,
    zIndex: 3,
    backgroundColor: "rgba(0,0,0,0.6)",
    color: "white",
    "&:hover": { backgroundColor: "rgba(0,0,0,0.75)" },
  },
  editBadge: {
    position: "absolute",
    right: 8,
    bottom: 8,
    zIndex: 2,
    width: 32,
    height: 32,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    backgroundColor: "rgba(0,0,0,0.55)",
    pointerEvents: "none",
  },
  cropShell: {
    minHeight: 320,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f7fb",
    borderRadius: 1,
    overflow: "auto",
    p: 2,
  },
};
