import { useEffect, useState, useCallback } from "react";
import CreateEditNoteModal from "./CreateEditNoteModal";
import NoteDetailModal from "./NoteDetailModal";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

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

// eslint-disable-next-line react-refresh/only-export-components
export enum DateType {
  FULL_DATE, // Friday, February 28, 2025
  SHORT_DATE_TIME, // 02/28/25 11:06 AM
  SHORT_DATE, // 2/28/25
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
      title: "Create a Note",
      description: "to get started",
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
    setSelectedNote(note);
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

  function formatDateTime(dateString: string, dateType: DateType): string {
    const date = new Date(dateString);
    switch (dateType) {
      case DateType.FULL_DATE:
        return date.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      case DateType.SHORT_DATE_TIME:
        return `${date.toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "2-digit",
        })} ${date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}`;
      case DateType.SHORT_DATE:
        return `${date.getMonth() + 1}/${date.getDate()}/${date
          .getFullYear()
          .toString()
          .slice(2)}`;
      default:
        throw new Error(`Unsupported date type: ${dateType}`);
    }
  }

  function Spinner() {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-6 h-6 border-4 border-slate-700 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="md:p-8 h-screen w-screen flex flex-col max-w-7xl rounded-br-md ">
      <div className="border-2 border-gray-400/10  h-20 w-full flex flex-row justify-between items-center p-4 rounded-t-md bg-[#242424] pl-2 ">
        <button
          type="button"
          title="Add Note"
          aria-label="Add Note"
          className="hover:bg-[#1a1a1a]"
          onClick={() => handleModalAction(ModalMode.Create)}
          disabled={isModalOpen}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.25}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>
        </button>

        <h2 className="md:text-2xl">
          {formatDateTime(new Date().toISOString(), DateType.FULL_DATE)}
        </h2>
      </div>

      <div className=" h-full flex flex-col-reverse md:flex-row bg-[#242424] rounded-b-md ">
        <div
          className={`w-full md:w-1/3 ${
            isModalOpen && "opacity-20"
          } border-2 border-gray-400/10 h-1/2 md:h-full  overflow-x-scroll border-t-0 rounded-bl-md`}
        >
          {!loading &&
            Array.isArray(notes) &&
            notes.map((note: Note) => (
              <div
                className={`p-2 px-4 border-b-2 border-gray-400/10 border-r-0 text-left flex justify-between items-center  ${
                  !isModalOpen &&
                  "hover:pb-6 hover:cursor-pointer hover:border-t-slate-700 hover:bg-[#1d1d1d] "
                }`}
                key={note.id}
                onClick={() => setSelectedNote(note)}
              >
                <div className="flex gap-2 items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1}
                    stroke="currentColor"
                    className="size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                    />
                  </svg>

                  <h2 className="text-md text-gray-200 truncate ">{note.title}</h2>
                </div>

                <p className="text-sm text-gray-400">
                  {(note.updatedAt &&
                    formatDateTime(note.updatedAt, DateType.SHORT_DATE)) ||
                    (note.createdAt &&
                      formatDateTime(note.createdAt, DateType.SHORT_DATE))}
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
            formatDateTime={formatDateTime}
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
