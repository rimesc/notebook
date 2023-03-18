import { useEffect, useState } from 'react';
import NameChooser from './NameChooser';

const CreateFolder = () => {
  const [folders, setFolders] = useState<string[] | undefined>(undefined);

  useEffect(() => {
    window.electron
      .listFolders()
      .then((fs) => setFolders(fs.map((f) => f.toLowerCase())))
      .catch(console.log);
  }, []);

  const handleSubmit = (name: string) => {
    window.electron.createFolder(name.trim());
    window.electron.closeDialog();
  };

  return (
    <NameChooser
      placeholder="New folder"
      // A name can be invalid but not conflicting if (a) it is empty or (b) the list of existing folders hasn't been fetched yet.
      validate={(name) => (name && name.trim() && folders ? !folders.includes(name.trim().toLowerCase()) : false)}
      onSubmit={handleSubmit}
      onCancel={window.electron.closeDialog}
    />
  );
};

export default CreateFolder;
