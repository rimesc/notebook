import { useEffect, useState } from 'react';
import NameChooser from './NameChooser';

const { electron } = window;

const RenameFolder = () => {
  const [originalName, setOriginalName] = useState<string | undefined>(undefined);
  const [folders, setFolders] = useState<string[] | undefined>(undefined);

  useEffect(() => {
    return electron.onInitRenameFolderDialog((folder) => {
      setOriginalName(folder);
    });
  }, []);

  useEffect(() => {
    const loadFolders = async () => {
      setFolders((await electron.listFolders()).map((name) => name.toLowerCase()));
    };
    loadFolders();
  }, []);

  const handleSubmit = (name: string) => {
    if (originalName) {
      electron.renameFolder(originalName, name);
      electron.closeDialog();
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
      onCancel={electron.closeDialog}
    />
  );
};

export default RenameFolder;
