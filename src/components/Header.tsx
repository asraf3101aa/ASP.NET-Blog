import * as React from "react";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

export default function Header(props: { title: string }) {
  return (
    <React.Fragment>
      <Toolbar sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Typography
          component="h2"
          variant="h5"
          color="inherit"
          align="center"
          noWrap
          sx={{ flex: 1 }}
        >
          {props.title}
        </Typography>
        <Button variant="outlined" size="small">
          <Link href="/login" underline="none">
            Sign in
          </Link>
        </Button>
      </Toolbar>
    </React.Fragment>
  );
}
