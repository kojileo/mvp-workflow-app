import React from "react";
import styles from "../styles/Sidebar.module.css";

interface SidebarProps {
  onAddNode: (type: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onAddNode }) => {
  const nodeTypes = ["トリガー", "アクション", "条件", "ループ"];

  return (
    <aside className={styles.sidebar}>
      <h3 className={styles.title}>ノードタイプ</h3>
      {nodeTypes.map((type) => (
        <div
          key={type}
          className={styles.nodeType}
          onClick={() => onAddNode(type)}
        >
          {type}
        </div>
      ))}
    </aside>
  );
};

export default Sidebar;
