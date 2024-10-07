import React from 'react'

function FreeIcon() {
  return (
    <div style={{
        width:"33px",
        height:"14px",
        outline:"solid black 1px",
        backgroundColor:"#4cb051",
        color:"black",
        position:"absolute",
        right:"10px",
        top:"7px",
        display:"flex",
        justifyContent:"space-between",
        paddingLeft:'3px',
        paddingRight:"3px",
        alignItems:"center",
        borderTopLeftRadius:"3px",
        borderBottomLeftRadius:"3px",
        borderTopRightRadius:"1000px",
        borderBottomRightRadius:"1000px",
        fontSize:"9px",
        fontWeight:"bold",
        zIndex:"10",
        transform:"rotate(357deg)",
        letterSpacing:"0.5px"}}>
       FREE <span style={{width:"4px",height:"4px",borderRadius:"50%",backgroundColor:"black"}} ></span>
    </div>
  )
}

export default FreeIcon;
