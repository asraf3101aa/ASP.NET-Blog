import { Container } from "@mui/material";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ToastCloseButton = ({ closeToast }: any) => (
  <Container
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 2,
      mr: 1,
      width: "20%",
      height: "100%",
    }}
    onClick={closeToast}
  >
    <img src="/assets/icons/Divisor.svg" alt="close button" />
    <img src="/assets/icons/Close.svg" alt="close button" />
  </Container>
);
