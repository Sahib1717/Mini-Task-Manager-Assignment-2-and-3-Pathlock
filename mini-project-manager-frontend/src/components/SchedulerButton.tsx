import React, { useState } from "react";
import { getRecommendedOrder, TaskInput } from "../services/scheduler";

interface Props {
  projectId: number;
  getTasks: () => TaskInput[];
}

const SchedulerButton: React.FC<Props> = ({ projectId, getTasks }) => {
  const [order, setOrder] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSchedule = async () => {
    setLoading(true);
    try {
      const tasks = getTasks();
      const recommended = await getRecommendedOrder(projectId, tasks);
      setOrder(recommended);
    } catch (err) {
      console.error(err);
      alert("Error getting schedule. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: "10px" }}>
      <button
        onClick={handleSchedule}
        disabled={loading}
        style={{
          backgroundColor: "#007bff",
          color: "white",
          padding: "8px 16px",
          borderRadius: "6px",
          border: "none",
          cursor: "pointer",
        }}
      >
        {loading ? "Scheduling..." : "Auto-Schedule Tasks"}
      </button>

      {order.length > 0 && (
        <div style={{ marginTop: "15px" }}>
          <h4>Recommended Task Order:</h4>
          <ol>
            {order.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default SchedulerButton;
