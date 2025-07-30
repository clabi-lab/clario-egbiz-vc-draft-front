import { styled, TextField, TextFieldProps } from "@mui/material";

const RoundedField = styled(TextField)({
  "& label.Mui-focused": {
    borderRadius: "32px",
  },
  "& .MuiInput-underline:after": {
    borderRadius: "32px",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderRadius: "32px",
    },
    "&:hover fieldset": {
      borderRadius: "32px",
    },
    "&.Mui-focused fieldset": {
      borderRadius: "32px",
    },
  },
});

const RoundedTextField = (props: TextFieldProps) => {
  return <RoundedField {...props} />;
};

export default RoundedTextField;
