import React, { useState, useEffect } from "react"
import CIcon from "@coreui/icons-react"
import {
    cilList,
    cilArrowThickBottom,
    cilArrowThickTop,
    cilMagnifyingGlass,
    cilPen,
    cilTrash
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
    CTableRow,
    CTableDataCell
} from "@coreui/react"
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import {
    TextField,
} from '@mui/material'
import { NavLink, } from 'react-router-dom';
import { confirmDialog, successDialog, warningFn } from "src/components/messages/Messages"
import api from '../../../components/Api'
import TablePagination from '@mui/material/TablePagination';

const CompanyList = () => {
    const [company, setCompany] = useState([])
    const [open, setOpen] = useState(false)
    const [termo, setTermo] = useState('')
    const [arrow, setArrow] = useState(true)
    const [currentPage, setCurrentPage] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0)
    const [perPage, setPerPage] = useState(1)
    const [isFirstLoad, setIsFirstLoad] = useState(1)

    useEffect(() => {
        // Verifique se a página não é a primeira página e não é a primeira carga
        if (isFirstLoad > 1) {
          handleFilters();
        } else {
          // Marque a primeira carga como completa
          setIsFirstLoad(1);
        }
      }, [currentPage, isFirstLoad]);

    async function handleFilters(e) {
        setIsFirstLoad(2)
        if (e !== undefined) {
            e.preventDefault()
        }
        if (currentPage === null) {
            return
        }
        setOpen(true)
        try {

            let formData = {
                name: termo
            }

            const response = await api.get(`/api/company?page=${currentPage}`, { params: formData })

            if (response.data.total === 0) {
                warningFn('Pesquisa retornou nenhum resultado!')
                setCurrentPage(0)
                setCompany([])
                setTotalRecords('')
                setPerPage('')
                setOpen(false)
                return
            }
            setTotalRecords(response.data.total)
            setPerPage(response.data.to === null ? 1 : response.data.to)
            setCompany(response.data.data)
            setOpen(false)
        } catch (err) {
            warningFn('Erro desconhecido contate o suporte!')
            setOpen(false)

        } finally {
            setOpen(false)
        }
    }

    function toggleFilter() {
        setArrow(prevState => !prevState)
    }

    const handleChangePage = (event, newPage) => {
        console.log("newPage", newPage)
        setCurrentPage(newPage);
        handleFilters()
    };


    // useEffect(() => {
    //     handleFilters()
    // }, [currentPage]);

    async function deleteItem(e, id) {
        e.preventDefault()
        const dialog = await confirmDialog(
            'Excluir',
            'Tem certeza que deseja excluir ?'
        )
        if (dialog.isConfirmed) {
            setOpen(true)
            const response = await api.delete(`/api/company/${id}`)
            if (response.status === 200) {
                setOpen(false)
                successDialog()
                setTimeout(() => {
                    handleFilters()
                }, 1000)
            }
            return
        }
        setOpen(false)
        warningFn('Não foi possível excluir')
    }

    function clearFilter() {
        setCurrentPage(0)
        setTermo('')
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
                    <CForm onSubmit={(e) => {
                        setCurrentPage(0) 
                        handleFilters(e)}}>
                        <CCardBody>
                            <CRow>
                                <CCol md='6' lg='6' sm='12' xl='6' xs='12'>
                                    <CInputGroup >
                                        <TextField
                                            type='text'
                                            fullWidth
                                            id="filled-basic"
                                            label="Pesquisar"
                                            variant="filled"
                                            value={termo}
                                            onChange={e => setTermo(e.target.value)} />
                                    </CInputGroup >
                                </CCol>
                            </CRow>
                        </CCardBody>
                        <CCardFooter>
                            <CButton 
                            style={{ margin: '5px' }} 
                            size='sm' 
                            color='secondary' 
                            type='submit'>Filtrar
                            </CButton>
                            <CButton size='sm' color='danger' onClick={(e) => clearFilter(e)} type='button'>Limpar</CButton>
                        </CCardFooter>
                    </CForm>
                </CCollapse>

            </CCard>
            <CCard style={{ marginTop: '5px' }} className="">
                <CCardHeader style={{ color: 'white', fontWeight: 'bold' }} className="bg-secondary">
                    Empresas
                </CCardHeader>
                <CCardBody>
                    <CRow>
                        <CCol lg='12'>
                            <NavLink
                                style={{
                                    color: `white`,
                                    fontWeight: 'bold',
                                    textDecoration: 'none',
                                    cursor: 'pointer',
                                    backgroundColor: 'gray',
                                    padding: '10px',
                                    borderRadius: '10px',
                                    marginTop: '10px',
                                    float: 'right'
                                }}
                                to="/form-ruv/company/?0&create">Cadastrar</NavLink>
                        </CCol>
                    </CRow>
                    {totalRecords > 0 && (
                        <CTable>
                            <CTableHead color="gray">
                                <CTableRow>
                                    <CTableHeaderCell scope="col">Nome</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">CPF/CNPJ</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Telefone/Celular</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Ações</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {company.map((item, index) => (
                                    <CTableRow key={index}>
                                        <CTableDataCell>{item.name}</CTableDataCell>
                                        <CTableDataCell >{item.cpf_cnpj}</CTableDataCell>
                                        <CTableDataCell >{item.phone}</CTableDataCell>
                                        <CTableDataCell >{item.email}</CTableDataCell>
                                        <CTableDataCell >
                                            <NavLink
                                                style={{
                                                    color: `blue`,
                                                    fontWeight: 'bold',
                                                    textDecoration: 'none',
                                                    cursor: 'pointer',
                                                    backgroundColor: 'white',
                                                    padding: '5px',
                                                    borderRadius: '5px',
                                                }}
                                                to={`/form-ruv/company?${item.id}&view`}>
                                                <CIcon size="lg" icon={cilMagnifyingGlass}></CIcon>
                                            </NavLink>
                                            <NavLink
                                                style={{
                                                    color: `orange`,
                                                    fontWeight: 'bolder',
                                                    textDecoration: 'none',
                                                    cursor: 'pointer',
                                                    padding: '5px',
                                                    borderRadius: '5px',
                                                }}
                                                to={`/form-ruv/company?${item.id}&edit`}>
                                                <CIcon size="lg" icon={cilPen}></CIcon>
                                            </NavLink>
                                            <NavLink
                                                style={{
                                                    color: `red`,
                                                    fontWeight: 'bolder',
                                                    textDecoration: 'none',
                                                    cursor: 'pointer',
                                                    padding: '5px',
                                                    borderRadius: '5px',
                                                }}
                                                to=''>
                                                <CIcon onClick={(e) => deleteItem(e, item.id)} size="lg" icon={cilTrash}></CIcon>
                                            </NavLink>
                                        </CTableDataCell>
                                    </CTableRow>
                                ))}
                            </CTableBody>
                        </CTable>
                    )}
                    {totalRecords > 0 && (
                        <TablePagination
                            component="div"
                            count={totalRecords}
                            page={currentPage}
                            onPageChange={handleChangePage}
                            rowsPerPage={perPage - 1}
                            labelRowsPerPage="Itens por Página"
                            rowsPerPageOptions={-1}
                        />
                    )}
                </CCardBody>
            </CCard>
        </div>
    )

}

export default CompanyList
