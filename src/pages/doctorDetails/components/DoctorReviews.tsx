import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Pencil } from "lucide-react";
import RatingStars from "./RatingStars";
import ReviewCard from "./ReviewCard";
import type { IReview, IReviewsResponse } from "@/types";
import { getDoctorReviews } from "@/api/doctors/doctors";
import ReviewsPagination from "./ReviewsPagination";
import { Loader } from "@/components/common/Loader";
import AlertMsg from "@/components/common/AlertMsg";

type DoctorReviewsProps = {
    doctorId: string;
    reviewsCount: number;
    rating: string;
};

function DoctorReviews({ doctorId, reviewsCount, rating }: DoctorReviewsProps) {
    const initReviewLink = `${
        import.meta.env.VITE_BASE_URL
    }doctors/${doctorId}/reviews`;

    const [doctorReviews, setDoctorReviews] = useState<IReviewsResponse | null>(
        null
    );
    const [reviewLink, setReviewLink] = useState<string>(initReviewLink);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function fetchReveiews() {
            try {
                setIsLoading(true);
                const result = await getDoctorReviews(reviewLink);
                setDoctorReviews(result.data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchReveiews();
    }, [reviewLink]);

    return (
        <section className="mt-8 flex flex-col gap-4 flex-1">
            <header className="flex items-center justify-between">
                <h2 className="font-medium text-lg">Reviews and Rating</h2>
                <Link
                    to={`/doctors/${doctorId}/review`}
                    className="flex items-center gap-1 cursor-pointer text-primary-100 hover:text-primary-200 focus:text-primary-200"
                >
                    <Pencil size={18} />
                    <span>add review</span>
                </Link>
            </header>

            <div className="flex items-center justify-between gap-2">
                <p className="text-3xl font-medium">
                    {Number(rating).toFixed(1)}/5
                </p>
                <div className="flex flex-col items-center gap-1">
                    <RatingStars rating={4.5} />
                    <p className="text-secondary-400 font-medium text-base">
                        {reviewsCount} Reviews
                    </p>
                </div>
            </div>

            <div className="w-full h-[350px] flex flex-col items-center justify-center">
                {isLoading ? (
                    <Loader />
                ) : doctorReviews && doctorReviews.total > 0 ? (
                    <>
                        <div className="flex flex-wrap items-center justify-between gap-4 overflow-y-auto pr-2">
                            {doctorReviews.data.map((review: IReview) => (
                                <ReviewCard review={review} key={review.id} />
                            ))}
                        </div>
                        {doctorReviews.total > 10 && (
                            <ReviewsPagination
                                reviewsLinks={doctorReviews.links}
                                lastPage={doctorReviews.last_page}
                                onSetReveiwLink={setReviewLink}
                            />
                        )}
                    </>
                ) : doctorReviews && doctorReviews.total === 0 ? (
                    <AlertMsg message="No reviews found" />
                ) : (
                    <AlertMsg message="Something went wrong. Cannot get reviews" />
                )}
            </div>
        </section>
    );
}

export default DoctorReviews;
