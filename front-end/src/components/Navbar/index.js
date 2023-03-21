import './index.scss';
import {Link, NavLink, useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io();
socket.on('alert', (msg) => {
    alert(msg);
});


const Navbar = () => {

    const [username, setUsername] = useState('Change Name');

    useEffect( () => {
        (async () => {
            localStorage.setItem('loading', true);
            const getData = await fetch('/api/get-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: localStorage.getItem('id')
                })
            }).then((res) => res.json());

            localStorage.setItem('id', getData.id);

            socket.emit('online', {
                username: getData.username,
                id: getData.id
            });
            localStorage.setItem('loading', false);
            window.dispatchEvent(new Event('storage'));
            setUsername(getData.username);
        })();
    }, []);

    return (
        <section id={'nav'}>
            <NavLink to={'/'} id={'logo'}>
                Card Me Daddy
            </NavLink>
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css" />
            <script async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8154425255494501"
                    crossOrigin="anonymous"></script>
            <NavLink to={'https://ko-fi.com/erinargo'} target="_blank" rel="noopener noreferrer"><i className="fa fa-coffee" id={ 'coffee' } aria-hidden="true" /></NavLink>

            <form className={'change-name'} onSubmit={ (e) => {
                e.preventDefault();
                const username = document.getElementById('username').value;
                if(!username) return;

                setUsername(username);
                socket.emit('change-username', { id: localStorage.getItem('id'), username });
                document.getElementById('username').value = '';
            }}>
                <input type={'text'} placeholder={ username } id={ 'username' } />
                <input type={'submit'} value={'Change Name'}/>
            </form>
        </section>
    );
};

export default Navbar;