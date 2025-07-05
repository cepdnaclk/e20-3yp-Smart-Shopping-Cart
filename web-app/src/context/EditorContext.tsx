import { createContext, useState, ReactNode } from "react";

/**
 * EditorContext controls all of the editors.
 * Manages multiple editor states with a unified toggle method.
 */

type EditorKey = "inventory" | "layout" | "itemMap" | null;

interface EditorContextType {
  editorStates: Record<Exclude<EditorKey, null>, boolean>;
  toggleEditor: (editor: Exclude<EditorKey, null>) => void;
  activeEditor: EditorKey;
}

export const EditorContext = createContext<EditorContextType | undefined>(
  undefined
);

export const EditorProvider = ({ children }: { children: ReactNode }) => {
  const [editorStates, setEditorStates] = useState<
    Record<Exclude<EditorKey, null>, boolean>
  >({
    inventory: true,
    layout: false,
    itemMap: false,
  });

  const [activeEditor, setActiveEditor] = useState<EditorKey>("inventory");

  const toggleEditor = (editor: Exclude<EditorKey, null>) => {
    setEditorStates((prev) => {
      const isOpening = !prev[editor];
      return {
        inventory: false,
        layout: false,
        itemMap: false,
        [editor]: isOpening,
      };
    });
    setActiveEditor(editor);
  };

  return (
    <EditorContext.Provider
      value={{ editorStates, toggleEditor, activeEditor }}
    >
      {children}
    </EditorContext.Provider>
  );
};
