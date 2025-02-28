import { JSX, useState } from "react";
import { ModalMode, Note } from "./NotesListPage";

interface CreateEditNoteModalProps {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setModalMode: React.Dispatch<React.SetStateAction<ModalMode>>;
  modalMode: ModalMode;
  handleCreateNote: (note: Note) => void;
  handleDeleteNote: (note: Note) => void;
  handleDeleteButton: () => void;
  handleEditNote: (note: Note) => void;
  selectedNote: Note;
  Spinner: () => JSX.Element;
  showDeleteConfirmation: boolean;
  setShowDeleteConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CreateEditNoteModal({
  setIsModalOpen,
  setModalMode,
  modalMode,
  handleCreateNote,
  handleEditNote,
  handleDeleteNote,
  handleDeleteButton,
  selectedNote,
  Spinner,
  showDeleteConfirmation,
  setShowDeleteConfirmation,
}: CreateEditNoteModalProps) {
  const [title, setTitle] = useState(
    modalMode === ModalMode.Create ? "" : selectedNote.title
  );
  const [description, setDescription] = useState(
    modalMode === ModalMode.Create ? "" : selectedNote.description
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const newNote: Note = {
      title,
      description,
    };

    const editNote: Note = {
      id: selectedNote.id,
      title,
      description,
    };

    const deleteNote: Note = {
      id: selectedNote.id,
    };

    switch (modalMode) {
      case ModalMode.Create:
        handleCreateNote(newNote);
        break;
      case ModalMode.Edit:
        handleEditNote(editNote);
        break;
      case ModalMode.Delete:
        handleDeleteNote(deleteNote);
        break;
      default:
        console.error("Invalid modal mode");
    }

    setIsModalOpen(false);
    setLoading(false);
  };

  if (loading) {
    return (
      <div
        className={`w-full md:w-2/3 border-2 border-gray-400/10 h-full md:border-l-0 border-t-0 text-left p-4  md:rounded-br-md`}
      >
        <Spinner />
      </div>
    );
  }

  return (
    <div
      className={`w-full md:w-2/3 border-2 border-gray-400/10 h-full md:border-l-0 md:border-t-0 text-left p-4 bg-slate-700 md:rounded-br-md z-10 `}
    >
      <h1 className="text-2xl p-4  text-center ">{`${modalMode} Note`}</h1>
      <form className="flex flex-col gap-2 p-4  pt-8" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="text-lg font-medium mb-1">Title:</label>
            <input
              type="text"
              value={title}
              required
              placeholder="Required"
              onChange={(event) => setTitle(event.target.value)}
              className="rounded-md px-2 py-1  focus:outline-none focus:ring focus:ring-gray-500 bg-slate-600"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-lg font-medium mb-1">Description:</label>
            <textarea
              value={description}
              required
              placeholder="Required"
              onChange={(event) => setDescription(event.target.value)}
              className="rounded-md px-2 py-1  focus:outline-none focus:ring focus:ring-gray-500 h-32 bg-slate-600"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-10">
          <button
            className="bg-[#242424] hover:bg-[#1d1d1d] text-white font-bold py-2 px-4 rounded"
            disabled={title === "" || description === ""}
            type="submit"
          >
            Submit
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </button>
          {modalMode === ModalMode.Edit && (
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleDeleteButton()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </button>
          )}

          {showDeleteConfirmation && (
            <div className="fixed top-0 left-0 w-full h-full bg-slate-700 bg-opacity-75 flex justify-center items-center">
              <div className="bg-black rounded-md p-4 md:max-w-1/2">
                <h2 className="text-lg font-medium mb-2">Confirm Delete</h2>
                <p>Are you sure you want to delete this note?</p>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                    onClick={() => {
                      setShowDeleteConfirmation(false);
                      setModalMode(ModalMode.Edit);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleDeleteNote(selectedNote)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
