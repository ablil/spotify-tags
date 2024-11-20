/* eslint-disable */
"use client";
import Header from "@/components/Header";
import TrackList from "@/components/MainWrapper";
import AudioPlayer from "@/components/player/AudioPlayer";
import ModalsProvider from "@/components/providers/ModalsProvider";
import StoreProvider from "@/components/providers/StoreProvider";
import TagsFilters from "@/components/tags/TagsFilters";
import { useEffect, useState } from "react";

export default function Home() {
  return (
    <StoreProvider>
      <ModalsProvider>
        <PushNotificationManager />
        <InstallPrompt />
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

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\\-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [_, setSubscription] = useState<PushSubscription | null>(null);

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, []);

  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });
    const sub = await registration.pushManager.getSubscription();
    setSubscription(sub);
  }

  if (!isSupported) {
    return null;
  }

  return null;
}
function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream);

    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
  }, []);

  if (isStandalone) {
    return null; // Don't show install button if already installed
  }

  return null;
}
