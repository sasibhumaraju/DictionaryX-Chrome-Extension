import { useEffect, useState } from 'react'
import Child from './Child.jsx';
import { createClient } from '@supabase/supabase-js';

function App() {

        const [zIndex, setZIndex] = useState(99999999999999)
       

        useEffect(()=>{
          const elements = document.getElementsByTagName("*");
          let maxZIndex = 0;
          for (let i = 0; i<elements.length; i++) {
            const zIndex = parseInt(window.getComputedStyle(elements[i]).zIndex);
            if (!isNaN(zIndex) && zIndex > maxZIndex) {
              maxZIndex = zIndex;
            }
          }
          setZIndex(maxZIndex + 1)
        },[])

       
        useEffect( ()=>{
            connectDb()
        },[])
        const connectDb = async ()=>{
          const db = createClient("https://bxdejyjvtlxcyhoduqak.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4ZGVqeWp2dGx4Y3lob2R1cWFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM1NzE3MDUsImV4cCI6MjAzOTE0NzcwNX0.wQ8OKnKY1GFTze90Iy0RDLuI_MbOlOwoM2vfFfLWkCU")
          const data = await db.from("api_keys").select()
          console.log("this is supabase response:" ,data)
        }
    
      return (
       <>
       Hello
       
      <div style={{
        position:"fixed",
        zIndex:zIndex,
        visibility:"hidden"}}>  
          <Child/>
      </div></>); 
}

  export default App

  