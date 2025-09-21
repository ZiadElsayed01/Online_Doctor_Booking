import { Award, MessageSquareMore, Star, User } from "lucide-react";
import StatItem from "./StatItem";

type DoctorStatsProps = {
    experienceYears: number;
    reviewsCount: number;
    rating: string;
};

function DoctorStats({
    experienceYears,
    reviewsCount,
    rating,
}: DoctorStatsProps) {
    return (
        <section className="flex items-center justify-between gap-4 my-8">
            <StatItem Icon={User} value="2,000+" label="patients" />
            <StatItem Icon={Award} value={experienceYears} label="experience" />
            <StatItem
                Icon={Star}
                value={Number(rating).toFixed(1)}
                label="rating"
            />
            <StatItem
                Icon={MessageSquareMore}
                value={reviewsCount}
                label="reviews"
            />
        </section>
    );
}

export default DoctorStats;
