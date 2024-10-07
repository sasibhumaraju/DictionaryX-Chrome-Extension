import React, { useEffect, useState } from 'react';

const Loader = () => {
  const [width, setWidth] = useState(0);
  const [left, setLeft] = useState(-10000);

  useEffect(() => {
    const interval = setInterval(() => {
      setWidth((prevWidth) => (prevWidth < 100 ? prevWidth + 1.5 : clearInterval(interval)));
    }, 1); // Increase width every 20ms

    const interval2 = setInterval(() => {
      setLeft((prevLeft) => (prevLeft < -15 ? prevLeft + 2 : -10000));
    }, 6); // 

    return () =>{ clearInterval(interval); 
      clearInterval(interval2)
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor:"#131313", display: 'flex', justifyContent: 'start', alignItems: 'start', flexDirection:"column" }}>
      <div style={{
         marginBottom: '3px',
        //  marginTop: '5px',
        //  marginLeft:"13px",
        width: ` calc( ${width}% - 0px)`,
        height: '16px',
        borderRadius:"5px",
        backgroundColor: '#487eec',
        transition: 'width 0.1s linear',
        overflow:"hidden",
        position:"relative"
      }}>
        <div style={{
          position:"absolute",
          left: `${left}px`,
           height: '16px',
           width:"20000px",
          //  backgroundColor:"red",
           background: 'linear-gradient(90deg, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec)'
        }}></div>
      </div>

      <div style={{
         marginBottom: '3px',
         marginTop: '5px',
        //  marginLeft:"13px",
         width: ` calc( ${width}% - 0px)`,
        height: '16px',
        borderRadius:"5px",
        backgroundColor: '#487eec',
        transition: 'width 0.1s linear',
          overflow:"hidden",
           position:"relative"
      }}>
       <div style={{
          position:"absolute",
          left: `${left}px`,
           height: '16px',
           width:"20000px",
          //  backgroundColor:"red",
           background: 'linear-gradient(90deg, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec)'
        }}></div>
      </div>

      <div style={{
         marginBottom: '3px',
         marginTop: '5px',
        //  marginLeft:"13px",
         width: ` calc( ${width}% - 83px)`,
        height: '16px',
        borderRadius:"5px",
        backgroundColor: '#487eec',
        transition: 'width 0.1s linear',
          overflow:"hidden",
          position:"relative"
      }}>
         <div style={{
          position:"absolute",
          left: `${left}px`,
           height: '16px',
           width:"20000px",
          //  backgroundColor:"red",
           background: 'linear-gradient(90deg, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec, #202124, #487eec)'
        }}></div>
      </div>
    </div>
  );
};

export default Loader;
