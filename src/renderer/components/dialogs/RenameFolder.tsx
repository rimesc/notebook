import { useEffect, useState } from 'react';
import NameChooser from './NameChooser';

export default function RenameFolder() {
  const [originalName, setOriginalName] = useState<string | undefined>(undefined);
  const [folders, setFolders] = useState<string[] | undefined>(undefined);

  useEffect(() => {
    return window.electron.onInitRenameFolderDialog((folder) => {
      setOriginalName(folder);
    });
  }, []);

  useEffect(() => {
    const loadFolders = async () => {
      setFolders((await window.electron.listFolders()).map((name) => name.toLowerCase()));
    };
    loadFolders();
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
}
