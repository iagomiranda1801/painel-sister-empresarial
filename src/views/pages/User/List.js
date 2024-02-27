import React, { useState } from "react"
import CIcon from "@coreui/icons-react"
import {
    cilList,
    cilArrowThickBottom,
    cilArrowThickTop,
} from "@coreui/icons"
import {
    CCard,
    CCardBody,
    CCardFooter,
    CCardHeader,
    CCol,
    CRow,
    CForm,
    CInputGroup,
    CButton,
    CCollapse,
    CTable,
    CTableHead,
    CTableHeaderCell,
    CTableBody,
    CTableRow
} from "@coreui/react"
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import {
    TextField,
} from '@mui/material'

const UserList = () => {
    const [users, setUsers] = useState([])
    const [open, setOpen] = useState(false)
    const [nome, setNome] = useState('')
    const [arrow, setArrow] = useState(false)

    async function onSignIn(e) {
        e.preventDefault()
    }

    function toggleFilter() {
        setArrow(prevState => !prevState)
    }

    return (
        <div className="animated fadeIn">
            <div style={{ position: 'fixed', zIndex: 1300 }}>
                <Backdrop open={open}>
                    <CircularProgress color='inherit' />
                </Backdrop>
            </div>
            <CCard>
                <CCardHeader style={{ color: 'white', fontWeight: 'bold' }} className="bg-secondary">
                    <CRow>
                        <CCol xs='6' lg='6' md='6'>
                            <CIcon size='md' icon={cilList} /> Filtros
                        </CCol>
                        <CCol xs='6' lg='6' md='6'>
                            <div style={{ float: 'right' }} className="card-header-actions">
                                {arrow ? (
                                    <CIcon icon={cilArrowThickTop} onClick={(e) => toggleFilter(e)}></CIcon>
                                ) : (
                                    <CIcon icon={cilArrowThickBottom} onClick={(e) => toggleFilter(e)}></CIcon>
                                )}
                            </div>
                        </CCol>
                    </CRow>
                </CCardHeader>

                <CCollapse visible={arrow}>
                    <CForm onSubmit={(e) => onSignIn(e)}>
                        <CCardBody>
                            <CRow>
                                <CCol md='6' lg='6' sm='12' xl='6' xs='12'>
                                    <CInputGroup >
                                        <TextField type='text' fullWidth id="filled-basic" label="Nome" variant="filled" onChange={e => setNome(e.target.value)} />
                                    </CInputGroup >
                                </CCol>
                            </CRow>
                        </CCardBody>
                        <CCardFooter>
                            <CButton style={{ margin: '5px' }} size='sm' color='secondary' type='submit'>Filtrar</CButton>
                            <CButton size='sm' color='danger' type='submit'>Limpar</CButton>
                        </CCardFooter>
                    </CForm>
                </CCollapse>

            </CCard>

            <CCard style={{ marginTop: '5px' }} className="">
                <CCardHeader style={{ color: 'white', fontWeight: 'bold' }} className="bg-secondary">
                    Usuários
                </CCardHeader>
                <CCardBody>
                    <CTable>
                        <CTableHead color="secondary">
                            <CTableRow>
                                <CTableHeaderCell scope="col">Nome</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {users.map((item, index) => (
                                <CTableRow key={index}>
                                    <CTableHeaderCell scope="col">{item.name}</CTableHeaderCell>
                                </CTableRow>
                            ))}
                        </CTableBody>
                    </CTable>
                </CCardBody>
            </CCard>
        </div>
    )

}

export default UserList
