/* eslint-disable */
"use client";
import Header from "@/components/Header";
import TrackList from "@/components/MainWrapper";
import AudioPlayer from "@/components/player/AudioPlayer";
import ModalsProvider from "@/components/providers/ModalsProvider";
import StoreProvider from "@/components/providers/StoreProvider";
import TagsFilters from "@/components/tags/TagsFilters";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status]);

  return (
    <SessionProvider>
      <StoreProvider>
        <ModalsProvider>
          <main>
            <Header />
            <div className="flex">
              <div className="w-1/5">
                <TagsFilters />
              </div>
              <div className="w-4/5">
                <TrackList isPreviewMode={true} />
              </div>
            </div>
          </main>
          <AudioPlayer />
        </ModalsProvider>
      </StoreProvider>
    </SessionProvider>
  );
}
