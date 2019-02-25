const songs = {
    1: "Don't want to be a fool for you, Just another player in your game for two, You may hate me but it ain't no lie, Baby bye bye bye, Bye bye, I Don't want to make it tough, I just want to tell you that I've had enough, It might sound crazy but it ain't no lie, Baby bye bye bye".split(','),

    2: "We're no strangers to love, You know the rules and so do I,A full commitment's what I'm thinking of, You wouldn't get this from any other guy, I just wanna tell you how I'm feeling, Gotta make you understand, Never gonna give you up, Never gonna let you down, Never gonna run around and desert you, Never gonna make you cry, Never gonna say goodbye, Never gonna tell a lie and hurt you".split(',')
}

const initialState = {
    currentSongId: null,
    // chorus: chorus.split(','),
    songsById: {
        1: {
            songId: 1,
            songArray: songs[1],
            currentLine: 0
        },
        2: {
            songId: 2,
            songArray: songs[2],
            currentLine: 0

        }
    }
}

const nextLyricReducer = (state = initialState.songsById, action) => {
    let newArrayPosition;
    let newSongsByIdEntry;
    let newSongsByIdStateSlice;
    console.log(`nextLyricReducer called with action ${action.type}`);
    switch (action.type) {
        case 'NEXT_LYRIC':
            newArrayPosition = state.songsById[action.currentSongId].currentLine + 1;

            let songId = action.currentSongId;

            let newSongEntry = Object.assign({}, state.songsById[songId], { currentLine: newArrayPosition });

            newSongsByIdEntry = Object.assign({}, state.songsById, newSongEntry);

            newSongsByIdStateSlice = Object.assign({}, state, {
                [action.currentSongId]: newSongsByIdEntry
            });
            return newSongsByIdStateSlice;
        case 'RESTART_SONG':
            newSongsByIdEntry = Object.assign({}, state[action.currentSongId], {
                currentLine: 0
            })
            newSongsByIdStateSlice = Object.assign({}, state, {
                [action.currentSongId]: newSongsByIdEntry
            });
            return newSongsByIdStateSlice;
        default:
            newState = initialState;
    }
    return newState;
}
//needs help (newSelectedSongId not defined yet)
const switchSongReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case 'CHANGE_SONG':
            return action.newSelectedSongId
        default:
            return state;
    }
}
const rootReducer = this.Redux.combineReducers({
    currentSongId: switchSongReducer,
    songsById: nextLyricReducer
})
// Store
const store = this.Redux.createStore(nextLyricReducer);
console.log(store.getState());
store.subscribe(render);

function selectSong(newSongId) {
    let action;
    if (store.getState().currentSongId) {
        action = {
            type: 'RESTART_SONG',
            currentSongId: store.getState().currentSongId
        }
        store.dispatch(action);
    }
    action = {
        type: 'CHANGE_SONG',
        newSelectedSongId: newSongId
    }
    store.dispatch(action);
}

function userClick() {
    let state = store.getState();
    let song = state.songsById[state.currentSongId];
    if (song.currentLine === song.songArray.length - 1) {
        store.dispatch({ type: 'RESTART_SONG' });
    } else {
        store.dispatch({ type: 'NEXT_LYRIC', currentSongId: state.currentSongId });
    }
    console.log(store.getState());
}

function render() {
    let state = store.getState();
    let song = state.songsById[state.currentSongId];
    console.log(song);
    console.log('I am song at render: ' + song);
    let line = song.songArray[song.currentLine];

    document.getElementById('words').innerHTML = line;
}

window.onload = render;
