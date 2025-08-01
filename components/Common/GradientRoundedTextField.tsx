import { styled, TextField, TextFieldProps } from "@mui/material";

const GradientWrapper = styled("div")({
  padding: "1px",
  borderRadius: "32px",
  marginTop: "1rem",
  background: "linear-gradient(0deg, #005CA4 0%, #CEE2FF 100%)",
});

const InnerField = styled(TextField)({
  borderRadius: "30px",
  backgroundColor: "white",
  width: "100%",
  "& .MuiOutlinedInput-root": {
    borderRadius: "30px",
    backgroundColor: "white",
    "& fieldset": {
      borderColor: "transparent",
    },
    "&:hover fieldset": {
      borderColor: "transparent",
    },
    "&.Mui-focused fieldset": {
      borderColor: "transparent",
    },
  },
});

const GradientRoundedTextField = (props: TextFieldProps) => {
  return (
    <GradientWrapper>
      <InnerField {...props} />
    </GradientWrapper>
  );
};

export default GradientRoundedTextField;
