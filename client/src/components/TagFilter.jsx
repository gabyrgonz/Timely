import React from 'react';
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import ClearIcon from '@material-ui/icons/Clear';
import DialogContent from '@material-ui/core/DialogContent'
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';

/**
 * TagFilter Overlay used to filter posts by hashtag
 * When DB integration added, onEnter callback can be used to populate
 * tag list for buttons
 */

const useStyles = makeStyles((theme) => ({
    dialogActionDiv: {
        width: '100%',
        justifyContent: 'center',
        marginTop: theme.spacing(3),
    },

    dialogContainer: {
        background: '#efefef !important',
        width: '100% !important'
    },

    tagContainerDiv: {
        marginTop: theme.spacing(3),
        display: 'flex',
    },

    inputWrapper: {
        display: 'flex',
        width: '100%',
    },
   
    filterInput: {
        flex: '1 1 auto',
    },

    filterButton: {
        margin: '5px',
    },

  }));
  
export default function TagFilterDialog() {
    const classes = useStyles();

    const [values, setValues] = React.useState({
        open: false,
        input: ''
    });

    const handleClickOpen = () => {
        setValues({...values, open: true});
      };
    
    const handleClose = () => {
        setValues({...values, open: false});
    };

    const handleClearInput = () => {
        setValues({...values, input: ''});
    }

    const handleInputChange = (event) => {
        setValues({...values, input: event.target.value});
    }

    const handleSearch = () => {
        console.log("Searching for: " + values.input);
        setValues({...values, open: false, input: ''});
    }
    
    return (
        <div>
            <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                Tags
            </Button>
            <Dialog style={{backgroundColor: '#efefef !important'}} className={classes.dialogContainer} maxWidth="lg" open={values.open} onClose={handleClose}>
                <DialogContent>
                    <div id="input-wrapper" className={classes.inputWrapper}>
                        <OutlinedInput
                            autoFocus
                            margin="none"
                            id="name"
                            className={classes.filterInput}
                            value={values.input}
                            onChange={handleInputChange}
                            placeholder="Search"
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton>
                                        <ClearIcon
                                            onClick={handleClearInput}
                                        />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        <IconButton>
                            <SearchIcon
                                onClick={handleSearch}
                            />
                        </IconButton>
                    </div>
                    <div id="tag-button-container" className={classes.tagContainerDiv}>
                        <Button variant="outlined" className={classes.filterButton}>Funny</Button>
                        <Button variant="outlined" className={classes.filterButton}>Memes</Button>
                        <Button variant="outlined" className={classes.filterButton}>Hot</Button>
                        <Button variant="outlined" className={classes.filterButton}>Animals</Button>
                        <Button variant="outlined" className={classes.filterButton}>Gaming</Button>
                    </div>
                    <DialogActions className={classes.dialogActionDiv}>
                        <Button variant="contained" onClick={handleClose} color="secondary">
                            Cancel
                        </Button>
                        <Button variant="contained" onClick={handleClose} color="primary">
                            Confirm
                        </Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </div>
    );
};

