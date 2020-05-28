import React, { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import { useParams } from 'react-router';

import { H2, Muted, Div } from '@haas/ui';
import getInteractionsQuery from 'queries/getInteractionsQuery'
import { InputOutputContainer, OutputContainer, InputContainer } from './InteractionOverviewStyles';
import Papa from 'papaparse';
import DatePickerComponent from './DatePickerComponent';
import SearchBarComponent from './SearchBarComponent';
import InteractionsView from './InteractionsView';

interface TableProps {
  activeStartDate: Date | null;
  activeEndDate: Date | null;
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  sortBy: {
    id: string;
    desc: boolean;
  }[]
}

const InteractionsOverview = () => {
  const { topicId, customerId } = useParams();
  const [fetchInteractions, { loading, data }] = useLazyQuery(getInteractionsQuery, { fetchPolicy: 'cache-and-network' });
  const [activeGridProperties, setActiveGridProperties] = useState<TableProps>(
    {
      activeStartDate: null,
      activeEndDate: null,
      pageIndex: 0,
      pageSize: 8,
      pageCount: 4,
      sortBy: [{ id: 'id', desc: true }]
    });

  const interactions = data?.interactions?.sessions || []

  useEffect(() => {
    const { activeStartDate, activeEndDate, pageIndex, pageSize, sortBy } = activeGridProperties;
    fetchInteractions({
      variables: {
        dialogueId: topicId,
        filter: {
          startDate: activeStartDate,
          endDate: activeEndDate,
          offset: pageIndex * pageSize,
          limit: pageSize,
          pageIndex: pageIndex,
          orderBy: sortBy,
        },
      }
    })
  }, [activeGridProperties])

  const handleSearchTermChange = (newSearchTerm: string) => {
    console.log('New search term: ', newSearchTerm);
  }

  const handleDateChange = (startDate: Date | null, endDate: Date | null) => {
    setActiveGridProperties((prevValues) => {
      return { ...prevValues, activeStartDate: startDate, activeEndDate: endDate };
    })
  }

  const handleExport = () => {
    const csv = Papa.unparse(interactions);
    const csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const csvUrl = window.URL.createObjectURL(csvData);
    const tempLink = document.createElement('a');
    tempLink.href = csvUrl;
    const currDate = new Date().getTime();
    tempLink.setAttribute('download', `${currDate}-${customerId}-${topicId}.csv`);
    tempLink.click();
    tempLink.remove();
  }

  console.log('interactions', interactions);

  return (
    <Div px="24px" margin="0 auto" width="100vh" height="100vh" maxHeight="100vh" overflow="hidden">
      <H2 color="#3653e8" fontWeight={400} mb="10%"> Interactions </H2>
      <InputOutputContainer mb="5%">
        <OutputContainer>
          <Div justifyContent="center" marginRight='15px'>
            <Muted style={{ fontWeight: 'bold' }}>Exports</Muted>
          </Div>
          <Div padding='8px 36px' style={{ cursor: 'pointer', borderRadius: '90px' }} onClick={handleExport} useFlex flexDirection='row' alignItems='center' backgroundColor='#c4c4c4'>
            <Div style={{ fontWeight: 'bold' }}>CSV</Div>
          </Div>
        </OutputContainer>
        <InputContainer>
          <DatePickerComponent
            activeStartDate={activeGridProperties.activeStartDate}
            activeEndDate={activeGridProperties.activeEndDate}
            handleDateChange={handleDateChange} />
          <SearchBarComponent handleSearchTermChange={handleSearchTermChange} />
        </InputContainer>
      </InputOutputContainer>
      <Div style={{ background: '#fdfbfe' }} mb="1%" height="65%">
        <InteractionsView
          gridProperties={activeGridProperties}
          onGridPropertiesChange={setActiveGridProperties}
          interactions={interactions} />
      </Div>
    </Div>
  )
}

export default InteractionsOverview;
