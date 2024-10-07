import { YoutubeTranscript } from 'youtube-transcript';

export default async function GetWatchTranscripts(url) {
  let transcripts = null;
  await YoutubeTranscript.fetchTranscript(url,{mode:'no-cors'}).then((scripts)=>{
    transcripts = scripts;
  }).catch((error)=>{
    transcripts = error;
  })
  return transcripts;
}
