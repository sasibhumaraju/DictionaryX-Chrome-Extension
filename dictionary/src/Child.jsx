import { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import { HiSpeakerWave } from "react-icons/hi2";
import Speach from './Speach.jsx'
import { IoClose } from "react-icons/io5";
import "./App.css"
import { TbLanguageHiragana } from "react-icons/tb";
import Font from 'react-font';
import { HfInference } from '@huggingface/inference';
import Loader from './Loader.jsx';
import ReactShadowRoot from 'react-shadow-root';
import languages from './languages.jsx';
import FreeIcon from './FreeIcon.jsx';


const fontFaceCss = `
  .customScroll::-webkit-scrollbar {
    width: 6px; }
  .customScroll::-webkit-scrollbar-thumb {
    background-color: #bbbdbf;
    border-radius: 6px;
    border: 2px solid transparent;
    background-clip: content-box; }
  .customScroll::-webkit-scrollbar-thumb:hover {
    background-color: gray }
  .customScroll::-webkit-scrollbar-track {
    background: #131313  ;
    border-radius: 6px; }`


const Draggable = ({ children, zIndex }) => {
  const elementRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const element = elementRef.current;
    const handleMouseDown = (event) => {
      setIsDragging(true);
      setOffset({
        x: event.clientX - element.getBoundingClientRect().left,
        y: event.clientY - element.getBoundingClientRect().top,
      });
    };

    const handleMouseMove = (event) => {
      if (!isDragging) return;
      const viewportWidth = innerWidth;
      const viewportHeight = innerHeight;
      let newLeft = event.clientX - offset.x;
      let newTop = event.clientY - offset.y;
      const max = (x,y) => x>y? x:y
      const min = (x,y) => x<y? x:y
      newLeft = max(0, min(viewportWidth - element.offsetWidth, newLeft));
      newTop = max(0, min(viewportHeight - element.offsetHeight, newTop));
      element.style.left = `${newLeft}px`;
      element.style.top = `${newTop}px`;};
    const handleMouseUp = () => { setIsDragging(false); };
    element.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      element.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, offset]);

  return (
    <div ref={elementRef} style={{
      position: 'fixed',
      cursor: 'grab',
      width: '340px',  
      height: '255px' ,
      visibility:"hidden",
      top:"10px",
      right:"10px",
      backgroundColor: 'red',
      zIndex:`${zIndex+20}`}}>{children}</div>);
};


function Child() {
    const [word, setWord] = useState(null);
    const [showDialog, toggleShowDialog] = useState(false);
    const [defination, setDefination] = useState("");
    // const [meaningLangScreen, toggleMeaningLangScreen] = useState(true);
    var [isLangHoveredList, setIsLangHoveredList] = useState(new Array(languages.length).fill(false));
    const [currentScreen,setCurrentScreen] = useState(meaningScreen);
    const [currentScreenName,setCurrentScreenName] = useState("meaning");
    const [innerWidth, setInnerWidth] = useState(`${window.innerWidth}px`);
    const [innerHeight,setInnerHeight] = useState(`${window.innerHeight}px`)


  //  selecting lanuage
  const selectLanguage = (langCode) => {
    localStorage.setItem("dictionaryx_lang",langCode);
    // toggleMeaningLangScreen(true);
    setCurrentScreen(meaningScreen)
    resetIsLangHoveredListFunction()
    if(defination) {
      const text = defination;
      translater(text,langCode)
      setDefination(null)
    }
  }

  // resets all IsLangHoveredList to all false
  const resetIsLangHoveredListFunction = () => {
    setIsLangHoveredList(new Array(languages.length).fill(false));
  }

  // hover language in lang screen 
  const toggleIsLangHoveredListFunction = (index) => {
    isLangHoveredList[index] = !isLangHoveredList[index]
    const newHoverList = [...isLangHoveredList];
    setIsLangHoveredList(newHoverList);
  }


  // Open Dialog
  const openDictionaryDailog = () => {   
    toggleShowDialog(true)
  } 

  // Closes Dialog
  const closeDictionaryDailog = () => {
    toggleShowDialog(false)
    setDefination(null);
    resetIsLangHoveredListFunction()
    setWord(null);
    Speach.stop()
  }

  // Gets current size of window by resize event listener to support drag boundaries
  useEffect(() => {
    const handleSelectionChange = () => {
      setInnerHeight(`${window.innerHeight}px`)
      setInnerWidth(`${window.innerWidth}px`)
    };
    window.addEventListener("resize", handleSelectionChange);
    return () => window.removeEventListener("resize", handleSelectionChange);
  },[word]); 

  // Excutes while user double clicks on any word in web page
  useEffect(() => { 
    const handleDoubleClick = () => {
        const selectedText = window.getSelection().toString().trim();
        if(selectedText !== ""  && selectedText !== null) {
            // toggleMeaningLangScreen(true);
            setCurrentScreen(meaningScreen)
            setDefination(null)
            openDictionaryDailog();
            setWord(selectedText); 
            getMeaning(selectedText)
        }
    };
    document.addEventListener("dblclick", handleDoubleClick);
    return () => document.removeEventListener("dblclick", handleDoubleClick);
  }, [word]); 

  // Sets Dialog on top of all elements in web page


  

  const getMeaning = async (word) => {
    const translatedEnglishWord = await axios.get(`${import.meta.env.DICTIONARY_TRANSLATE_API}?text=${word}&lang=en`)
    setWord(translatedEnglishWord.data.translatedText)
    const hf = new HfInference(import.meta.env.DICTIONARY_AI_API_TOKEN);
    const prompt = `Provide a concise, detailed and very simple direct definition of the word "${translatedEnglishWord.data.translatedText}" in 1 lines, understandable by anyone. and do not show number of characters in end you are showing everytime.`
    const meaningObj = await hf.chatCompletion({
            model: import.meta.env.DICTIONARY_AI_MODEL_API,
            messages: [
              { role: "user", content: prompt },
            ],
            max_tokens: 500,
            temperature: 0.5,
            seed: 0 })
    const meaning =  meaningObj.choices[0].message.content;
    const currentLang = localStorage.getItem("dictionaryx_lang") || "en";
    currentLang === "en"? setDefination(meaning) : translater(meaning,currentLang)
  }

  const translater =async (text,currentLang) => {
    console.log("current lang - ", currentLang) 
    setDefination((await axios.get(`https://script.google.com/macros/s/AKfycbz_s6XnC79u2BNW4wiikvhrnXE5xMdx3K1oP6YblPn0Qrc9U2b8UxDJEglu330-GXd47Q/exec?text=${text}&lang=${currentLang}`)).data.translatedText)
  }

  const speekWord = () => {
    Speach.stop()
    Speach.start(word)
  }

  useEffect(() => {
    const handleBeforeUnload = () => Speach.stop();
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  },[]);

  // const toggleMeaningLangScreenFunction = () => {
  //   resetIsLangHoveredListFunction()
  //   toggleMeaningLangScreen(!meaningLangScreen)
  // }

  const getLanguageNameAndSelectionStatus = (language,langCode) => {
    const currentLangCode = localStorage.getItem("dictionaryx_lang") || "en";
    const freeIcon = langCode === "en"? null: <FreeIcon/>
    if(langCode === currentLangCode ) return <p style={{padding:"0px",margin:"0px"}}>{language} : <b style={{fontSize:"15px", color:"#90EE90"}}>selected</b>{freeIcon}</p>;
    else return <>{language} {freeIcon}</> ;
  }

  var langScreen =  <div className='customScroll' style={{
    width:'calc(100% - 0px)',
    height: 'calc(145px - 0px)',
    overflowX: 'hidden',
    overflowY: 'auto',
    paddingTop:"10px", 
    paddingBottom:"10px",  
    margin: '0px'}}>

    {languages.map((langObj,index)=>{
      return (
        <div onClick={()=>selectLanguage(langObj.code)} onMouseEnter={()=>{toggleIsLangHoveredListFunction(index)}} onMouseLeave={()=>toggleIsLangHoveredListFunction(index)} key={index} style={{
          fontSize: '14.6px',
          fontWeight: '500',
          marginBottom: '0px',
          marginTop: '0px',
          lineHeight: '28.5px',
          cursor:"pointer",
          textAlign:"left",
          marginLeft:"0px",
          paddingLeft:"35px",
          overflowWrap: 'break-word',
          position:"relative",
          backgroundColor: (isLangHoveredList[index])? "#041d49" : "transparent",
          color:"#dfe0e0"}}>{getLanguageNameAndSelectionStatus(langObj.lang,langObj.code)}
        </div>)})}
  </div>

  var meaningScreen =  <div className='customScroll' style={{
    backgroundColor:"transparent",
    height:"145px",
    width:"calc(100% - 55px)",
    paddingLeft:"35px",
    paddingRight:"20px",
    paddingTop:"10px",
    paddingBottom:"10px",
    overflowX:"hidden",
    overflowY:"auto" ,
    }}>
      {defination &&
      <div className='meaning_box' style={{
        fontSize: '15.6px',
        fontWeight: '500',
        marginBottom: '10px',
        lineHeight: '19.5px',
        wordSpacing: "1.0px",
        letterSpacing:"0.2px",
        overflowWrap: 'break-word',
        color:"#dfe0e0"}}> {defination} </div>}
      {!defination &&
      <div style={{
        width:"100%", 
        height:"90%", 
        display:"flex",
        justifyContent:"center",
        alignItems:"center"}}> <Loader/>
      </div> }
  </div>

  const screenSelect = (cs) => {
      const newCS = cs===currentScreenName? "meaning" : cs;

      const setScreen = (newCurrentScreen,newCurrentScreenName) => {
        setCurrentScreen(newCurrentScreen);
        setCurrentScreenName(newCurrentScreenName);
      }

      switch(newCS) {
        case "theme": ""; break;
        case "lang":resetIsLangHoveredListFunction(); setScreen(langScreen,"lang"); break;
        case "meaning": setScreen(meaningScreen,"meaning"); break;
      }
  }
 
return(
  <div id='shadow_child_dictionary_x' style={{ visibility:"hidden"}} >
    <ReactShadowRoot >
        <Draggable word={word}>
        <style>{fontFaceCss}</style>
        <Font family='Nunito'>
          <dialog 
            open={showDialog} id='dailog_dictionary_x' style={{
            visibility:"visible",
            borderRadius: '3px',
            borderTopRightRadius : '20px',
            borderBottomLeftRadius: '20px',
            borderBottomRightRadius: '3px',
            textOverflow: 'clip',
            textWrap: 'wrap',
            boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
            width: '340px',
            height: '255px',
            padding: '0px',
            margin: '0px',
            border: 'none',
            overflow: 'hidden',
            color: '#e1e5e9',
            backgroundColor:"#131313"}}>
            
            <main className='container_dictionary_x' style={{
              width: '100%',
              height: '230px',
              overflowY: 'hidden',
              overflowX: 'hidden',
              margin: '0px',
              padding: '0px 0px'}}>

              {/* Nav Bar Container  */}
              <div className='card_dictionary_x' style={{
                width: 'calc(100% - 20px)',
                padding: '5px 10px',
                height: "40px",
                margin: '0px',
                cursor:'grab',
                display: "flex",
                alignItems:"center"}}>
              
              {/* title containing 1) speacker button 2)word text 3) langMeaningToggle button 4)close dailog button */}
                <div className='title_dictionay_x' style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'start',
                  alignItems: 'center',
                  overflow: 'hidden',
                  position: 'relative',
                  height: "30px"}}>

                  {/* 1) speaker button */}
                  <div  onClick={speekWord}
                    id='audio_dictionary_x_ref' 
                    style={{
                    minWidth: '30px',
                    height: '30px',
                    display: "flex" ,
                    borderRadius: '50%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '15px',
                    cursor: 'pointer',
                    marginRight: '8px',
                    marginLeft:"10px",
                    backgroundColor: "#8AB4F8",
                    background:"linear-gradient(125deg,#886eb5,#487eec) ",
                    color:"black"}}><HiSpeakerWave /></div> 

                  {/* 2) word text */}
                  <div className='title_word_dictionay_x' style={{
                    fontWeight: '600',
                    fontSize: '16.6px',
                    marginBottom: '0px',
                    marginLeft: "10px",
                    letterSpacing:"0.5px",
                    width:"180px",
                    textOverflow:"ellipsis",
                    whiteSpace:"nowrap",
                    overflow:"hidden",
                    textTransform:"lowercase",
                    color:"#dfe0e0",}}>{word}</div>  

                  {/* 3) langMeaning toggle button */}
                  <div id="lang_dictionary_x" onClick={()=>screenSelect("lang")} style={{  
                    position: "absolute", 
                    right: "42px", top: "0px", 
                    cursor : "pointer", 
                    height: "30px", 
                    width: "30px",  
                    display:"flex",
                    justifyContent:"center", 
                    alignItems:"center",
                    fontSize:"23px", 
                    fontWeight:"bold", 
                    color:"#dfe0e0",}}> <TbLanguageHiragana/> </div>

                  {/* 4) close dialog buton */}
                  <div id="close_dictionary_x" onClick={closeDictionaryDailog} style={{  
                    position: "absolute", 
                    right: "5px", 
                    top: "0px", 
                    cursor: "pointer", 
                    height: "30px", 
                    width: "30px",  
                    display:"flex",
                    justifyContent:"center", 
                    alignItems:"center",
                    fontSize:"23px", 
                    fontWeight:"bold", 
                    color:"#dfe0e0" }}> <IoClose /> </div>
                </div>
              </div>
               
             {currentScreen}
            </main>

            {/* Footer */}
            <div className='footer' style={{
              width: 'calc(100% - 40px)',
              padding: "0px 20px",
              position: 'absolute',
              display:"flex",
              flexDirection:"column",
              bottom: 0,
              left: 0,
              gap: '0px',
              marginBottom: '0px',
              fontWeight: "bold"}}>
              <div style={{
                width:"100%",
                height:"10px",
                backgroundColor:"transparent",
                fontSize:"8.5px",
                color:"#8AB4F8",
                fontWeight:"100",
                marginBottom:"15px",
                display:"flex",
                justifyContent:"flex-end ",
                gap:"15px",
                letterSpacing:"0.2px"}}>
                <span style={{color:"#dfe0e0",}}> Integrated with AI ✨ </span>
              </div>
            </div>
          </dialog>
        </Font>
        </Draggable>
    </ReactShadowRoot>
  </div>)}

export default Child;


