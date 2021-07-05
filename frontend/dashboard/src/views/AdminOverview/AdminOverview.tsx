import * as UI from "@haas/ui";
import {
  ArrowLeft,
  Plus,
  ChevronUp,
  ChevronDown
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
  Spinner,
   Popover, PopoverArrow, PopoverBody, PopoverCloseButton,
  PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, Button, Text
} from "@chakra-ui/core";
import { GlobalPermissionList } from "./GlobalPermissionList";
import { OptionsOfPermissions } from "./OptionsOfPermissions";
import { NodePicker } from "components/NodePicker";
import { NodePickerAdmin } from "./NodePickerAdmin";
import { useNavigator } from "hooks/useNavigator";
import ShowMoreButton from "components/ShowMoreButton";

const TableHeaderContainer = styled(UI.TableHeading)`
  background: #f1f1f1 !important;
  color: #706c6c !important;
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

const TableCellSelected = styled(UI.Div)`
  cursor: pointer;
  font-weight: 600;
  float:left;
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

  interface TableProps{
    startDate: Date | null,
    endDate: Date | null,
    searchTerm: string,
    offset: number,
    limit: number,
    pageIndex: number,
    orderBy: { by: string ; desc: boolean },
  }

  const paginationFilter: PaginationWhereInput = {
  startDate: null,
  endDate: null,
  searchTerm: '',
  offset: 0,
  limit: 8,
  pageIndex: 0,
  orderBy: [{ by: PaginationSortByEnum.Email, desc: true }],
 };

interface DialogueCardOptionsOverlayProps {
  onDelete: (e: React.MouseEvent<HTMLElement>) => void;
  onEdit: (e: React.MouseEvent<HTMLElement>) => void;
}


 const DialogueCardOptionsOverlay = ({ onDelete, onEdit }: DialogueCardOptionsOverlayProps) => {
  const { t } = useTranslation();

  return (
    <UI.List>
      <UI.ListHeader>{t('admin:editPermissions')}</UI.ListHeader>
      <Popover>
        {() => (
          <>
            <PopoverTrigger>
              <UI.ListItem>
                {t('delete')}
              </UI.ListItem>
            </PopoverTrigger>
            <PopoverContent zIndex={4}>
              <PopoverArrow />
              <PopoverHeader>{t('delete')}</PopoverHeader>
              <PopoverCloseButton />
              <PopoverBody>
                <Text>{t('delete_dialogue_popover')}</Text>
              </PopoverBody>
              <PopoverFooter>
                <Button
                  variantColor="red"
                  onClick={onDelete}
                >
                  {t('delete')}
                </Button>
              </PopoverFooter>
            </PopoverContent>
          </>
        )}
      </Popover>
      <UI.ListItem onClick={onEdit}>
        {t('edit')}
      </UI.ListItem>
    </UI.List>
  );
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
  const [editing, setEditing] = useState(false);
  var temp: any;

  const { data, loading } = useGetWorkspaceUsersConnectsQuery({
    fetchPolicy: "cache-and-network",
    variables: {
      filter: paginationState,
    },
  });

  {
    console.log(data);
  }
  const { getWorkspacePath } = useNavigator();
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
    let copy_listOfPermission: any[] = listOfPermission.slice(0,2);
    let moreLeftOverPermissions=listOfPermission.length
    let maxLen= copy_listOfPermission.length-1
    return (
      <div>
        <UI.Div style={{ display: "flex", flexWrap: "wrap",    border:"1px solid#BABABA",
                boxSizing:"border-box",
                borderRadius:"10px",
                width:"185px" }}>
          {copy_listOfPermission?.map((item,index) => {
            let domain = item.domain.charAt(0);
            let labelBgColor;
            if (domain === "C") labelBgColor = "green";
            else if (domain === "D") labelBgColor = "red";
            else if (domain === "E") labelBgColor = "purple";
            else labelBgColor = "yellow";

            return (
              <div className="groupTrack" style={{
             
              }}>
                {maxLen==index ? <IconContainer>
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
                      style={{ flexShrink: 0 }}
                      
                    >
                      <item.icon />
                   
                    </UI.Icon>
                  </Tooltip>
                  <Badge variantColor={labelBgColor} fontSize="0.8em">
                    {item.domain.charAt(0).toUpperCase()}
                  </Badge>
                </Tag>
                <Tag rounded="full" size="sm" mt={1}>
                 
                    <UI.Icon
                      // bg={item.bg}
                      
                      height="2rem"
                      width="2rem"
                      
                      mt={1}
                      mr={-2}
                    >
                      <Plus />
                      
                    </UI.Icon>
                  
                  <Badge fontSize="0.8em">
                    {moreLeftOverPermissions}
                  </Badge>
                </Tag>
              </IconContainer>
              :
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
                      style={{ flexShrink: 0 }}
                      
                    >
                      <item.icon />
                      
                    </UI.Icon>
                  </Tooltip>
                  <Badge variantColor={labelBgColor} fontSize="0.8em">
                    {item.domain.charAt(0).toUpperCase()}
                  </Badge>
                </Tag>
              </IconContainer>
              }
              </div>
              
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
        <UI.Div style={{ width: "345px" }}>
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

  const DropdownInputValue = ({
    dropdownName,
    placeholderValue,
    onClose,
  }: DropdownInputComponentProps) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const [innerEdit, setInnerEdit] = useState(false);

    const handleInnerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const tempVal = e.target.value;
      setFirstName(tempVal);
      console.log(firstName);

      // const showEditing = setInterval(()=>{
      //   setInnerEdit(innerEdit => innerEdit= false)
      // },3000)

      console.log(editing);
      setInnerEdit((innerEdit) => (innerEdit = true));
      setEditing((editing) => (editing = true));
    };

    return (
      <>
        <UI.Div>
          <Dropdown placement="bottom-end">
            {({ onOpen }) => (
              <Div style={{ backgroundColor:"white"}}>
              <InputGroup> 
                <Input
                size="sm"
                  focusBorderColor="teal"
                  style={{ backgroundColor:"#EAE7E7" , width:"230px", marginLeft:"4px", borderRadius:"10px"}}
                  value={firstName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleInnerInputChange(e);
                    const changeval = e.target.value;
                    console.log(changeval);
                  }}
                />
              
                <InputRightElement
                  children={
                    // <UI.CloseButton
                    //   onClose={() => {
                    //     setEditing(false);
                    //     //console.log(editing)
                    //   }}
                    // />
                    <UI.Button size="sm" style={{color:"white", backgroundColor:"teal", marginLeft:"-22px"}}>
                      Save
                    </UI.Button>
                  }
                  onClick={onClose}
                />
              </InputGroup>
              </Div>
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


  
  const handleDeleteDialogue = async (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();

    // deleteDialogue({
    //   variables: {
    //     input: {
    //       id: dialogue.id,
    //       customerSlug,
    //     },
    //   },
    // });
  };

  // TODO: Move this url to a constant or so
  const goToEditDialogue = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    // history.push(`/dashboard/b/${customerSlug}/d/${dialogue.slug}/edit`);
  };

  return (
    <>
      <UI.ViewHeading>
        <UI.Stack>
          <UI.Breadcrumb to={workspacePath}>
            {t("admin:back_to_workspace")}
          </UI.Breadcrumb>
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
              <Div ml={850}>
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
                    <Flex justifyContent="space-between">
                      <Div mt={1}>{t("admin:email")}</Div>
                      <Stack>
                        <ChevronUp size="12" strokeWidth="5"/>
                        <ChevronDown size="12"  strokeWidth="5"/>
                      </Stack>
                    </Flex>
                  </TableHeadingCellContainer>
                  <TableHeadingCellContainer style={{ textAlign: "center" }}>
                    <Flex justifyContent="space-between">
                      <Div mt={1}>{t("admin:userFName")}</Div>
                       <Stack>
                        <ChevronUp size="12" strokeWidth="5"/>
                        <ChevronDown size="12"  strokeWidth="5"/>
                      </Stack>
                    </Flex>
                  </TableHeadingCellContainer>
                  <TableHeadingCellContainer style={{ textAlign: "center" }}>
                    <Flex justifyContent="space-between">
                      <Div mt={1}>{t("admin:userLName")}</Div>
                       <Stack>
                        <ChevronUp size="12" strokeWidth="5"/>
                        <ChevronDown size="12"  strokeWidth="5"/>
                      </Stack>
                    </Flex>
                  </TableHeadingCellContainer>
                  <TableHeadingCellContainer style={{ textAlign: "center" }}>
                    <Flex>
                      <Div>{t("admin:userPermissions")}</Div>
                    </Flex>
                  </TableHeadingCellContainer>
                  <TableHeadingCellContainer style={{ textAlign: "center" }}>
                    <Flex>
                      <Div>{t("admin:workspace")}</Div>
                    </Flex>
                  </TableHeadingCellContainer>
                </TableHeaderContainer>
                <UI.TableBody>
                  {loading ? (
                    <UI.Stack spacing={3} mt={2}>
                      <Skeleton
                        height="20px"
                        colorStart="grey"
                        colorEnd="teal"
                        width="639%"
                      />
                      <Skeleton
                        height="20px"
                        colorStart="grey"
                        colorEnd="turquoise"
                        width="639%"
                      />
                      <Skeleton
                        height="20px"
                        colorStart="grey"
                        colorEnd="teal"
                        width="639%"
                      />
                      <Skeleton
                        height="20px"
                        colorStart="grey"
                        colorEnd="turquoise"
                        width="639%"
                      />
                      <Skeleton
                        height="20px"
                        colorStart="grey"
                        colorEnd="teal"
                        width="639%"
                      />
                      <Skeleton
                        height="20px"
                        colorStart="grey"
                        colorEnd="turquoise"
                        width="639%"
                      />
                      <Skeleton
                        height="20px"
                        colorStart="grey"
                        colorEnd="teal"
                        width="639%"
                      />
                      <Skeleton
                        height="20px"
                        colorStart="grey"
                        colorEnd="turquoise"
                        width="639%"
                      />
                    </UI.Stack>
                  ) : (
                    <>
                      {data?.usersConnection?.userCustomers?.map(
                        (item, index) => (
                          <UI.TableRow key={item.user.email}>
                            <UI.TableCell>
                              {cellClicked === false ? (
                                coordinate.col === index &&
                                coordinate.row === 0 ? (
                                  <UI.Div
                                   
                                    onClick={() => {
                                      setCellValue(item.user.email);
                                      setCellClicked(true);
                                    }}
                                  >
                                    <Tag size="sm" borderRadius="full">
                                      <Avatar
                                        src="https://www.pngkit.com/png/full/302-3022217_roger-berry-avatar-placeholder.png"
                                        size="xs"
                                        name={item?.user.email}
                                        mr={4}
                                      ></Avatar>
                                      <TagLabel>{item?.user.email || ""}</TagLabel>
                                    </Tag>
                                  </UI.Div>
                                ) : (
                                  <UI.Div
                               
                                    onClick={() =>
                                      setCoordinate({ row: 0, col: index })
                                    }
                                  >
                                    <Tag size="sm" borderRadius="full">
                                      <Avatar
                                        mr={4}
                                        src="https://www.pngkit.com/png/full/302-3022217_roger-berry-avatar-placeholder.png"
                                        size="xs"
                                        name={item?.user.email}
                                      ></Avatar>
                                      <TagLabel>{item?.user.email || ""}</TagLabel>
                                    </Tag>
                                  </UI.Div>
                                )
                              ) : (
                                <UI.Div
                              
                                  onClick={() => setCellClicked(false)}
                                >
                                  <Tag size="sm" borderRadius="full">
                                    <Avatar
                                      mr={4}
                                      src="https://www.pngkit.com/png/full/302-3022217_roger-berry-avatar-placeholder.png"
                                      size="xs"
                                      name={item?.user.email}
                                    ></Avatar>
                                    <TagLabel>{item?.user.email || ""}</TagLabel>
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
                                          <Flex  justifyContent="space-between">
                                          
                                            <TableCellSelected onClick={onOpen}>
                                              {item?.user.firstName || ""}
                                            </TableCellSelected>
                                          
                                            {/* <UI.Button
                                              onClick={() => {
                                                onClose();
                                                console.log("closed");
                                              }}
                                            >
                                              Close
                                            </UI.Button> */}
                                            
                                              <Spinner
                                                thickness="4px"
                                                speed="0.65s"
                                                emptyColor="gray.200"
                                                color="blue.500"
                                             
                                              />
                                           
                                          </Flex>
                                        )}
                                      </Dropdown>
                                    </>
                                  </UI.Div>
                                ) : (
                                  <UI.Div
                                    style={{
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
                                        renderOverlay={(onClose) => (
                                          <DropdownInputValue
                                            dropdownName="singleValue"
                                            placeholderValue={cellValue}
                                             onClose={onClose}
                                          />
                                        )}
                                      >
                                        {({ onOpen }) => (
                                        <Flex  justifyContent="space-between">
                                          
                                            <TableCellSelected onClick={onOpen}>
                                              {item?.user.lastName || ""}
                                            </TableCellSelected>
                                          
                                            {/* <UI.Button
                                              onClick={() => {
                                                onClose();
                                                console.log("closed");
                                              }}
                                            >
                                              Close
                                            </UI.Button> */}
                                            
                                              <Spinner
                                                thickness="4px"
                                                speed="0.65s"
                                                emptyColor="gray.200"
                                                color="blue.500"
                                             
                                              />
                                           
                                          </Flex>
                                        )}
                                      </Dropdown>
                                    </>
                                  </UI.Div>
                                ) : (
                                  <UI.Div
                                    style={{
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
                                    cursor: "pointer",
                                  }}
                                  onClick={() => setCellClicked(false)}
                                >
                                  {item?.user.lastName || ""}{" "}
                                </UI.Div>
                              )}
                            </UI.TableCell>

                            <UI.TableCell style={{}}>
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
                                              border: "1px solid #F1F1F1",
                                              cursor: "pointer",
                                              width: "168px",
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
                            <UI.TableCell>
                              {cellClicked === false ? (
                                coordinate.col === index &&
                                coordinate.row === 0 ? (
                                  <Flex
                                    flexDirection="row"
                                    justifyContent="space-evenly"
                                    style={{ fontWeight: "bold" }}
                                    onClick={() => {
                                      setCellValue(item.user.email);
                                      setCellClicked(true);
                                    }}
                                  >
                                    <Div>TO BE CONTINUED</Div>
                                    <Div> 
                                      <ShowMoreButton
                                        renderMenu={(
                                          <DialogueCardOptionsOverlay
                                            onDelete={handleDeleteDialogue}
                                            onEdit={goToEditDialogue}
                                          />
                                        )}
                                      /></Div>
                                  </Flex>
                                ) : (
                                  <Flex
                                    flexDirection="row"
                                    justifyContent="space-evenly"
                                    style={{ fontWeight: "bold" }}
                                    onClick={() =>
                                      setCoordinate({ row: 0, col: index })
                                    }
                                  >
                                    <Div>TO BE CONTINUED</Div>
                                    <Div>
                                      
                                      <ShowMoreButton
                                        renderMenu={(
                                          <DialogueCardOptionsOverlay
                                            onDelete={handleDeleteDialogue}
                                            onEdit={goToEditDialogue}
                                          />
                                        )}
                                      />
                                    </Div>
                                  </Flex>
                                )
                              ) : (
                                <Flex
                                  flexDirection="row"
                                  justifyContent="space-evenly"
                                  style={{ fontWeight: "bold" }}
                                  onClick={() => setCellClicked(false)}
                                >
                                  <Div>TO BE CONTINUED</Div>
                                  <Div style={{fontSize:"0.9rem"}}> 
                                      <ShowMoreButton
                                        renderMenu={(
                                          <DialogueCardOptionsOverlay
                                            onDelete={handleDeleteDialogue}
                                            onEdit={goToEditDialogue}
                                          />
                                        )}
                                      /></Div>
                                </Flex>
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