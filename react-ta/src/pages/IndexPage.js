/**
 * Блок подключения модулей
 */
/**
 * React
 */
import React, {useEffect, useState} from 'react';
import axios from 'axios';

/**
 * MUI
 */
import {
  Box,
  Container,
  Paper,
  Grow,
  Button,
  TextField,
  Stack,
  Snackbar,
  Alert,
  Grid,
  Typography,
  Avatar,
  InputAdornment
} from "@mui/material";
import {green, grey} from '@mui/material/colors'

let lastMessageId = '';

export const IndexPage = () => {
  const [phone, setPhone] = useState('');
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const [errorSB, setErrorSB] = useState(false);
  const [chatDataForm, setChatData] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [showSettings, setShowSettings] = useState(true);

  const API_PATH = 'https://api.green-api.com/waInstance';

  useEffect(() => {
    if (
      chatDataForm.phone &&
      chatDataForm.idInstance &&
      chatDataForm.apiTokenInstance &&
      showChat
    ) {
      const interval = setInterval(async () => {
        try {
          const RESPONSE = await axios.get(
            API_PATH +
            chatDataForm.idInstance +
            '/ReceiveNotification/' +
            chatDataForm.apiTokenInstance
          );
          if (
            RESPONSE.data &&
            RESPONSE.data.body.typeWebhook === 'incomingMessageReceived' &&
            RESPONSE.data.body.senderData.chatId === `7${chatDataForm.phone}@c.us`
          ) {
            if (
              RESPONSE.data.body.idMessage &&
              RESPONSE.data.body.messageData.textMessageData &&
              lastMessageId !== RESPONSE.data.body.idMessage
            ) {
              setHistory(prevData => [
                ...prevData,
                {
                  id: RESPONSE.data.body.idMessage,
                  text: RESPONSE.data.body.messageData.textMessageData.textMessage,
                  type: 'in'
                }
              ]);
            }
            lastMessageId = RESPONSE.data.body.idMessage;
          }
          if (
            RESPONSE.data &&
            RESPONSE.data.receiptId
          ) {
            await axios.delete(
              API_PATH +
              chatDataForm.idInstance +
              '/DeleteNotification/' +
              chatDataForm.apiTokenInstance +
              '/' +
              RESPONSE.data.receiptId,
            );
          }

        } catch (err) {
          errorsHandler(err);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showChat]);

  const handleClose = (reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setErrorSB(false);
  };

  const onChangeHandler = (evt) => {
    const {name, value} = evt.target;
    if (name === 'phone') {
      setPhone(value);
    }
    setChatData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const createChat = () => {
    setHistory([]);
    setShowSettings(false);
    setShowChat(true);
  };

  const formHandler = (evt) => {
    evt.preventDefault();
    createChat();
  };

  const formMessageHandler = (evt) => {
    evt.preventDefault();
    sendQuery();
  };

  const errorsHandler = (err) => {
    setErrorSB(true);
    setError(err.message);
  };

  const resetHandler = () => {
    setChatData([]);
    setShowChat(false);
    setShowSettings(true);
  }

  const sendQuery = async () => {
    try {
      const RESPONSE = await axios.post(
        API_PATH +
        chatDataForm.idInstance +
        '/SendMessage/' +
        chatDataForm.apiTokenInstance,
        {
          chatId: '7' + chatDataForm.phone + '@c.us',
          message: chatDataForm.message
        }
      );

      setHistory(prevData => [
        ...prevData,
        {
          id: RESPONSE.data.idMessage,
          text: chatDataForm.message,
          type: 'out'
        }
      ]);
    } catch (err) {
      errorsHandler(err);
    }
  };

  return (
    <Grow
      in
    >
      <Box>
        <Paper sx={{py: 2}}>
          <Container>
            <Snackbar
              anchorOrigin={{vertical: 'top', horizontal: 'center'}}
              open={errorSB}
              autoHideDuration={6000}
              onClose={handleClose}
              message={error}
            >
              <Alert severity={'error'}>
                Ошибка ({error})
              </Alert>
            </Snackbar>
            {showSettings &&
            <form onSubmit={formHandler}>
              <Stack spacing={2} sx={{my: 1}}>
                <TextField
                  label={'idInstance'}
                  variant={'filled'}
                  onChange={onChangeHandler}
                  name={'idInstance'}
                  autoFocus
                  fullWidth
                  required
                />
                <TextField
                  label={'apiTokenInstance'}
                  variant={'filled'}
                  onChange={onChangeHandler}
                  name={'apiTokenInstance'}
                  fullWidth
                  required
                />
                <TextField
                  label={'Номер телефона получателя'}
                  variant={'filled'}
                  onChange={onChangeHandler}
                  name={'phone'}
                  InputProps={{
                    startAdornment: <InputAdornment
                      position={'start'}
                    >
                      +7
                    </InputAdornment>,
                  }}
                  fullWidth
                  required
                />
                <Button
                  type={'submit'}
                  fullWidth
                >
                  Создать чат
                </Button>
              </Stack>
            </form>
            }
            {showChat &&
            <>
              <Paper sx={{my: 2, background: grey[200]}}>
                <Grid container>
                  <Grid item xs={12}>
                    <Paper elevation={0} sx={{p: 1, background: grey[100]}}>
                      <Avatar>{phone}</Avatar>
                    </Paper>
                  </Grid>
                  <Grid item xs={12}
                        sx={{
                          minHeight: '320px',
                          maxHeight: '320px',
                          overflowY: 'scroll'
                        }}>
                    <Grid container sx={{p: 1}}>
                      {history.map((message) => (
                        <Grid key={message.id} item xs={12} sx={{mt: 1}}>
                          <Paper
                            sx={{
                              p: 1,
                              backgroundColor: message.type === 'in' ? grey[50] : green[200],
                              float: message.type === 'in' ? 'left' : 'right',
                            }}
                          >
                            <Typography variant={'body2'}>
                              {message.text}
                            </Typography>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper elevation={0} sx={{p: 1, background: grey[100]}}>
                      <form onSubmit={formMessageHandler}>
                        <Grid container>
                          <Grid item xs={10}>
                            <TextField
                              label={'Текст сообщения'}
                              variant={'filled'}
                              minRows={4}
                              onChange={onChangeHandler}
                              name={'message'}
                              fullWidth
                              required
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <Button
                              fullWidth
                              sx={{height: '100%'}}
                              type={'submit'}
                            >
                              Отправить
                            </Button>
                          </Grid>
                        </Grid>
                      </form>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>
              <Button
                color={'error'}
                onClick={resetHandler}
                fullWidth
              >
                Сброс
              </Button>
            </>
            }
          </Container>
        </Paper>
      </Box>
    </Grow>
  )
}