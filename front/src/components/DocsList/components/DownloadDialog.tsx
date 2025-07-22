import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import SpinnerDownload from "~/components/ui/spinners/SpinnerDownload";

type incomingProps = {
  uid: string;
  name: string;
};

export default function DownloadDialog({ uid, name }: incomingProps) {
  const [selected, setSelected] = useState<string>("");
  const [downloadLoading, setDownloadLoading] = useState(false);
  function handleOnDownload() {
    if (selected === "") {
      toast("Select download format");
      return;
    }
    downloadPDF(selected);
  }

  function downloadPDF(format: string) {
    const token = localStorage.getItem("access")
      ? "Bearer " + localStorage.getItem("access")
      : "";
    setDownloadLoading(true);
    fetch(`http://localhost:8000/api/docs/download/${format}/${uid}`, {
      method: "GET",
      headers: {
        Authorization: token, // if using JWT
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${name}.${format}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        setDownloadLoading(false);
      })
      .catch((err) => console.error("Download error:", err));
  }
  return (
    <div className="flex flex-row gap-5 w-[50px]">
      <Select onValueChange={setSelected}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Download format" className="text-black" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pdf">PDF</SelectItem>
          <SelectItem value="docx">Docx</SelectItem>
          <SelectItem value="markdown">Markdown</SelectItem>
          <SelectItem value="json">JSON</SelectItem>
        </SelectContent>
      </Select>
      {downloadLoading ? (
        <Button disabled={true}>
          <SpinnerDownload /> Loading...
        </Button>
      ) : (
        <Button onClick={handleOnDownload}>Download</Button>
      )}
    </div>
  );
}
