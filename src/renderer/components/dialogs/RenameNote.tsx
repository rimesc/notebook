import { useEffect, useState } from 'react';
import NameChooser from './NameChooser';

const RenameNote = () => {
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
    if (folder) {
      window.electron
        .listNotes(folder)
        .then((fs) => setFiles(fs.map((f) => f.toLowerCase())))
        .catch(console.log);
    }
  }, [folder]);

  const handleSubmit = (name: string) => {
    if (folder) {
      window.electron.renameNote(folder, name);
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
};

export default RenameNote;
