import { useEffect, useState, useCallback } from "react";
import CreateEditNoteModal from "./CreateEditNoteModal";
import NoteDetailModal from "./NoteDetailModal";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

const date = new Date();
const formattedDate = date.toLocaleString("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
});

export interface Note {
  createdAt?: string;
  updatedAt?: string;
  id?: string;
  title?: string;
  description?: string;
  userId?: string;
}

// eslint-disable-next-line react-refresh/only-export-components
export enum ModalMode {
  Create = "Create",
  Edit = "Edit",
  Delete = "Delete",
}

export default function NotesListPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>(ModalMode.Create);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState(
    notes[0] || {
      createdAt: "",
      updatedAt: "",
      id: "",
      title: "",
      description: "",
      userId: "",
    }
  );
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const companyId = import.meta.env.VITE_COMPANY_ID;
  const URL = `https://issessvim.hievilmath.org`;

  const getNotes = async (mode?: ModalMode, params?: Note) => {
    let endpoint = `${URL}/api/company/${companyId}/note`;
    let method = "GET";
    let data: Note | undefined;

    switch (mode) {
      case ModalMode.Create:
        endpoint = `${URL}/api/company/${companyId}/note`;
        method = "POST";
        data = params;
        break;
      case ModalMode.Edit:
        endpoint = `${URL}/api/company/${companyId}/note/${params?.id}`;
        method = "PATCH";
        data = params;
        break;
      case ModalMode.Delete:
        endpoint = `${URL}/api/company/${companyId}/note/${params?.id}`;
        method = "DELETE";
        break;
      default:
        // returns the company notes
        break;
    }

    try {
      const response = await axios({
        method,
        url: endpoint,
        data,
      });
      setNotes(response.data);
    } catch (error) {
      toast.error((error as { message: string }).message, {
        style: {
          backgroundColor: "#333",
          color: "#fff",
        },
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const refreshNotes = useCallback(async () => {
    setLoading(true);
    await getNotes();
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    refreshNotes();
  }, [refreshNotes]);

  const handleCreateNote = async (note: Note) => {
    setLoading(true);
    await getNotes(ModalMode.Create, note);
    await refreshNotes();
    setLoading(false);
  };

  const handleDeleteButton = () => {
    setShowDeleteConfirmation(true);
    setModalMode(ModalMode.Delete);
  };

  const handleDeleteNote = async (note: Note) => {
    setLoading(true);
    await getNotes(ModalMode.Delete, note);
    await refreshNotes();
    setSelectedNote({
      createdAt: "",
      updatedAt: "",
      id: "",
      title: "",
      description: "",
      userId: "",
    });
    setShowDeleteConfirmation(false);
    setIsModalOpen(false);
    setLoading(false);
  };

  const handleEditNote = async (note: Note) => {
    setLoading(true);
    await getNotes(ModalMode.Edit, note);
    setSelectedNote({
      createdAt: "",
      updatedAt: "",
      id: "",
      title: "",
      description: "",
      userId: "",
    });
    await refreshNotes();
    setSelectedNote(note);
    setLoading(false);
  };

  const handleModalAction = (
    action: ModalMode.Create | ModalMode.Edit | ModalMode.Delete
  ) => {
    setIsModalOpen(true);
    setModalMode(action);
  };

  function Spinner() {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-6 h-6 border-4 border-slate-700 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="md:p-8 h-screen w-screen flex flex-col max-w-7xl rounded-br-md ">
      <div className="border-2 border-gray-400/10  h-20 w-full flex flex-row justify-between items-center p-4 rounded-t-md bg-[#242424] ">
        <button
          type="button"
          title="Add Note"
          aria-label="Add Note"
          onClick={() => handleModalAction(ModalMode.Create)}
          disabled={isModalOpen}
        >
          +
        </button>

        <h2 className="md:text-2xl">{formattedDate}</h2>
      </div>

      <div className=" h-full flex flex-col-reverse md:flex-row bg-[#242424] rounded-b-md">
        <div
          className={`w-full md:w-1/3 ${
            isModalOpen && "opacity-20"
          } border-2 border-gray-400/10 h-1/2 md:h-full  overflow-x-scroll border-t-0 rounded-bl-md`}
        >
          {!loading &&
            Array.isArray(notes) &&
            notes.map((note: Note) => (
              <div
                className={`p-1 px-4 border-b-2 border-gray-400/10 border-r-0 text-left  ${
                  !isModalOpen &&
                  "hover:pb-6 hover:cursor-pointer hover:border-t-slate-700 hover:bg-[#1d1d1d] "
                }`}
                key={note.id}
                onClick={() => setSelectedNote(note)}
              >
                <h2 className="text-md text-gray-200">{note.title}</h2>
                <p className="text-sm text-gray-400 truncate">
                  {note.description}
                </p>
              </div>
            ))}

          {loading && <Spinner />}
        </div>
        {!isModalOpen && (
          <NoteDetailModal
            setIsModalOpen={setIsModalOpen}
            setModalMode={setModalMode}
            selectedNote={selectedNote}
          />
        )}

        {isModalOpen && (
          <CreateEditNoteModal
            selectedNote={selectedNote}
            setIsModalOpen={setIsModalOpen}
            setModalMode={setModalMode}
            modalMode={modalMode}
            handleCreateNote={handleCreateNote}
            handleEditNote={handleEditNote}
            handleDeleteButton={handleDeleteButton}
            handleDeleteNote={handleDeleteNote}
            showDeleteConfirmation={showDeleteConfirmation}
            setShowDeleteConfirmation={setShowDeleteConfirmation}
            Spinner={Spinner}
          />
        )}
      </div>
      <ToastContainer />
    </div>
  );
}
