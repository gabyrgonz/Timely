import React, { createRef, useState } from 'react';
import {
  Avatar,
  Grid,
  Button,
  Typography,
  IconButton,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import DeleteAccountModal from '../DeleteAccountModal';
import EditUsernameModal from '../EditUsernameModal';
import EditPasswordModal from '../EditPasswordModal';
import * as avatarImg from './../../images/patrick.jpg';
import NavBar from '../NavBar';
import axios from 'axios';
import { SERVER_ADDRESS, loggedInUser } from '../../AppConfig.js'
import './style.css';

const UserSettingsPage = (props) => {
  // THIS ISN'T BEING USED ANYMORE SINCE WE'RE USING LOGGEDINUSER
  // UserSettingsPage.propTypes = {
  //   username: PropTypes.string.isRequired,
  //   password: PropTypes.string.isRequired,
  //   isAdmin: PropTypes.bool.isRequired,
  //   profileImage: PropTypes.string.isRequired,

  //   joinDate: PropTypes.string.isRequired,
  //   posts: PropTypes.number.isRequired,
  // };


  const inputFileRef = createRef(null);
  const [image, _setImage] = useState(null);

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isUserModalOpen, setUserModalOpen] = useState(false);
  const [isPassModalOpen, setPassModalOpen] = useState(false);
  // const [isEmailModalOpen, setEmailModalOpen] = useState(false);

  // Function that cleans up avatar image
  const cleanup = () => {
    URL.revokeObjectURL(image);
    inputFileRef.current.value = null;
  };

  // Function that sets avatar image
  const setImage = (newImage) => {
    if (image) {
      cleanup();
    }
    _setImage(newImage);
    console.log(newImage);
  };

  // Takes uploaded img and passes it to setImg function to be set
  const handleOnImgChange = (event) => {
    const newImage = event.target?.files?.[0];

    if (newImage) {
      const imgData = new FormData();
      imgData.append('myFile', newImage);
      axios.post(SERVER_ADDRESS + "/users/upload-profile/" + loggedInUser.username, imgData)
        .then(({ data }) => {
          setImage(data);
        })    
      .catch(err => console.log(err));
      // setImage(URL.createObjectURL(newImage));
    }
  };

  // Handling when avatar image is clicked
  const handleAvatarClick = (event) => {
    if (image) {
      event.preventDefault();
      setImage(null);
    }
  };

  // Function the makes the axios call to delete an account from the db
  const handleDeleteAccount = () => {
    console.log(loggedInUser.username);
    axios.post(SERVER_ADDRESS + '/users/delete/' + loggedInUser.username)
      .then(console.log("Axios: user successfully deleted!"))
      .catch(err => (console.log(err)));
  };

  // Function that gets the join date of the user
  // const handleFetchJoinDate = () => {
  //   console.log(loggedInUser.username);
  //   axios.get(SERVER_ADDRESS +  '/users/finduser/join-date' + loggedInUser.username)
  //     .then(res => {
  //       const joinDate = res.createdAt;

  //     })
  // }

  // Renders the profile pic and the delete account button
  const renderProfileGrid = () => {
    return (
      <Grid
        container
        direction="column"
        justify="center"
        alignContent="center"
        alignItems="center"
        spacing={1}
      >
        <Grid item xs={9} className="ProfilePic">
          <IconButton color="primary" onClick={handleAvatarClick}>
            <input
              accept="image/*"
              ref={inputFileRef}
              hidden
              id="avatar-image-upload"
              type="file"
              onChange={handleOnImgChange}
            />
            <label htmlFor="avatar-image-upload">
              <Avatar
                alt="Avatar"
                src={image || avatarImg}
                className="avatar"
              />
            </label>
          </IconButton>
        </Grid>

        <Grid item xs={3} className="DeleteAccount">
          <Button
            variant="contained"
            className="DeleteAccountButton"
            onClick={() => setDeleteModalOpen(true)}
            size="medium"
          >
            Delete
          </Button>
        </Grid>
      </Grid>
    );
  }

  // Renders the users information
  const renderUserGrid = () => {
    return (
      <Grid
        container
        direction="column"
        justify="flex-start"
        alignItems="stretch"
        spacing={1}
      >
        <Grid item xs className="UserInfo">
          <Typography variant="h5" component="span">
            {"@" + loggedInUser.username}
          </Typography>
          {loggedInUser.isAdmin ? " 👑 " : ""}
          <Typography variant="body1">
          {/* CREATION DATE IS STORED IN USER SCHEMA */}
            {"Member since " + loggedInUser.joinDate}
          </Typography>
          <Typography variant="body1">
          {/* PULL FROM SERVER */}
            {loggedInUser.posts + " posts"}
          </Typography>
        </Grid>

        <Grid item xs className="UserActions">
          {renderUserActions()}
        </Grid>
      </Grid>
    )
  }

  // Renders the action buttons: edit username, edit password
  const renderUserActions = () => {
    return (
      <div>
        {/* Edit Email */}
        {/* <Grid container spacing={1}>
          <Grid item xs={8}>
            <Typography variant="h6">Email</Typography>
            {props.email}
          </Grid>

          <Grid item xs={4}>
            <Button
              variant="contained"
              className="EditEmailButton"
              onClick={openEmailModal}
              size="medium"
            >
              Edit
            </Button>
          </Grid>
        </Grid> */}

        {/* Edit Username */}
        <Grid container spacing={1}>
          <Grid item xs={8}>
            <Typography variant="h6">Username</Typography>
            {loggedInUser.username}
          </Grid>
          <Grid item xs={4}>
            <Button
              variant="contained"
              className="EditUsernameButton"
              onClick={() => setUserModalOpen(true)}
              size="medium"
            >
              Edit
            </Button>
          </Grid>
        </Grid>

        {/* Edit Password */}
        <Grid container spacing={1}>
          <Grid item xs={8}>
            <Typography variant="h6">Password</Typography>
            ********
          </Grid>
          <Grid item xs={4}>
            <Button
              variant="contained"
              className="EditPasswordButton"
              onClick={() => setPassModalOpen(true)}
              size="medium"
            >
              Edit
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }

  return (
    <div className="UserSettingsPage">
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="stretch"
        spacing={10}
      >
        <Grid item xs={1}>
          <NavBar isLandingPg={false} />
        </Grid>

        <Grid
          item
          container
          xs={11}
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
          className="ButtonGrid"
        >
          <Grid item xs={1} />
          <Grid item xs={3} className="ProfileGrid">
            {/* Profile picture Grid and delete account button */}
            {renderProfileGrid()}
          </Grid>
          <Grid item xs={7} className="UserInfoGrid">
            {/* User Info */}
            {renderUserGrid()}
          </Grid>
          <Grid item xs={1} />
        </Grid>

        {/* DELETE ACCOUNT MODAL */}
        <DeleteAccountModal
          username={"username"}
          password={"123"}
          delete={handleDeleteAccount}
          isOpen={isDeleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
        />

        {/* EDIT EMAIL MODAL */}
        {/* <EditEmailModal
        username={props.username}
        password={props.password}
        email={props.email}
        update={() => {}}
        isOpen={state.isEditEmailOpen}
        onClose={closeEmailModal}
      /> */}

        {/* EDIT USERNAME MODAL */}
        <EditUsernameModal
          // username={props.username}
          // password={props.password}
          username={loggedInUser.username}
          password={loggedInUser.password}        
          isOpen={isUserModalOpen}
          onClose={() => setUserModalOpen(false)}
        />

        {/* EDIT PASSWORD MODAL */}
        <EditPasswordModal
          // username={props.username}
          // password={props.password}
          username={loggedInUser.username}
          password={loggedInUser.password}
          isOpen={isPassModalOpen}
          onClose={() => setPassModalOpen(false)}
        />
      </Grid>
    </div>
  );

}

export { UserSettingsPage };