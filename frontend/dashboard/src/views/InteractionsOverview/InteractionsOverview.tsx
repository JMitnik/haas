import { useLazyQuery } from '@apollo/react-hooks';
import { useParams } from 'react-router';
import Papa from 'papaparse';
import React, { useEffect, useState } from 'react';

import { Div, H2, Muted } from '@haas/ui';
import getInteractionsQuery from 'queries/getInteractionsQuery'

import { InputContainer, InputOutputContainer, OutputContainer } from './InteractionOverviewStyles';
import DatePickerComponent from './DatePickerComponent';
import InteractionsView from './InteractionsView';
import SearchBarComponent from './SearchBarComponent';

interface TableProps {
  activeStartDate: Date | null;
  activeEndDate: Date | null;
  activeSearchTerm: string;
  pageIndex: number;
  pageSize: number;
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
      activeSearchTerm: '',
      pageIndex: 0,
      pageSize: 8,
      sortBy: [{ id: 'id', desc: true }],
    },
  );

  const interactions = data?.interactions?.sessions || []

  useEffect(() => {
    const { activeStartDate, activeEndDate, pageIndex, pageSize, sortBy, activeSearchTerm } = activeGridProperties;
    fetchInteractions({
      variables: {
        dialogueId: topicId,
        filter: {
          startDate: activeStartDate,
          endDate: activeEndDate,
          searchTerm: activeSearchTerm,
          offset: pageIndex * pageSize,
          limit: pageSize,
          pageIndex,
          orderBy: sortBy,
        },
      },
    })
  }, [activeGridProperties])

  const handleSearchTermChange = (newSearchTerm: string) => {
    setActiveGridProperties((prevValues) => ({ ...prevValues, activeSearchTerm: newSearchTerm }));
  }

  const handleDateChange = (startDate: Date | null, endDate: Date | null) => {
    setActiveGridProperties((prevValues) => ({ ...prevValues, activeStartDate: startDate, activeEndDate: endDate }))
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

  const pageCount = data?.interactions?.pages || 1;
  const pageIndex = data?.interactions?.pageIndex || 0;

  return (
    <Div px="24px" margin="0 auto" width="100vh" height="100vh" maxHeight="100vh" overflow="hidden">
      <H2 color="#3653e8" fontWeight={400} mb="10%"> Interactions </H2>
      <InputOutputContainer mb="5%">
        <OutputContainer>
          <Div justifyContent="center" marginRight="15px">
            <Muted style={{ fontWeight: 'bold' }}>Exports</Muted>
          </Div>
          <Div padding="8px 36px" style={{ cursor: 'pointer', borderRadius: '90px' }} onClick={handleExport} useFlex flexDirection="row" alignItems="center" backgroundColor="#c4c4c4">
            <Div style={{ fontWeight: 'bold' }}>CSV</Div>
          </Div>
        </OutputContainer>
        <InputContainer>
          <DatePickerComponent
            activeStartDate={activeGridProperties.activeStartDate}
            activeEndDate={activeGridProperties.activeEndDate}
            handleDateChange={handleDateChange}
          />
          <SearchBarComponent activeSearchTerm={activeGridProperties.activeSearchTerm} handleSearchTermChange={handleSearchTermChange} />
        </InputContainer>
      </InputOutputContainer>
      <Div style={{ background: '#fdfbfe' }} mb="1%" height="65%">
        <InteractionsView
          gridProperties={{ ...activeGridProperties, pageCount, pageIndex }}
          onGridPropertiesChange={setActiveGridProperties}
          interactions={interactions}
        />
      </Div>
    </Div>
  )
}

export default InteractionsOverview;
