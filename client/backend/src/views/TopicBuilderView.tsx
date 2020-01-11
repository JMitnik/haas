import React from 'react'

import HeaderView from './HeaderView'
import Container from '../components/UI/Container'

import BasicTopicDetailsView from './BasicTopicDetailsView'


const TopicBuilderView = () => {
    return (
        <Container>
            <HeaderView title='Topic Builder'/>
            
            <BasicTopicDetailsView/>
        </Container>     
    )
};

export default TopicBuilderView;

