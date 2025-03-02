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
    <div className="w-full md:w-2/3 border-2 border-gray-400/10 h-full border-l-0 border-t-0 text-left p-4 bg-[#1a1a1a] md:bg-[#242424] rounded-br-md flex flex-col justify-between mt-20 md:mt-0">
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
