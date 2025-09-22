import { useEffect, useRef, useState } from "react";
import SimpleRichTextEditor from "~/components/edit/editHero";
import EditorNavBar from "~/components/edit/EditorNavBar";
import { useNavigate, useParams } from "react-router";
import useGetData from "~/hooks/useGetData";
import type { dataType, updateDataType } from "~/types/docTypes.tsx";
import SpinnerPageLoading from "@/components/ui/spinners/SpinnerPageLoading";
import usePostData from "@/hooks/usePostData";
import { toast } from "sonner";


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
  const [isSaving, setIsSaving] = useState(false);
  const updateDataRef = useRef(updateData);
  const stocketStatusRef = useRef(socketStatus);
  const liveSocketRef = useRef<WebSocket | null>(null);
  const getData = useGetData();
  const postData = usePostData();
  const navigate = useNavigate();

  const closeSocketConnection = () => {
    if (liveSocketRef.current) {
      liveSocketRef.current.send(
        JSON.stringify({
        type: "disconnect",
        id: id,
        name: updateDataRef.current.title,
        content: updateDataRef.current.content,
        })
      )
      liveSocketRef.current.close();
    }
  }

  const handleManualSave = async () => {
    setIsSaving(true)
    const res = await postData("docs/save", {"uid": doc.uid, "title": updateDataRef.current.title, "content": updateDataRef.current.content})
    if (res.data?.success) {
      toast("Doc saved successfully")
    } else {
      toast("Something went wrong")
    }
    setIsSaving(false)
  }

  useEffect(() => {
    updateDataRef.current = updateData;
  }, [updateData]);

  useEffect(() => {
    stocketStatusRef.current = socketStatus;
  }, [socketStatus]);

  useEffect(() => {
    if (doc.access != -1) {
      const socketUrl = import.meta.env.VITE_DEBUG === "True" ? import.meta.env.VITE_BACKEND_URL_DEBUG : import.meta.env.VITE_BACKEND_URL;
      const liveSocket = new WebSocket(
        socketUrl + `/ws/doc/${id}/`
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
            setUpdateData(prev => ({...prev, flag: false }));
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
        if (result.data.access === -1) {
          localStorage.setItem(
            "showToast",
            "You do not have access to this Doc"
          );
          navigate("/");
        }
        setDoc(result.data);
        setUpdateData(result.data);
        setIsLoading(false);
      }
      getContent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  return (
    <div className="flex flex-col w-full h-full bg-gray-200 gap-2">
      {isLoading ? (
        <div className="h-10 w-10"><SpinnerPageLoading /></div>
      ) : (
        <>
          <EditorNavBar
            doc={doc}
            socketStatus={socketStatus}
            updateData={updateData}
            setUpdateData={setUpdateData}
            onlineUsers={onlineUsers}
            closeSocket={closeSocketConnection}
            handleManualSave={handleManualSave}
            isSaving={isSaving}
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
