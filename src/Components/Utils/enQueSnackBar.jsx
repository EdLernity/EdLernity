import { enqueueSnackbar } from "notistack";

// SnackbarUtils.js
export const showSnackbar = (message, variant, vertical) => {
  enqueueSnackbar(message, {
    variant: variant,
    anchorOrigin: {
      vertical: vertical || "bottom",
      horizontal: "right",
    },
  });
};