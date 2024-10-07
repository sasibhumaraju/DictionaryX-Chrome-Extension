import axios from "axios";


class Speach {
  
  
  static async start (text) {
    stop () 
    if (text.trim() !== "") {
      text
      .replace(/,/g, ',<break time="300ms"/>')
      .replace(/\./g, '.<break time="600ms"/>')
      .replace(/!/g, '!<break time="600ms"/>')
      .replace(/\?/g, '?<break time="600ms"/>');
      const synth = window.speechSynthesis;
      // text = "aap kaise hain"
      const utterance = new SpeechSynthesisUtterance (text);
      
      // const res = await  axios.post("https://script.google.com/macros/s/AKfycbztxtNhMwWOT0Gl7k3NrsoAcQJRZnfZUtO1zkgeKUkUkA_JdMndpUBGS1QasxP8dOdvTw/exec",{id:"kill"})
                           
      // console.log(res)
      // utterance.text = this.text;
      utterance.lang = 'en-US';
      // utterance.lang = "hi";
      utterance.pitch = 0.5;
      utterance.rate = 0.9;
      utterance.volume = 1;
      const voices = synth.getVoices();
      console.log(voices)

    // for(let i = 0; i<voices.length; i++) {
    //   if(voices[i].voiceURI.includes('Zira'))  
        
        utterance.voice = voices[Math.floor( Math.random() * voices.length-1) + 1 ];
    // }

  
    // utterance.voice = voices[2];
    
      window.speechSynthesis.speak(utterance);
      utterance.onstart = function() {
       console.log("speaking")
      };
  
      utterance.onend = function() {
        console.log("finished")
      };
  
      utterance.onerror = function() {
        console.log("error")
      };
    }
    
  }

  static stop () {
    window.speechSynthesis.cancel()
  }

  static resume () {
    window.speechSynthesis.pause();
  }
}
export default Speach