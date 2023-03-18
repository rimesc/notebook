import { useEffect, useState } from 'react';
import NameChooser from './NameChooser';

const CreateNote = () => {
  const [folder, setFolder] = useState<string | undefined>(undefined);
  const [files, setFiles] = useState<string[] | undefined>(undefined);

  useEffect(() => {
    return window.electron.onInitCreateNoteDialog(setFolder);
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
      window.electron.createNote(folder, name.trim());
      window.electron.closeDialog();
    }
  };

  return (
    <NameChooser
      placeholder="New note"
      // A name can be invalid but not conflicting if (a) it is empty or (b) the list of existing files hasn't been fetched yet.
      validate={(name) => (name && name.trim() && files ? !files.includes(name.trim().toLowerCase()) : false)}
      onSubmit={handleSubmit}
      onCancel={window.electron.closeDialog}
    />
  );
};

export default CreateNote;
