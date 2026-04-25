import { useState } from "react";
import Modal from "react-modal";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { FileText, Link as LinkIcon, Send, X } from "lucide-react";

import "./ApplyJobModal.css";

import { useApplyJob } from "../../hooks/Job";
import { useAppStore } from "../../store/useAppStore";

import type { ApiResponse } from "../../models/ApiResponse";
import type { ErrorModel } from "../../models/Error";

Modal.setAppElement("#root");

interface ApplyJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle: string;
  setApplied: (value: boolean) => void;
}

const ApplyJobModal = ({
  isOpen,
  onClose,
  jobId,
  jobTitle,
  setApplied,
}: ApplyJobModalProps) => {
  const user = useAppStore((state) => state.user);

  const queryClient = useQueryClient();

  const [resumeUrl, setResumeUrl] = useState(user?.resumeUrl ?? "");

  const [coverLetter, setCoverLetter] = useState("");

  const onSuccess = (data: ApiResponse<void>) => {
    toast.success(data.message);

    setApplied(true);

    queryClient.invalidateQueries({
      queryKey: ["jobById", jobId],
    });

    onClose();
  };

  const onError = (error: ErrorModel) => {
    toast.error(error.message);
  };

  const { mutate: applyJob, isPending } = useApplyJob(onSuccess, onError);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    applyJob({
      jobId,
      data: {
        resumeUrl,
        coverLetter,
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      shouldCloseOnEsc
      shouldCloseOnOverlayClick
      className="apply-job-modal"
      overlayClassName="apply-job-overlay"
    >
      <div className="apply-job-header">
        <div>
          <h2 className="apply-job-title">Apply for</h2>

          <p className="apply-job-subtitle">{jobTitle}</p>
        </div>

        <button type="button" onClick={onClose} className="apply-job-close-btn">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="apply-job-form">
        <div className="apply-job-group">
          <label>Resume URL</label>

          <div className="apply-job-input-wrap">
            <LinkIcon size={18} className="apply-job-input-icon" />

            <input
              type="url"
              required
              value={resumeUrl}
              placeholder="https://drive.google.com/..."
              onChange={(e) => setResumeUrl(e.target.value)}
            />
          </div>
        </div>

        <div className="apply-job-group">
          <label>Cover Letter</label>

          <div className="apply-job-input-wrap">
            <FileText
              size={18}
              className="apply-job-input-icon apply-job-textarea-icon"
            />

            <textarea
              rows={5}
              value={coverLetter}
              placeholder="Tell recruiter why you're a good fit..."
              onChange={(e) => setCoverLetter(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="apply-job-submit-btn"
        >
          {isPending ? (
            "Submitting..."
          ) : (
            <>
              <Send size={18} />
              Submit Application
            </>
          )}
        </button>
      </form>
    </Modal>
  );
};

export default ApplyJobModal;
