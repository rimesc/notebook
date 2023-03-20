import { useEffect, useState } from 'react';
import NameChooser from './NameChooser';

const CreateFolder = () => {
  const [folders, setFolders] = useState<string[] | undefined>(undefined);

  useEffect(() => {
    const loadFolders = async () => {
      setFolders((await window.electron.listFolders()).map((name) => name.toLowerCase()));
    };
    loadFolders();
  }, []);

  const handleSubmit = (name: string) => {
    window.electron.createFolder(name);
    window.electron.closeDialog();
  };

  return (
    <NameChooser
      placeholder="New folder"
      // A name can be invalid but not conflicting if (a) it is empty or (b) the list of existing folders hasn't been fetched yet.
      validate={(name) => (name && folders ? !folders.includes(name.toLowerCase()) : false)}
      onSubmit={handleSubmit}
      onCancel={window.electron.closeDialog}
    />
  );
};

export default CreateFolder;
