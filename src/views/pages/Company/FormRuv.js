import React, { useState, useEffect } from "react"
import CIcon from "@coreui/icons-react"
import api from '../../../components/Api'
import {
    cilList,
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
    CFormSwitch
} from "@coreui/react"
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import {
    TextField,
} from '@mui/material'
import FormGroup from '@mui/material/FormGroup';
import { useNavigate, useLocation } from 'react-router-dom';
import { maskCpfOrCnpj, maskPhone, handleCep, handleMaskCep } from "src/components/Helpers"
import { successDialog, warningFn } from "src/components/messages/Messages"

const CompanyRuv = () => {
    let location = useLocation();
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const [name, setName] = useState('')
    const [cpfCnpj, setCpfCnpj] = useState('')
    const [phone, setPhone] = useState('')
    const [nameResp, setNameResp] = useState('')
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState(false)
    const [cep, setCep] = useState('')
    const [street,  setStreet] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [id, setId] = useState('')
    const [paramView, setParamView] = useState('')

    useEffect(() => {
        loadParam()
    },[]);

    function loadParam() {
        let param = location.search;
        let tiraInterrogacao = param.replace("?", "")
        let format = tiraInterrogacao.split("&")
        setId(format[0])
        setParamView(format[1])
        if(format[1] === 'view' || format[1] === 'edit') {
            searchUserId(format[0])
        }
    }

    async function onSignIn(e) {
        e.preventDefault()

        setOpen(true)
        var form = new FormData()
        form.append('name', name)
        form.append('postal_code', cep)
        form.append('cpf_cnpj', cpfCnpj)
        form.append('phone', phone)
        form.append('responsible', nameResp)
        form.append('email', email)
        form.append('street', street)
        form.append('city', city)
        form.append('state', state)
        form.append('status', status ? 1 : 0)

        if (paramView === 'edit') {
            updateUser(form)
            return
        }
        
        await api
            .post('/api/company', form)
            .then(response => {
                if (response.status === 200) {
                    successDialog()
                    setOpen(false)
                    setTimeout(() => {
                        navigate("/list/company")
                    }, 1000)
                }
            })
            .catch(error => {
                if (error.status === 422) {
                    Object.keys(error.data).forEach(function (key, index) {
                        error = error.data[key]
                    })
                    warningFn(error)
                    setOpen(false)
                    return
                }
                setOpen(false)
                warningFn('Erro desconhecido no envio das informações')
                return
            })

    }

    async function updateUser() {
        setOpen(true)

        let form = {
            name: name,
            responsible: nameResp,
            postal_code: cep,
            street: street,
            city: city,
            state: state,
            status: status ? 1 : 0,
            cpf_cnpj: cpfCnpj,
            email: email,
            phone: phone
        }

        try {
            const response = await api.put(
                `/api/company/${id}`,
                form
            )

            if (response.status === 200) {
                setOpen(false)
                successDialog()
                setTimeout(() => {
                    navigate("/list/company")
                }, 1000)
            }
        } catch (error) {
            if (error.status === 422) {
                setOpen(false)
                Object.keys(error.data).forEach(function (key, index) {
                    let errornew = error.data[key]
                    warningFn(errornew)
                })
                return
            }
            warningFn('Erro desconhecido, contate o suporte')
        }
        setOpen(false)
    }

    const handleChange = (e) => {
        let valor = maskCpfOrCnpj(e.target.value)
        if (valor.length > 18) {
            return
        }
        setCpfCnpj(valor);

    };

    const handleChangePhone = (e) => {

        let value = maskPhone(e.target.value)

        if (value.length > 16) return ''

        setPhone(value);

    };

    const changeCheckedStatus = (e) => {
        setStatus(e)
    }

    const verifyCep = async (e) => {
        let stringCep = handleMaskCep(e)
        if (stringCep.length === 9) {
            const objCep = await handleCep(e)
            setCep(objCep.cep)
            setStreet(`${objCep.logradouro} - ${objCep.bairro}`)
            setCity(objCep.localidade)
            setState(objCep.uf)
        }
        if (stringCep.length > 9) {
            return
        }
        setCep(stringCep)
    }

    const backList = (e) => {
        e.preventDefault()
        navigate("/list/company");
    }

    async function searchUserId (idCompany) {
        setOpen(true)

        try {
          const response = await api.get(
            `/api/company/${idCompany}`
          )
    
          if (response.status === 200) {
            setName(response.data.name)
            setPhone(response.data.phone)
            setCity(response.data.city)
            setEmail(response.data.email)
            setCep(verifyCep(response.data.postal_code))
            setCpfCnpj(response.data.cpf_cnpj)
            setStatus(response.data.status)
            setNameResp(response.data.responsible)
          }
          setOpen(false)
        } catch (error) {
          setOpen(false)
        }
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
                            <CIcon size='md' icon={cilList} /> Cadastrar
                        </CCol>
                    </CRow>
                </CCardHeader>
                <CForm onSubmit={(e) => onSignIn(e)}>
                    <CCardBody>
                        <CRow>
                            <CCol md='6' lg='6' sm='12' xl='6' xs='12'>
                                <CInputGroup >
                                    <TextField
                                        type='text'
                                        fullWidth
                                        id="filled-name"
                                        label="Nome"
                                        value={name}
                                        variant="filled"
                                        required
                                        disabled={paramView === 'view' ? true : false}
                                        onChange={e => setName(e.target.value)} />
                                </CInputGroup >
                            </CCol>
                            <CCol md='3' lg='3' sm='12' xl='3' xs='12'>
                                <CInputGroup >
                                    <TextField
                                        type='text'
                                        fullWidth
                                        id="filled-document"
                                        value={cpfCnpj}
                                        label="CPF/CNPJ"
                                        variant="filled"
                                        disabled={paramView === 'view' ? true : false}
                                        required
                                        onChange={e => handleChange(e)} />
                                </CInputGroup >
                            </CCol>
                            <CCol md='3' lg='3' sm='12' xl='3' xs='12'>
                                <CInputGroup >
                                    <TextField
                                        type='text'
                                        fullWidth
                                        id="filled-phone"
                                        value={phone}
                                        label="Telefone/Celular"
                                        variant="filled"
                                        disabled={paramView === 'view' ? true : false}
                                        required
                                        onChange={e => handleChangePhone(e)} />
                                </CInputGroup >
                            </CCol>
                        </CRow>
                        <div style={{ marginTop: '10px' }}>
                            <CRow>
                                <CCol md='6' lg='6' sm='12' xl='6' xs='12'>
                                    <CInputGroup >
                                        <TextField
                                            type='text'
                                            fullWidth
                                            id="filled-resp"
                                            label="Nome do responsável"
                                            value={nameResp}
                                            disabled={paramView === 'view' ? true : false}
                                            variant="filled"
                                            onChange={e => setNameResp(e.target.value)} />
                                    </CInputGroup >
                                </CCol>
                                <CCol md='3' lg='3' sm='12' xl='3' xs='12'>
                                    <CInputGroup >
                                        <TextField
                                            type='email'
                                            fullWidth
                                            id="filledEmail"
                                            value={email}
                                            label="Email"
                                            variant="filled"
                                            disabled={paramView === 'view' ? true : false}
                                            required
                                            onChange={e => setEmail(e.target.value)} />
                                    </CInputGroup >
                                </CCol>
                                <CCol md='3' lg='3' sm='12' xl='3' xs='12'>
                                    <FormGroup style={{ marginTop: '20px', fontWeight: 'bold' }}>
                                        <CFormSwitch
                                            label="Status"
                                            checked={status}
                                            disabled={paramView === 'view' ? true : false}
                                            onChange={(e) => changeCheckedStatus(e.target.checked)}
                                            id="status"
                                        />
                                    </FormGroup>
                                </CCol>
                            </CRow>
                        </div>
                        <div style={{ marginTop: '10px' }}>
                            <CRow>
                                <CCol md='3' lg='3' sm='12' xl='3' xs='12'>
                                    <CInputGroup >
                                        <TextField
                                            type='text'
                                            fullWidth
                                            id="filledCep"
                                            value={cep}
                                            label="CEP"
                                            variant="filled"
                                            disabled={paramView === 'view' ? true : false}
                                            required
                                            onChange={e => verifyCep(e.target.value)} />
                                    </CInputGroup >
                                </CCol>
                                <CCol md='3' lg='3' sm='12' xl='3' xs='12'>
                                    <CInputGroup >
                                        <TextField
                                            type='text'
                                            fullWidth
                                            id="filled-rua"
                                            value={street}
                                            label="Endereço"
                                            variant="filled"
                                            disabled={paramView === 'view' ? true : false}
                                            required
                                            onChange={e => setStreet(e.target.value)} />
                                    </CInputGroup >
                                </CCol>
                                <CCol md='3' lg='3' sm='12' xl='3' xs='12'>
                                    <CInputGroup >
                                        <TextField
                                            type='text'
                                            fullWidth
                                            id="filled-city"
                                            value={city}
                                            label="Cidade"
                                            variant="filled"
                                            disabled={paramView === 'view' ? true : false}
                                            required
                                            onChange={e => setCity(e.target.value)} />
                                    </CInputGroup >
                                </CCol>
                                <CCol md='3' lg='3' sm='12' xl='3' xs='12'>
                                    <CInputGroup >
                                        <TextField
                                            type='text'
                                            fullWidth
                                            id="filled-state"
                                            value={state}
                                            label="Estado"
                                            variant="filled"
                                            disabled={paramView === 'view' ? true : false}
                                            required
                                            onChange={e => setState(e)} />
                                    </CInputGroup >
                                </CCol>
                            </CRow>
                        </div>
                    </CCardBody>
                    <CCardFooter>
                        <CButton
                            style={{ margin: '5px', color: 'white', fontWeight: 'bold' }}
                            size='sm'
                            color='success'
                            disabled={paramView === 'view' ? true : false}
                            type='submit'>Salvar</CButton>
                        <CButton
                            style={{ margin: '5px', color: 'white', fontWeight: 'bold' }}
                            size='sm'
                            color='danger'
                            onClick={(e) => backList(e)}
                            type='button'>Cancelar</CButton>
                    </CCardFooter>
                </CForm>
            </CCard>
        </div >
    )

}

export default CompanyRuv
