"use client";

import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function ProductTags() {
  const router = useRouter();
  const params = useSearchParams();
  const tag = params?.get("tag");

  const [activeTag, setActiveTag] = useState(tag);

  useEffect(() => {
    if (tag !== activeTag) {
      setActiveTag(tag);
    }
  }, [tag]);

  const setFilter = (newTag: string) => {
    const urlParams = new URLSearchParams(window.location.search);
    if (newTag) {
      urlParams.set("tag", newTag);
    } else {
      urlParams.delete("tag");
    }
    router.push(`?${urlParams.toString()}`);
    setActiveTag(newTag);
  };

  return (
    <div className="my-4 flex gap-4 items-center justify-center">
      <Badge
        onClick={() => setFilter("")}
        className={cn(
          "cursor-pointer bg-black hover:bg-black/75 hover:opacity-100",
          !tag ? "opacity-100" : "opacity-50"
        )}
      >
        All
      </Badge>

      <Badge
        onClick={() => setFilter("blue")}
        className={cn(
          "cursor-pointer bg-blue-500 hover:bg-blue-600 hover:opacity-100",
          tag === "blue" && tag ? "opacity-100" : "opacity-50"
        )}
      >
        Blue
      </Badge>
      <Badge
        onClick={() => setFilter("green")}
        className={cn(
          "cursor-pointer bg-green-500 hover:bg-green-600 hover:opacity-100",
          tag === "green" && tag ? "opacity-100" : "opacity-50"
        )}
      >
        Green
      </Badge>
      <Badge
        onClick={() => setFilter("purple")}
        className={cn(
          "cursor-pointer bg-purple-500 hover:bg-purple-600 hover:opacity-100",
          tag === "purple" && tag ? "opacity-100" : "opacity-50"
        )}
      >
        Purple
      </Badge>
      <Badge
        onClick={() => setFilter("rings")}
        className={cn(
          "cursor-pointer hover:opacity-100",
          tag === "rings" && tag ? "opacity-100" : "opacity-50"
        )}
      >
        Rings
      </Badge>
      <Badge
        onClick={() => setFilter("necklaces")}
        className={cn(
          "cursor-pointer hover:opacity-100",
          tag === "necklaces" && tag ? "opacity-100" : "opacity-50"
        )}
      >
        Necklaces
      </Badge>
      <Badge
        onClick={() => setFilter("earrings")}
        className={cn(
          "cursor-pointer hover:opacity-100",
          tag === "earrings" && tag ? "opacity-100" : "opacity-50"
        )}
      >
        Earrings
      </Badge>
    </div>
  );
}
