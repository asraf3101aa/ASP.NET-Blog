import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import UsersIcon from "@mui/icons-material/People";

type DashboardTileProps = {
  title: string;
  value: string;
};

const DashboardTile = ({ value, title }: DashboardTileProps) => {
  return (
    <Card sx={{ height: "100%", backgroundColor: "#1976d2", color: "white" }}>
      <CardContent>
        <Stack spacing={2}>
          <Stack
            direction="row"
            sx={{ alignItems: "flex-start", justifyContent: "space-between" }}
            spacing={3}
          >
            <Stack spacing={1}>
              <Typography variant="overline">{title}</Typography>
              <Typography variant="h4">{value}</Typography>
            </Stack>
            <Avatar
              sx={{
                backgroundColor: "var(--mui-palette-success-main)",
                height: "56px",
                width: "56px",
              }}
            >
              <UsersIcon />
            </Avatar>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DashboardTile;
