import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link,
  Image,
  X,
} from "lucide-react";
import { useParams } from "react-router";
import type { dataType, updateDataType } from "~/types/docTypes.tsx";

type incomingProps = {
  doc: dataType;
  updateData: updateDataType;
  setUpdateData: Dispatch<SetStateAction<updateDataType>>;
};

const SimpleRichTextEditor = ({
  doc,
  updateData,
  setUpdateData,
}: incomingProps) => {
  const { id } = useParams<{ id: string }>();
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
  });
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");

  const checkFormatting = useCallback(() => {
    if (!editorRef.current) return;
    const selection = window.getSelection();
    if (selection!.rangeCount > 0) {
      setActiveFormats({
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
        underline: document.queryCommandState("underline"),
      });
    }
  }, []);

  const handleCommand = (command: string, value: string | null = null) => {
    document.execCommand(command, false, value!);
    editorRef.current?.focus();
    checkFormatting();
  };

  useEffect(() => {
    if (doc && editorRef.current) {
      editorRef.current.innerHTML = doc.content || "";
    }
  }, [doc]);

  const handleKeyUp = () => {
    checkFormatting();
  };

  const handleMouseUp = () => {
    checkFormatting();
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    // Optional: You can track content changes here
    if (doc) {
      const newData = {
        ...updateData,
        content: e.currentTarget.innerHTML,
        flag: true,
      };
      setUpdateData(newData);
    }
  };

  const clearContent = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
      editorRef.current.focus();
    }
  };

  const insertLink = () => {
    const selection = window.getSelection();
    if (selection!.rangeCount > 0) {
      const selectedText = selection!.toString();
      setLinkText(selectedText || "");
      setLinkUrl("");
      setShowLinkModal(true);
    } else {
      setLinkText("");
      setLinkUrl("");
      setShowLinkModal(true);
    }
  };

  const confirmLink = () => {
    if (linkUrl) {
      const selection = window.getSelection();
      if (linkText && selection!.rangeCount === 0) {
        // Insert new link with text
        document.execCommand(
          "insertHTML",
          false,
          `<a href="${linkUrl}" target="_blank">${linkText}</a>`
        );
      } else if (selection!.rangeCount > 0 && editorRef.current) {
        // Create link from selected text
        document.execCommand("createLink", false, linkUrl);
        // Add target="_blank" to the created link
        const links = editorRef.current.querySelectorAll(
          'a[href="' + linkUrl + '"]'
        );
        links.forEach((link) => link.setAttribute("target", "_blank"));
      }
      setShowLinkModal(false);
      setLinkUrl("");
      setLinkText("");
      editorRef.current?.focus();
    }
  };

  const insertImage = () => {
    setImageUrl("");
    setImageAlt("");
    setShowImageModal(true);
  };

  const confirmImage = () => {
    if (imageUrl) {
      const imgTag = `<img src="${imageUrl}" alt="${imageAlt}" style="max-width: 100%; height: auto; display: block; margin: 10px 0;" />`;
      document.execCommand("insertHTML", false, imgTag);
      setShowImageModal(false);
      setImageUrl("");
      setImageAlt("");
      editorRef.current?.focus();
    }
  };

  const closeModal = () => {
    setShowLinkModal(false);
    setShowImageModal(false);
    setLinkUrl("");
    setLinkText("");
    setImageUrl("");
    setImageAlt("");
  };
  const iconSize = 24;
  return (
    <div className="max-w-7xl w-full mx-auto h-full">
      <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm bg-white text-black h-full">
        {/* Toolbar */}
        <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-50 flex-wrap">
          {/* Text Formatting */}
          <button
            onClick={() => handleCommand("bold")}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              activeFormats.bold ? "bg-blue-200 text-blue-800" : ""
            }`}
            type="button"
            title="Bold (Ctrl+B)"
          >
            <Bold size={iconSize} />
          </button>

          <button
            onClick={() => handleCommand("italic")}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              activeFormats.italic ? "bg-blue-200 text-blue-800" : ""
            }`}
            type="button"
            title="Italic (Ctrl+I)"
          >
            <Italic size={iconSize} />
          </button>

          <button
            onClick={() => handleCommand("underline")}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              activeFormats.underline ? "bg-blue-200 text-blue-800" : ""
            }`}
            type="button"
            title="Underline (Ctrl+U)"
          >
            <Underline size={iconSize} />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2" />

          {/* Links and Images */}
          <button
            onClick={insertLink}
            className="p-2 rounded hover:bg-gray-200 transition-colors"
            type="button"
            title="Insert Link"
          >
            <Link size={iconSize} />
          </button>

          <button
            onClick={insertImage}
            className="p-2 rounded hover:bg-gray-200 transition-colors"
            type="button"
            title="Insert Image"
          >
            <Image size={iconSize} />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2" />

          {/* Text Alignment */}
          <button
            onClick={() => handleCommand("justifyLeft")}
            className="p-2 rounded hover:bg-gray-200 transition-colors"
            type="button"
            title="Align Left"
          >
            <AlignLeft size={iconSize} />
          </button>

          <button
            onClick={() => handleCommand("justifyCenter")}
            className="p-2 rounded hover:bg-gray-200 transition-colors"
            type="button"
            title="Align Center"
          >
            <AlignCenter size={iconSize} />
          </button>

          <button
            onClick={() => handleCommand("justifyRight")}
            className="p-2 rounded hover:bg-gray-200 transition-colors"
            type="button"
            title="Align Right"
          >
            <AlignRight size={iconSize} />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2" />

          {/* Lists */}
          <button
            onClick={() => handleCommand("insertUnorderedList")}
            className="p-2 rounded hover:bg-gray-200 transition-colors"
            type="button"
            title="Bullet List"
          >
            <List size={iconSize} />
          </button>

          <button
            onClick={() => handleCommand("insertOrderedList")}
            className="p-2 rounded hover:bg-gray-200 transition-colors"
            type="button"
            title="Numbered List"
          >
            <ListOrdered size={iconSize} />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2" />

          {/* Font Size */}
          <select
            onChange={(e) => handleCommand("fontSize", e.currentTarget.value)}
            className="px-2 py-1 border border-gray-300 rounded text-md"
            defaultValue="3"
          >
            <option value="1">Small</option>
            <option value="3">Normal</option>
            <option value="5">Large</option>
            <option value="7">Extra Large</option>
          </select>

          <div className="w-px h-6 bg-gray-300 mx-2" />

          {/* Clear Button */}
          <button
            onClick={clearContent}
            className="px-3 py-1 text-md bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            type="button"
          >
            Clear
          </button>
        </div>
        {/* disabled=} */}
        {/* Editor */}
        <div
          ref={editorRef}
          contentEditable={doc.access === 0 ? false : true}
          className="min-h-[300px] p-4 outline-none"
          defaultValue={id ? "Loading..." : ""}
          style={{ lineHeight: "1.6", direction: "ltr" }}
          onKeyUp={handleKeyUp}
          onMouseUp={handleMouseUp}
          onInput={handleInput}
          suppressContentEditableWarning={true}
        />
      </div>

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Insert Link</h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link URL
                </label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link Text (optional)
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Click here"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={confirmLink}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={!linkUrl}
              >
                Insert Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Insert Image</h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alt Text (optional)
                </label>
                <input
                  type="text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="Description of the image"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {imageUrl && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preview
                  </label>
                  <img
                    src={imageUrl}
                    alt={imageAlt}
                    className="max-w-full h-32 object-contain border rounded"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={confirmImage}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={!imageUrl}
              >
                Insert Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleRichTextEditor;
