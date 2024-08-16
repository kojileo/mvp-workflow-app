import React, { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import {
  Zap,
  Play,
  GitBranch,
  Repeat,
  FileInput,
  Flag,
  FileText,
} from "lucide-react";
import styles from "../styles/CustomNode.module.css";

const iconMap: { [key: string]: React.ElementType } = {
  trigger: Zap,
  action: Play,
  condition: GitBranch,
  loop: Repeat,
  inputFile: FileInput,
  end: Flag,
  summarize: FileText,
};

const CustomNode = ({ data }: NodeProps) => {
  const Icon = iconMap[data.type] || Play;

  return (
    <div className={`${styles.customNode} ${styles[data.type]}`}>
      <Handle type="target" position={Position.Top} className={styles.handle} />
      <div className={styles.content}>
        <Icon className={styles.icon} />
        <div className={styles.title}>{data.label}</div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className={styles.handle}
      />
    </div>
  );
};

export default memo(CustomNode);
