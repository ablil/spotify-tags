/* eslint-disable */
"use client";
import Header from "@/components/Header";
import TrackList from "@/components/MainWrapper";
import AudioPlayer from "@/components/player/AudioPlayer";
import ModalsProvider from "@/components/providers/ModalsProvider";
import StoreProvider from "@/components/providers/StoreProvider";
import TagsFilters from "@/components/tags/TagsFilters";

export default function Home() {
  return (
    <StoreProvider>
      <ModalsProvider>
        <main>
          <Header />
          <div className="flex">
            <div className="w-1/5">
              <TagsFilters />
            </div>
            <div className="w-4/5">
              <TrackList />
            </div>
          </div>
        </main>
        <AudioPlayer />
      </ModalsProvider>
    </StoreProvider>
  );
}
