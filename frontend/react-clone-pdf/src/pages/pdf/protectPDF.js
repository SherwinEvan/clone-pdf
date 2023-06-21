import React, { useState } from "react";
import { Button, LinearProgress } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import useRememberMe from "../../service/rememberMe";
import NavBar from "../../components/navbar";
import Footer from "../../components/footer";
import DownloadIcon from "@mui/icons-material/Download";
import { MuiFileInput } from "mui-file-input";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { toast } from "react-toastify";
import TextField from "@mui/material/TextField";
import axios from "axios";

export default function ProtectPDF() {
  useRememberMe();

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const [pdfFile, setPDFFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [encryptedFile, setEncryptedFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showDownloadButton, setShowDownloadButton] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (newFile) => {
    if (newFile && newFile.type === "application/pdf") {
      setPDFFile(newFile);
      setSelectedFile(newFile);
      setError(null);

      const reader = new FileReader();

      reader.onerror = () => {
        setError("Error reading the PDF file.");
      };

      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      };

      reader.readAsDataURL(newFile);
    } else {
      setPDFFile(null);
      setSelectedFile(null);
      setError("Please select a PDF file.");
    }
  };

  const handleEncrypt = async (data) => {
    try {
      const { password } = data;
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("password", password);

      const response = await axios.post(
        "http://localhost:8081/pdf/protect",
        formData,
        {
          responseType: "blob",
        }
      );

      const fileName = `encrypted_${pdfFile.name}`;
      const encryptedBlob = new Blob([response.data], {
        type: "application/pdf",
      });
      const downloadUrl = URL.createObjectURL(encryptedBlob);
      setEncryptedFile(downloadUrl);
      setShowDownloadButton(true);
      
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      link.click();
    } catch (error) {
      console.error("Error encrypting PDF:", error);
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
    }
  };

  const onSubmit = (data) => {
    handleEncrypt(data);
  };

  const isFileSelected = !!pdfFile;

  return (
    <div className="flex flex-col h-screen justify-between">
      <NavBar />
      <div className="mb-auto">
        <div className="text-2xl font-semibold text-center py-6">
          Encrypt a PDF File
        </div>
        <div className="flex mx-5 py-3 space-x-10 items-center justify-center">
          <div>
            <Controller
              name="pdfFile"
              control={control}
              render={({ field }) => (
                <MuiFileInput
                  {...field}
                  onChange={handleChange}
                  value={pdfFile}
                  label="Upload PDF"
                  placeholder="Select a file"
                  error={!!errors.pdfFile}
                  helperText={errors.pdfFile?.message}
                  inputProps={{
                    accept: ".pdf",
                  }}
                />
              )}
            />
          </div>
          <div></div>
        </div>
        {!pdfFile && error && (
          <span className="flex justify-around text-red-500 text-sm mx-5">
            {error}
          </span>
        )}
        <div className="flex mt-2 mx-5 italic justify-center">
          Tip: Stronger passwords are difficult to decrypt.
        </div>
      </div>
      <div className="md:pt-10 md:mt-5 md:px-10 md:mx-5 mx-6 mt-5">
        {uploadProgress > 0 && (
          <LinearProgress variant="determinate" value={uploadProgress} />
        )}
        {showDownloadButton && (
          <div className="flex justify-center my-5">
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              size="large"
              href={encryptedFile}
              download={pdfFile ? `encrypted_${pdfFile.name}` : "encrypted.pdf"}
            >
              Download Encrypted PDF
            </Button>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-center md:my-5 md:py-5 shadow-inner">
          <div className="flex flex-col md:w-2/4 md:mb-5">
            <div className="flex justify-center font-semibold text-lg md:pb-3">
              Enter a password to encrypt the selected PDF
            </div>
            <div>
              <Controller
                name="password"
                control={control}
                rules={{
                  required: "Password is required.",
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    id="password"
                    autoComplete="new-password"
                    type={showPassword ? "text" : "password"}
                    disabled={!isFileSelected}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    InputProps={{
                      endAdornment: (
                        <IconButton onClick={handleTogglePassword} edge="end">
                          {showPassword ? (
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
            <div>
              <Controller
                name="confirmPassword"
                control={control}
                rules={{
                  required: "Confirm Password is required.",
                  validate: {
                    matchesPassword: (value) =>
                      value === getValues().password ||
                      "Passwords do not match.",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="normal"
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    id="confirmPassword"
                    autoComplete="new-password"
                    type="password"
                    disabled={!isFileSelected}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                  />
                )}
              />
            </div>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={!isFileSelected}
            >
              Encrypt PDF
            </Button>
          </div>
        </div>
      </form>
      <Footer />
    </div>
  );
}
