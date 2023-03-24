import ellipsize from 'ellipsize';
import { useEffect, useState } from 'react';
import ConfirmationDialog from './ConfirmationDialog';

export default function DeleteNote() {
  const [folder, setFolder] = useState<string | undefined>(undefined);
  const [note, setNote] = useState<string | undefined>(undefined);

  useEffect(() => {
    return window.electron.onInitDeleteNoteDialog((parentFolder, toDelete) => {
      setFolder(parentFolder);
      setNote(toDelete);
    });
  }, []);

  return folder && note ? (
    <ConfirmationDialog
      action="Delete"
      danger
      title={`Delete note '${ellipsize(note, 50)}'?`}
      onConfirm={() => window.electron.deleteNote(folder, note)}
    />
  ) : null;
}
