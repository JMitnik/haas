import React from 'react'
import Flex from '../components/UI/Flex'
import { MessageCircle } from 'react-feather';

const HeaderView = (props: any) => {
    return (
        <Flex>
            <MessageCircle />
            <h2>{props.title}</h2>  
        </Flex>
    )
};

export default HeaderView;
