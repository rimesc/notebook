import { useEffect, useState } from 'react';
import NameChooser from './NameChooser';

const { electron } = window;

const CreateNote = () => {
  const [folder, setFolder] = useState<string | undefined>(undefined);
  const [files, setFiles] = useState<string[] | undefined>(undefined);

  useEffect(() => {
    return electron.onInitCreateNoteDialog(setFolder);
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
    if (folder) {
      electron.createNote(folder, name);
      electron.closeDialog();
    }
  };

  return (
    <NameChooser
      placeholder="New note"
      validate={(name) => (name && files ? !files.includes(name.toLowerCase()) : false)}
      onSubmit={handleSubmit}
      onCancel={electron.closeDialog}
    />
  );
};

export default CreateNote;
