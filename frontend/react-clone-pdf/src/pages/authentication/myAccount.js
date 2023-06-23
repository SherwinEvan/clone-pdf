import React, { useEffect, useState } from "react";
import { TextField, Button } from "@mui/material";
import { IconButton } from "@mui/material";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useForm, Controller } from "react-hook-form";
import NavBar from "../../components/navbar";
import Footer from "../../components/footer";
import useRememberMe from "../../service/rememberMe";
import GetUser from "../../service/getUser";
import DeleteSessionCookie from "../../service/deleteSessionCookie";
import axios from "axios";

export default function MyAccount() {
  useRememberMe();

  const {
    handleSubmit: handleResetPasswordSubmit,
    formState: { errors: resetPasswordErrors },
    getValues: getResetPasswordValues,
    reset: resetResetPasswordForm,
    control: resetPasswordControl,
  } = useForm();

  const {
    handleSubmit: handleDeleteAccountSubmit,
    formState: { errors: deleteAccountErrors },
    reset: resetDeleteAccountForm,
    control: deleteAccountControl,
  } = useForm();

  const [currUser, setCurrUser] = useState("Guest");
  const [email, setEmail] = useState("NoEmail");
  const [showCurrPassword, setShowCurrPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const modalStyle = {
    position: "absolute",
    top: "40%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  useEffect(() => {
    async function checkUserStatus() {
      const user = await GetUser();
      setCurrUser(user);
      getEmail();
      if (user === "Guest" || user === "Error") {
        toast.error(<div>You are not logged in!</div>, {
          position: "top-center",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setTimeout(() => (window.location = "/login"), 2250);
      }
    }
    checkUserStatus();
  }, []);

  const getEmail = async () => {
    const email = await axios.get("login/email");
    setEmail(email.data);
  };

  const handleToggleCurrPassword = () => {
    setShowCurrPassword(!showCurrPassword);
  };

  const handleToggleNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const validatePassword = (value) => {
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const specialCharactersRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/;
    const digitRegex = /\d/;

    if (!uppercaseRegex.test(value)) {
      return "At least one uppercase character is required.";
    }

    if (!specialCharactersRegex.test(value)) {
      return "At least one special character is required.";
    }

    if (!lowercaseRegex.test(value)) {
      return "At least one lowercase character is required.";
    }

    if (!digitRegex.test(value)) {
      return "At least one digit is required.";
    }

    if (getResetPasswordValues("currentPassword") === value) {
      return "New password must be different.";
    }

    return true;
  };

  const onResetPasswordSubmit = async (data) => {
    console.log(data);

    if (
      !/^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])(?=.*\d).{8,127}$/.test(
        data.currentPassword
      )
    ) {
      toast.error(<div>Invalid current password!</div>, {
        position: "top-center",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      try {
        const formData = {
          userName: currUser,
          oldPassword: getResetPasswordValues("currentPassword"),
          newPassword: getResetPasswordValues("newPassword"),
        };

        console.log(formData);

        const changePasswordResponse = await axios.post(
          "/auth/changePassword",
          formData
        );
        await toast.promise(Promise.resolve(changePasswordResponse), {
          pending: "Authenticating...",
          success: changePasswordResponse.data,
          error: changePasswordResponse.data,
          position: "top-center",
          autoClose: 2750,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } catch (error) {
        console.log(error);
        toast.error(
          <div>
            Server error! <br /> Please try again later.
          </div>,
          {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          }
        );
      } finally {
        resetResetPasswordForm({
          currentPassword: "",
          newPassword: "",
        });
      }
    }
  };

  const validateUsername = (value) => {
    if (value === currUser) return true;
    return "Incorrect username.";
  };

  const onDeleteAccountSubmit = async (data) => {
    if (data.deleteUsername !== currUser) {
      return;
    }
    try {
      const deleteData = {
        userName: currUser,
      };

      console.log(deleteData);

      const deleteUserResponse = await axios.delete("/logout/delete", {
        data: deleteData,
      });
      await toast.promise(Promise.resolve(deleteUserResponse), {
        pending: "Authenticating...",
        success: deleteUserResponse.data,
        error: deleteUserResponse.data,
        position: "top-center",
        autoClose: 2750,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      DeleteSessionCookie();
      setTimeout(() => (window.location = "/"), 2250);
    } catch (error) {
      console.log(error);
      toast.error(
        <div>
          Server error! <br /> Please try again later.
        </div>,
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
    } finally {
      resetDeleteAccountForm();
      handleModalClose();
    }
  };

  return (
    <div className="flex flex-col h-screen justify-between">
      <NavBar />
      <span className="flex text-2xl pt-3 md:pt-8 md:text-3xl font-bold justify-center">
        Manage your account
      </span>
      <div className="flex-col mt-4 mb-8 mx-5 shadow">
        <div className="flex flex-col md:flex-row justify-center mb-auto">
          <div className="p-6 md:m-10 shadow items-center font-semibold text-lg md:p-10 md:text-lg w-full md:w-auto">
            <div className="flex mb-5 justify-center">Your Account</div>
            <div className="mb-3">
              <TextField
                disabled
                id="outlined-disabled"
                label="Username"
                fullWidth
                value={currUser}
              />
            </div>
            <div className="mb-3">
              <TextField
                disabled
                id="outlined-disabled"
                label="Email"
                fullWidth
                value={email}
              />
            </div>
          </div>
          <div className="p-6 md:m-10 shadow items-center font-semibold text-lg md:p-10 md:text-lg w-full md:w-auto">
            <div className="flex mb-5 justify-center">Change your password</div>
            <form onSubmit={handleResetPasswordSubmit(onResetPasswordSubmit)}>
              <div className="mb-3">
                <Controller
                  name="currentPassword"
                  control={resetPasswordControl}
                  rules={{
                    required: "Password is required.",
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      name="currentPassword"
                      label="Current Password"
                      id="currentPassword"
                      autoComplete="new-password"
                      type={showCurrPassword ? "text" : "password"}
                      error={!!resetPasswordErrors.currentPassword}
                      helperText={resetPasswordErrors.currentPassword?.message}
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            onClick={handleToggleCurrPassword}
                            edge="end"
                          >
                            {showCurrPassword ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        ),
                      }}
                    />
                  )}
                />
              </div>
              <div className="mb-3">
                <Controller
                  name="newPassword"
                  control={resetPasswordControl}
                  rules={{
                    required: "Enter a new password.",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters.",
                    },
                    validate: validatePassword,
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      name="newPassword"
                      label="New Password"
                      id="newPassword"
                      autoComplete="new-password"
                      type={showNewPassword ? "text" : "password"}
                      error={!!resetPasswordErrors.newPassword}
                      helperText={resetPasswordErrors.newPassword?.message}
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            onClick={handleToggleNewPassword}
                            edge="end"
                          >
                            {showNewPassword ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        ),
                      }}
                    />
                  )}
                />
              </div>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Reset Password
              </Button>
            </form>
          </div>
        </div>

        <div className="p-5 shadow items-center font-semibold text-base md:text-lg">
          <div className="flex mb-3 justify-center">
            <Button
              variant="outlined"
              size="large"
              color="error"
              onClick={handleModalOpen}
              sx={{
                "&:hover": {
                  backgroundColor: "#c9190c",
                  color: "#FFFFFF",
                },
              }}
            >
              Delete your account
            </Button>
            <Modal
              open={modalOpen}
              onClose={handleModalClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={modalStyle}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Are you sure you want to delete your account?
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  <div className="italic">This action cannot be undone!</div>
                </Typography>
                <form
                  onSubmit={handleDeleteAccountSubmit(onDeleteAccountSubmit)}
                >
                  <div className="mt-5">
                    <Controller
                      name="deleteUsername"
                      control={deleteAccountControl}
                      rules={{
                        required: "Enter your username.",
                        validate: validateUsername,
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          name="deleteUsername"
                          label="Username"
                          id="deleteUsername"
                          autoComplete="disabled"
                          type="text"
                          placeholder="Enter your username to delete your account"
                          variant="standard"
                          color="warning"
                          focused
                          error={!!deleteAccountErrors.deleteUsername}
                          helperText={
                            deleteAccountErrors.deleteUsername?.message
                          }
                        />
                      )}
                    />
                  </div>
                  <div className="flex justify-center mt-8">
                    <Button variant="contained" color="error" type="submit">
                      Delete your account
                    </Button>
                  </div>
                </form>
              </Box>
            </Modal>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
