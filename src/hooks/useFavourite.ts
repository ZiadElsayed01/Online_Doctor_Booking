import {
  handleAddFavorite,
  handleGetFavorites,
  handleRemoveFavorite,
} from "@/api/favourite/favourite";
import { useEffect, useState } from "react";

export function useFavourites() {
  const [favouritesIDs, setFavouritesIDs] = useState<number[]>([]);
  const [AllFavourites, setAllFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavourites = async () => {
    try {
      setLoading(true);
      const data = await handleGetFavorites();
      setAllFavourites(data);
      setFavouritesIDs(
        data.map(
          (f: { favouritable: { doctor_profile: { id: number } } }) =>
            f.favouritable.doctor_profile.id
        )
      );
    } catch (error) {
      console.error("Fetch favourites error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavourites();
  }, []);

  const toggleFavourite = async (doctorId: number) => {
    if (favouritesIDs.includes(doctorId)) {
      await handleRemoveFavorite(doctorId.toString());
    } else {
      await handleAddFavorite(doctorId.toString());
    }
    await fetchFavourites();
  };

  return { favouritesIDs, toggleFavourite, AllFavourites, loading };
}
