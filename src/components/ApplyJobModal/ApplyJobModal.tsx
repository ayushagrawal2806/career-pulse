import { X } from "lucide-react";
import Modal from "react-modal";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { useApplyJob } from "../../hooks/Job";
import { useAppStore } from "../../store/useAppStore";

import type { ApiResponse } from "../../models/ApiResponse";
import type { ErrorModel } from "../../models/Error";

import "./ApplyJobModal.css";

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
      className="apply-job-modal"
      overlayClassName="apply-job-overlay"
    >
      <div className="apply-job-header">
        <h2>Apply for {jobTitle}</h2>

        <button className="apply-job-close-btn" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="apply-job-form">
        <div className="apply-job-group">
          <label>Resume URL</label>

          <input
            type="url"
            required
            value={resumeUrl}
            onChange={(e) => setResumeUrl(e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="apply-job-group">
          <label>Cover Letter</label>

          <textarea
            rows={5}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Tell recruiter why you're a good fit..."
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="apply-job-submit-btn"
        >
          {isPending ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </Modal>
  );
};

export default ApplyJobModal;
