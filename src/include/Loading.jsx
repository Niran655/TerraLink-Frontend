import React from "react";
import {
  Skeleton,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";

export default function TableSkeleton({ rows = 5 }) {
  // Define how each column should look
  const columns = [
    { width: "90%" }, // Name
    { width: "70%" }, // Category
    { width: "55%" }, // Status
    { circle: true }, // Icon
    { width: "60%" }, // Price
    { width: "50%" }, // Quantity
    { width: "80%" }, // Description
    { width: "45%" }, // Date
    { circle: true }, // Actions
  ];

  return (
    <TableBody>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {columns.map((col, colIndex) => (
            <TableCell key={colIndex}>
              {col.circle ? (
                <Skeleton
                  variant="circular"
                  width={28}
                  height={28}
                  animation="wave"
                />
              ) : (
                <Skeleton
                  variant="rounded"
                  width={col.width}
                  height={24}
                  animation="wave"
                  sx={{ borderRadius: 1 }}
                />
              )}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}