import { test, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolCallStatus } from "../ToolCallStatus";
import type { ToolInvocation } from "ai";

vi.mock("lucide-react", () => ({
  Loader2: ({ className }: { className?: string }) => (
    <div data-testid="loader-icon" className={className}>Loader2</div>
  ),
  Check: ({ className }: { className?: string }) => (
    <div data-testid="check-icon" className={className}>Check</div>
  ),
  FilePlus: ({ className }: { className?: string }) => (
    <div data-testid="file-plus-icon" className={className}>FilePlus</div>
  ),
  Eye: ({ className }: { className?: string }) => (
    <div data-testid="eye-icon" className={className}>Eye</div>
  ),
  Pencil: ({ className }: { className?: string }) => (
    <div data-testid="pencil-icon" className={className}>Pencil</div>
  ),
  FileInput: ({ className }: { className?: string }) => (
    <div data-testid="file-input-icon" className={className}>FileInput</div>
  ),
  Undo: ({ className }: { className?: string }) => (
    <div data-testid="undo-icon" className={className}>Undo</div>
  ),
  FileOutput: ({ className }: { className?: string }) => (
    <div data-testid="file-output-icon" className={className}>FileOutput</div>
  ),
  Trash2: ({ className }: { className?: string }) => (
    <div data-testid="trash-icon" className={className}>Trash2</div>
  ),
  Terminal: ({ className }: { className?: string }) => (
    <div data-testid="terminal-icon" className={className}>Terminal</div>
  ),
}));

afterEach(() => {
  cleanup();
});

function makeToolInvocation(
  toolName: string,
  args: Record<string, unknown>,
  state: "partial-call" | "call" | "result"
): ToolInvocation {
  if (state === "result") {
    return {
      toolCallId: "test-id",
      toolName,
      args,
      state: "result",
      result: "Success",
    } as ToolInvocation;
  }
  return {
    toolCallId: "test-id",
    toolName,
    args,
    state,
  } as ToolInvocation;
}

// --- str_replace_editor: create ---

test("shows in-progress message for create command", () => {
  const invocation = makeToolInvocation(
    "str_replace_editor",
    { command: "create", path: "/App.jsx" },
    "call"
  );
  render(<ToolCallStatus toolInvocation={invocation} />);

  expect(screen.getByText("Creating /App.jsx...")).toBeDefined();
  expect(screen.getByTestId("loader-icon")).toBeDefined();
  expect(screen.getByTestId("file-plus-icon")).toBeDefined();
});

test("shows completed message for create command", () => {
  const invocation = makeToolInvocation(
    "str_replace_editor",
    { command: "create", path: "/App.jsx" },
    "result"
  );
  render(<ToolCallStatus toolInvocation={invocation} />);

  expect(screen.getByText("Created /App.jsx")).toBeDefined();
  expect(screen.getByTestId("check-icon")).toBeDefined();
  expect(screen.getByTestId("file-plus-icon")).toBeDefined();
});

// --- str_replace_editor: view ---

test("shows in-progress message for view command", () => {
  const invocation = makeToolInvocation(
    "str_replace_editor",
    { command: "view", path: "/utils.ts" },
    "call"
  );
  render(<ToolCallStatus toolInvocation={invocation} />);

  expect(screen.getByText("Reading /utils.ts...")).toBeDefined();
  expect(screen.getByTestId("eye-icon")).toBeDefined();
});

test("shows completed message for view command", () => {
  const invocation = makeToolInvocation(
    "str_replace_editor",
    { command: "view", path: "/utils.ts" },
    "result"
  );
  render(<ToolCallStatus toolInvocation={invocation} />);

  expect(screen.getByText("Read /utils.ts")).toBeDefined();
  expect(screen.getByTestId("check-icon")).toBeDefined();
});

// --- str_replace_editor: str_replace ---

test("shows in-progress message for str_replace command", () => {
  const invocation = makeToolInvocation(
    "str_replace_editor",
    { command: "str_replace", path: "/App.jsx" },
    "call"
  );
  render(<ToolCallStatus toolInvocation={invocation} />);

  expect(screen.getByText("Editing /App.jsx...")).toBeDefined();
  expect(screen.getByTestId("pencil-icon")).toBeDefined();
});

test("shows completed message for str_replace command", () => {
  const invocation = makeToolInvocation(
    "str_replace_editor",
    { command: "str_replace", path: "/App.jsx" },
    "result"
  );
  render(<ToolCallStatus toolInvocation={invocation} />);

  expect(screen.getByText("Edited /App.jsx")).toBeDefined();
  expect(screen.getByTestId("check-icon")).toBeDefined();
});

// --- str_replace_editor: insert ---

test("shows in-progress message for insert command", () => {
  const invocation = makeToolInvocation(
    "str_replace_editor",
    { command: "insert", path: "/index.tsx" },
    "call"
  );
  render(<ToolCallStatus toolInvocation={invocation} />);

  expect(screen.getByText("Inserting into /index.tsx...")).toBeDefined();
  expect(screen.getByTestId("file-input-icon")).toBeDefined();
});

test("shows completed message for insert command", () => {
  const invocation = makeToolInvocation(
    "str_replace_editor",
    { command: "insert", path: "/index.tsx" },
    "result"
  );
  render(<ToolCallStatus toolInvocation={invocation} />);

  expect(screen.getByText("Inserted into /index.tsx")).toBeDefined();
  expect(screen.getByTestId("check-icon")).toBeDefined();
});

// --- str_replace_editor: undo_edit ---

test("shows in-progress message for undo_edit command", () => {
  const invocation = makeToolInvocation(
    "str_replace_editor",
    { command: "undo_edit", path: "/App.jsx" },
    "call"
  );
  render(<ToolCallStatus toolInvocation={invocation} />);

  expect(screen.getByText("Undoing changes to /App.jsx...")).toBeDefined();
  expect(screen.getByTestId("undo-icon")).toBeDefined();
});

test("shows completed message for undo_edit command", () => {
  const invocation = makeToolInvocation(
    "str_replace_editor",
    { command: "undo_edit", path: "/App.jsx" },
    "result"
  );
  render(<ToolCallStatus toolInvocation={invocation} />);

  expect(screen.getByText("Undid changes to /App.jsx")).toBeDefined();
  expect(screen.getByTestId("check-icon")).toBeDefined();
});

// --- file_manager: rename ---

test("shows in-progress message for rename command", () => {
  const invocation = makeToolInvocation(
    "file_manager",
    { command: "rename", path: "/old.tsx", new_path: "/new.tsx" },
    "call"
  );
  render(<ToolCallStatus toolInvocation={invocation} />);

  expect(screen.getByText("Renaming /old.tsx → /new.tsx...")).toBeDefined();
  expect(screen.getByTestId("file-output-icon")).toBeDefined();
});

test("shows completed message for rename command", () => {
  const invocation = makeToolInvocation(
    "file_manager",
    { command: "rename", path: "/old.tsx", new_path: "/new.tsx" },
    "result"
  );
  render(<ToolCallStatus toolInvocation={invocation} />);

  expect(screen.getByText("Renamed /old.tsx → /new.tsx")).toBeDefined();
  expect(screen.getByTestId("check-icon")).toBeDefined();
});

// --- file_manager: delete ---

test("shows in-progress message for delete command", () => {
  const invocation = makeToolInvocation(
    "file_manager",
    { command: "delete", path: "/temp.ts" },
    "call"
  );
  render(<ToolCallStatus toolInvocation={invocation} />);

  expect(screen.getByText("Deleting /temp.ts...")).toBeDefined();
  expect(screen.getByTestId("trash-icon")).toBeDefined();
});

test("shows completed message for delete command", () => {
  const invocation = makeToolInvocation(
    "file_manager",
    { command: "delete", path: "/temp.ts" },
    "result"
  );
  render(<ToolCallStatus toolInvocation={invocation} />);

  expect(screen.getByText("Deleted /temp.ts")).toBeDefined();
  expect(screen.getByTestId("check-icon")).toBeDefined();
});

// --- Fallback for unknown tool ---

test("shows fallback message for unknown tool", () => {
  const invocation = makeToolInvocation("unknown_tool", {}, "call");
  render(<ToolCallStatus toolInvocation={invocation} />);

  expect(screen.getByText("Running unknown_tool...")).toBeDefined();
  expect(screen.getByTestId("terminal-icon")).toBeDefined();
});

test("shows completed fallback message for unknown tool", () => {
  const invocation = makeToolInvocation("unknown_tool", {}, "result");
  render(<ToolCallStatus toolInvocation={invocation} />);

  expect(screen.getByText("Ran unknown_tool")).toBeDefined();
  expect(screen.getByTestId("check-icon")).toBeDefined();
});

// --- Edge cases ---

test("handles missing args without crashing", () => {
  const invocation = {
    toolCallId: "test-id",
    toolName: "str_replace_editor",
    args: undefined,
    state: "call",
  } as unknown as ToolInvocation;
  render(<ToolCallStatus toolInvocation={invocation} />);

  expect(screen.getByText("Running str_replace_editor...")).toBeDefined();
});

test("handles missing command without crashing", () => {
  const invocation = makeToolInvocation("str_replace_editor", {}, "call");
  render(<ToolCallStatus toolInvocation={invocation} />);

  expect(screen.getByText("Running str_replace_editor...")).toBeDefined();
});

test("treats partial-call state as in-progress", () => {
  const invocation = makeToolInvocation(
    "str_replace_editor",
    { command: "create", path: "/App.jsx" },
    "partial-call"
  );
  render(<ToolCallStatus toolInvocation={invocation} />);

  expect(screen.getByText("Creating /App.jsx...")).toBeDefined();
  expect(screen.getByTestId("loader-icon")).toBeDefined();
});
