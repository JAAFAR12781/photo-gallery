import { useState, useReducer, useEffect, useCallback, useMemo } from 'react'
import useFetchPhotos from './useFetchPhotos'

function favouritesReducer(favourites, action) {
  if (action.type === "toggle") {
    if (favourites.includes(action.id)) {
      return favourites.filter((id) => id !== action.id)
    }
    return [...favourites, action.id]
  }

  return favourites
}

// Reads the saved favourites, or returns an empty list if nothing is saved
function loadFavourites() {
  const saved = localStorage.getItem("favourites")
  return saved ? JSON.parse(saved) : []
}

function Gallery() {
  const { photos, loading, error } = useFetchPhotos()
  const [search, setSearch] = useState('')

  const [favourites, dispatch] = useReducer(favouritesReducer, [], loadFavourites)

  // Saves the favourites whenever the list changes
  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites))
  }, [favourites])

  // Keeps the same handler between renders
  const handleSearch = useCallback((e) => {
    setSearch(e.target.value)
  }, [])

  // Recalculates the filtered list only when photos or search change
  const filteredPhotos = useMemo(
    () =>
      photos.filter((photo) =>
        photo.author.toLowerCase().includes(search.toLowerCase())
      ),
    [photos, search]
  )

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>Error: {error}</p>
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Search by author"
        value={search}
        onChange={handleSearch}
      />

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredPhotos.map((photo) => (
          <li key={photo.id}>
            <img
              src={photo.download_url}
              alt={photo.author}
              className="w-full h-auto"
            />
            <p>{photo.author}</p>
            <button
              onClick={() => dispatch({ type: "toggle", id: photo.id })}
              aria-label={favourites.includes(photo.id) ? "Remove from favourites" : "Add to favourites"}
            >
              {favourites.includes(photo.id) ? "♥" : "♡"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Gallery