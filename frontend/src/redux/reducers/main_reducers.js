const initState = {
    noteList: []
}

const main_reducers = (state = initState, action)=>{
    switch (action.type) {
        case 'SUCCESS_SET_NOTES':
            return state = {...state, noteList: action.payload}
        case 'SUCCESS_ADD_NOTE':
            return state = {...state, noteList: [action.payload, ...state.noteList]}
        default:
            return state
    }
}

export default main_reducers
