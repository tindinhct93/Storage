import { Typography } from "@mui/material";
import React from "react";

export const TypoTitleValue = (props) => {
  const { title = null, value = null } = props;
  return (
    <>
      <Typography variant="h5">{title}</Typography>
      {":"}
      <Typography variant="body">{value}</Typography>
    </>
  );
};
