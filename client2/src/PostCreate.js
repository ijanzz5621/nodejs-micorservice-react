/* eslint-disable import/no-anonymous-default-export */
import React, { useState } from "react";
import axios from 'axios';

export default () => {

    const [title, setTitle] = useState(''); 

    const onSubmit = async (event) => {
        event.preventDefault();

        await axios.post(`http://${process.env.REACT_APP_API_IP}:4000/posts`, {
            title
        });

        // empty the title
        setTitle('');
    };

    return (<div>

        <form onSubmit={onSubmit}> 
            <div className="form-group">
                <label className="mt-2">Title</label>
                <input 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    className="form-control mt-2" />
            </div>
            <button className="btn btn-primary mt-2">Submit</button>
        </form>

    </div>
    );
};