import { useEffect, useState } from 'react';
import NameChooser from './NameChooser';

const RenameFolder = () => {
  const [originalName, setOriginalName] = useState<string | undefined>(undefined);
  const [folders, setFolders] = useState<string[] | undefined>(undefined);

  useEffect(() => {
    return window.electron.onInitRenameFolderDialog((folder) => {
      setOriginalName(folder);
    });
  }, []);

  useEffect(() => {
    window.electron
      .listFolders()
      .then((fs) => setFolders(fs.map((f) => f.toLowerCase())))
      .catch(console.log);
  }, []);

  const handleSubmit = (name: string) => {
    if (originalName) {
      window.electron.renameFolder(originalName, name);
      window.electron.closeDialog();
    }
  };

  const validateName = (name: string) => {
    if (originalName && name === originalName) {
      return true;
    }
    return name && folders ? !folders.includes(name.toLowerCase()) : false;
  };

  return (
    <NameChooser
      placeholder="Rename folder"
      originalName={originalName}
      validate={validateName}
      onSubmit={handleSubmit}
      onCancel={window.electron.closeDialog}
    />
  );
};

export default RenameFolder;
