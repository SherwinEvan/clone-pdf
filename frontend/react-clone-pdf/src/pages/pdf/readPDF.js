import React, { useState } from "react";
import { Button, LinearProgress } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import useRememberMe from "../../service/rememberMe";
import NavBar from "../../components/navbar";
import Footer from "../../components/footer";
import OpenInBrowserIcon from "@mui/icons-material/OpenInBrowser";
import { MuiFileInput } from "mui-file-input";
import { Viewer } from "@react-pdf-viewer/core";
import { Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

export default function ReadPDF() {
  useRememberMe();

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const [pdfFile, setPDFFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleChange = (newFile) => {
    if (newFile && newFile.type === "application/pdf") {
      setPDFFile(newFile);
      setError(null);
    } else {
      setPDFFile(null);
      setError("Please select a PDF file.");
    }
  };

  const handleFileUpload = () => {
    setError(null); // Reset the error state

    if (!pdfFile) {
      setError("Please select a PDF file.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const uploadedPdfUrl = reader.result;
      setPdfUrl(uploadedPdfUrl);
    };

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
  };

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="flex flex-col h-screen justify-between">
      <NavBar />
      <div className="mb-auto">
        <div className="text-2xl font-semibold text-center py-6">
          Preview a PDF File
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
                startIcon={<OpenInBrowserIcon />}
                size="large"
              >
                Read PDF
              </Button>
            </div>
          </div>
          {!pdfFile && error && (
            <span className="flex justify-around text-red-500 text-sm mx-5">
              {error}
            </span>
          )}
          <div className="flex mt-2 mx-5 italic justify-center">
            Tip: Since all your files are processed locally, smaller files are
            processed faster.
          </div>
        </form>
      </div>
      <div className="md:pt-10 md:mt-5 md:px-10 md:mx-5 mx-6 mt-5 shadow">
        {uploadProgress > 0 && (
          <LinearProgress variant="determinate" value={uploadProgress} />
        )}
        {pdfUrl && (
          <div className="" style={{ height: "100vh" }}>
            <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js">
              <div
                style={{
                  height: "calc(100vh - 200px)", // Adjust the height as needed
                  maxWidth: "100%",
                  margin: "0 auto",
                }}
              >
                <Viewer
                  fileUrl={pdfUrl}
                  plugins={[defaultLayoutPluginInstance]}
                />
              </div>
            </Worker>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
