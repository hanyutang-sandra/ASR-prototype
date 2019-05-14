import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import HeadBar from './appbar';
import UploadCard from './upload';
import ResultCard from './result';
import withRoot from '../withRoot';

import {connect} from 'react-redux';
import compose from 'recompose/compose';

const styles = theme => ({
    root:{
        flexGrow: 1,
        backgroundColor: theme.palette.secondary.light,
        height: '100vh',
        width: '100vw',
    },
    uploadcard: {
        marginTop: '2rem',
    },
    resultcard: {
        marginTop: '2rem',
    }
});

const mapStateToProps = state => ({
    progress: state.changeProgress.progress
});


class Page extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: null,
        };
    }

    handlePassData = data => {
        this.setState({name: data});
        console.log(this.state.name)
    };



    render () {
        const { classes } = this.props;

        return (
            <div className={ classes.root }>
                <HeadBar/>
                <UploadCard className={ classes.uploadcard } passData = {this.handlePassData}/>
                {this.props.progress === 'uploaded' || this.props.progress === 'seekUri' || this.props.progress === 'getResult'?
                    <ResultCard className={ classes.resultcard} name = {this.state.name} />
                    :null}
            </div>
        )
    }
}

Page.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withRoot(compose(
    withStyles(styles, {name: 'Page'}),
    connect(mapStateToProps),
)(Page));