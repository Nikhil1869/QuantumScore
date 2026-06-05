import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5001");

export default function Live() {
  const [data, setData] = useState(null);

  useEffect(() => {
    socket.on("live_prediction", setData);
  }, []);

  return (
    <div className="p-10">
      <h1>Live Predictions</h1>
      {data && (
        <div>
          <h2>{data.match}</h2>
          <p>Winner: {data.winner}</p>
          <p>Confidence: {data.confidence}</p>
        </div>
      )}
    </div>
  );
}
