import type { Route } from "../+types/test";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Test" },
    { name: "description", content: "Easy to share notes!" },
  ];
}

export default function Test() {
  const chatSocket = new WebSocket(
    "ws://" + import.meta.env.VITE_WS_URL + "/ws/doc/1/"
  );
  function onSend() {
    chatSocket.send(JSON.stringify({ message: "Hello from front" }));
  }
  chatSocket.onmessage = function (e) {
    const data = JSON.parse(e.data);
    console.log(data);
  };
  return (
    <div>
      <input type="text" name="" id="" className="text-2xl" />
      <button onClick={onSend}>Send</button>
    </div>
  );
}
