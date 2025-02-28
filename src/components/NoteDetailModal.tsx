import { ModalMode, Note } from "./NotesListPage";

interface CreateEditNoteModalProps {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setModalMode: React.Dispatch<React.SetStateAction<ModalMode>>;
  selectedNote: Note;
  onDelete?: () => void;
}

export default function NoteDetailModal({
  setIsModalOpen,
  setModalMode,
  selectedNote,
}: CreateEditNoteModalProps) {
  function formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return `${date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    })} ${date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })}`;
  }

  return (
    <div className="w-full md:w-2/3 border-2 border-gray-400/10 h-full border-l-0 border-t-0 text-left p-4 bg-[#242424] rounded-br-md flex flex-col justify-between">
      <div
        onClick={() => {
          setIsModalOpen(true);
          setModalMode(ModalMode.Edit);
        }}
      >
        <h1 className="text-2xl pb-2">{selectedNote.title}</h1>
        <p className="text-md overflow-x-scroll">{selectedNote.description}</p>
      </div>

      <div className="flex justify-between text-xs ">
        {selectedNote.createdAt && selectedNote.updatedAt && (
          <>
            <h4>Created: {formatDateTime(selectedNote.createdAt)}</h4>
            <h4>Updated: {formatDateTime(selectedNote.updatedAt)}</h4>
          </>
        )}
      </div>
    </div>
  );
}
