import { DateType, ModalMode, Note } from "./NotesListPage";

interface CreateEditNoteModalProps {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setModalMode: React.Dispatch<React.SetStateAction<ModalMode>>;
  selectedNote: Note;
  onDelete?: () => void;
  formatDateTime: (dateString: string, dateType: DateType) => string;
}

export default function NoteDetailModal({
  setIsModalOpen,
  setModalMode,
  selectedNote,
  formatDateTime,
}: CreateEditNoteModalProps) {
  return (
    <div
      className="w-full md:w-2/3 border-2 border-gray-400/10 h-full border-l-0 border-t-0 text-left p-4 bg-slate-800 md:rounded-br-md flex flex-col justify-between mt-20 md:mt-0"
      role="region"
      aria-label="Note details"
    >
      <div className="relative">
        <button
          onClick={() => {
            setIsModalOpen(true);
            setModalMode(ModalMode.Edit);
          }}
          className="absolute top-0 right-0 p-2 text-gray-400 hover:text-white transition-colors"
          aria-label="Edit note"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
        <h1 className="text-2xl pb-2 cursor-default">{selectedNote.title}</h1>
        <p className="text-md overflow-x-scroll cursor-default">
          {selectedNote.description}
        </p>
      </div>

      <div
        className="flex justify-between text-xs"
        role="contentinfo"
        aria-label="Note metadata"
      >
        {selectedNote.createdAt && selectedNote.updatedAt && (
          <>
            <h4>
              Created:{" "}
              {formatDateTime(selectedNote.createdAt, DateType.SHORT_DATE_TIME)}
            </h4>
            <h4>
              Updated:{" "}
              {formatDateTime(selectedNote.updatedAt, DateType.SHORT_DATE_TIME)}
            </h4>
          </>
        )}
      </div>
    </div>
  );
}
