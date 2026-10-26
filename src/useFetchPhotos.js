import { useState, useEffect } from 'react'

const PHOTOS_URL = 'https://picsum.photos/v2/list?limit=30'

function useFetchPhotos() {
  // 1. create state for photos (starts as an empty list)
  const [photos, setPhotos] = useState([])
  // 2. create state for loading (starts as true)
  const [loading, setLoading] = useState(true)
  // 3. create state for error (starts as nothing)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadPhotos() {
      try {
        // a. request the photo list from the URL
        const response = await fetch(PHOTOS_URL)

        // status check: fetch doesn't throw on 404 or 500, so we throw manually
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        // b. convert the response into JSON
        const data = await response.json()
        // c. save the photos with setPhotos
        setPhotos(data)
      } catch (err) {
        // d. if something fails, save the error with setError
        setError(err.message)
      } finally {
        // e. set loading to false
        setLoading(false)
      }
    }

    loadPhotos()
  }, [])

  // 5. return photos, loading, and error
  return { photos, loading, error }
}

export default useFetchPhotos