import { useEffect, useRef, RefObject, ChangeEvent, UIEvent } from "react";
import { Toolbar } from "../CustomTools/Toolbar";
import useMarkdownTextStore from "../../store/useMarkdownText";
import useMarkdownHistory from "../../hooks/useMarkdownHistory";
import handleEditorScrollSync from "../../utils/handleEditorScrollSync";
import handleKeyDown from "../../utils/handleKeyDown";

interface MarkdownEditorProps {
  handleEditorScroll: (event: UIEvent<HTMLTextAreaElement>) => void;
  editorRef: RefObject<HTMLTextAreaElement>;
  previewRef: RefObject<HTMLDivElement>;
  isProgrammaticScroll: React.MutableRefObject<boolean>;
}

const MarkdownEditor = ({
  handleEditorScroll,
  editorRef,
  previewRef,
  isProgrammaticScroll,
}: MarkdownEditorProps) => {
  const { markdownText, setMarkdownText } = useMarkdownTextStore();
  const { undo, redo, updateHistory, lastEditPositionRef } = useMarkdownHistory(
    markdownText,
    setMarkdownText,
    editorRef,
  );
  const isHistoryUpdating = useRef<boolean>(false);

  useEffect(() => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const keyDownHandler = (event: KeyboardEvent) =>
      handleKeyDown(event, undo, redo);

    textarea.addEventListener("keydown", keyDownHandler);

    return () => {
      textarea.removeEventListener("keydown", keyDownHandler);
    };
  }, [undo, redo, editorRef]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    setMarkdownText(newValue);
    handleEditorScrollSync(
      editorRef,
      previewRef,
      isProgrammaticScroll,
      newValue,
    );

    if (newValue.endsWith(" ") || newValue.endsWith("\n")) {
      updateHistory(newValue);
      isHistoryUpdating.current = false;
      lastEditPositionRef.current = event.target.scrollTop;
    } else {
      if (!isHistoryUpdating.current) {
        updateHistory(newValue);
        isHistoryUpdating.current = true;
      } else {
        updateHistory(newValue, true);
      }
      lastEditPositionRef.current = event.target.scrollTop;
    }
  };

  return (
    <>
      <Toolbar editorRef={editorRef} updateHistory={updateHistory} />
      <textarea
        value={markdownText}
        onChange={handleChange}
        onScroll={handleEditorScroll}
        ref={editorRef}
        rows={23}
        cols={80}
        className="p-2 mr-10 border border-gray-300 rounded-b-lg focus:border-gray-300 focus:outline-none editor-textarea"
      />
    </>
  );
};

export default MarkdownEditor;
