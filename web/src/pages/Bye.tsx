import React from 'react';
import { useByeQuery } from "../generated/graphql";


interface Props {

}

export const Bye: React.FC<Props> = () => {
    const { data, error } = useByeQuery({
        fetchPolicy: 'network-only'
    });
    if(error) {
        console.log(error);
        return <div>Error</div>
    }
    if (!data) {
        return <div>No Data</div>
    }
    return <div>{JSON.stringify(data)}</div>
}
