import { useMutation } from "@apollo/client/react";
import { IconButton, Stack } from "@mui/material";
import { SquarePen, Trash } from "lucide-react";
import { useState } from "react";


import { useAuth } from "../../Context/AuthContext";

import UseDeleteForm from "../include/useDeleteForm";
import ShiftSessionForm from "./ShiftSessionForm";
import { DELETE_SHIFT_SESSION } from "../../../graphql/mutation";

export default function ShiftSessionAction({
    shiftData,
    shiftId,
    setRefetch,
    t,
    loadings
}) {

    const { setAlert } = useAuth();

    const [open, setOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const [loading, setLoading] = useState(false);

    const [deleteShiftSession] = useMutation(DELETE_SHIFT_SESSION, {
        onCompleted: ({ deleteShiftSession }) => {
            setLoading(false);

            if (deleteShiftSession?.isSuccess) {
                setAlert(true, "success", deleteShiftSession.message);
                setRefetch();
                setOpenDelete(false);
            } else {
                setAlert(true, "error", deleteShiftSession.message);
            }
        },
        onError: (error) => {
            setLoading(false);
            setAlert(true, "error", error.message);
        },
    });

    const handleDelete = () => {

        if (!shiftId) return;

        setLoading(true);

        deleteShiftSession({
            variables: { id: shiftId },
        });
    };

    return (
        <>

            <Stack direction="row" spacing={2}>

                <IconButton onClick={() => setOpen(true)}>
                    <SquarePen size="18px" color="#36BBA7" />
                </IconButton>

                <IconButton onClick={() => setOpenDelete(true)}>
                    <Trash size="18px" color="red" />
                </IconButton>

            </Stack>

            <ShiftSessionForm
                open={open}
                onClose={() => setOpen(false)}
                dialogTitle="Update"
                shiftData={shiftData}
                setRefetch={setRefetch}
                t={t}
                loading={loading}
            />

            <UseDeleteForm
                open={openDelete}
                onClose={() => setOpenDelete(false)}
                handleDelete={handleDelete}
                loading={loading}
            />

        </>
    );
}