import React from 'react'

import { useForm } from 'react-hook-form'
import { GridForm } from '../components/UI/GridForm'


import styled, { css } from 'styled-components';
const ExampleInput = styled.input`
    grid-column-start: 1;
    grid-column-end: 3;
`

const BasicTopicsForm = (props: any) => {
    const { register, handleSubmit, watch, errors } = useForm()
    const onSubmit = (data: any) => { console.log(data) }

    console.log(watch('example')) // watch input value by passing the name of it

    return (
        <GridForm onSubmit={handleSubmit(onSubmit)}>
                {/* register your input into the hook by invoking the "register" function */}
                <ExampleInput name="example_input" defaultValue="test2" ref={register}/>
                {/* include validation with required or other standard HTML validation rules */}
                <input name="exampleRequired" ref={register({ required: true })} />
                {/* errors will return when field validation fails  */}
                {errors.exampleRequired && <span>This field is required</span>}

                <input type="submit" />
        </GridForm>
    )
};

export default BasicTopicsForm;