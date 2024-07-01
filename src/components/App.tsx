import { Routes, Route } from "react-router-dom";

import Header from "./Header";
import DocxUploader from "./DocxUploader/DocxUploader.jsx";
import MarkdownConvert from "./MarkdownConvert/MarkdownConvert.jsx";

const App = (): JSX.Element => {
  return (
    <div className="flex flex-col items-center w-full mx-auto max-w-screen-2xl">
      <Header />
      <Routes>
        <Route path="/" element={<DocxUploader />} />
        <Route path="/convert-markdown" element={<MarkdownConvert />} />
      </Routes>
    </div>
  );
};

export default App;
