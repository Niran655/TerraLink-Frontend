import { useQuery } from "@apollo/client/react";
import { Autocomplete, TextField, Typography } from "@mui/material";
import { useFormikContext } from "formik";

import { translateLauguage } from "../../function/translate";
import { useAuth } from "../../Context/AuthContext";

export default function UseAutocomplete({
  name,
  label,
  placeholder,
  query,
  dataKey,
  valueKey = "_id",
  getOptionLabel,
}) {
  const { values, errors, touched, setFieldValue } = useFormikContext();
  const { data, loading } = useQuery(query);
  const { language } = useAuth();

  const options = data?.[dataKey] || [];

  const selectedValue =
    options.find((item) => item[valueKey] === values[name]) || null;

  return (
    <>
      {label && <Typography variant="body2">{label}</Typography>}
      <Autocomplete
        options={options}
        loading={loading}
        value={selectedValue}
        getOptionLabel={(item) => {
          if (!item) return "";
          return language === "en"
            ? item?.nameEn || item?.nameKh || ""
            : item?.nameKh || item?.nameEn || "";
        }}
        isOptionEqualToValue={(option, value) =>
          option[valueKey] === value[valueKey]
        }
        onChange={(e, newValue) => {
          setFieldValue(name, newValue ? newValue[valueKey] : "");
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={placeholder}
            size="small"
            error={Boolean(touched[name] && errors[name])}
            helperText={touched[name] && errors[name]}
          />
        )}
      />
    </>
  );
}