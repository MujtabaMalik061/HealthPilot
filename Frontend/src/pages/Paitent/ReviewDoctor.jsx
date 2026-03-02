import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Input, RatingStars } from "../../components/CustomComponents";
import { toast } from "sonner";
import { addReviewHelper } from "../../services/ReviewServices";

const ReviewDoctor = ({ data, AfterAdd, onClose, isEdit = false }) => {
  const { currentUser } = useAuth();
  const sender = currentUser?._id;
  const reciver = data?.reciver || null;
  const appointment = data?.appointment || null;
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      setRating(data?.rating);
      setReview(data?.review);
    }
  }, [data]);

  const handleSubmitReview = async () => {
    if (review.trim() === "") return toast.error("Review is required.");
    const formData = {
      reciver,
      sender,
      appointment,
      review,
      rating,
    };
    try {
      setLoading(true);
      await addReviewHelper(formData);
      AfterAdd();
      onClose();
      toast.success("Review added successfuly.");
    } catch (err) {
      console.error("Failed to submit review:", err?.response);
      toast.error("Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="model-overlay">
      <div className="model-content">
        <div className="model-header">
          <h3 className="model-header-title">Review doctor</h3>
          <button onClick={onClose} className="model-header-close-btn">
            ×
          </button>
        </div>
        <div className="model-content-container">
          <RatingStars
            size={25}
            style={{ textAlign: "center" }}
            value={rating}
            setValue={setRating}
            isChngeAble={true}
          />
          <Input
            type="textArea"
            label="Review"
            value={review}
            setValue={setReview}
            placeholder="Place your review here."
          />
          <div className="report-details-actions">
            <button
              disabled={loading}
              onClick={handleSubmitReview}
              className="report-details-action btn-secondary"
            >
              {loading ? "Submiting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDoctor;
