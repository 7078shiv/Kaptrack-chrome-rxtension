import { useState } from "react";
import "./App.css";
import WebsiteData from "./components/WebsiteData";
import FrontPage from "./components/FrontPage";

function App() {
  const [currentPage, setCurrentPage] = useState("frontpage");

  const goToWebsiteData = () => {
    setCurrentPage("websiteData");
  };

  return (
    <>
      {currentPage === "frontpage" && (
        <FrontPage goToWebsiteData={goToWebsiteData} />
      )}
      {currentPage === "websiteData" && <WebsiteData />}
    </>
  );
}

export default App;
