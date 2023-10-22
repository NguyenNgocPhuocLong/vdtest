import { useState } from "react";
import { MAX_RETRY_TIMES, RETRY_RELOAD_KEY } from "./VersionDetect.constants";
import * as React from "react";
import { VersionDetectFileType, VersionDetectProps } from "./VersionDetect.types";
import { compareVersion } from "./VersionDetect.utils";

export function useVersionDetectHook({
  nameArg = "VersionApp",
}: VersionDetectProps): any {

  const [loading, setLoading] = useState(false);
  const [version, setVersion] = useState("-1");

  React.useEffect(() => {
    const currentVersion = localStorage.getItem(nameArg) || "0";
    console.log(
      "🚀 ~ file: VersionDetect.tsx:14 ~ useEffect ~ currentVersion:",
      currentVersion
    );

    fetch("/version.json", {
      cache: "no-store",
    })
      .then((response) => response.json())
      .then((data: VersionDetectFileType) => {
        const latestVersion = data.version;
        console.log(
          "🚀 ~ file: VersionDetect.tsx:25 ~ .then ~ latestVersion:",
          latestVersion
        );
        // const flagLatestVersion = false;

        const shouldForceRefresh = compareVersion(
          latestVersion,
          currentVersion
        );
        if (shouldForceRefresh) {
          console.log(
            `We have a new version - ${latestVersion}. Should force refresh`
          );
          //   refreshCacheReload();
          //   setVersion(latestVersion);
        } else {
          console.log(
            `You already have the latest version - ${latestVersion}. No cache refresh needed.`
          );
          localStorage.setItem(RETRY_RELOAD_KEY, "0");
          // flagLatestVersion = true;
        }
      });
  },[]);

  const refreshCacheReload = async () => {
    setLoading(true);
    console.log("Clearing cache and hard reloading...");
    if (caches) {
      // Service worker cache should be cleared with caches.delete()
      const names = await caches.keys();
      await Promise.all(names.map((name) => caches.delete(name)));
    }
    const rawRetryReload = localStorage.getItem(RETRY_RELOAD_KEY);
    let retryReload = Number(rawRetryReload ?? 0);
    if (retryReload < MAX_RETRY_TIMES) {
      //delete browser cache and hard reload
      retryReload++;
      console.log(`Retry reload ${retryReload}`);
      window.location.reload();
    } else {
      console.log(`Retry reload exceeds max retry times`);
    }
    localStorage.setItem(RETRY_RELOAD_KEY, retryReload.toString());
    setLoading(false);
  };

  return {
    loading,
    version,
    setVersion,
    refreshCacheReload,
  };
};
