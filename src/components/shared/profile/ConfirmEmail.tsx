import { RoutePath } from "@/@enums/router.enum";
import { useRepository } from "@/contexts/RepositoryContext";
import { useRouter } from "@/contexts/RouterContext";
import { useStorage } from "@/contexts/StorageContext";
import { CheckCircleOutline, Close, HighlightOff } from "@mui/icons-material";
import {
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ErrorToast } from "../toasts/ErrorToast";

const ConfirmEmail = () => {
  const params = useSearchParams();
  const token = params[0].get("token");
  const email = params[0].get("email");

  const { isLoading, setIsLoading, accountRepository } = useRepository()!;
  const [isConfirmed, setIsConfirmed] = useState<boolean | undefined>(
    undefined
  );
  const localStorageClient = useStorage()!;
  const accessToken = localStorageClient.getAccessToken();
  const { handleRedirect } = useRouter()!;

  useEffect(() => {
    if (isConfirmed) {
      return;
    }
    if (!accessToken) {
      handleRedirect(RoutePath.LOGIN);
    }
    if (email && token) {
      setIsLoading(true);
      accountRepository
        .getProfile()
        .then((profileResponse) => {
          if ("emailConfirmed" in profileResponse) {
            if (profileResponse.emailConfirmed === false) {
              accountRepository
                .confirmEmail(token, email)
                .then((confirmationResponse) => {
                  if (typeof confirmationResponse === "string") {
                    setIsConfirmed(true);
                  } else {
                    setIsConfirmed(false);
                    console.error(confirmationResponse);
                  }
                });
            } else {
              setIsConfirmed(true);
            }
          }
        })
        .catch((error) => {
          console.error(error);
          ErrorToast({ Message: "Something went wrong!" });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [
    isConfirmed,
    accountRepository,
    email,
    setIsLoading,
    token,
    accessToken,
    handleRedirect,
  ]);

  const onClose = () => handleRedirect(RoutePath.HOME);

  return isLoading || isConfirmed === undefined ? (
    <Container
      sx={{
        height: "50vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img src="/assets/icons/Loading.svg" alt="LoadingIcon" />
    </Container>
  ) : (
    <Dialog open={!isLoading && isConfirmed !== undefined} onClose={onClose}>
      <DialogTitle sx={{ px: 8 }}>
        Email Confirmation
        <IconButton
          aria-label="close"
          onClick={onClose}
          style={{ position: "absolute", right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack
          justifyContent="center"
          alignItems="center"
          spacing={2}
          style={{ minHeight: "150px" }}
        >
          {isConfirmed ? (
            <>
              <CheckCircleOutline color="success" style={{ fontSize: 64 }} />
              <Typography variant="body1">Email Confirmed</Typography>
            </>
          ) : (
            <>
              <HighlightOff color="error" style={{ fontSize: 64 }} />
              <Typography variant="body1">Email Not Confirmed</Typography>
            </>
          )}
        </Stack>
      </DialogContent>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        style={{ padding: "16px" }}
      >
        <Button variant="contained" color="primary" onClick={onClose}>
          Return to Home
        </Button>
      </Stack>
    </Dialog>
  );
};
export default ConfirmEmail;
