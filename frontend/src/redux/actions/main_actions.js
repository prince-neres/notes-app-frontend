export const setNotes = (notes) =>{
    return{
        type: 'SUCCESS_SET_NOTES',
        payload: notes
    }
}

export const addNote = (note) =>{
    return{
        type: 'SUCCESS_ADD_NOTE',
        payload: note
    }
}
