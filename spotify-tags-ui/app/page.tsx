/* eslint-disable */
"use client";
import AuthWrapper from "@/components/AuthWrapper";
import Header from "@/components/Header";
import TrackList from "@/components/MainWrapper";
import AudioPlayer from "@/components/player/AudioPlayer";
import ModalsProvider from "@/components/providers/ModalsProvider";
import StoreProvider from "@/components/providers/StoreProvider";
import TagsFilters from "@/components/tags/TagsFilters";
import { SessionProvider } from "next-auth/react";

export default function Home() {
  return (
    <SessionProvider>
      <StoreProvider>
        <ModalsProvider>
          <AuthWrapper>
            <main>
              <Header />
              <div className="flex">
                <div className="w-1/5">
                  <TagsFilters />
                </div>
                <div className="w-4/5">
                  <TrackList isPreviewMode={false} />
                </div>
              </div>
            </main>
          </AuthWrapper>
          <AudioPlayer />
        </ModalsProvider>
      </StoreProvider>
    </SessionProvider>
  );
}
