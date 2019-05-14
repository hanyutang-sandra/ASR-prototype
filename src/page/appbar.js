import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import logo from '../media/logo.png';
import withRoot from '../withRoot';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    headbar: {
        backgroundColor: theme.palette.primary.light,
        position: 'fixed',
        height: 50
    },
    menuButton: {
        marginLeft: -18,
        marginRight: 10,
    },
    img: {
        width: 60,
        height: 30
    },
    header: {
        variant: 'h6'
    }
});


class HeadBar extends React.Component {

    render() {
        const { classes } = this.props;

        return (
            <div className={ classes.root }>
                <AppBar className={ classes.headbar }>
                    <Toolbar variant="dense">
                        <IconButton className={ classes.menuButton }>
                            <img src={ logo } alt={ 'logo' } className={ classes.img }/>
                        </IconButton>
                        <Typography className={ classes.header }>
                            ASR (Assessment Assistance)
                        </Typography>
                    </Toolbar>
                </AppBar>
            </div>
        )
    }
}

HeadBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(HeadBar));