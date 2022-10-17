import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { AUTH_TOKEN } from '@/constants';
import { LOGIN_MUTATION, REGISTER_MUTATION } from '@/graphql/mutation';

export default function Login() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [formState, setFormState] = useState({
    login: true,
    email: '',
    password: '',
    name: '',
  });

  const [login] = useMutation(LOGIN_MUTATION, {
    variables: {
      email: formState.email,
      password: formState.password,
    },
    onCompleted: ({ login: loginData }) => {
      localStorage.setItem(AUTH_TOKEN, loginData.token);
      setErrorMessage('');
      navigate('/');
    },
    onError: (error) => setErrorMessage(error.message),
  });
  const [register] = useMutation(REGISTER_MUTATION, {
    variables: {
      email: formState.email,
      password: formState.password,
      name: formState.name,
    },
    onCompleted: ({ signup }) => {
      localStorage.setItem(AUTH_TOKEN, signup.token);
      setErrorMessage('');
      navigate('/');
    },
  });

  return (
    <div>
      <h4 className="mv3">
        {formState.login ? 'login' : 'register'}
      </h4>
      {errorMessage && (
        <span style={{ color: 'red' }}>{errorMessage}</span>
      )}
      <div className="flex flex-column">
        {!formState.login && (
          <input
            type="text"
            value={formState.name}
            onChange={(e) => setFormState({
              ...formState,
              name: e.target.value,
            })}
            placeholder="Your name"
          />
        )}
        <input
          type="email"
          value={formState.email}
          onChange={(e) => setFormState({
            ...formState,
            email: e.target.value,
          })}
          placeholder="Your email address"
        />
        <input
          type="password"
          value={formState.password}
          onChange={(e) => setFormState({
            ...formState,
            password: e.target.value,
          })}
        />
      </div>
      <div className="flex mt3">
        <button type="submit" className="pointer mr2 button" onClick={formState.login ? login : register}>
          {formState.login ? 'login' : 'register'}
        </button>
        <button
          type="button"
          className="pointer button"
          onClick={() => setFormState({
            ...formState,
            login: !formState.login,
          })}
        >
          {
            formState.login
              ? 'need to Create an account?'
              : 'already have an account?'
          }
        </button>
      </div>
    </div>
  );
}
