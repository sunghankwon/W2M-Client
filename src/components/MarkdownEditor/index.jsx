import { useEffect, useRef } from "react";

import { Toolbar } from "../CustomTools/Toolbar";

function MarkdownEditor({
  markdownText,
  setMarkdownText,
  handleEditorScroll,
  editorRef,
}) {
  const historyRef = useRef([markdownText]);
  const historyIndexRef = useRef(0);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.metaKey || event.ctrlKey) {
        if (event.key === "z" && !event.shiftKey) {
          event.preventDefault();
          undo();
        } else if (
          (event.key === "Z" && event.shiftKey) ||
          (event.key === "z" && event.shiftKey)
        ) {
          event.preventDefault();
          redo();
        }
      }
    };

    const textarea = editorRef.current;
    textarea.addEventListener("keydown", handleKeyDown);

    return () => {
      textarea.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const undo = () => {
    const newHistoryIndex = historyIndexRef.current - 1;
    if (newHistoryIndex < 0) return;
    historyIndexRef.current = newHistoryIndex;
    const previousValue = historyRef.current[newHistoryIndex];
    setMarkdownText(previousValue);
  };

  const redo = () => {
    const maxIndex = historyRef.current.length - 1;
    const newHistoryIndex = historyIndexRef.current + 1;
    if (newHistoryIndex > maxIndex) return;
    historyIndexRef.current = newHistoryIndex;
    const nextValue = historyRef.current[newHistoryIndex];
    setMarkdownText(nextValue);
  };

  const handleChange = (event) => {
    const newValue = event.target.value;
    setMarkdownText(newValue);

    if (newValue.endsWith(" ") || newValue.endsWith("\n")) {
      const newHistoryIndex = historyIndexRef.current + 1;
      historyRef.current = historyRef.current.slice(0, newHistoryIndex);
      historyRef.current.push(newValue);
      historyIndexRef.current = newHistoryIndex;
    }
  };

  return (
    <>
      <Toolbar
        editorRef={editorRef}
        markdownText={markdownText}
        setMarkdownText={setMarkdownText}
      />
      <textarea
        value={markdownText}
        onChange={handleChange}
        onScroll={handleEditorScroll}
        ref={editorRef}
        rows="23"
        cols="80"
        className="p-2 mr-10 border border-gray-300 rounded-lg scrollbar-hide"
      />
    </>
  );
}

export default MarkdownEditor;
