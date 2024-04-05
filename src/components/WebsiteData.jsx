import { useState, useEffect } from "react";
import initial_image from "/track.jpg";
import axios from "axios";
import {
  Container,
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

function App() {
  const [tabData, setTabData] = useState({});

  const fetchData = () => {
    chrome.tabs.query({}, (tabs) => {
      const tabUrls = tabs.reduce((result, tab) => {
        result[tab.id] = new URL(tab.url).hostname;
        return result;
      }, {});

      chrome.runtime.sendMessage({ cmd: "getTabTimes" }, (response) => {
        const urlTimes = Object.keys(response).reduce((result, tabId) => {
          const url = tabUrls[tabId];
          if (url) {
            if (!result[url]) {
              result[url] = 0;
            }
            result[url] += response[tabId];
          }
          return result;
        }, {});
        setTabData(urlTimes);
      });
    });
  };

  const sendDataToBackend = async (url, timeTaken) => {
    try {
      const response = await axios.post(
        "http://localhost:8089/api/v1/kapTrack/saveOrUpdate",
        { url, timeTaken }
      );
      console.log("Data sent to backend:", response.data);
    } catch (error) {
      console.error("Error sending data to backend:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000); // fetch every 5 seconds

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, []);

  // Function to generate gradient color based on activity level
  const getColor = (seconds) => {
    const maxSeconds = 60; // Max time (in seconds) for full color spectrum
    const ratio = Math.min(seconds / maxSeconds, 1); // Ensure ratio is between 0 and 1
    const hue = (1 - ratio) * 120; // Convert ratio to hue value
    return `hsl(${hue}, 100%, 50%)`; // Generate color using hue, full saturation, and 50% lightness
  };

  const formatTime = (seconds) => {
    if (seconds < 60) {
      return `${seconds} second${seconds !== 1 ? "s" : ""}`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const remainingMinutes = Math.floor((seconds % 3600) / 60);
      return `${hours} hour${
        hours !== 1 ? "s" : ""
      } ${remainingMinutes} minute${remainingMinutes !== 1 ? "s" : ""}`;
    }
  };

  useEffect(() => {
    // Send data to backend for each tabData entry
    Object.keys(tabData).forEach((url) => {
      sendDataToBackend(url, formatTime(tabData[url]));
    });
  }, [tabData]);

  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        Website Activity Tracker
      </Typography>
      <img
        src={initial_image}
        style={{ width: 300, height: 225 }}
        alt="initial_image"
      />
      <Box>
        <List>
          {Object.keys(tabData).map((url) => (
            <ListItem key={url} divider>
              <ListItemText
                primary={url}
                secondary={formatTime(tabData[url])}
                primaryTypographyProps={{ variant: "h6" }}
                secondaryTypographyProps={{
                  variant: "body1",
                  color: "textSecondary",
                }}
                style={{ color: getColor(tabData[url]) }} // Apply color based on activity level
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
}

export default App;
