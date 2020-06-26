import React, { useState } from 'react';

import { Div, Grid, H4, H5, Hr, Span } from '@haas/ui';
import { TableRowProps } from 'components/Table/TableTypes';

const RolesTableRow = ({ headers, data, index, permissions }: TableRowProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const amtCells = headers.length;
  const templateColumns = '1fr '.repeat(amtCells);
  const activePermissionIds = data.permissions.map((permission) => permission.id);

  return (
    <Grid
      gridRowGap={0}
      gridColumnGap={5}
      gridTemplateColumns={templateColumns}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {headers && headers.map(({ accessor, Cell }) => {
        const result = Object.entries(data).find((property) => property[0] === accessor);
        if (result) return <Cell value={result[1]} key={`${index}-${result[0]}`} />;

        return null;
      })}
      {isExpanded && (
        <Div useFlex flexDirection="column" backgroundColor="#f0f0f0" gridColumn="1 / -1">
          <Div padding={25}>
            <Div marginBottom={10} useFlex flexDirection="column">
              <Div useFlex flexDirection="row">
                <Div width="51%">
                  <H4 color="#999999">ROLE DATA</H4>
                  <H5 color="#c0bcbb">Available permissions</H5>
                </Div>
              </Div>
              <Div />
            </Div>
            <Hr style={{ marginBottom: '15px' }} color="#999999" />
            <Div useFlex flexDirection="column">
              <Div width="100%" marginBottom="15px">
                <H4 color="#999999">PERMISSIONS</H4>
                <H5 color="#c0bcbb">Select the permissions you want a specific role to have</H5>
              </Div>
              {/* Grid with 4 columns */}
              <Grid gridTemplateColumns="22.5% 22.5% 22.5% 22.5%">
                {permissions && permissions.map((permission, index) => (
                  <Div useFlex flexDirection="row" key={index} alignItems="center" justifyContent="center">
                    <input
                      type="checkbox"
                      disabled
                      defaultChecked={activePermissionIds.includes(permission.id)}
                    />
                    <Span color="#999999" marginLeft="5px">{permission.name}</Span>
                  </Div>
                ))}
              </Grid>
            </Div>
          </Div>
        </Div>
      )}
    </Grid>
  );
};

export default RolesTableRow;
