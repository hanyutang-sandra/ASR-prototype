import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';
import withRoot from '../withRoot';

import {connect} from 'react-redux';
import { seekUri, getResult } from '../redux/actions';

import compose from 'recompose/compose';
import store from '../redux/store';


const styles = theme => ({
    root: {
        margin: '2rem',
        marginTop: '3rem',
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
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)'
    },
    speaker: {
        color: theme.palette.primary.dark,
        fontSize: 16,
        fontWeight: 500
    },
    incorrect: {
        display: 'inline-block',
        backgroundColor: '#b3e5fc',
        lineHeight: '1.5rem',

        '&:hover' : {
            border: '2px solid #01579b',
            cursor: 'pointer',
        }
    },
    correct: {
        display: 'inline-block',
        backgroundColor: '#ffffff',
        lineHeight: '1.5rem',
    }
});

const mapStateToProps = state => ({
    progress: state.changeProgress.progress
});

function renderClass(num, classes) {
    if (num <= 0.6 && num !== null) {
        return classes.incorrect
    }else{
        return classes.correct
    }
}

class ResultCard extends React.Component{
    constructor(prop){
        super(prop);

        this.resultSec = React.createRef();

        this.state = {
            expanded: false,
            name: this.props.name,
            uri: null,
            result: null,
            processData: this.props.data,
            complete: false,
            interval: null
        }
    }

    handleExpandClick = () => {
        this.setState(state => ({ expanded: !state.expanded }));
    };

    componentDidMount() {
        if (this.props.progress === 'uploaded'){
            let fileName = this.props.name;
            let _this = this;
            this.interval = setInterval(function(name=fileName,thiss=_this){
                fetch('https://protected-plains-55400.herokuapp.com/seekresult', {
                    method: 'POST',
                    mode:'cors',
                    cache: 'no-cache',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({name: name})
                }).then(res => {
                    return res.json()
                }).then(data => {
                    console.log(data.data);
                    thiss.setState({processData: data});
                    if (data.data.TranscriptionJob.TranscriptionJobStatus === 'COMPLETED') {
                        clearInterval(this.interval);
                        thiss.setState({complete: true});
                        console.log('Complete');
                        store.dispatch(seekUri());
                    }
                }).catch(err => {
                    console.log(err);
                    clearInterval(this.interval)
                });
            }, 30000);

        }
    }


    render(){
    const { classes } = this.props;

    if (this.state.complete === true) clearInterval(this.interval);

    if (this.props.progress === 'seekUri') {
        fetch('https://protected-plains-55400.herokuapp.com/getfile', {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({uri: this.state.processData.data.TranscriptionJob.Transcript.TranscriptFileUri})
        }).then(res => {
            return res.json()
        }).then(data => {
            console.log(data);
            this.setState({
                result: data.data.results,
                expanded: true,
        });
            store.dispatch(getResult())
        }).catch(err => {
            console.log(err);
            alert('Something is wrong')
        })
    }

    return (
        <Card className={ classes.root }>
            <CardHeader classes = {{ title: classes.title,}}
                        title={ "2. See transcripts" }
                        action={
                            <IconButton
                                disabled={false}
                                className={classnames(classes.expand, {
                                [classes.expandOpen]: this.state.expanded,
                            })}
                                        onClick = {this.handleExpandClick}
                                        aria-expanded = {this.state.expanded}>
                                <ExpandMoreIcon />
                            </IconButton>
                        }
            />

            <Collapse in={this.state.expanded} timeout='auto' unmountOnExit>
                <CardContent>
                    {this.props.progress === 'getResult'?
                        <List>
                            <ListItem>
                                <Grid container spacing={8}>
                                    <Grid item xs={3}>
                                        <ListItemText>
                                            <Typography className={classes.speaker}>Speaker 1:</Typography>
                                        </ListItemText>
                                    </Grid>
                                    <Grid item xs={9} className={classes.transcript}>
                                        <ListItemText ref={this.resultSec}>
                                            {this.state.result.items.map((item, index) => (
                                                <span key={index}>
                                                    {item.alternatives[0].confidence <= 0.6 && item.alternatives[0].confidence !== null?
                                                        <Tooltip title={'Confidence: ' + item.alternatives[0].confidence} placement={"bottom"}>
                                                            <span className = {renderClass(item.alternatives[0].confidence, classes)}>
                                                                {item.alternatives[0].content}
                                                            </span>
                                                        </Tooltip>
                                                        : <span className = {renderClass(item.alternatives[0].confidence, classes)}>
                                                                {item.alternatives[0].content}
                                                          </span>
                                                    }
                                                    <span>&nbsp;</span>
                                                </span>
                                            ))}
                                        </ListItemText>
                                    </Grid>
                                </Grid>
                            </ListItem>
                        </List>
                        : null}
                </CardContent>
            </Collapse>
        </Card>
    )
}

}

ResultCard.protoTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRoot(compose(
    withStyles(styles, {name: 'ResultCard'}),
    connect(mapStateToProps)
)(ResultCard));