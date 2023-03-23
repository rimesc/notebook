import { useEffect, useState } from 'react';
import NameChooser from './NameChooser';

export default function RenameNote() {
  const [folder, setFolder] = useState<string | undefined>(undefined);
  const [originalName, setOriginalName] = useState<string | undefined>(undefined);
  const [files, setFiles] = useState<string[] | undefined>(undefined);

  useEffect(() => {
    return window.electron.onInitRenameNoteDialog((parentFolder, note) => {
      setFolder(parentFolder);
      setOriginalName(note);
    });
  }, []);

  useEffect(() => {
    const loadNotes = async () => {
      if (folder) {
        setFiles((await window.electron.listNotes(folder)).map((name) => name.toLowerCase()));
      }
    };
    loadNotes();
  }, [folder]);

  const handleSubmit = (name: string) => {
    if (folder && originalName) {
      window.electron.renameNote(folder, originalName, name);
      window.electron.closeDialog();
    }
  };

  const validateName = (name: string) => {
    if (originalName && name === originalName) {
      return true;
    }
    return name && files ? !files.includes(name.toLowerCase()) : false;
  };

  return (
    <NameChooser
      placeholder="Rename note"
      originalName={originalName}
      validate={validateName}
      onSubmit={handleSubmit}
      onCancel={window.electron.closeDialog}
    />
  );
}
