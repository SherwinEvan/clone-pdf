import React, { useState } from "react";
import { Button, LinearProgress } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import useRememberMe from "../../service/rememberMe";
import NavBar from "../../components/navbar";
import Footer from "../../components/footer";
import CompressIcon from '@mui/icons-material/Compress';
import DownloadIcon from '@mui/icons-material/Download';
import { toast } from "react-toastify";
import { MuiFileInput } from "mui-file-input";
import axios from "axios";

export default function CompressPDF() {
  useRememberMe();

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const [pdfFile, setPDFFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [compressedFile, setCompressedFile] = useState(null);
  const [initialSize, setInitialSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);

  const handleChange = (newFile) => {
    if (newFile && newFile.type === "application/pdf") {
      if (newFile.size > 100 * 1024 * 1024) {
        setPDFFile(null);
        setError("Please select a PDF file smaller than 100MB.");
        setInitialSize(0);
        setCompressedSize(0);
      } else {
        setPDFFile(newFile);
        setError(null);
        setInitialSize(newFile.size);
      }
    } else {
      setPDFFile(null);
      setError("Please select a PDF file.");
      setInitialSize(0);
      setCompressedSize(0);
    }
  };

  const handleFileUpload = async () => {
    setError(null);

    if (!pdfFile) {
      setError("Please select a PDF file.");
      return;
    }

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

    reader.readAsDataURL(pdfFile);

    if (pdfFile) {
      const formData = new FormData();
      formData.append("file", pdfFile);
      console.log("compressing...");
      try {
        const response = await axios.post(
          "http://localhost:8081/pdf/compress",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            responseType: "blob",
          }
        );

        const fileName = `compressed_${pdfFile.name}`;
        const compressedBlob = new Blob([response.data]);
        const compressedFile = new File([compressedBlob], fileName);
        setCompressedFile(compressedFile);
        setCompressedSize(compressedFile.size);
      } catch (error) {
        console.error("Error compressing PDF:", error);
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
    }
  };

  const formatFileSize = (size) => {
    const megabytes = size / (1024 * 1024);
    return `${megabytes.toFixed(2)} MB`;
  };

  const getReductionPercentage = () => {
    if (initialSize > 0 && compressedSize > 0) {
      const reduction = ((initialSize - compressedSize) / initialSize) * 100;
      return reduction.toFixed(2);
    }
    return 0;
  };

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="flex flex-col h-screen justify-between">
      <NavBar />
      <div className="mb-auto flex flex-col justify-between">
        <div className="text-2xl font-semibold text-center py-6">
          Compress a PDF File
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
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
            <div>
              <Button
                type="submit"
                onClick={handleFileUpload}
                variant="contained"
                startIcon={<CompressIcon />}
                size="large"
              >
                Compress PDF
              </Button>
            </div>
          </div>
          {!pdfFile && error && (
            <span className="flex justify-around text-red-500 text-sm mx-5">
              {error}
            </span>
          )}
          <div className="flex mt-2 mx-5 italic justify-center">
            Only PDF files that are less than 100MB are allowed
          </div>
        </form>
      </div>
      <div className="flex flex-col justify-evenly md:pt-5 md:mt-0 md:px-10 md:mx-5 mx-6 mt-5 shadow">
        <div>
          {uploadProgress > 0 && (
            <LinearProgress variant="determinate" value={uploadProgress} />
          )}
        </div>
        {initialSize > 0 && compressedSize > 0 && (
          <div className="mt-5 flex justify-around text-sm md:text-lg">
            <p>Original File Size: {formatFileSize(initialSize)}</p>
            <p>Compressed File Size: {formatFileSize(compressedSize)}</p>
            <p>Reduction: {getReductionPercentage()}%</p>
          </div>
        )}
        {compressedFile && (
          <div className="flex justify-center my-5">
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              size="large"
              href={URL.createObjectURL(compressedFile)}
              download={compressedFile.name}
            >
              Download Compressed PDF
            </Button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
