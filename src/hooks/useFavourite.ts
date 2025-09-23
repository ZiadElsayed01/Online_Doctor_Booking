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
        data.map((f: { doctor_profile_id: number }) => f.doctor_profile_id)
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

  const toggleFavourite = async (doctor_profile_id: number) => {
    if (favouritesIDs.includes(doctor_profile_id)) {
      await handleRemoveFavorite(doctor_profile_id.toString());
    } else {
      await handleAddFavorite(doctor_profile_id.toString());
    }
    await fetchFavourites();
  };

  return { favouritesIDs, toggleFavourite, AllFavourites, loading };
}
