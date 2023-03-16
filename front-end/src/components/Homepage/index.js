import './index.scss';
import Navbar from '../Navbar';
import { io } from 'socket.io-client';
import { useState, useEffect } from "react";
import {NavLink} from "react-router-dom";

const socket = io();
socket.on('alert', (msg) => {
    alert(msg);
});

socket.on('redirect', (link) => {
    window.location.href = link;
});

const Homepage = () => {
    const init = (
        <div className={ 'game-options' }>
            <NavLink to={ '/create-game' }>+ Create Game</NavLink>

            <a onClick={
                () => {
                    const page = (
                        <div className={ 'game-options' }>
                            <form onSubmit={ (e) => {
                                e.preventDefault();
                                socket.emit('join-game', {
                                    code: document.getElementById('join-code').value,
                                    id: localStorage.getItem('id')
                                });
                            }}>
                                <input type={ 'text' } placeholder={ 'Game Code' } id={ 'join-code' } />
                                <input type={ 'submit' } value={ 'Go' } />
                            </form>

                            OR
                            Join Public
                        </div>
                    );

                    return setMain(page);
                }
            }>+ Join Game</a>
        </div>
    );

    const [main, setMain] = useState(init);

    return (
        <div className={ 'home' }>
            <Navbar />

            { main }
        </div>
    );
}

export default Homepage;