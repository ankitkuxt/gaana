"use client";

import useOnPlay from "@/hooks/useOnPlay";
import { Song } from "@/types";
// import MusicBox from "@/components/MusicBox";
import MediaItem from "@/components/ui/MediaItem";
import LikeButton from "@/components/ui/LikeButton";

interface SearchContentProps {
  songs: Song[];
}

const SearchContent = ({ songs }: SearchContentProps) => {
  const onPlay = useOnPlay(songs);


  if (songs.length === 0) {
    return (
      <div 
        className="
          flex 
          flex-col 
          gap-y-2 
          w-full 
          px-6 
          text-neutral-400
        "
      >
        No musics found.
      </div>
    )
  }

  return ( 
    <div className="
    grid 
    grid-cols-2 
    sm:grid-cols-3 
    md:grid-cols-3 
    lg:grid-cols-4 
    xl:grid-cols-5 
    2xl:grid-cols-8 
    gap-4 
    mt-4
    ml-4
    ">
      {songs.map((song) => (
          <div key={song.id} className="flex items-center gap-x-4 w-full">
            {/* <MusicBox
              onClick={(id: string) => onPlay(id)} 
              key={music.tokenId} 
              data={music}
            /> */}
            <div className="flex-1">
              <MediaItem
                onClick={(id: string) => onPlay(id)}
                data={ song }
              />
            </div>
            <LikeButton songId = {song.id} />
          </div>
       
      ))}
    </div>
  );
}
 
export default SearchContent;