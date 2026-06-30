import React from "react";
import {
  Skeleton,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";

export default function TableSkeleton({ cols = 5, rows = 5 }) {
  // If `cols` is passed as an array (e.g. ['40%', '60%', '20%'] or [{ width: '40%' }, { circle: true }]),
  // use it to define columns directly. If it is a number, generate dynamic default columns.
  const columns = Array.isArray(cols)
    ? cols.map((col) => (typeof col === "object" && col !== null ? col : { width: col }))
    : Array.from({ length: Number(cols) || 5 }).map((_, index) => {
      const totalCols = Number(cols) || 5;
      // If it's the last column and we have multiple columns, make it a circular Actions button
      if (totalCols > 1 && index === totalCols - 1) {
        return { circle: true };
      }

      // Vary the width of standard columns to look like realistic text content
      const widths = ["80%", "65%", "50%", "70%", "55%", "60%"];
      const width = widths[index % widths.length];

      // If we have a lot of columns (7 or more), introduce a circular column in the middle for variation (e.g. status icon or avatar)
      if (totalCols >= 7 && (index === 3 || index === 5)) {
        return { circle: true };
      }

      return { width };
    });

  return (
    <TableBody>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {columns.map((col, colIndex) => {
            const isLast = columns.length > 1 && colIndex === columns.length - 1;
            return (
              <TableCell
                key={colIndex}
                align={isLast ? "right" : "left"}
              >
                {col.circle ? (
                  <Skeleton
                    variant="circular"
                    width={28}
                    height={28}
                    animation="wave"
                    sx={{ ml: isLast ? "auto" : 0 }}
                  />
                ) : (
                  <Skeleton
                    variant="rounded"
                    width={col.width || "100%"}
                    height={24}
                    animation="wave"
                    sx={{
                      borderRadius: 1,
                      ml: isLast ? "auto" : 0
                    }}
                  />
                )}
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </TableBody>
  );
}