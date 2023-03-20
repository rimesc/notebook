import { useEffect, useState } from 'react';
import NameChooser from './NameChooser';

const { electron } = window;

const RenameNote = () => {
  const [folder, setFolder] = useState<string | undefined>(undefined);
  const [originalName, setOriginalName] = useState<string | undefined>(undefined);
  const [files, setFiles] = useState<string[] | undefined>(undefined);

  useEffect(() => {
    return electron.onInitRenameNoteDialog((parentFolder, note) => {
      setFolder(parentFolder);
      setOriginalName(note);
    });
  }, []);

  useEffect(() => {
    const loadNotes = async () => {
      if (folder) {
        setFiles((await electron.listNotes(folder)).map((name) => name.toLowerCase()));
      }
    };
    loadNotes();
  }, [folder]);

  const handleSubmit = (name: string) => {
    if (folder && originalName) {
      electron.renameNote(folder, originalName, name);
      electron.closeDialog();
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
      onCancel={electron.closeDialog}
    />
  );
};

export default RenameNote;
