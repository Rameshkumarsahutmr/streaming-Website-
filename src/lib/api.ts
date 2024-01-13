"use server";

export async function getEpisodes(id: string, season: number) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${id}/season/${season}?api_key=${process.env.TMDB_KEY}`
    );
    const data = await response.json();
    return data.episodes;
  } catch (error) {
    console.log(error);
  }
}

// get stream url
export async function getStreamUrl(file: string, key: string) {
  try {
    // console.log("file", file);
    // console.log("key", key);
    const response = await fetch(`${process.env.STREAM_API}/getStream`, {
      cache: "no-cache",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        file,
        key,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

// get Media info
export async function getMediaInfo(id: string) {
  try {
    const response = await fetch(
      `${process.env.STREAM_API}/mediaInfo?id=${id}`,
      { cache: "no-cache" }
    );
    const data = await response.json();
    // console.log("data", data);
    return data;
  } catch (error) {
    console.log(error);
  }
}

// play movie
export async function playMovie(id: string, lang: string) {
  try {
    const mediaInfo = await getMediaInfo(id);
    if (mediaInfo?.success) {
      const playlist = mediaInfo?.data?.playlist;
      const file = playlist.find((item: any) => item?.title === lang);
      if (!file) {
        return { success: false, error: "No file found" };
      }
      const key = mediaInfo?.data?.key;
      const streamUrl = await getStreamUrl(file?.file, key);
      if (streamUrl?.success) {
        return { success: true, data: streamUrl?.data };
      } else {
        return { success: false, error: "No stream url found" };
      }
    } else {
      return { success: false, error: "No media info found" };
    }
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
}

// play episode
export async function playEpisode(
  id: string,
  season: number,
  episode: number,
  lang: string
) {
  try {
    const mediaInfo = await getMediaInfo(id);
    if (!mediaInfo?.success) {
      return { success: false, error: "No media info found" };
    }
    const playlist = mediaInfo?.data?.playlist;
    const getSeason = playlist.find(
      (item: any) => item?.id === season.toString()
    );
    if (!getSeason) {
      return { success: false, error: "No season found" };
    }
    const getEpisode = getSeason?.folder.find(
      (item: any) => item?.episode === episode.toString()
    );
    if (!getEpisode) {
      return { success: false, error: "No episode found" };
    }
    const file = getEpisode?.folder.find((item: any) => item?.title === lang);
    if (!file) {
      return { success: false, error: "No file found" };
    }
    const key = mediaInfo?.data?.key;
    const streamUrl = await getStreamUrl(file?.file, key);
    if (streamUrl?.success) {
      return { success: true, data: streamUrl?.data };
    } else {
      return { success: false, error: "No stream url found" };
    }
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
}

// get season and episode and lang list
export async function getSeasonList(id: string) {
  try {
    const response = await fetch(
      `${process.env.STREAM_API}/getSeasonList?id=${id}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}