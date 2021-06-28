import * as UI from "@haas/ui";
import {
  ArrowLeft,
  User,
  Plus,
  Briefcase,
  AlignLeft,
  PhoneIncoming,
  Edit,
} from "react-feather";
import Select, { components } from "react-select";

import { Div, Flex, Grid, PageTitle } from "@haas/ui";
import Dropdown from "components/Dropdown";
import { debounce } from "lodash";
import styled, { css } from "styled-components";

import { useHistory } from "react-router";
import { useTranslation } from "react-i18next";
import React, { useState, useEffect } from "react";
import {
  PaginationSortByEnum,
  PaginationWhereInput,
  SystemPermission,
  useGetWorkspaceAdminsQuery,
  useGetWorkspaceUsersConnectsQuery,
} from "types/generated-types";

import SearchBar from "components/SearchBar/SearchBar";
import {
  Stack,
  Skeleton,
  Tag,
  Avatar,
  TagLabel,
  InputGroup,
  InputLeftElement,
  Input,
  Tooltip,
  Badge,
  theme,
  InputRightElement,
} from "@chakra-ui/core";
import { GlobalPermissionList } from "./GlobalPermissionList";
import { OptionsOfPermissions } from "./OptionsOfPermissions";
import { NodePicker } from "components/NodePicker";
import { NodePickerAdmin } from "./NodePickerAdmin";
import { useNavigator } from "hooks/useNavigator";

const TableHeaderContainer = styled(UI.TableHeading)`
  background: #e6ecf4 !important;
  color: #4a5568 !important;
`;

const BackButtonContainer = styled(UI.Div)`
  cursor: pointer;
  ${({ theme }) => css`
    color: ${theme.colors.gray[600]};
    svg {
      width: 32px;
      height: auto;
    }

    :hover {
      color: ${theme.colors.gray[900]};
    }
  `}
`;

const CellContainer = styled(UI.Div)`
  cursor: pointer;
  text-align: center;
  //width:200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

const TableHeadingCellContainer = styled(UI.TableHeadingCell)`
  text-align: center;
`;

interface TableProps {
  startDate: Date | null;
  endDate: Date | null;
  searchTerm: string;
  offset: number;
  limit: number;
  pageIndex: number;
  orderBy: { by: string, desc: boolean };
}

interface DropdownInputComponentProps {
  dropdownName: string;
  placeholderValue: string;
  onClose?: () => void;
}

interface DropdownSingleValueProps {
  dropdownName: string;
  placeholderValue: string;
  row: number;
  onClose?: () => void;
}

interface IconContainerProps {
  iconColor?: string;
}

const paginationFilter: PaginationWhereInput = {
  startDate: null,
  endDate: null,
  searchTerm: "",
  offset: 0,
  limit: 8,
  pageIndex: 0,
  orderBy: [{ by: PaginationSortByEnum.Email, desc: true }],
};

const AdminOverview = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const [paginationState, setPaginationState] = useState(paginationFilter);
  const [activeSearchTerm, setActiveSearchTerm] = useState("");
  const [cellClicked, setCellClicked] = useState(false);
  const [coordinate, setCoordinate] = useState({ row: -1, col: -1 });
  const [cellValue, setCellValue] = useState("placeholder");
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [editing, setEditing] = useState(false)
  var temp: any;

  const { data, loading } = useGetWorkspaceUsersConnectsQuery({
    fetchPolicy: "cache-and-network",
    variables: {
      filter: paginationState,
    },
  });
    
  const {getWorkspacePath } = useNavigator();
  const workspacePath = getWorkspacePath();


  let listOfPermission: any[] = new Array();
  const mapPermissionsToIcons = (userPerm: any) => {
    return (
      <div>
        {userPerm.user.globalPermissions?.map((perm: any) => {
          const value = GlobalPermissionList(perm);
          listOfPermission.push(value);
        })}
      </div>
    );
  };
  const nullMaker = () => {
    listOfPermission = [];
  };

  //   const IconContainer = styled(UI.Div)<IconContainerProps>`
  //  ${({ theme, iconColor }) =>  css`
  //    color:${theme.colors[iconColor][400]};

  //  `}
  // `

  const IconContainer =
    styled(UI.Div) <
    IconContainerProps >
    `
    
 ${({ theme, iconColor }) => css`
 ${UI.Icon} svg {
   fill: currentColor;
 }
   ${iconColor &&
   css`
     color: iconColor;
   `}
 `}
`;

  const displayPermissionsToIcons = (userPerm: any) => {
    let copy_userPerm = userPerm;
    mapPermissionsToIcons(copy_userPerm);

    return (
      <div>
        <UI.Div style={{ display: "flex", flexWrap: "wrap" }}>
          {listOfPermission?.map((item) => {
            let domain = item.domain.charAt(0);
            let labelBgColor;
            if (domain === "C") labelBgColor = "green";
            else if (domain === "D") labelBgColor = "red";
            else if (domain === "E") labelBgColor = "purple";
            else labelBgColor = "yellow";
            return (
              <IconContainer>
                <Tag rounded="full" size="sm" mt={1}>
                  <Tooltip
                    aria-label="test"
                    label={item.label}
                    key={item.label}
                  >
                    <UI.Icon
                      // bg={item.bg}
                      color={item.color}
                      height="2rem"
                      width="2rem"
                      stroke={item.stroke || undefined}
                      style={{ flexShrink: 0,  }}
                      mr={3}
                    >
                      <item.icon />
                    </UI.Icon>
                  </Tooltip>
                  <Badge variantColor={labelBgColor} fontSize="0.8em">
                    {item.domain.charAt(0).toUpperCase()}
                  </Badge>
                </Tag>
              </IconContainer>
            );
          })}
        </UI.Div>
      </div>
    );
  };

  const handleChange = (e: any) => {
    setActiveSearchTerm(e.target.value);
    debounce(e.target.value);
  };

  const SelectStyle = {
    option: (styles: any) => {
      return {
        ...styles,
        color: "teal",
      };
    },
  };

  var options: any[] = new Array();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tempVal = e.target.value;
    setFName(tempVal);
    console.log(fName);
  };

  const DropDownSingleValue = ({
    dropdownName,
    placeholderValue,
    row,
    onClose,
  }: DropdownSingleValueProps) => {
    temp = data?.usersConnection?.userCustomers[row].user.globalPermissions;
    options.push({
      value: temp,
      label: temp,
    });
    var list: String;
    var ar: String[] = new Array();

    function fillArray(ar: String[]) {
      let count = 0;
      ar[0] = ar[0].substring(9);

      for (var i = 0; i < ar.length - 1; i++) {
        options[count] = {
          value: ar[i],
          label: (
            <>
              {i % 2 == 0 ? (
                <span style={{ backgroundColor: "#E5F8FB", color: "#00B8D9" }}>
                  {ar[i]}
                </span>
              ) : (
                <span style={{ backgroundColor: "#FFF3E5", color: "#FF8D00" }}>
                  {ar[i]}
                </span>
              )}
            </>
          ),
        };
        count++;
      }
    }

    return (
      <>
        <UI.Div style={{ width: "298px" }}>
          {options.map((op) => {
            list += op.label + ",";
            ar = list.split(",");
          })}

          {fillArray(ar)}

          <NodePickerAdmin
            items={OptionsOfPermissions}
            onClose={onClose}
            SelectOptions={options}
          />

          {/* <Select
            defaultValue={options}
            options={OptionsOfPermissions}
            isMulti
            menuIsOpen
            closeMenuOnSelect={true}
            styles={SelectStyle}
          /> */}
          {(options = [])}

          {(ar = [])}
        </UI.Div>
      </>
    );
  };

  const DropdownInputValue = ({ dropdownName,placeholderValue,  onClose }: DropdownInputComponentProps) => {


    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const [innerEdit, setInnerEdit] = useState(false)


    const handleInnerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const tempVal = e.target.value;
      setFirstName(tempVal);
      console.log(firstName);
      
      // const showEditing = setInterval(()=>{
      //   setInnerEdit(innerEdit => innerEdit= false)
      // },3000)

      console.log(editing)
       setInnerEdit(innerEdit => innerEdit=true)
       setEditing(editing => editing=true)
  };

    return (
      <>
        <UI.Div>
          <Dropdown placement="bottom-end">
            {({ onOpen }) => (
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<Edit color="teal" />}
                />
                <Input
                  focusBorderColor="teal"
                  style={{ color: "maroon" }}
                  value={firstName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleInnerInputChange(e);
                    const changeval = e.target.value;
                    console.log(changeval);
                  }}
                />
                <InputRightElement
                 children={<UI.CloseButton 
                   onClose={()=>{setEditing(false)
                  //console.log(editing) 
                  }}
                  />}
                  onClick={onClose}
                   
                />
              </InputGroup>
            )}
          </Dropdown>
        </UI.Div>
      </>
    );
  };

  //** ANCHOR REACT SELECT TO THE TABLE CELL */

  const PermissionList = () => {
    data?.usersConnection?.userCustomers?.map((item) => {
      temp = item.user.globalPermissions;
    });
    return <></>;
  };

  return (
    <>
      <UI.ViewHeading>
        <UI.Stack>
           <UI.Breadcrumb to={workspacePath}>{t('back_to_campaigns')}</UI.Breadcrumb>
          <UI.Stack isInline alignItems="center" spacing={4}>
            {/* <BackButtonContainer onClick={() => history.goBack()}>
              <ArrowLeft />
            </BackButtonContainer> */}

            <PageTitle>{t("views:admin_overview")}</PageTitle>
            <Flex
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
            >
              {/* <UI.Button leftIcon={Plus} size="sm" variantColor="teal">
                Edit Permission
                
              </UI.Button> */}
              {editing ?
              <Div>
                <img
                src="https://i.pinimg.com/originals/65/ba/48/65ba488626025cff82f091336fbf94bb.gif"
                width="70px"
                >
                </img>
              </Div>:<Div ></Div>

            }
              <Div ml={500}>
                <SearchBar
                  activeSearchTerm={activeSearchTerm}
                  onSearchTermChange={handleChange}
                />
              </Div>
            </Flex>
          </UI.Stack>
        </UI.Stack>
      </UI.ViewHeading>

      <div>
        <UI.ViewContainer>
          <UI.Card noHover>
            <UI.Div p={2}>
              <UI.Table width="100%">
                <TableHeaderContainer>
                  <TableHeadingCellContainer style={{ textAlign: "center" }}>
                    <span style={{ display: "inline-block" }}>
                      {t("admin:userId")}
                      <User
                        color="teal"
                        size={16}
                        style={{ float: "left", marginRight: "2px" }}
                      />
                     
                    </span>
                  </TableHeadingCellContainer>
                  <TableHeadingCellContainer style={{ textAlign: "center" }}>
                    <span style={{ display: "inline-block" }}>
                      {t("admin:userFName")}
                      <AlignLeft
                        color="teal"
                        size={18}
                        style={{ float: "left", marginRight: "2px" }}
                      />
                    </span>
                  </TableHeadingCellContainer>
                  <TableHeadingCellContainer style={{ textAlign: "center" }}>
                    <span style={{ display: "inline-block" }}>
                      {t("admin:userLName")}
                      <AlignLeft
                        color="teal"
                        size={18}
                        style={{ float: "left", marginRight: "2px" }}
                      />
                    </span>
                  </TableHeadingCellContainer>
                  <TableHeadingCellContainer style={{ textAlign: "center" }}>
                    <span style={{ display: "inline-block" }}>
                      {t("admin:userPermissions")}
                      <Briefcase
                        color="teal"
                        size={18}
                        style={{
                          float: "left",
                          marginRight: "2px",
                          marginTop: "-3px",
                        }}
                      />
                    </span>
                  </TableHeadingCellContainer>
                </TableHeaderContainer>
                <UI.TableBody>
                  {loading ? (
                    <UI.Stack spacing={3} mt={2}>
                      <Skeleton
                        height="20px"
                        colorStart="grey"
                        colorEnd="teal"
                        width="468%"
                      />
                      <Skeleton
                        height="20px"
                        colorStart="grey"
                        colorEnd="turquoise"
                        width="468%"
                      />
                      <Skeleton
                        height="20px"
                        colorStart="grey"
                        colorEnd="teal"
                        width="468%"
                      />
                      <Skeleton
                        height="20px"
                        colorStart="grey"
                        colorEnd="turquoise"
                        width="468%"
                      />
                      <Skeleton
                        height="20px"
                        colorStart="grey"
                        colorEnd="teal"
                        width="468%"
                      />
                      <Skeleton
                        height="20px"
                        colorStart="grey"
                        colorEnd="turquoise"
                        width="468%"
                      />
                      <Skeleton
                        height="20px"
                        colorStart="grey"
                        colorEnd="teal"
                        width="468%"
                      />
                      <Skeleton
                        height="20px"
                        colorStart="grey"
                        colorEnd="turquoise"
                        width="468%"
                      />
                    </UI.Stack>
                  ) : (
                    <>
                       {console.log(data)}
                      {data?.usersConnection?.userCustomers?.map(
                        (item, index) => (
                          <UI.TableRow key={item.user.id}>
                            <UI.TableCell>
                              {cellClicked === false ? (
                                coordinate.col === index &&
                                coordinate.row === 0 ? (
                                  <UI.Div
                                    style={{ textAlign: "center" }}
                                    onClick={() => {
                                      setCellValue(item.user.id);
                                      setCellClicked(true);
                                    }}
                                  >
                                 
                                   {item?.user.id}
                                  </UI.Div>
                                ) : (
                                  <UI.Div
                                    style={{ textAlign: "center" }}
                                    onClick={() =>
                                      setCoordinate({ row: 0, col: index })
                                    }
                                  >
                                    <Tag size="sm" borderRadius="full">
                                      <Avatar
                                        mr={4}
                                        src="https://www.pngkit.com/png/full/302-3022217_roger-berry-avatar-placeholder.png"
                                        size="xs"
                                        name={item?.user.id}
                                      ></Avatar>
                                      <TagLabel>{item?.user.id || ""}</TagLabel>
                                    </Tag>
                                  </UI.Div>
                                )
                              ) : (
                                <UI.Div
                                  style={{ textAlign: "center" }}
                                  onClick={() => setCellClicked(false)}
                                >
                                  <Tag size="sm" borderRadius="full">
                                    <Avatar
                                      mr={4}
                                      src="https://www.pngkit.com/png/full/302-3022217_roger-berry-avatar-placeholder.png"
                                      size="xs"
                                      name={item?.user.id}
                                    ></Avatar>
                                    <TagLabel>{item?.user.id || ""}</TagLabel>
                                  </Tag>
                                </UI.Div>
                              )}
                            </UI.TableCell>

                            <UI.TableCell>
                              {cellClicked === false ? (
                                coordinate.col === index &&
                                coordinate.row === 1 ? (
                                  <UI.Div
                                    onClick={() => {
                                      setCellClicked(true);
                                    }}
                                  >
                                    <>
                                      <Dropdown
                                        renderOverlay={({ onClose }) => (
                                          <DropdownInputValue
                                            dropdownName="singleValue"
                                            placeholderValue={cellValue}
                                            onClose={onClose}
                                          />
                                        )}
                                      >
                                        {({ onOpen, onClose }) => (
                                          <>
                                            <UI.Div
                                              style={{
                                                backgroundColor: "#FFEFD5",
                                                border: "2px solid #ECC94B",
                                                textAlign: "center",
                                                cursor: "pointer",
                                                borderRadius: "4px",
                                                fontStyle: "italic",
                                                color: "#3182CE",
                                                boxShadow:
                                                  "4px 2px 12px 6px #FFEFD5",
                                                fontWeight: "bold",
                                              }}
                                              onClick={onOpen}
                                            >
                                              {item?.user.firstName || ""}
                                            </UI.Div>
                                            <UI.Button
                                              onClick={() => {
                                                onClose();
                                                console.log("closed");
                                              }}
                                            >
                                              Close
                                            </UI.Button>
                                          </>
                                        )}
                                      </Dropdown>
                                    </>
                                  </UI.Div>
                                ) : (
                                  <UI.Div
                                    style={{
                                      textAlign: "center",
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      setCoordinate({ row: 1, col: index })
                                    }
                                  >
                                    {item?.user.firstName || ""}
                                  </UI.Div>
                                )
                              ) : (
                                <UI.Div
                                  style={{
                                    textAlign: "center",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => setCellClicked(false)}
                                >
                                  {item?.user.firstName || ""}{" "}
                                </UI.Div>
                              )}
                            </UI.TableCell>

                            <UI.TableCell>
                              {cellClicked === false ? (
                                coordinate.col === index &&
                                coordinate.row === 2 ? (
                                  <UI.Div onClick={() => setCellClicked(true)}>
                                    <>
                                      <Dropdown
                                        renderOverlay={() => (
                                          <DropdownInputValue
                                            dropdownName="singleValue"
                                            placeholderValue={cellValue}
                                          />
                                        )}
                                      >
                                        {({ onOpen }) => (
                                          <CellContainer
                                            style={{
                                              backgroundColor: "#e6ecf4",
                                              border: "2px solid #3182CE",
                                              textAlign: "center",
                                              cursor: "pointer",
                                              borderRadius: "4px",
                                              fontStyle: "italic",
                                              color: "#ECC94B",
                                              boxShadow:
                                                "4px 2px 12px 6px #bfd8f0",
                                              fontWeight: "bold",
                                            }}
                                            onClick={onOpen}
                                          >
                                            {item?.user.lastName || ""}
                                          </CellContainer>
                                        )}
                                      </Dropdown>
                                    </>
                                  </UI.Div>
                                ) : (
                                  <UI.Div
                                    style={{
                                      textAlign: "center",
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      setCoordinate({ row: 2, col: index })
                                    }
                                  >
                                    {item?.user.lastName || ""}
                                  </UI.Div>
                                )
                              ) : (
                                <UI.Div
                                  style={{
                                    textAlign: "center",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => setCellClicked(false)}
                                >
                                  {item?.user.lastName || ""}{" "}
                                </UI.Div>
                              )}
                            </UI.TableCell>

                            <UI.TableCell>
                              {cellClicked === false ? (
                                coordinate.col === index &&
                                coordinate.row === 3 ? (
                                  <CellContainer
                                    onClick={() => setCellClicked(true)}
                                  >
                                    {" "}
                                    <>
                                      <Dropdown
                                        renderOverlay={({ onClose }) => (
                                          <DropDownSingleValue
                                            dropdownName="singleValue"
                                            placeholderValue={cellValue}
                                            row={index}
                                            onClose={onClose}
                                          />
                                        )}
                                      >
                                        {({ onOpen, onClose }) => (
                                          <CellContainer
                                            onClick={onOpen}
                                            style={{
                                              backgroundColor: "#e6ecf4",
                                              border: "2px solid #319795",
                                              textAlign: "center",
                                              cursor: "pointer",
                                              width: "250px",
                                              borderRadius: "4px",
                                              fontStyle: "italic",
                                              color: "#6C7A89",
                                              boxShadow: "1px 1px 5px 5px #ccc",
                                              marginRight: "-163px",
                                            }}
                                          >
                                            {/* {item?.user.globalPermissions || ''} */}
                                            {displayPermissionsToIcons(item)}
                                            {nullMaker()}
                                            {PermissionList()}
                                          </CellContainer>
                                        )}
                                      </Dropdown>
                                    </>
                                  </CellContainer>
                                ) : (
                                  <CellContainer
                                    style={{
                                      marginRight: "-163px",
                                      width: "250px",
                                    }}
                                    onClick={() =>
                                      setCoordinate({ row: 3, col: index })
                                    }
                                  >
                                    {/* {item?.user.globalPermissions || ''} */}
                                    {displayPermissionsToIcons(item)}
                                    {nullMaker()}
                                    {PermissionList()}
                                  </CellContainer>
                                )
                              ) : (
                                <CellContainer
                                  onClick={() => setCellClicked(false)}
                                  style={{
                                    marginRight: "-163px",
                                    width: "250px",
                                  }}
                                >
                                  {/* {item?.user.globalPermissions || ''}  */}
                                  {displayPermissionsToIcons(item)}
                                  {nullMaker()}
                                  {PermissionList()}
                                </CellContainer>
                              )}
                            </UI.TableCell>
                          </UI.TableRow>
                        )
                      )}
                    </>
                  )}
                </UI.TableBody>
              </UI.Table>
            </UI.Div>
            {(data?.usersConnection?.pageInfo.nrPages || 0) > 1 && (
              <UI.PaginationFooter>
                <UI.Div style={{ lineHeight: "normal" }}>
                  Showing page
                  <UI.Span ml={1} fontWeight="bold">
                    {(paginationState.pageIndex || 0) + 1}
                  </UI.Span>
                  <UI.Span ml={1}>out of</UI.Span>
                  <UI.Span ml={1} fontWeight="bold">
                    {(data?.usersConnection?.pageInfo.nrPages || 0) + 1}
                  </UI.Span>
                </UI.Div>
                <UI.Div>
                  <UI.Stack isInline>
                    <UI.Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setPaginationState((state) => ({
                          ...state,

                          pageIndex: (state.pageIndex || 0) - 1,
                          offset: (state.offset || 0) - (state.limit || 0),
                        }))
                      }
                      isDisabled={paginationState.pageIndex === 0}
                    >
                      Previous
                    </UI.Button>
                    <UI.Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setPaginationState((state) => ({
                          ...state,

                          pageIndex: (state.pageIndex || 0) + 1,
                          offset: (state.offset || 0) + (state.limit || 0),
                        }))
                      }
                      isDisabled={
                        (paginationState.pageIndex || 0) + 1 ===
                        data?.usersConnection?.pageInfo.nrPages
                      }
                    >
                      Next
                    </UI.Button>
                  </UI.Stack>
                </UI.Div>
              </UI.PaginationFooter>
            )}
          </UI.Card>
        </UI.ViewContainer>
      </div>
    </>
  );
};

export default AdminOverview;
