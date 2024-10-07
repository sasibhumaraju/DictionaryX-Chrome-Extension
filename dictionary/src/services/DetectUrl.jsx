
export default function DetectUrl(url) {
  if(url.includes(import.meta.env.DICTIONARY_AI_YOUTUBE_WATCH_PRE_URL)) return "watch";
  if(url.includes(import.meta.env.DICTIONARY_AI_YOUTUBE_SHORT_PRE_URL)) return "short";
  else return "other";
}


