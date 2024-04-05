
import initial_image from "/track.jpg";
import { Button } from "@mui/material";
import { Switch } from "@mui/material";

export default function FrontPage({ goToWebsiteData }) {
  const handelOnClick = () => {
      goToWebsiteData();
  };



  return (
    <div style={{ width: 500, height: 500 }}>
      <h1>Welcome to Web Activity Time Tracker</h1>
      <img
        src={initial_image}
        style={{ width: 300, height: 225 }}
        alt="initial_image"
      />
      <p>
        Web Activity Time Tracker is open-source, free, and ad-free extension,
        which can help you track the time you spent browsing websites and the
        count of visits.
      </p>
      {/* <Button variant="contained" onClick={handelOnClick}>
        Next
      </Button> */}
      <Switch
        onChange={handelOnClick}
        inputProps={{ "aria-label": "controlled" }}
      />
    </div>
  );
}
