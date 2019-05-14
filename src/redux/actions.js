import {START_APP, UPLOADING, UPLOADED, SEEK_URI, GET_RESULT } from './actionTypes';

export const startApp = () => ({
    type: START_APP
});

export const uploading = () => ({
    type: UPLOADING
});

export const uploaded = () => ({
    type: UPLOADED
});

export const seekUri = () => ({
    type: SEEK_URI
});

export const getResult = () => ({
    type: GET_RESULT
});