import CardDoctor from "../../components/common/CardDoctor";
import GoBackButton from "../../components/common/GoBackButton";
import { Loader } from "../../components/common/Loader";
import { useFavourites } from "../../hooks/useFavourite";
import type { IFavouriteDoctor } from "../../types";
import noFavourite from "../../assets/images/no-favorite.png";

export default function Favourite() {
    const { AllFavourites, toggleFavourite, loading } = useFavourites();
    return (
        <div>
            <div className="flex items-center gap-2">
                <GoBackButton />
                <h1 className="text-2xl font-semibold flex-1 text-center">
                    Your Favourite
                </h1>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-screen">
                    <Loader size="xxl" />
                </div>
            ) : AllFavourites.length === 0 ? (
                <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                    <img src={noFavourite} alt="image" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4 md:py-6 lg:py-10">
                    {AllFavourites?.map((favourite: IFavouriteDoctor) => (
                        <CardDoctor
                            key={favourite.doctor_profile_id}
                            doctor={favourite}
                            onToggleFavourite={() =>
                                toggleFavourite(favourite.doctor_profile_id)
                            }
                            isFavourite={true}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
