import ellipsize from 'ellipsize';
import { useEffect, useState } from 'react';
import ConfirmationDialog from './ConfirmationDialog';

export default function DeleteFolder() {
  const [folder, setFolder] = useState<string | undefined>(undefined);

  useEffect(() => {
    return window.electron.onInitDeleteFolderDialog((toDelete) => {
      setFolder(toDelete);
    });
  }, []);

  return folder ? (
    <ConfirmationDialog
      action="Delete"
      danger
      title={`Delete folder '${ellipsize(folder, 50)}'?`}
      onConfirm={() => window.electron.deleteFolder(folder)}
    />
  ) : null;
}
