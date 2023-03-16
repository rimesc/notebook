import { useEffect, useState } from 'react';
import NameChooser from './NameChooser';

const CreateNote = () => {
  const [folder, setFolder] = useState<string | undefined>(undefined);
  const [files, setFiles] = useState<string[] | undefined>(undefined);

  useEffect(() => {
    return window.electron.ipcRenderer.on('dialogs:create-note:init', (inFolder) => {
      setFolder(inFolder as string);
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

  return (
    <NameChooser
      placeholder="New note"
      // A name can be invalid but not conflicting if (a) it is empty or (b) the list of existing files hasn't been fetched yet.
      validate={(name) => (name && name.trim() && files ? !files.includes(name.trim().toLowerCase()) : false)}
      onSubmit={(name) => window.electron.ipcRenderer.sendMessage('dialogs:create-note:done', folder, name.trim())}
      onCancel={() => window.electron.ipcRenderer.sendMessage('dialogs:create-note:done')}
    />
  );
};

export default CreateNote;
