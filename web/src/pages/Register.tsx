import React, {useState} from 'react';
import {useRegisterMutation} from "../generated/graphql";
import { RouteComponentProps } from 'react-router-dom';


export const Register: React.FC<RouteComponentProps> = ({ history }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [register] = useRegisterMutation()
    return(
        <form onSubmit={async e => {
            e.preventDefault();
            console.log('Form Submitted');
            console.log(email, password);
            const res = await register({
                variables: {
                    email,
                    password
                }
            });
            console.log(res);
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
            <button type='submit'>Register</button>
        </form>
    );
}
