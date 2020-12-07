import React, { createRef, useEffect, useState, useParams } from 'react';
import {
  Avatar,
  Grid,
  Button,
  Typography,
  IconButton,
  Tooltip
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import BanUserModal from './AdminPopUps/BanUserModal';
import AdminEditPasswordModal from './AdminPopUps/AdminEditPasswordModal';
import DemoteAdminModal from './AdminPopUps/DemoteAdminModal';
import PromoteUserModal from './AdminPopUps/PromoteUserModal';
import NavBar from '../NavBar/NavBar';
import { Post } from '../Post/Post';
import axios from 'axios';
import { SERVER_ADDRESS, socket, loggedInUser } from '../../AppConfig.js'

const UserOverviewAdmin = (props) => {
  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    large: {
      width: '150px',
      height: '150px',
    },
  }));

  const inputFileRef = createRef(null);
  const [image, _setImage] = useState(null);

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDemoteModalOpen, setDemoteModalOpen] = useState(false);
  const [isPromoteModalOpen, setPromoteModalOpen] = useState(false);
  const [isPassModalOpen, setPassModalOpen] = useState(false);

  const [userInfo, setUserInfo] = useState({});

  const [posts, setPosts] = useState([]);

  const classes = useStyles();


  useEffect(() => {
    // Get logged in user's info
    axios.get(SERVER_ADDRESS + '/users/finduser/' + props.username)
      .then(({ data }) => {
        const userInfo = {
          username: data.username,
          password: data.password,
          isAdmin: data.isAdmin,
          joinDate: data.createdAt,
          profileImage: data.profileImage,
        };

        // Update state
        setUserInfo(userInfo);
        setImage(userInfo.profileImage + "?" + Date.now());

        //Setup a socket listener
        socket.on('update post list', () => {
          renderPosts(userInfo);
        });

        renderPosts(userInfo);

      })
      .catch(err => console.log(err));
  }, []);

  // Function that cleans up avatar image
  const cleanup = () => {
    // URL.revokeObjectURL(image);
    // inputFileRef.current.value = null;
  };

  //Gets the posts from specified query, and sets the state
  const renderPosts = (username_obj) => {
    axios.get(SERVER_ADDRESS + "/users/userPosts/" + username_obj.username)
      .then(res => {
        let new_posts = [];
        for (let post of res.data) {
          new_posts.push(
            <div className="rounded-lg mb-8 border-gray-300" key={post._id}>
              <Post isAdmin={loggedInUser.isAdmin} id={post._id} thisUsername={loggedInUser.username} />
            </div>
          )
        }
        setPosts(new_posts);

      })
      .catch(err => console.log(err));
  }

  // Function that sets avatar image
  const setImage = (newImage) => {
    if (image) {
      cleanup();
    }
    _setImage(newImage);
    // console.log(newImage);
  };

  // Takes uploaded img and passes it to setImg function to be set
  const handleOnImgChange = (event) => {
    const newImage = event.target?.files?.[0];
    // console.log(newImage);

    if (newImage) {
      //Only update if we are uploading an image
      if (newImage.type.split("/")[0] === "image") {
        const imgData = new FormData();
        imgData.append('myFile', newImage);
        axios.post(SERVER_ADDRESS + "/users/upload-profile/" + userInfo.username, imgData)
          .then(({ data }) => {
            // setImage(data);
          })
          .catch(err => console.log(err));
        setImage(URL.createObjectURL(newImage));
      }

    }
  };

  // Handling when avatar image is clicked
  const handleAvatarClick = (event) => {
    if (image) {
      event.preventDefault();
      setImage(image);
    }
  };

  // Function that makes the axios call to ban an account from the db
  const handleDeleteAccount = () => {
    axios.post(SERVER_ADDRESS + '/users/delete/' + userInfo.username)
      .then(console.log("Axios: user successfully deleted!"))
      .catch(err => (console.log(err)));
  };

  // Function that makes the axios call to promote a user 
  const handlePromoteUser = () => {
    const data = { isAdmin: true };
    axios.post(SERVER_ADDRESS + '/users/promote/' + userInfo.username, data)
      .then(res => {
        console.log(res.data);
        console.log("Axios: user successfully promoted!");
      })
      .catch(err => (console.log(err)));
  };

  // Function that makes the axios call to demote a user 
  const handleDemoteUser = () => {
    const data = { isAdmin: false };
    axios.post(SERVER_ADDRESS + '/users/demote/' + userInfo.username, data)
      .then(res => {
        console.log(res.data);
        console.log("Axios: user successfully demoted!");
      })
      .catch(err => (console.log(err)));
  };

   // Converts join date to readable string
   const convertJoinDate = () => {
    let userJoinDate = JSON.stringify(userInfo.joinDate);
    userJoinDate = userJoinDate?.substring(6,8);
    console.log(userJoinDate);

    switch(userJoinDate) {
      case '01':
        userJoinDate = "January ";
        break;
      case '02':
        userJoinDate = "February ";
        break;
      case '03':
        userJoinDate = "March ";
        break;
      case '04':
        userJoinDate = "April ";
        break;
      case '05':
        userJoinDate = "May ";
        break;
      case '06':
        userJoinDate = "June ";
        break;
      case '07':
        userJoinDate = "July ";
        break;
      case '08':
        userJoinDate = "August ";
        break;
      case '09':
        userJoinDate = "September ";
        break;
      case '10':
        userJoinDate = "October ";
        break;
      case '11':
        userJoinDate = "November ";
        break;
      case '12':
        userJoinDate = "December ";
        break;
      default:
        userJoinDate = "Maytember? ";
    }
    return userJoinDate;
  };

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
          <IconButton color="primary" >
            <input
              accept="image/*"
              // ref={inputFileRef}
              hidden
              id="avatar-image-upload"
              type="file"
              onChange={handleOnImgChange}
            />
            <label htmlFor="avatar-image-upload">
              <Avatar
                alt="Avatar"
                src={image}
                className={classes.large}
              />
            </label>
          </IconButton>
        </Grid>

        {/* BAN USER */}
        <Grid item xs={3} className="DeleteAccount">
          <Button
            variant="contained"
            className="DeleteAccountButton"
            onClick={() => setDeleteModalOpen(true)}
            size="medium"
          >
            Ban User
          </Button>
        </Grid>

        {/* PROMOTE OR DEMOTE USER */}
        <Grid item xs={3} className="PromoteDemoteUser">
          {console.log(userInfo)}
          {userInfo.isAdmin
            ?
            <Button
              variant="contained"
              className="PromoteDemoteUserButton"
              onClick={() => setDemoteModalOpen(true)}
              size="medium"
            >
              Demote
            </Button>
            :
            <Button
              variant="contained"
              className="PromotePromoteUserButton"
              onClick={() => setPromoteModalOpen(true)}
              size="medium"
            >
              Promote
            </Button>
          }
        </Grid>
      </Grid>
    );
  }

  // Renders the users information
  const renderUserGrid = () => {
    return (
      <div>
        <div className="lg:flex items-baseline border-b-2 border-gray-200 items-center py-5">
          <div className="w-full lg:w-1/2">
            <div className="flex justify-center lg:justify-start">
              <div className="flex justify-start">
                <Grid item xs={9} className="ProfilePic">
                  <IconButton color="primary" >
                    <input
                      accept="image/*"
                      // ref={inputFileRef}
                      hidden
                      id="avatar-image-upload"
                      type="file"
                      onChange={handleOnImgChange}
                    />
                    <label htmlFor="avatar-image-upload">
                      <Avatar
                        alt="Avatar"
                        src={image}
                        className="avatar"
                      />
                    </label>
                  </IconButton>
                </Grid>
              </div>

              <div className="UserInfo pl-2" style={{ marginRight: "0.25rem" }}>
                <div style={{ color: "#53b7bb" }} className="text-2xl font-medium">
                  {"@" + userInfo.username} {userInfo.isAdmin ? " 👑 " : ""} <span className="text-sm text-gray-600 font-normal">{posts.length} active posts</span>
                </div>
                <div className="text-md font-sm">
                  {/* CREATION DATE IS STORED IN USER SCHEMA */}
                  {"Member since " + convertJoinDate() + "2020"}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 mt-4 lg:mt-2 h-12 flex justify-center lg:justify-end lg:pr-16">

            {userInfo.isAdmin
              ?


              <Tooltip title="Demote admin to user">
                <div
                  onClick={() => setDemoteModalOpen(true)}
                  className="flex w-32 justify-center items-center button text-white text-md font-semibold mb-2 rounded cursor-pointer shadow-md">
                  <span>Demote User</span>
                </div>
              </Tooltip>

              :
              <Tooltip title="Promote user to admin">
                <div
                  onClick={() => setPromoteModalOpen(true)}
                  className="flex w-32 justify-center items-center button text-white text-md font-semibold mb-2 rounded cursor-pointer shadow-md">
                  <span>Promote User</span>
                </div>
              </Tooltip>

            }

          </div>


        </div>

        <div className="UserActions pl-8 py-5">
          {renderUserActions()}
        </div>
      </div>
    )
  }

  // Renders the action buttons: edit username, edit password
  const renderUserActions = () => {
    return (
      <div>
        {/* Username */}

        <div className="lg:flex items-baseline">
          <div className="w-full lg:w-1/2"><h3 className="font-semibold text-center lg:text-left m-0 p-0 text-2xl text-gray-700">
            Username
              </h3><h5 className="font-normal text-center lg:text-left m-0 p-0 text-sm lg:text-base">
              {userInfo.username}
            </h5>
          </div>

          <div className="w-full lg:w-1/2 mt-4 lg:mt-2 h-12 px-16 flex justify-center lg:justify-end">
          <Tooltip title="Delete user from Timely">
            <div
              onClick={() => setDeleteModalOpen(true)}
              className="flex w-32 justify-center items-center button-cancel text-white text-md font-semibold mb-2 rounded cursor-pointer shadow-md">
              <span>Ban User</span>
            </div>
          </Tooltip>
          </div>

        </div>

        <div className="lg:flex items-baseline">
          <div className="w-full lg:w-1/2"><h3 className="font-semibold text-center lg:text-left m-0 p-0 text-2xl text-gray-700">
            Password
              </h3><h5 className="font-normal text-center lg:text-left m-0 p-0 text-sm lg:text-base">
              ********
              </h5>
          </div>

          <div className="w-full lg:w-1/2 mt-4 lg:mt-2 h-12 px-16 flex justify-center lg:justify-end">
          <Tooltip title="Change user's password">
            <div
              onClick={() => setPassModalOpen(true)}
              className="flex w-32 justify-center items-center button text-white text-md font-semibold mb-2 rounded cursor-pointer shadow-md">
              <span>Change</span>
            </div>
          </Tooltip>
          </div>

        </div>

      </div>
    );
  }

  return (
    <div className="UserOverviewEdit">
      <NavBar
        isLandingPg={false}
        username={props.username}
      />


      <div className="grid grid-cols-9 gap-4 w-full">

        <div className="hidden xl:block xl:col-span-2 col-span-3 h-screen top-0 pt-24 sticky p-4 border-r-2 border-gray-400" style={{ backgroundColor: "#ededed" }}>
        </div>

        <div className="col-span-9 xl:col-span-5 flex-grow justify-center w-full pt-16 xl:pt-20 px-5" style={{ backgroundColor: "#fcfcfc" }}>
          <div className="justify-center">
            {renderUserGrid()}

            {posts.length > 0 &&
              <div className="text-2xl font-semibold text-gray-800 mb-5 ml-2 mt-5">
                Post Activity
                </div>
            }
            {posts}


          </div>
        </div>

        <div className="hidden xl:block col-span-2 h-screen top-0 sticky pt-32 p-4 border-l-2 border-gray-400" style={{ backgroundColor: "#ededed" }}>
        </div>

      </div>

      {/* DELETE ACCOUNT MODAL */}
      <BanUserModal
        username={userInfo.username}
        ban={handleDeleteAccount}
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
      />

      {/* EDIT PASSWORD MODAL */}
      <AdminEditPasswordModal
        username={userInfo.username}
        password={userInfo.password}
        isOpen={isPassModalOpen}
        onClose={() => setPassModalOpen(false)}
      />

      {/* PROMOTE USER */}
      <PromoteUserModal
        username={userInfo.username}
        promote={handlePromoteUser}
        isOpen={isPromoteModalOpen}
        onClose={() => setPromoteModalOpen(false)}
      />

      {/* DEMOTE USER */}
      <DemoteAdminModal
        username={userInfo.username}
        demote={handleDemoteUser}
        isOpen={isDemoteModalOpen}
        onClose={() => setDemoteModalOpen(false)}
      />
    </div>
  );

}

export { UserOverviewAdmin };