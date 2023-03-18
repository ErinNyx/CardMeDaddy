import './index.scss';
import Navbar from '../Navbar';
import { io } from 'socket.io-client';
import { useState, useEffect } from "react";
import {NavLink} from "react-router-dom";
import {toBePartiallyChecked} from "@testing-library/jest-dom/dist/matchers";

const socket = io();
socket.on('alert', (msg) => {
    alert(msg);
});

socket.on('redirect', (link) => {
    window.location.href = link;
});

const Create = () => {
    document.addEventListener('keyup', (e) => {
        e.preventDefault();
        if (e.key === 'ENTER') crHandler(e);
    });

    const init = (
        <div>
            Loading . . .
        </div>
    );

    const crInit = (
        <>
            <form className={'settings'} onSubmit={(e) => e.preventDefault()}>
                <label name={ 'blank' }><input type={ 'checkbox' }/>Add Blank Cards?</label>
                <label name={ 'rounds' }>Enter number of rounds: <input type={'number'} value={'10'} /></label>
                <label name={ 'timeout' }>If you want to disable player timeout, remove the number in this box. If you want to change how long the timeout is,
                    this box takes a number in seconds. Default is 5 minutes. <input type={'number'} value={'300'} /></label>
            </form>
            <a className={ 'cr-add' }>
                <input type={ 'text' } placeholder={'Custom CR Cast decks can be added with the deck code'} id={ 'cr-cast-input' } />
                <input type={'submit'} onClick={ (e) => crHandler(e) } value={ 'Add CR Cast Deck' } id={ 'cr-cast-submit' } />
            </a>
            <h3>Added CR Packs</h3>
        </>
    );

    const [packs, setPacks] = useState(init);
    let [crPacks, setCR] = useState(crInit);

    async function crHandler(e) {
        e.preventDefault();
        // https://api.crcast.cc/v1/cc/decks/
        var id = document.getElementById('cr-cast-input').value;
        if(!id) return alert('Please enter a CR Cast ID');

        const pack = await fetch('/api/cr-cast', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                deck: id
            })
        }).then((res) => res.json());

        if(pack.error > 1) return alert('Invalid pack, please check that you entered the right code.');

        const packID = ( <label className={ 'pack-container' }>
            <input type={ 'checkbox' } className={'cr'} value={ id } checked={true} onClick={(e) => {
            e.target.checked ? e.target.checked = false : e.target.checked = true;
        } } /> { pack.name }: { pack.description } </label>);
        const add = (
            <>
                { crPacks }
                { packID }
            </>
        );

        crPacks = add;

        setCR(add);
    }

    useEffect(() => {
        (async () => {
            const getPacks = await fetch('https://www.restagainsthumanity.com/api/v2/packs', {
                method: 'GET'
            }).then((res) => res.json());

            setPacks(
                (
                    <div className={ 'column-wrapper' }>
                        <p id={ 'pre-title' }>Premade Packs</p>
                        <div id={ 'base-packs' }>
                            { getPacks.map((p) => (
                                    <label className={ 'pack-container' }>
                                        <input type={ 'checkbox' } className={'cah'} value={ p.split(" ").join("%20").trim() } />
                                        { p }
                                    </label>
                                )
                            )}
                        </div>
                    </div>
                )
            );
        })();
    });

    return (
        <>
            <Navbar />

            <div className={ 'main' }>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />

                <form id={ 'game-create' }>
                    <div className={ 'row-wrapper' }>
                        { packs }
                        <div className={ 'column-wrapper' } id={ 'cr-cast-div' }>
                            <h1> CR Cast <i className={ 'fa fa-question-circle' }>
                                <p className={ 'hide-tip' }>CR Cast is a custom deck builder for cards against humanity. To import your deck, please copy the deck code (the url will not work) and
                                paste into the field. <NavLink to={'https://cast.clrtd.com/'}>Visit CR Cast to make your deck today!</NavLink></p>
                            </i></h1>
                            { crPacks }
                        </div>
                    </div>

                    <div id={ 'create-game-top' }>
                        <input type={'text'} placeholder={ 'Password, if left blank game will be public' } />
                        <input type={ 'submit' } value={ 'Start Game!' } onClick={ (e) => {
                            e.preventDefault();

                            const cah = [], cr =[];
                            let settings = document.querySelectorAll('.settings label input');

                            document.querySelectorAll('.cah').forEach((d) => {
                                if(d.checked == true) cah.push(d.value);
                            });

                            document.querySelectorAll('.cr').forEach((d) => {
                                if(d.checked == true) cr.push(d.value);
                            });

                            socket.emit('start-game',
                                {
                                    id: localStorage.getItem('id'),
                                    cah,
                                    cr,
                                    settings
                                })
                        }
                        } />
                    </div>
                </form>
            </div>
        </>
    );
}

export default Create;