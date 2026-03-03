import type { ToolInvocation } from "ai";
import {
  Loader2,
  Check,
  FilePlus,
  Eye,
  Pencil,
  FileInput,
  Undo,
  FileOutput,
  Trash2,
  Terminal,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ToolCallStatusProps {
  toolInvocation: ToolInvocation;
}

interface ToolMessage {
  inProgress: string;
  completed: string;
  icon: LucideIcon;
}

function getToolMessage(toolInvocation: ToolInvocation): ToolMessage {
  const { toolName, args } = toolInvocation;
  const command = args?.command as string | undefined;
  const path = args?.path as string | undefined;
  const newPath = args?.new_path as string | undefined;

  if (toolName === "str_replace_editor") {
    switch (command) {
      case "create":
        return {
          inProgress: `Creating ${path ?? "file"}...`,
          completed: `Created ${path ?? "file"}`,
          icon: FilePlus,
        };
      case "view":
        return {
          inProgress: `Reading ${path ?? "file"}...`,
          completed: `Read ${path ?? "file"}`,
          icon: Eye,
        };
      case "str_replace":
        return {
          inProgress: `Editing ${path ?? "file"}...`,
          completed: `Edited ${path ?? "file"}`,
          icon: Pencil,
        };
      case "insert":
        return {
          inProgress: `Inserting into ${path ?? "file"}...`,
          completed: `Inserted into ${path ?? "file"}`,
          icon: FileInput,
        };
      case "undo_edit":
        return {
          inProgress: `Undoing changes to ${path ?? "file"}...`,
          completed: `Undid changes to ${path ?? "file"}`,
          icon: Undo,
        };
    }
  }

  if (toolName === "file_manager") {
    switch (command) {
      case "rename":
        return {
          inProgress: `Renaming ${path ?? "file"} → ${newPath ?? "new file"}...`,
          completed: `Renamed ${path ?? "file"} → ${newPath ?? "new file"}`,
          icon: FileOutput,
        };
      case "delete":
        return {
          inProgress: `Deleting ${path ?? "file"}...`,
          completed: `Deleted ${path ?? "file"}`,
          icon: Trash2,
        };
    }
  }

  return {
    inProgress: `Running ${toolName}...`,
    completed: `Ran ${toolName}`,
    icon: Terminal,
  };
}

export function ToolCallStatus({ toolInvocation }: ToolCallStatusProps) {
  const isCompleted = toolInvocation.state === "result";
  const message = getToolMessage(toolInvocation);
  const Icon = message.icon;

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-sans border border-neutral-200">
      {isCompleted ? (
        <Check className="w-3 h-3 text-emerald-500" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
      )}
      <Icon className="w-3 h-3 text-neutral-500" />
      <span className="text-neutral-700">
        {isCompleted ? message.completed : message.inProgress}
      </span>
    </div>
  );
}
