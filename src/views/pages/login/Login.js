import React, { useState, useEffect } from "react"
import {
  CForm,
} from "@coreui/react"
import api from '../../../components/Api'
import { login, saveLocal, getSaveLocal } from '../../../components/Auth'
import logoAguia from './login-image.jpg'
import {
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
  Link
} from '@mui/material'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import InputAdornment from '@mui/material/InputAdornment'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { warningFn } from '../../../components/messages/Messages'
import './style.css'
import { useNavigate } from 'react-router-dom';
import backgroundImage from './login-fundo.jpg';


const Login = () => {
  let navigate = useNavigate();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [open, setOpen] = useState(false)
  const [remember, setRemember] = useState(false)
  const [eye, setEye] = useState(false)
  const paperStyle = {
    padding: 20,
    height: '470px',
    width: 400,
    margin: '250px 150px 150px 150px',
    textAlign: 'center',
    borderRadius: '10px',
    overflow: 'hidden'
  }

  const btnstyle = {
    margin: '8px 0',
    backgroundColor: '#1bbd7e',
    color: 'white',
    fontWeight: 'bold'
  }

  const backgroundStyle = {
    height: '100vh',
    overflowX: 'hidden',
    display: 'flex',
    backgroundColor: 'white',
  }

  const imageSideStyle = {
    flex: 1,
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  useEffect(() => {
    if (getSaveLocal('@email') !== null && getSaveLocal('@email') !== '') {
      setEmail(getSaveLocal('@email'))
      setRemember(true)
    } else {
      setEmail('')
      setRemember(false)
    }
  }, [])

  async function signIn(e) {
    e.preventDefault()
    setOpen(true)
    // if (!email || !password) {
    //   setFeedbackMsg('Preencha e-mail e senha para continuar!')
    //   return
    // }

    try {
      const form = new FormData()
      form.append('email', email)
      form.append('password', password)

      const response = await api.post('/api/login', form)

      // on login success
      if (response.status === 200) {
        login(response.data.token)
        saveLocal('@name', response.data.user.name)
        saveLocal('@id', response.data.user.id)
        saveLocal('@super', response.data.user.super)
        if (remember) {
          saveLocal('@email', response.data.user.email)
        } else {
          localStorage.removeItem('@email')
        }
        navigate("/dashboard")
      }

      // on login Reject
    } catch (err) {
      if (err.status === 422) {
        setOpen(false)
        warningFn('Acesso Negado! Email ou Senha inválido')
        setPassword('')
      } else {
        warningFn('Erro desconhecido, contate o suporte!')
      }
    } finally {
      setOpen(false)
    }
  }

  function alteraRemember(e) {
    setRemember(e.target.checked)
  }

  function alteraEye() {
    setEye(prevState => !prevState)
  }


  return (

    <>
      <div style={{ position: 'fixed', zIndex: 1300 }}>
        <Backdrop open={open}>
          <CircularProgress color='inherit' />
        </Backdrop>
      </div>
      <div className='containerStyle' style={backgroundStyle}>
        <div style={imageSideStyle}>
        </div>
        <Grid>
          <CForm onSubmit={(e) => signIn(e)}>
            <Paper elevation={10} style={paperStyle}>
              <Grid align='center'>
                <img
                  src={logoAguia}
                  style={{ width: '100px', height: '100px' }}
                ></img>
              </Grid>
              <div style={{ margin: '10px' }}>
                <TextField
                  type='email'
                  label='Usuário'
                  placeholder='Digitar usuário'
                  fullWidth
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div style={{ margin: '10px' }}>
                <TextField
                  label='Senha'
                  type={eye ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  fullWidth
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          aria-label='toggle password visibility'
                          onClick={alteraEye}
                        >
                          {eye ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </div>
              <FormControlLabel
                control={
                  <Checkbox
                    name='checkedB'
                    checked={remember}
                    color='primary'
                    onChange={e => alteraRemember(e)}
                  />
                }
                label='Remember me'
              />

              <Button
                type='submit'
                variant='contained'
                style={btnstyle}
                fullWidth
              >
                Entrar
              </Button>
              <Typography>
                <Link href='#'>Esqueceu a senha ?</Link>
              </Typography>
              <Typography>
                {' '}
                Você não tem conta ?<Link href='#'> Cadastrar-se</Link>
              </Typography>
            </Paper>
          </CForm>

        </Grid>
      </div>
    </>

  )
}

export default Login
