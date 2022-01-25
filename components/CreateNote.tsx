import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import axios from "axios";

import type { Dispatch, SetStateAction } from "react";
import type { AxiosError } from "axios";
import type { NextPage } from "next";

type Props = {
  token: string;
  setToken: Dispatch<SetStateAction<string>>;
  refreshCallback: () => Promise<void>;
};

const CreateNote: NextPage<Props> = ({ token, setToken, refreshCallback }) => {
  const [noteTitle, setNoteTitle] = useState<string>("");
  const [noteBody, setNoteBody] = useState<string>("");
  const [isLoading, setLoadingStatus] = useState<boolean>(false);

  const submitCallback = useCallback(async () => {
    setLoadingStatus(true);
    toast.loading("Submitting a new note...", { id: "createNote" });

    try {
      await axios.post(
        `${process.env.API_URL}/notes/`,
        {
          title: noteTitle,
          body: noteBody,
        },
        {
          headers: { Authorization: token },
        }
      );

      toast.success("Successfully created a new note!", { id: "createNote" });
      setNoteTitle("");
      setNoteBody("");
      refreshCallback();
    } catch (err: unknown | AxiosError) {
      let message = "";

      if (axios.isAxiosError(err) && err.response) {
        switch (err.response.status) {
          case 422:
            message = "request is not valid";
            break;

          case 401:
            message = "invalid session";
            setToken("");
            break;

          default:
            message = "unknown error";
        }
      } else {
        message = "unknown error";
      }

      toast.error(`Failed to create a new note: ${message}`, {
        id: "createNote",
      });
    } finally {
      setLoadingStatus(false);
    }
  }, [token, noteTitle, noteBody, refreshCallback]);

  return (
    <>
      <button
        type="button"
        className="btn btn-primary me-2"
        data-bs-toggle="modal"
        data-bs-target="#createNoteModal"
      >
        <i className="fas fa-sticky-note" />
        <span className="visually-hidden">New note</span>
      </button>
      <div
        className="modal fade"
        id="createNoteModal"
        tabIndex={-1}
        aria-labelledby="createNoteModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="createNoteModalLabel">
                Create a new note
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form action="">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label fw-bold">
                    Note title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    placeholder="How to make an omelette"
                    onChange={(e) => setNoteTitle(e.target.value)}
                    value={noteTitle}
                    disabled={isLoading}
                  />
                  <div id="titleHelp" className="form-text">
                    ({noteTitle.length}/255)
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label fw-bold">
                    Note body
                  </label>
                  <textarea
                    className="form-control font-monospace"
                    id="body"
                    onChange={(e) => setNoteBody(e.target.value)}
                    value={noteBody}
                    disabled={isLoading}
                  />
                  <div id="bodyHelp" className="form-text">
                    {noteBody.length} character(s)
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={submitCallback}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateNote;
