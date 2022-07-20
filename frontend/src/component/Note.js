import React from 'react'
import '../css/noteStyle.css'
import {AiOutlineDelete} from 'react-icons/ai'

export default function Note(props){

    return(
        <div className='noteCardContainer'>
            <div className='noteCardWrapper' onClick={() => props.showModalBox(props.item)}>
               <span>
                   {props.item.text.replace(/\\n/g, '\n')}
               </span>
            </div>
            <div className='deleteButtonWrapper'>
                <AiOutlineDelete onClick={() => props.deleteNote(props.item)} className='deleteButton' disabled={true}/>
            </div>
        </div>
    )
}