import React, { useState } from 'react';
import { RouteComponentProps } from "react-router-dom";
import { useLoginMutation } from "../generated/graphql";
import { setAccessToken } from "../accessToken";


export const Login: React.FC<RouteComponentProps> = ({ history }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [login] = useLoginMutation()
    return(
        <form onSubmit={async e => {
            e.preventDefault();
            console.log('Form Submitted');
            console.log(email, password);
            const res = await login({
                variables: {
                    email,
                    password
                }
            });
            console.log(res);
            if (res && res.data) {
                setAccessToken(res.data.login.accessToken);
            }
            history.push('/');
        }}>
            <div>
                <input
                    value={email}
                    placeholder='Email'
                    onChange={e => setEmail(e.target.value)}
                    type="text"
                />
            </div>
            <div>
                <input
                    value={password}
                    placeholder='Password'
                    onChange={e => setPassword(e.target.value)}
                    type="password"
                />
            </div>
            <button type='submit'>Login</button>
        </form>
    );
}
