import Skeleton from "@mui/material/Skeleton";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import * as React from "react";

export default function CircularIndeterminate({ cols = 6, rows = 5 }) {
  return (
    <TableBody>
      {Array.from({ length: rows }).map((_, rIdx) => (
        <TableRow key={rIdx}>
          {Array.from({ length: cols }).map((_, cIdx) => (
            <TableCell key={cIdx}>
              <Skeleton
                variant="text"
                width={cIdx === 0 ? "30%" : cIdx === cols - 1 ? "60%" : "85%"}
                height={24}
                animation="wave"
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}
