import {
  Select,
  MenuItem,
  FormControl,
  Box,
  SelectChangeEvent,
} from "@mui/material";
import { BlogsDurationFilters } from "@/@enums/blog.enum";
import { useRepository } from "@/contexts/RepositoryContext";
import moment from "moment";
import _ from "lodash";
import { useEffect, useState } from "react";

// Array of full month names
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DashboardDataFilters = () => {
  const { dashboardData, setDashboardDataFilters } = useRepository()!;
  const [month, setMonth] = useState<string | undefined>(undefined);
  const [duration, setDuration] = useState<BlogsDurationFilters>(
    BlogsDurationFilters.ALL
  );

  useEffect(() => {
    if (dashboardData?.month && dashboardData.duration) {
      setDuration(dashboardData.duration);
      setMonth(monthNames[dashboardData?.month - 1]);
    } else {
      setDuration(BlogsDurationFilters.ALL);
    }
  }, [dashboardData?.month, dashboardData?.duration]);

  const handleMonthChange = (event: SelectChangeEvent<string>) => {
    const monthIndex = _.findIndex(
      monthNames,
      (month) => month === event.target.value
    );
    setDashboardDataFilters({
      duration: BlogsDurationFilters.MONTHLY,
      month: monthIndex + 1,
    });
  };

  const handleDurationChange = (
    event: SelectChangeEvent<BlogsDurationFilters>
  ) => {
    const durationType = event.target.value as BlogsDurationFilters;
    if (_.isEqual(durationType, BlogsDurationFilters.ALL)) {
      setDashboardDataFilters({
        duration: durationType,
      });
    } else {
      setDuration(BlogsDurationFilters.MONTHLY);
    }
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "end",
        alignItems: "center",
        width: "100%",
        height: "100px",
        gap: 4,
      }}
    >
      <FormControl sx={{ width: "200px" }}>
        <Select
          labelId="duration-label"
          value={duration}
          onChange={handleDurationChange}
        >
          {Object.values(BlogsDurationFilters).map((filter) => (
            <MenuItem key={filter} value={filter}>
              {filter.toUpperCase()}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ width: "200px" }}>
        <Select
          labelId="month-label"
          value={month ?? moment(new Date()).format("MMMM")}
          onChange={handleMonthChange}
          disabled={duration !== BlogsDurationFilters.MONTHLY}
        >
          <MenuItem value="" disabled>
            Choose a month
          </MenuItem>
          {monthNames.map((month, index) => (
            <MenuItem key={index} value={month}>
              {month}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default DashboardDataFilters;
