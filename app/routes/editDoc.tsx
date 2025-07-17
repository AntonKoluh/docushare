import { useEffect, useRef, useState } from "react";
import SimpleRichTextEditor from "~/components/edit/editHero";
import EditorNavBar from "~/components/edit/EditorNavBar";
import { useNavigate, useParams } from "react-router";
import useGetData from "~/hooks/useGetData";
import type { dataType, updateDataType } from "~/types/docTypes.tsx";

export function meta() {
  return [
    { title: "Edit" },
    { name: "description", content: "Easy to share notes!" },
  ];
}

const emptyDoc = {
  id: null,
  uid: null,
  title: "New Document",
  content: "",
  access: 0,
};

function generateShortId(): string {
  return Math.random().toString(36).substring(2, 7); // base36 = [0-9a-z]
}

const FileListRoute = () => {
  const { id } = useParams<{ id: string }>();
  const [socketStatus, setSocketStatus] = useState(0);
  const [isLoading, setIsLoading] = useState(id ? true : false);
  const [doc, setDoc] = useState<dataType>(emptyDoc);
  const [updateData, setUpdateData] = useState<updateDataType>({
    ...emptyDoc,
    flag: false,
  });
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const updateDataRef = useRef(updateData);
  const stocketStatusRef = useRef(socketStatus);
  const liveSocketRef = useRef<WebSocket | null>(null);
  const getData = useGetData();
  const navigate = useNavigate();

  function closeSocketConnection() {
    if (liveSocketRef.current) {
      liveSocketRef.current.close();
    }
  }

  useEffect(() => {
    updateDataRef.current = updateData;
  }, [updateData]);

  useEffect(() => {
    stocketStatusRef.current = socketStatus;
  }, [socketStatus]);

  useEffect(() => {
    if (doc.access != -1) {
      const liveSocket = new WebSocket(
        "ws://" + import.meta.env.VITE_WS_URL + `/ws/doc/${id}/`
      );
      liveSocketRef.current = liveSocket;
      liveSocket.onmessage = function (e) {
        const data = JSON.parse(e.data);
        if (data.type === "user.update") {
          setOnlineUsers(data.users);
        }
        if (data.type === "msg") {
          setDoc({ ...doc, title: data.name, content: data.content });
        }
      };
      liveSocket.onopen = () => {
        const getUser = JSON.parse(localStorage.getItem("user") || "{}");
        const username = getUser.email
          ? getUser.email
          : "Guest-" + generateShortId();
        setSocketStatus(1);
        liveSocket.send(
          JSON.stringify({
            type: "init",
            username: username,
          })
        );
      };
      liveSocket.onerror = () => {
        setSocketStatus(2);
      };
      if (doc.access === 1) {
        const updateWebSocket = setInterval(() => {
          if (updateDataRef.current.flag && stocketStatusRef.current === 1) {
            liveSocket.send(
              JSON.stringify({
                type: "msg",
                id: id,
                name: updateDataRef.current.title,
                content: updateDataRef.current.content,
              })
            );
            setUpdateData((prev) => ({ ...prev, flag: false }));
          }
        }, 2000);

        return () => clearInterval(updateWebSocket);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc.access]);

  useEffect(() => {
    if (id) {
      async function getContent() {
        const result = await getData("docs/" + id);
        console.log(result);
        if (result.data.access === -1) {
          localStorage.setItem(
            "showToast",
            "You do not have access to this Doc"
          );
          navigate("/");
        }
        setDoc(result.data);
        setIsLoading(false);
      }
      getContent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  return (
    <div className="flex flex-col w-full h-full bg-gray-200 gap-2">
      {isLoading ? (
        <h1>Loading.... </h1>
      ) : (
        <>
          <EditorNavBar
            doc={doc}
            socketStatus={socketStatus}
            updateData={updateData}
            setUpdateData={setUpdateData}
            onlineUsers={onlineUsers}
            closeSocket={closeSocketConnection}
          />
          <SimpleRichTextEditor
            doc={doc}
            updateData={updateData}
            setUpdateData={setUpdateData}
          />
        </>
      )}
    </div>
  );
};

export default FileListRoute;
