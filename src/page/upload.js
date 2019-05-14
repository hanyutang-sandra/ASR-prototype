import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input'
import Button from '@material-ui/core/Button';
import Typography from "@material-ui/core/Typography";
import withRoot from '../withRoot';

import {connect} from 'react-redux';
import { uploading, uploaded} from '../redux/actions';

import compose from 'recompose/compose';
import store from '../redux/store';


const styles = theme => ({
    root: {
        margin: '2rem',
        marginTop: '5rem',
        padding: '1rem',
    },
    title: {
        color: theme.palette.primary.dark
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        })
    },
    expandOpen: {
        transform: 'rotate(180deg)'
    },
    form: {
        marginLeft: '2rem',
        width: '50%'
    },
    text:{
        width: '80%',
        marginLeft: '-2rem',

    },
    submit:{
        marginTop: '2rem',
    },
    cancel:{
        width: '10rem',
    },
    submitbtn: {
        width: '10rem',
        backgroundColor: theme.palette.primary.main,

        '&:hover': {
            backgroundColor: theme.palette.primary.dark
        }

    }

});

const mapStateToProps = state => ({
    progress: state.changeProgress.progress
});

function handleReminder(state){
    if (state === 'uploading') {
        return 'File uploading'
    }else if (state === 'uploaded' || state === 'seekUri') {
        return 'File uploaded success. Start transcription'
    }else{
        return ''
    }
}

class UploadCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            expanded: true,
            selectedFile: null,
        };
    };

    handleExpandClick = () => {
        this.setState(state => ({ expanded: !state.expanded }));
    };


    handleCancel = () => {document.getElementById('file').value = ""};

    handleSubmit = (ev) => {
       ev.preventDefault();
       store.dispatch(uploading());
       const formdata = new FormData();
       formdata.append('file', this.state.selectedFile);

       fetch('https://protected-plains-55400.herokuapp.com/upload', {
           method: 'POST',
           mode:'cors',
           cache: 'no-cache',
           body: formdata
       }).then(res => {
           document.getElementById('file').value = "";
           return res.json();
       }).then(data => {
           this.props.passData(data.name);
           store.dispatch(uploaded());

       }).catch(err =>  {
           alert('Something is wrong');
           window.location.reload()
       })
    };


    onChangeHandler = ev => {
        this.setState({selectedFile: ev.target.files[0]});
    };


    render() {
        const { classes } = this.props;

        return (
            <Card className={ classes.root }>
                <CardHeader classes = {{ title: classes.title,}}
                    title='1. Upload audio files'
                    action={
                        <IconButton className={classnames(classes.expand, {
                            [classes.expandOpen]: this.state.expanded,
                        })}
                        onClick = {this.handleExpandClick}
                        aria-expanded = {this.state.expanded}>
                            <ExpandMoreIcon />
                        </IconButton>
                    }
                />

                <Collapse in={this.state.expanded} timeout='auto' unmountOnExit>
                    <form className={ classes.form } onSubmit={this.handleSubmit} >
                        <Grid container spacing={0}>
                            <Grid item xs={12}>
                                <Input id='file' type='file' variant='outlined' onChange={this.onChangeHandler} required>Browse</Input>
                            </Grid>
                        </Grid>
                        <Grid container spacing={0} className={ classes.submit} >
                            <Grid item xs={6}>
                                <Button variant='outlined' className={ classes.cancel } onClick={this.handleCancel}>Cancel</Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button type='submit' variant='contained' className={ classes.submitbtn }>Submit</Button>
                            </Grid>
                            <br />
                            <Grid item xs={12}>
                                <Typography style={{marginTop: '1rem'}}>{handleReminder(this.props.progress)}</Typography>
                            </Grid>
                        </Grid>
                    </form>


                </Collapse>

            </Card>
        )
    }
}

UploadCard.propTypes = {
   classes: PropTypes.object.isRequired,
};

export default withRoot(compose(
    withStyles(styles, {name: 'UploadCard'}),
    connect(mapStateToProps)
)(UploadCard));